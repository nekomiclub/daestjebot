import { bot } from '~/conf';
import { ICommandProps } from '~/types/types';
import { BirthdayNotifyKeyboard } from '~/utils/utils';



/** Handle birthday_notify_decline callback */
export default async function BirthdayNotifyDeclineCallback({ message, user }: ICommandProps) {
  if (!user) return;

  const isNotify = false;

  user.recieve_birthday_notifications = isNotify;

  await user.save();



  return await bot.editMessageReplyMarkup({
    inline_keyboard: [
      BirthdayNotifyKeyboard(isNotify)
    ]
  }, {
    chat_id: message.chat.id,
    message_id: message.message_id
  });
}