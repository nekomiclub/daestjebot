import { bot } from '~/conf';
import { messageDTO } from '~/utils/DTOs';
import { ICommandProps } from '~/types/types';
import getGroup from '~/utils/get-group';
import { GroupBirthdayNotificationKeyboard } from '~/utils/utils';



/** Edit birthdays notify settings */
export default async function BirthdaysCommand({ message }: ICommandProps) {
  const { chat, chatId, from } = messageDTO(message);

  const member = await bot.getChatMember(chatId, from!.id);
  if (!['administrator', 'creator'].includes(member.status)) return;

  const group = await getGroup(message);



  return await bot.sendMessage(chatId, `🍰 Налаштування сповіщень про дні народження учасників групи`, {
    reply_markup: {
      inline_keyboard: [
        GroupBirthdayNotificationKeyboard(group.variables.birthdays_notify)
      ]
    }
  });
}