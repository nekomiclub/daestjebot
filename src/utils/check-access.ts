import { bot } from '~/conf';
import { Message } from 'node-telegram-bot-api';
import { messageDTO } from './DTOs';
import Logger from '~/services/LoggerService';



/** 
 * Check is user is admin
 * 
 * @returns whether is NOT passed
 */
export async function CHECK_isNotAdmin(message: Message, queryId?: string): Promise<boolean> {
  const { from } = messageDTO(message);
  if (!from) {
    Logger.warn(`[CHECK_isNotAdmin]: No from field retrieved from message`);

    return true;
  }


  const member = await bot.getChatMember(message.chat.id, from.id);
  if (!['administrator', 'creator'].includes(member.status)) {
    if (queryId) {
      await bot.answerCallbackQuery(queryId, {
        text: `👮 У тебе нема доступу для виконання цієї дії`
      });
    }

    return true;
  };

  return false;
}