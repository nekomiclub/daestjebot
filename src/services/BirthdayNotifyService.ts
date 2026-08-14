// import { HydratedDocument } from 'mongoose';
// import { UserModel } from '~/models/UserModel';
// import TUser, { USER_RIGHTS } from '~/types/TUser';
// import { bot, conf } from '~/conf';
// import Logger from './LoggerService';
// import { getUTC, mentionUser, randomBetween } from '~/utils/utils';

import { HydratedDocument } from 'mongoose';
import ms from 'ms';
import { ChatModel } from '~/models/ChatModel';
import { UserModel } from '~/models/UserModel';
import TUser from '~/types/TUser';
import { escapeHtml, getUTC, randomBetween } from '~/utils/utils';
import Logger from './LoggerService';
import { sleep } from 'telegram/Helpers';
import { bot } from '~/conf';



const BirthdayGreetings = [
  'Вітаю з днем народження! Бажаю робити лиш те, що до вподоби, брати від життя все найкраще, цінувати кожен день та бути щасливим.',
  'Нехай ніщо не завадить здійсненню мрій. Посміхайся, люби, досягай, насолоджуйся, будь завжди щасливим!',
  'Вітаю з твоїм особливими днем! Нехай всі мрії та бажання здійснюються і дарують неймовірне відчуття щастя!',
  'З днем народження! Бажаю любові та простого людського щастя, побільше грошей та міцного здоров’я. Нехай кожен день дарує нові можливості та приємні сюрпризи!',
  'Вітаю з днем народження! Бажаю тобі затишку в оселі, благополуччя в родині, здоров’я в тілі та кохання в душі!',
  'Бажаю радісних подій, цікавих пригод, фантастичних емоцій та завжди прекрасного настрою.',
  'Прийміть найкращі привітання з днем народження! Нехай душа сповниться світлою радістю, оптимізмом, вірою у власні сили. Все омріяне хай втілиться, все загадане — здійсниться!',
  'Нехай кожна мить твого життя буде наповнена щастям і благополуччям, коханням і щирістю. Хай успіх завжди крокує поруч з тобою.',
  'З днем народження! Бажаю розквіту сил, вдалих днів, безліч можливостей, міцного здоров’я, взаємного кохання, чудового настрою та розкішного життя!',
];



export default class BirthdayNotifyService {
  startCRON() {
    console.log(`[BirthdayNotifyService]: CRON process started ...`);

    this.poll();

    setInterval(() => {
      this.poll();
    }, ms('1h'));
  }



  /** Poll users birthdays */
  async poll() {
    const users = await UserModel.find({ birthday_at: { $ne: undefined } });

    for (const key in users) {
      const user = users[key];

      if (isBirthday(user.birthday_at!) && user.birthday_notified_year !== getUTC().year) await this.notifyChats(user);
      else if (isBirthdayInDays(user.birthday_at!, 3) && user.birthday_warned_year !== getUTC().year) await this.warnAboutBirthday(user);
    }
  }



  /** Notify user's chats */
  async notifyChats(user: HydratedDocument<TUser>) {
    const groups = await ChatModel.find({ participants: { $in: [user.id] }, 'variables.birthdays_notify': true });

    user.birthday_notified_year = getUTC().year;
    user.markModified('birthday_notified_year');

    await user.save();

    Logger.info(`[BirthdayNotify]: Sending notification about userId=${user.id} birthday to ${groups.length} groups`);

    for (const key in groups) {
      const group = groups[key];

      try {
        await sleep(500);

        const celebrateMsg = await bot.sendPhoto(group.id, `https://cataas.com/cat?ts=${getUTC().timestamp}`, {
          caption: `З днем народження <a href="tg://user?id=${user.id}">@${escapeHtml(user.username ?? user.name ?? `😼`)}</a>! 🥳🎂🥂\n${BirthdayGreetings[randomBetween(0, BirthdayGreetings.length - 1)]}\n\nДавайте вип'єм за ту дату, Коли мама дала тату. 🍻`,
          parse_mode: 'HTML'
        });

        try {
          await bot.pinChatMessage(group.id, celebrateMsg.message_id);
        } catch (e) {

        }
      } catch (e) {
        Logger.error(`[BirthdayNotify]: An error occured while notifying groupId=${group.id} about userId=${user.id} birthday`, e);
      }
    }
  }



  /** Warn about incoming birthday */
  async warnAboutBirthday(user: HydratedDocument<TUser>) {
    const recipients = await this._getRecipients(user);

    user.birthday_warned_year = getUTC().year;
    user.markModified('birthday_warned_year');

    await user.save();

    Logger.info(`[BirthdayNotify]: Sending 3-days warn about userId=${user.id} birthday to ${recipients.length} recipients`);

    for (const key in recipients) {
      const recipient = recipients[key];

      try {
        await sleep(500);


        await bot.sendMessage(recipient.id, `🎂 Нагадую, у <a href="tg://user?id=${user.id}">@${escapeHtml(user.username ?? user.name ?? `{Ім'я не вказано}`)}</a> скоро буде день народження (${getUTC(user.birthday_at!).fulldate}), бажаю удачі!\n\n<i>Ти отримав це сповіщення тому що увімкнув отримання сповіщення про день народження знайомих у налаштуваннях. Редагувати - /birthday_notify</i>`, {
          parse_mode: 'HTML'
        });
      } catch (e) {
        Logger.error(`[BirthdayNotify]: An error occured while notifying recepientId=${recipient.id} about userId=${user.id} birthday`, e);
      }
    }
  }

  async _getRecipients(user: HydratedDocument<TUser>) {
    const groups = await ChatModel.find({ participants: { $in: [user.id] } });
    const recipientsId = new Set(...groups.map(el => el.participants.filter(el => el !== user.id)));
    const recipients = await UserModel.find({ id: { $in: [...recipientsId] }, recieve_birthday_notifications: true });

    return recipients;
  }
}



function isBirthday(isoDate: string) {
  const birthday = getUTC(isoDate);
  const today = getUTC();

  if (
    birthday.month === 1 &&
    birthday.date === 29
  ) {
    if (!isLeapYear(today.year)) {
      return today.month === 1 && today.date === 28;
    }
  }

  return (
    birthday.month === today.month &&
    birthday.date === today.date
  );
}

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function isBirthdayInDays(isoDate: string, days: number): boolean {
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number);

  const now = new Date();

  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );

  let birthday = Date.UTC(
    now.getUTCFullYear(),
    month - 1,
    day,
  );

  // Birthday already passed this year → next year
  if (birthday < today) {
    birthday = Date.UTC(
      now.getUTCFullYear() + 1,
      month - 1,
      day,
    );
  }

  const diffDays = (birthday - today) / 86_400_000;

  return diffDays === days;
}



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