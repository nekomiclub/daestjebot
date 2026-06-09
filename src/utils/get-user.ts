import { HydratedDocument } from 'mongoose';
import TUser from '~/types/TUser';
import { UserModel } from '~/models/UserModel';
import { Message } from 'node-telegram-bot-api';
import { messageDTO } from '~/utils/DTOs';
import Logger from '~/services/LoggerService';
import { joinString } from './utils';



/** 
 * Get user's object from the database
 * 
 * Update fields like name, username and participate in on invokation
 */
export default async function getUser(message: Message): Promise<HydratedDocument<TUser>> {
  const { chat, chatId, from } = messageDTO(message);

  const person = chat.type === 'private' ? chat : from;
  if (!person) throw new Error('500 - User person is not formed');

  let user = await UserModel.findOne({ id: person.id });
  let isUserModified = false;

  // Create new user document if one is not exist
  if (!user) {
    const payload: TUser = {
      id: person.id,
      name: person.first_name ?? null,
      username: person.username ?? null,
      participateChatsIds: [chatId],
      birthday_changed_at: null,
      rights: [],
      birthday_at: null,
      participate_at: [],
    };

    user = new UserModel(payload);
    isUserModified = true;

    Logger.info(joinString([`[GetUser]: New user has been created`, payload.username ? `@${payload.username}` : payload.name ?? payload.id]));
  }

  // Sync user first name
  if (user.name !== person.first_name) {
    user.name = person.first_name ?? null;
    isUserModified = true;

    Logger.debug(`[GetUser]: User (${user.id}) name changed (${user.name} > ${person.first_name})`);
  };

  // Sync username
  if (user.username !== person.username) {
    user.username = person.username ?? null;
    isUserModified = true;

    Logger.debug(`[GetUser]: User (${user.id}) username changed (@${user.username} > @${person.username})`);
  };

  // !deprecated Sync user participate chats ids
  if (!user.participateChatsIds.includes(chatId)) {
    user.participateChatsIds.push(chatId);
    user.markModified('participateChatsIds');
    isUserModified = true;

    Logger.debug(`[GetUser]: (deprecated) User (${user.id}) appeared in new chat (${chatId})`);
  };

  // Sync user participate at
  if (!user.participate_at.includes(chatId)) {
    user.participate_at.push(chatId);
    user.markModified('participate_at');
    isUserModified = true;

    Logger.debug(`[GetUser]: User (${user.id}) appeared in new chat (${chatId})`);
  };



  // Update user document if it was modified
  if (isUserModified) await user.save();

  return user;
}