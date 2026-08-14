import { bot } from '~/conf';
import { messageDTO } from '~/utils/DTOs';
import { ICommandProps } from '~/types/types';
import getChat from '~/utils/get-chat';
import { GroupBirthdayNotificationKeyboard } from '~/utils/utils';



/** Edit birthdays notify settings */
export default async function BirthdaysCommand({ message }: ICommandProps) {
  const { chat, chatId, from } = messageDTO(message);

  const member = await bot.getChatMember(chatId, from!.id);
  if (!['administrator', 'creator'].includes(member.status)) return;

  const group = await getChat(message);



  return await bot.sendMessage(chatId, `🍰 Налаштування сповіщень про дні народження учасників групи`, {
    reply_markup: {
      inline_keyboard: [
        GroupBirthdayNotificationKeyboard(group.variables.birthdays_notify)
      ]
    }
  });
}