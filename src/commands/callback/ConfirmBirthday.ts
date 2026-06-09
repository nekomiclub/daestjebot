import { bot } from '~/conf';
import { messageDTO } from '~/handlers/DTOs';
import { UserModel } from '~/models/UserModel';
import { CallbackList, CallbackType, ICommandProps } from '~/types/types';
import { daysBetween, getUserBirthday, getUTC, wordDeclination } from '~/utils/utils';



/** Confirm user birthday set */
export default async function ConfirmBirthdayCallback({ message, user }: ICommandProps, data: CallbackType) {
  const { chat, chatId, from } = messageDTO(message);

  const { birthdayTimeout, canChangeBirthday } = getUserBirthday(user);

  //! Reject if user cannot change his birthday date
  if (!canChangeBirthday) {
    const today = getUTC();
    const birthdayChangeDate = getUTC(birthdayTimeout);
    const within = daysBetween(`${today.str.date}.${today.str.month}`, `${birthdayChangeDate.str.date}.${birthdayChangeDate.str.month}`) ?? 0;

    return await bot.sendMessage(chatId, `❌ Ти нещодавно вже змінював дату свого народження. \n\n⌚ В наступний раз це можна зробити через ${within} ${wordDeclination(within, ['день', 'дні', 'днів'])} (${birthdayChangeDate.fulldate})`);
  }

  // Set new date
  const hydratedUser = await UserModel.findOne({ id: chat.id });
  if (!hydratedUser) return;

  const date = getUTC(Number(data.replace(CallbackList.CONFIRM_BIRTHDAY, '')));

  hydratedUser.birthday = date.timestamp;
  hydratedUser.birthday_changed_at = getUTC().ISO;

  await hydratedUser.save();



  return await bot.editMessageText(`✅ Встановлено дату народження: ${date.fulldate}`, {
    chat_id: chatId,
    message_id: message.message_id,
    reply_markup: { inline_keyboard: [] }
  });
}