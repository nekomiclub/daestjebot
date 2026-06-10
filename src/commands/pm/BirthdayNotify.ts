import { bot } from '~/conf';
import { ICommandProps } from '~/types/types';
import { messageDTO } from '~/utils/DTOs';
import { BirthdayNotifyKeyboard } from '~/utils/utils';



/** Manage notify about birthday notyfi from mutual contacts */
export default async function BirthdayNotifyCommand({ message, user }: ICommandProps) {
  if (!user) return;

  const { chat, chatId, from, text } = messageDTO(message);

  const isNotify = Boolean(user.recieve_birthday_notifications);



  await bot.sendMessage(chatId, `🍰 Отримувати сповіщення за 3 дні до дня народження когось, з ким ти знаходишся в одній групі?`, {
    reply_markup: {
      inline_keyboard: [
        BirthdayNotifyKeyboard(isNotify)
      ]
    }
  });
}