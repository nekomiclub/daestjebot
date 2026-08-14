import { bot } from '~/conf';
import { ICommandProps } from '~/types/types';
import getChat from '~/utils/get-chat';
import { GroupBirthdayNotificationKeyboard } from '~/utils/utils';



/** Handle group_disable_birthday_notifications callback */
export default async function GroupDisableBirthdayNotificationsCallback({ message, user }: ICommandProps) {
  if (!user) return;

  const member = await bot.getChatMember(message.chat.id, user.id);
  if (!['administrator', 'creator'].includes(member.status)) return;

  const group = await getChat(message);

  group.variables.birthdays_notify = false;
  group.markModified('variables');

  await group.save();



  return await bot.editMessageReplyMarkup({
    inline_keyboard: [
      GroupBirthdayNotificationKeyboard(group.variables.birthdays_notify)
    ]
  }, {
    chat_id: message.chat.id,
    message_id: message.message_id
  });
}