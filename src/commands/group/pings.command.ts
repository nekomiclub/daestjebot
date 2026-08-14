import { bot } from '~/conf';
import { messageDTO } from '~/utils/DTOs';
import { ICommandProps } from '~/types/types';
import { CHECK_isNotAdmin } from '~/utils/check-access';
import { TogglePublicEveryoneKeyboard } from '~/callback/group/TogglePublicEveryone';
import getGroup from '~/utils/get-group';



/** Handle group pings access */
export default async function Pings({ message }: ICommandProps) {
  const { chat, chatId } = messageDTO(message);

  // Reject if non-admin user try to invoke command
  if (await CHECK_isNotAdmin(message)) return;

  const group = await getGroup(message);



  return await bot.sendMessage(chatId, `📣 Налаштування команди /all (відмітка всіх учасників групи) для всіх користувачів групи`, {
    reply_markup: {
      inline_keyboard: [
        TogglePublicEveryoneKeyboard(group.variables.allow_public_everyone)
      ]
    }
  });
}