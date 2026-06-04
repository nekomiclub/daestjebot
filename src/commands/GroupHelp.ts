import { bot } from '~/conf';
import { messageDTO } from '~/handlers/DTOs';
import { ICommandProps } from '~/types/types';



/** Send group help */
export default async function GroupHelpCommand({ message }: ICommandProps) {
  const { chat, chatId } = messageDTO(message);

  await bot.sendMessage(chatId, `
=== 🌿 daestje bot help ===

Цей бот робить те, що інші не роблять, ще й повідомлення не зберігає! 🔒

/ping - 🏓 pong!
/birthdays - Редагувати сповіщення про дні народження учасників групи (👮)
/all (@all, @everyone) - Згадати всіх учасників групи (всі/👮)
/pings - Редагувати доступ до @all (👮)

👮 - Команда доступна лише адміністраторам групи

===== 👾 by @kwzxu 👾 =====
    `);
}