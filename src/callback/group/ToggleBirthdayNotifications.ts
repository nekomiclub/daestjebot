import { InlineKeyboardButton } from 'node-telegram-bot-api';
import { bot } from '~/conf';
import { ICommandProps } from '~/types/types';
import { CHECK_isNotAdmin } from '~/utils/check-access';
import getGroup from '~/utils/get-group';
import { callbackType } from '~/utils/utils';



export default async function GroupToggleBirthdayNotifications({ message, user, query }: ICommandProps, enabled: boolean) {
  if (!user || !query) return;

  if (await CHECK_isNotAdmin(message, query.id)) return;

  const group = await getGroup(message);

  group.variables.birthdays_notify = enabled;
  group.markModified('variables');

  await group.save();



  return await bot.editMessageReplyMarkup({
    inline_keyboard: [
      ToggleBirthdayNotificationsKeyboard(group.variables.birthdays_notify)
    ]
  }, {
    chat_id: message.chat.id,
    message_id: message.message_id
  });
}



export const ToggleBirthdayNotificationsKeyboard = (enabled: boolean): InlineKeyboardButton[] => [{
  text: enabled ? '❌ Вимкнути' : '✅ Увімкнути',
  callback_data: enabled ? callbackType('disable_birthday_notifications') : callbackType('enable_birthday_notifications')
}];