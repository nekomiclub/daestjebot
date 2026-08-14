import { CallbackQuery } from 'node-telegram-bot-api';
import getUser from '~/utils/get-user';
import { messageDTO } from '~/utils/DTOs';
import Logger from '~/services/LoggerService';
import { PMCallbackList, PMCallbackType, ICommandProps, GroupCallbackList } from '~/types/types';
import PMCallback from '~/callback/pm/_index';
import GroupCallback from '~/callback/group/_index';



/** Callback controller */
export default async function CallbackController(query: CallbackQuery) {
  const message = query.message;
  if (!message) return Logger.warn(`[CallbackController]: No message retrieved from query`);

  message.from = query.from;

  const callbackType = query.data;



  try {
    const { chat, chatId, from } = messageDTO(message);

    // Drop undefined
    if (!from || !callbackType) return;

    // Get user
    const user = await getUser(message);
    const command: ICommandProps = { message, user, query };



    // ========== PM
    if (callbackType.match(PMCallbackList.CONFIRM_BIRTHDAY)) return await PMCallback.ConfirmBirthday(command, callbackType as PMCallbackType);

    if (callbackType.match(PMCallbackList.ENABLE_BIRTHDAY_NOTIFY)) return await PMCallback.ToggleBirthdayNotify(command, true);
    if (callbackType.match(PMCallbackList.DISABLE_BIRTHDAY_NOTIFY)) return await PMCallback.ToggleBirthdayNotify(command, false);



    // ========== GROUP
    if (callbackType.match(GroupCallbackList.ENABLE_BIRTHDAY_NOTIFICATIONS)) return await GroupCallback.ToggleBirthdayNotifications(command, true);
    if (callbackType.match(GroupCallbackList.DISABLE_BIRTHDAY_NOTIFICATIONS)) return await GroupCallback.ToggleBirthdayNotifications(command, false);
  } catch (e) {
    Logger.error(`[PM]: An error occured at private chat`, e);
  }
}