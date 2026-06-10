import { HydratedDocument } from 'mongoose';
import TUser from '~/types/TUser';
import { UserModel } from '~/models/UserModel';
import { Message, User } from 'node-telegram-bot-api';
import { messageDTO } from '~/utils/DTOs';
import Logger from '~/services/LoggerService';
import { joinString } from './utils';



type TPerson = {
  id: number
  first_name: string | undefined
  username: string | undefined
}



/** 
 * Get user's object from the database
 * 
 * Update fields like name, username and participate in on invokation
 */
export default async function getUser(message: Message, tgUser?: User): Promise<HydratedDocument<TUser> | null> {
  const { chat, chatId, from } = messageDTO(message);

  const person = getPerson(message, tgUser);
  if (!person) return null;



  let user = await UserModel.findOne({ id: person.id });
  let isUserModified = false;

  // Create new user document if one is not exist
  if (!user) {
    const payload: TUser = {
      id: person.id,
      name: person.first_name ?? null,
      username: person.username ?? null,
      birthday_changed_at: null,
      rights: [],
      recieve_birthday_notifications: false,
      birthday_at: null,
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



  // Update user document if it was modified
  if (isUserModified) await user.save();

  return user;
}



function getPerson(message: Message, tgUser?: User): TPerson | null {
  const { chat, from } = messageDTO(message);



  // Retrieve person data from telegram user
  if (tgUser) {
    return tgUser as TPerson;
  }

  // Retrieve person data from private chat
  if (chat.type === 'private') {
    return {
      id: chat.id,
      first_name: chat.first_name,
      username: chat.username
    } satisfies TPerson;
  }

  // Retrieve person data from from
  if (from && !from.is_bot) {
    return {
      id: from.id,
      first_name: from.first_name,
      username: from.username
    } satisfies TPerson;
  }

  return null;
}