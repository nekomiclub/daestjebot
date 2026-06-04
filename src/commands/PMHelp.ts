import { bot } from '~/conf';
import { messageDTO } from '~/handlers/DTOs';
import { ICommandProps } from '~/types/types';



/** Send PM help */
export default async function PMHelpCommand({ message }: ICommandProps) {
  const { chat, chatId } = messageDTO(message);

  await bot.sendMessage(chatId, `
=== 🌿 daestje bot help ===

Цей бот робить те, що інші не роблять, ще й повідомлення не зберігає! 🔒

/ping - 🏓 pong!
/my_birthday - Переглянути дату вашого збереженого дня народження. Бот привітає вас день в день в усіх групах, де це увімкнено адміністраторами.

===== 👾 by @kwzxu 👾 =====
    `);
}