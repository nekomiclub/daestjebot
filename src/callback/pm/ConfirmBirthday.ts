import { bot } from '~/conf';
import { messageDTO } from '~/utils/DTOs';
import { UserModel } from '~/models/UserModel';
import { PMCallbackList, PMCallbackType, ICommandProps } from '~/types/types';
import { daysBetween, getUserBirthday, getUTC, wordDeclination } from '~/utils/utils';



/** Confirm user birthday set */
export default async function ConfirmBirthday({ message, user }: ICommandProps, data: PMCallbackType) {
  if (!user) return;

  const { chat, chatId, from } = messageDTO(message);

  const { birthdayTimeout, canChangeBirthday } = getUserBirthday(user);

  //! Reject if user cannot change his birthday date
  if (!canChangeBirthday) {
    const today = getUTC();
    const birthdayChangedAt = getUTC(birthdayTimeout);
    const updateCooldown = daysBetween(`${today.str.date}.${today.str.month}`, `${birthdayChangedAt.str.date}.${birthdayChangedAt.str.month}`) ?? 0;

    return await bot.sendMessage(chatId, `❌ Ти нещодавно вже змінював дату свого народження. \n\n⌚ В наступний раз це можна зробити через ${updateCooldown} ${wordDeclination(updateCooldown, ['день', 'дні', 'днів'])} (${birthdayChangedAt.fulldate})`);
  }

  // Set new date
  const hydratedUser = await UserModel.findOne({ id: chat.id });
  if (!hydratedUser) return;

  const date = getUTC(Number(data.replace(PMCallbackList.CONFIRM_BIRTHDAY, '')));

  hydratedUser.birthday.at = date.ISO;
  hydratedUser.birthday.changed_at = getUTC().ISO;
  hydratedUser.markModified('birthday');

  await hydratedUser.save();



  return await bot.editMessageText(`✅ Встановлено дату народження: ${date.fulldate}`, {
    chat_id: chatId,
    message_id: message.message_id,
    reply_markup: { inline_keyboard: [] }
  });
}