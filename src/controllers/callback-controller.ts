import { Message } from 'node-telegram-bot-api';
import getUser from '~/utils/get-user';
import { messageDTO } from '~/utils/DTOs';
import Logger from '~/services/LoggerService';
import { CallbackList, CallbackType, ICommandProps } from '~/types/types';
import ConfirmBirthdayCallback from '~/commands/callback/ConfirmBirthday';
import BirthdayNotifyDeclineCallback from '~/commands/callback/BirthdayNotifyDecline';
import BirthdayNotifyAgreeCallback from '~/commands/callback/BirthdayNotifyAgree';
import GroupEnableBirthdayNotificationsCallback from '~/commands/callback/GroupEnableBirthdayNotifications';
import GroupDisableBirthdayNotificationsCallback from '~/commands/callback/GroupDisableBirthdayNotifications';



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
    if (data.match(CallbackList.BIRTHDAY_NOTIFY_AGREE)) return await BirthdayNotifyAgreeCallback(command);
    if (data.match(CallbackList.BIRTHDAY_NOTIFY_DECLINE)) return await BirthdayNotifyDeclineCallback(command);
    if (data.match(CallbackList.GROUP_DISABLE_BIRTHDAY_NOTIFICATIONS)) return await GroupDisableBirthdayNotificationsCallback(command);
    if (data.match(CallbackList.GROUP_ENABLE_BIRTHDAY_NOTIFICATIONS)) return await GroupEnableBirthdayNotificationsCallback(command);
  } catch (e) {
    Logger.error(`[PM]: An error occured at private chat`, e);
  }
}