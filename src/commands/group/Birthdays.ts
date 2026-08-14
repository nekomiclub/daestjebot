import { bot } from '~/conf';
import { messageDTO } from '~/utils/DTOs';
import { ICommandProps } from '~/types/types';
import getGroup from '~/utils/get-group';
import { ToggleBirthdayNotificationsKeyboard } from '~/callback/group/ToggleBirthdayNotifications';
import { CHECK_isNotAdmin } from '~/utils/check-access';



/** Edit birthdays notify settings */
export default async function BirthdaysCommand({ message }: ICommandProps) {
  const { chat, chatId, from } = messageDTO(message);

  // Reject if non-admin user try to invoke command
  if (await CHECK_isNotAdmin(message)) return;

  const group = await getGroup(message);



  return await bot.sendMessage(chatId, `🍰 Налаштування сповіщень про дні народження учасників групи`, {
    reply_markup: {
      inline_keyboard: [
        ToggleBirthdayNotificationsKeyboard(group.variables.birthdays_notify)
      ]
    }
  });
}