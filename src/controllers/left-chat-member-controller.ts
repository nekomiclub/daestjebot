import { Message } from 'node-telegram-bot-api';
import conf from '~/conf';
import Logger from '~/services/LoggerService';
import { messageDTO } from '~/utils/DTOs';
import getGroup from '~/utils/get-group';



/** left_chat_member event controller */
export default async function LeftChatMemberController(message: Message) {
  try {
    const { chat, chatId, from, text } = messageDTO(message);

    const member = message.left_chat_member;
    if (!member) return;

    const group = await getGroup(message);


    // Handle bot kick
    if (member.is_bot && member.id === conf.botId) {
      group.is_active = false;

      await group.save();

      Logger.debug(`[Chat]: Bot has been kicked from the chat [chatId=${chatId}]`);

      return;
    }



    //! Drop bots
    if (member.is_bot) return;



    // Handle user kick
    group.participants = group.participants.filter(el => el !== member.id);
    group.markModified('participants');

    await group.save();

    Logger.debug(`[Chat]: User has been kicked from the chat [id=${member.id};chatId=${chatId}]`);
  } catch (e) {
    Logger.error(`[Chat]: An error occured at the chat [left_chat_member]`, e);
  }
}