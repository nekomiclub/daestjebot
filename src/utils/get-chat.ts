import { HydratedDocument } from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import { ChatModel } from '~/models/ChatModel';
import Logger from '~/services/LoggerService';
import { TChat } from '~/types/TChat';



/** Get chat from the message */
export default async function getChat(message: Message): Promise<HydratedDocument<TChat>> {
  let chat = await ChatModel.findOne({ id: message.chat.id });

  // Create new chat
  if (!chat) {
    const payload: TChat = {
      id: message.chat.id,
      title: message.chat.title ?? 'untitled',
      is_active: false,
    };

    chat = new ChatModel(payload);

    await chat.save();

    Logger.debug(`[Chat]: New chat document has been created [chatId:${message.chat.id}]`);
  }

  return chat;
}