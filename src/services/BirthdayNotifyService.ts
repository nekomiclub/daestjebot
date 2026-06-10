// import { HydratedDocument } from 'mongoose';
// import { UserModel } from '~/models/UserModel';
// import TUser, { USER_RIGHTS } from '~/types/TUser';
// import { bot, conf } from '~/conf';
// import Logger from './LoggerService';
// import { getUTC, mentionUser, randomBetween } from '~/utils/utils';



// const BirthdayMessages = [
//   'Вітаю з днем народження! Бажаю робити лиш те, що до вподоби, брати від життя все найкраще, цінувати кожен день та бути щасливим.',
//   'Нехай ніщо не завадить здійсненню мрій. Посміхайся, люби, досягай, насолоджуйся, будь завжди щасливим!',
//   'Вітаю з твоїм особливими днем! Нехай всі мрії та бажання здійснюються і дарують неймовірне відчуття щастя!',
//   'З днем народження! Бажаю любові та простого людського щастя, побільше грошей та міцного здоров’я. Нехай кожен день дарує нові можливості та приємні сюрпризи!',
//   'Вітаю з днем народження! Бажаю тобі затишку в оселі, благополуччя в родині, здоров’я в тілі та кохання в душі!',
//   'Бажаю радісних подій, цікавих пригод, фантастичних емоцій та завжди прекрасного настрою.',
//   'Прийміть найкращі привітання з днем народження! Нехай душа сповниться світлою радістю, оптимізмом, вірою у власні сили. Все омріяне хай втілиться, все загадане — здійсниться!',
//   'Нехай кожна мить твого життя буде наповнена щастям і благополуччям, коханням і щирістю. Хай успіх завжди крокує поруч з тобою.',
//   'З днем народження! Бажаю розквіту сил, вдалих днів, безліч можливостей, міцного здоров’я, взаємного кохання, чудового настрою та розкішного життя!',
// ];



// class BirthdayNotifyServ {
//   usersNotified: number[] = [];
//   usersNotifiedThreeDays: number[] = [];



//   /** Start cron task */
//   startCRON() {
//     this.poll();

//     // Ping every hour
//     setInterval(async () => {
//       this.poll();
//     }, 3600000);
//   }

//   // Poll users birthdays
//   async poll() {
//     try {
//       const now = getUTC();

//       const users = await UserModel.find({ birthday: { $ne: undefined } });

//       for (const key in users) {
//         try {
//           const user = users[key];

//           const birthdayDate = getUTC(user.birthday);
//           const birthdayDateNow = new Date(user.birthday!).setFullYear(getUTC().year);
//           const threeDaysBirthdayOffset = new Date(user.birthday! - (60000 * 60 * 24 * 3)).setFullYear(getUTC().year);

//           // notify main chat
//           if (birthdayDate.month === now.month && birthdayDate.date === now.date && !this.usersNotified.includes(user.id)) {
//             this.usersNotified.push(user.id);

//             this.notifyChat(user, conf.mainChatId);
//           };

//           if (now.timestamp > threeDaysBirthdayOffset && now.timestamp < birthdayDateNow && !this.usersNotifiedThreeDays.includes(user.id)) {
//             this.usersNotifiedThreeDays.push(user.id);

//             this.notifyThreeDays(user);
//           }
//         } catch (e) {
//           Logger.error(`[BirthdayNotifyServ]: Poll map users error`, e);
//         }
//       }
//     } catch (e) {
//       Logger.error(`[BirthdayNotifyServ]: Poll error`, e);
//     }
//   }

//   /** Notify users chat */
//   async notifyChat(user: HydratedDocument<TUser>, chatId: number) {
//     try {
//       if (user.participateChatsIds.includes(chatId)) {
//         const celebrateMsg = await bot.sendPhoto(chatId, `https://cataas.com/cat?ts=${getUTC().timestamp}`, {
//           caption: `З днем народження ${mentionUser(user)}! 🥳🎂🥂\n${BirthdayMessages[randomBetween(0, BirthdayMessages.length - 1)]}\n\nДавайте вип'єм за ту дату, Коли мама дала тату. 🍻`,
//           parse_mode: 'Markdown'
//         });

//         await bot.pinChatMessage(chatId, celebrateMsg.message_id);

//         Logger.info(`[BirthdayNotifyServ]: Celebrating ${user.username ?? user.name} birthday!`);
//       } else {
//         Logger.warn(`[BirthdayNotifyServ]: User (${user.id}) is not participate in required chat (#${chatId})`);
//       }
//     } catch (e) {
//       Logger.error(`[BirthdayNotifyServ]: Chats notify error`, e);
//     }
//   }

//   /** Notify chosen users about soon someone birthday */
//   async notifyThreeDays(user: HydratedDocument<TUser>) {
//     try {
//       const notifyPoll = await UserModel.find({ rights: { $in: [USER_RIGHTS.BIRTHDAY_NOTIFY_3DAYS] } });

//       for (const key in notifyPoll) {
//         const notify = notifyPoll[key];

//         await bot.sendMessage(notify.id, `Сап, the chosen one 👋\n\n🎂 Нагадую, у ${mentionUser(user)} скоро буде день народження (${getUTC(user.birthday).fulldate}), бажаю удачі!`, { parse_mode: 'Markdown' });
//       }
//     } catch (e) {
//       Logger.error(`[BirthdayNotifyServ]: Three days notify error occured`, e);
//     }
//   }
// }



// const BirthdayNotifyService = new BirthdayNotifyServ();
// export default BirthdayNotifyService;