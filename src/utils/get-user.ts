import { HydratedDocument } from 'mongoose';
import IUser from '~/types/IUser';
import { UserModel } from '~/models/UserModel';
import { Message } from 'node-telegram-bot-api';
import { messageDTO } from '~/handlers/DTOs';
import Logger from '~/services/LoggerService';
import { joinString } from './utils';



/** 
 * Get user's object from the database
 * 
 * Update fields like name, username and participate in on invokation
 */
export default async function getUser(message: Message): Promise<HydratedDocument<IUser>> {
  const { chat, chatId, from } = messageDTO(message);

  const person = chat.type === 'private' ? chat : from;
  if (!person) throw new Error('500 - User person is not formed');

  let user = await UserModel.findOne({ id: person.id });
  let isUserModified = false;

  if (!user) {
    const payload: IUser = {
      id: person.id,
      name: person.first_name,
      username: person.username,
      participateChatsIds: [chatId],
      birthday_changed_at: null,
      rights: [],
    };

    user = new UserModel(payload);
    isUserModified = true;

    Logger.info(joinString([`[GetUser]: New user has been created`, payload.username ? `@${payload.username}` : payload.name ?? payload.id]));
  }

  // Update user data
  if (user.name !== person.first_name) {
    user.name = person.first_name;
    isUserModified = true;

    Logger.debug(`[GetUser]: User (${user.id}) name changed (${user.name} > ${person.first_name})`);
  };

  if (user.username !== person.username) {
    user.username = person.username;
    isUserModified = true;

    Logger.debug(`[GetUser]: User (${user.id}) username changed (@${user.username} > @${person.username})`);
  };

  if (!user.participateChatsIds.includes(chatId)) {
    user.participateChatsIds.push(chatId);
    user.markModified('participateChatsIds');
    isUserModified = true;

    Logger.debug(`[GetUser]: User (${user.id}) appeared in new chat (${chatId})`);
  };

  if (isUserModified) await user.save();

  return user;
}