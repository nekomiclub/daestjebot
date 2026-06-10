import { Message } from 'node-telegram-bot-api';
import conf from '~/conf';
import Logger from '~/services/LoggerService';
import { messageDTO } from '~/utils/DTOs';
import getChat from '~/utils/get-chat';
import getUser from '~/utils/get-user';



/** left_chat_member event controller */
export default async function LeftChatMemberController(message: Message) {
  try {
    const { chat, chatId, from, text } = messageDTO(message);

    const member = message.left_chat_member;
    if (!member) return;



    // Handle bot kick
    if (member.is_bot && member.id === conf.botId) {
      const chat = await getChat(message);
      chat.is_active = false;

      await chat.save();

      Logger.debug(`[Chat]: Bot has been kicked from the chat [chatId:${chatId}]`);

      return;
    }



    //! Drop bots
    if (member.is_bot) return;



    // Handle user kick
    const user = await getUser(message, member);
    if (!user) return;

    user.participate_at = user.participate_at.filter(el => el !== chatId);
    user.markModified('participate_at');

    await user.save();

    Logger.debug(`[Chat]: User has been kicked from the chat [id:${member?.id};chatId:${chatId}]`);
  } catch (e) {
    Logger.error(`[Chat]: An error occured at the chat [left_chat_member]`, e);
  }
}