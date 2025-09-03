import { HydratedDocument } from 'mongoose';
import IUser from '../types/IUser';
import { UserModel } from '../models/UserModel';
import { Message } from 'node-telegram-bot-api';
import { Logger } from '../services/LoggerService';
import { messageDTO } from './DTOs';



export default async function getUser(msg: Message): Promise<HydratedDocument<IUser>> {
  const { from, chatId } = messageDTO(msg);

  let user = await UserModel.findOne({ id: from.id });
  let isUserModified = false;
  if (!user) {
    const payload: IUser = {
      id: from.id,
      name: from.first_name,
      username: from.username,
      participateChatsIds: [chatId],
      rights: [],
    };

    user = new UserModel(payload);
    Logger.info(`New user has been created. [@${payload.username ?? payload.name}; ${payload.id}]`);

    await user.save();
  }

  // Update user data
  if (user.name !== from.first_name) {
    Logger.debug(`User (${user.id}) name changed (${user.name} > ${from.first_name})`);
    user.name = from.first_name;
    isUserModified = true;
  };

  if (user.username !== from.username) {
    Logger.debug(`User (${user.id}) username changed (@${user.username} > @${from.username})`);
    user.username = from.username;
    isUserModified = true;
  };

  if (!user.participateChatsIds.includes(chatId)) {
    Logger.debug(`User (${user.id}) appeared in new chat (${chatId})`);
    user.participateChatsIds.push(chatId);
    isUserModified = true;
    user.markModified('participateChatsIds');
  };

  if (isUserModified) await user.save();

  return user;
}