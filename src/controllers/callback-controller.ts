import { Message } from 'node-telegram-bot-api';
import getUser from '~/utils/get-user';
import { messageDTO } from '~/handlers/DTOs';
import Logger from '~/services/LoggerService';
import { CallbackList, CallbackType, ICommandProps } from '~/types/types';
import ConfirmBirthdayCallback from '~/commands/callback/ConfirmBirthday';



/** Callback controller */
export default async function CallbackController(message: Message, data?: CallbackType) {
  try {
    const { chat, chatId, from } = messageDTO(message);

    // Drop undefined
    if (!from || !data) return;

    // Get user
    const user = await getUser(message);
    const command: ICommandProps = { message, user };



    if (data.match(CallbackList.CONFIRM_BIRTHDAY)) return await ConfirmBirthdayCallback(command, data);
  } catch (e) {
    Logger.error(`[PM]: An error occured at private chat`, e);
  }
}