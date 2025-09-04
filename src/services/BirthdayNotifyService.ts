import { HydratedDocument } from 'mongoose';
import { getUTC, mentionUser, randomNumberBetween } from '../handlers/service';
import { UserModel } from '../models/UserModel';
import IUser from '../types/IUser';
import { Logger } from './LoggerService';
import { bot } from '../config';



const BirthdayMessages = [
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



class BirthdayNotifyServ {
  usersNotified: string[] = [];



  /** Start cron task */
  startCRON() {
    this.poll();

    // Ping every hour
    setInterval(async () => {
      this.poll();
    }, 3600000);
  }

  // Poll users birthdays
  async poll() {
    try {
      const now = getUTC();
      const users = await UserModel.find({ birthday: { $ne: undefined } });

      for (const key in users) {
        try {
          const user = users[key];

          const birthdayDate = getUTC(user.birthday);

          // notify
          if (birthdayDate.month === now.month && birthdayDate.date === now.date && !this.usersNotified.includes(user.id)) {
            this.usersNotified.push(user.id);

            this.notifyChats(user);
          };
        } catch (e) {
          Logger.fail(`[BirthdayNotifyServ]: Poll map users error`, e);
        }
      }
    } catch (e) {
      Logger.fail(`[BirthdayNotifyServ]: Poll error`, e);
    }
  }

  // Notify users chats
  async notifyChats(user: HydratedDocument<IUser>) {
    try {
      let participateModified = false;



      for (const key in user.participateChatsIds) {
        const chatId = user.participateChatsIds[key];

        // Drop private chat
        if (chatId > 0) continue;

        try {
          await bot.sendPhoto(chatId, `https://cataas.com/cat?ts=${getUTC().timestamp}`, {
            caption: `З днем народження ${mentionUser(user)}!\n${BirthdayMessages[randomNumberBetween(0, BirthdayMessages.length - 1)]}\n\nДавайте вип'єм за ту дату, Коли мама дала тату.`,
            parse_mode: 'Markdown'
          });
        } catch (e) {
          if ('response' in (e as any)) {
            const res = (e as any).response.body as { ok: boolean, error_code: number, description: string };

            // Drop invalid chat
            if (res.description === 'Bad Request: chat not found' || res.description === 'Bad Request: group chat was upgraded to a supergroup chat') {
              user.participateChatsIds = user.participateChatsIds.filter(el => el !== chatId);
              participateModified = true;
              Logger.debug(`[BirthdayNotifyServ]: Chat (${chatId}) dropped due to not found or upgrade to supergroup`);

              return;
            }
          }

          Logger.fail(`[BirthdayNotifyServ]: Chat notify error`, e);
        }
      }

      // Save modified participate chats
      if (participateModified) {
        Logger.debug(`[BirthdayNotifyServ]: Participate chats modified (invalid dropped)`);
        user.markModified('participateChatsIds');
        await user.save();
      }

      Logger.info(`[BirthdayNotifyServ]: Celebrating ${user.username ?? user.name} birthday!`);
    } catch (e) {
      Logger.fail(`[BirthdayNotifyServ]: Chats notify error`, e);
    }
  }
}



const BirthdayNotifyService = new BirthdayNotifyServ();
export default BirthdayNotifyService;