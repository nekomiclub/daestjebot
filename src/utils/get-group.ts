import { HydratedDocument } from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import { ChatModel } from '~/models/ChatModel';
import Logger from '~/services/LoggerService';
import { TGroup } from '~/types/TGroup';



/** 
 * Get group details from the message
 * 
 * If group is not exist in database, will create new document
 */
export default async function getGroup(message: Message): Promise<HydratedDocument<TGroup>> {
  let group = await ChatModel.findOne({ id: message.chat.id });

  // Create new chat
  if (!group) {
    const payload: TGroup = {
      id: message.chat.id,
      title: message.chat.title ?? 'untitled',
      is_active: false,
      participants: [],
      variables: {
        birthdays_notify: false
      }
    };

    group = new ChatModel(payload);

    await group.save();

    Logger.debug(`[Group]: New group document has been created [chatId=${message.chat.id}]`);
  }

  return group;
}