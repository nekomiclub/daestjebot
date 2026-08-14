import { InlineKeyboardButton } from 'node-telegram-bot-api';
import { bot } from '~/conf';
import { ICommandProps } from '~/types/types';
import { callbackType } from '~/utils/utils';



export default async function ToggleBirthdayNotify({ message, user }: ICommandProps, enabled: boolean) {
  if (!user) return;

  user.variables.recieve_birthday_notifications = enabled;
  user.markModified('variables');

  await user.save();



  return await bot.editMessageReplyMarkup({
    inline_keyboard: [
      ToggleBirthdayNotifyKeyboard(enabled)
    ]
  }, {
    chat_id: message.chat.id,
    message_id: message.message_id
  });
}



export const ToggleBirthdayNotifyKeyboard = (enabled: boolean): InlineKeyboardButton[] => [{
  text: enabled ? '❌ Ні' : '✅ Так',
  callback_data: enabled ? callbackType('disable_birthday_notify') : callbackType('enable_birthday_notify')
}];