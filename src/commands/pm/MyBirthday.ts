import { bot } from '~/conf';
import { messageDTO } from '~/handlers/DTOs';
import { ICommandProps } from '~/types/types';
import { daysBetween, getUserBirthday, getUTC, joinString } from '~/utils/utils';



const SUGGEST_DATE_CHANGE = `\n\n✒️ Ти можеш встановити нову дату ввівши /set_birthday {дата у вигляді дд.мм.рррр}`;



/** Get user's birthday */
export default async function MyBirthdayCommand({ message, user }: ICommandProps) {
  const { chat, chatId } = messageDTO(message);

  const { canChangeBirthday } = getUserBirthday(user);



  if (user.birthday) {
    // Send user's birthday if it is specified
    const today = getUTC();
    const birthdayDate = getUTC(user.birthday);

    return await bot.sendMessage(chatId, joinString([`🍰 Твій день народження буде через ${daysBetween(`${today.str.date}.${today.str.month}`, `${birthdayDate.str.date}.${birthdayDate.str.month}`)} днів (${birthdayDate.fulldate})`, canChangeBirthday && SUGGEST_DATE_CHANGE]));
  } else {
    // Suggest user to set his birthday date

    return await bot.sendMessage(chatId, joinString([`😶‍🌫️ У тебе відсутня інформація про день народження.`, SUGGEST_DATE_CHANGE]));
  }
}

