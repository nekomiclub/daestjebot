import { bot } from '~/conf';
import { messageDTO } from '~/utils/DTOs';
import { CommandsList, ICommandProps } from '~/types/types';
import { callbackType, daysBetween, getUserBirthday, getUTC, wordDeclination } from '~/utils/utils';



/** Set user's birthday */
export default async function SetMyBirthday({ message, user }: ICommandProps) {
  const { chat, chatId, from, text } = messageDTO(message);

  const { birthdayTimeout, canChangeBirthday } = getUserBirthday(user);

  //! Reject if user cannot change his birthday date
  if (!canChangeBirthday) {
    const today = getUTC();
    const birthdayChangeDate = getUTC(birthdayTimeout);
    const within = daysBetween(`${today.str.date}.${today.str.month}`, `${birthdayChangeDate.str.date}.${birthdayChangeDate.str.month}`) ?? 0;

    return await bot.sendMessage(chatId, `❌ Ти нещодавно вже змінював дату свого народження. \n\n⌚ В наступний раз це можна зробити через ${within} ${wordDeclination(within, ['день', 'дні', 'днів'])} (${birthdayChangeDate.fulldate})`);
  }

  // Parse date
  const parsedDate = parseDate(text.replace(CommandsList.SET_MY_BIRTHDAY, '') ?? '');
  if (!parsedDate) return bot.sendMessage(chatId, `❌ Неправильна дата або її формат (приклад: 06.06.2026)`);

  // Set new date
  const date = getUTC(parsedDate);

  return await bot.sendMessage(chatId, `⌚ Встановити дату народження як: ${date.fulldate}?`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '✅ Підтвердити', callback_data: `${callbackType('confirm_birthday')};${date.timestamp}` }]
      ]
    }
  });
}



function parseDate(value: string): Date | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);

  //! Reject invalid format
  if (!match) return null;

  const [, dayStr, monthStr, yearStr] = match;

  const day = Number(dayStr);
  const month = Number(monthStr) - 1;
  const year = Number(yearStr);

  const date = new Date();

  date.setUTCFullYear(year, month, day);
  date.setUTCHours(0, 0, 0, 0);

  // Validate that the resulting date matches the input
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month ||
    date.getUTCDate() !== day
  ) {
    return null; //! Reject invalid calendar date
  }

  return date;
}