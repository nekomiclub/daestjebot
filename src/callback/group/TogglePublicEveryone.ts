import { BotCommand, InlineKeyboardButton } from 'node-telegram-bot-api';
import { bot } from '~/conf';
import { ICommandProps } from '~/types/types';
import { GroupCommands, PingEveryone } from '~/utils/bot-commands';
import { CHECK_isNotAdmin } from '~/utils/check-access';
import getGroup from '~/utils/get-group';
import { callbackType } from '~/utils/utils';



export default async function TogglePublicEveryone({ message, user, query }: ICommandProps, enabled: boolean) {
  if (!user || !query) return;

  if (await CHECK_isNotAdmin(message, query.id)) return;

  const group = await getGroup(message);

  group.variables.allow_public_everyone = enabled;
  group.markModified('variables');

  await group.save();

  await bot.answerCallbackQuery(query.id, {
    text: enabled ? `✅ Використання команди /all дозволено для всіх учасників групи` : `👮 Використання команди /all заборонено для всіх учасників групи`
  });

  const newCommands: BotCommand[] = [
    ...GroupCommands,
  ];

  if (enabled) newCommands.push(PingEveryone);

  await bot.setMyCommands(newCommands, { scope: { type: 'chat', chat_id: message.chat.id } });



  return await bot.editMessageReplyMarkup({
    inline_keyboard: [
      TogglePublicEveryoneKeyboard(enabled)
    ]
  }, {
    chat_id: message.chat.id,
    message_id: message.message_id
  });
}



export const TogglePublicEveryoneKeyboard = (enabled: boolean): InlineKeyboardButton[] => [{
  text: enabled ? '❌ Не дозволяти використання' : '✅ Дозволити використання',
  callback_data: enabled ? callbackType('disable_public_everyone') : callbackType('enable_public_everyone')
}];