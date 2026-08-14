import { bot } from '~/conf';
import { messageDTO } from '~/utils/DTOs';
import { ICommandProps } from '~/types/types';



/** Send PM help */
export default async function PMHelpCommand({ message }: ICommandProps) {
  const { chat, chatId } = messageDTO(message);

  await bot.sendMessage(chatId, `
=== 🌿 daestje bot help ===

Цей бот може відмічати всіх учасників групи та вітати їх з днем народження

/ping - 🏓 pong!
/my_birthday - Переглянути дату твого збереженого дня народження. Бот привітає тебе день в день в усіх групах, де це увімкнено адміністраторами.
/set_birthday {дата у вигляді дд.мм.рррр} - Вказати нову дату народження. Змінити дату народження можна лише раз на пів року 
/birthday_notify - Налаштування передчасного сповіщення про день народження людей в спільних групах 

===== 👾 by @kwzxu 👾 =====
    `);
}