import { bot } from '~/conf';
import { messageDTO } from '~/utils/DTOs';
import { ICommandProps } from '~/types/types';



/** Send chat help */
export default async function ChatHelpCommand({ message }: ICommandProps) {
  const { chat, chatId } = messageDTO(message);



  return await bot.sendMessage(chatId, `
=== 🌿 daestje bot help ===

Цей бот може відмічати всіх учасників групи та вітати їх з днем народження

/ping - 🏓 pong!
/birthdays - Редагувати сповіщення про дні народження учасників групи (👮)
/all - Згадати всіх учасників групи (всі/👮)
/pings - Редагувати доступ до /all (👮)

👮 - Команда доступна лише адміністраторам групи

===== 👾 by @kwzxu 👾 =====
    `);
}