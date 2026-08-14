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
    const users = await UserModel.find({ 'birthday.at': { $ne: undefined } });

    for (const key in users) {
      const user = users[key];

      if (isBirthday(user.birthday.at!) && user.birthday.notified_year !== getUTC().year) await this.notifyChats(user);
      else if (isBirthdayInDays(user.birthday.at!, 3) && user.birthday.warned_year !== getUTC().year) await this.warnAboutBirthday(user);
    }
  }



  /** Notify user's chats */
  async notifyChats(user: HydratedDocument<TUser>) {
    const groups = await ChatModel.find({ participants: { $in: [user.id] }, 'variables.birthdays_notify': true });

    user.birthday.notified_year = getUTC().year;
    user.markModified('birthday');

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

    user.birthday.warned_year = getUTC().year;
    user.markModified('birthday');

    await user.save();

    Logger.info(`[BirthdayNotify]: Sending 3-days warn about userId=${user.id} birthday to ${recipients.length} recipients`);

    for (const key in recipients) {
      const recipient = recipients[key];

      try {
        await sleep(500);


        await bot.sendMessage(recipient.id, `🎂 Нагадую, у <a href="tg://user?id=${user.id}">@${escapeHtml(user.username ?? user.name ?? `{Ім'я не вказано}`)}</a> скоро буде день народження (${getUTC(user.birthday.at!).fulldate}), бажаю удачі!\n\n<i>Ти отримав це сповіщення тому що увімкнув отримання сповіщення про день народження знайомих у налаштуваннях. Редагувати - /birthday_notify</i>`, {
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