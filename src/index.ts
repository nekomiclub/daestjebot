import mongoose from 'mongoose';
import { bot, DevelopmentMode, ProductionMode } from './conf';
import BirthdayNotifyService from './services/BirthdayNotifyService';
import PMController from './controllers/pm-controller';
import GroupController from './controllers/group-controller';
import env from './utils/env';
import Logger from './services/LoggerService';
import { getUTC } from './utils/utils';



async function runtime() {
  try {
    // === Establish database connection
    await ConnectMongoDB();



    console.log(`
      ----------------------------
      BOT STARTED UP
    
      Date: ${`${getUTC().fulldate} ${getUTC().fulldate} ${getUTC().time}`} UTC
      Mode: ${`${ProductionMode ? 'Production' : DevelopmentMode ? 'Development' : 'UNKNOWN'}`}
      ----------------------------
        `);

    bot.on('message', msg => {
      Logger.verbose(`[${msg.from?.username ?? msg.from?.id}/${msg.chat.id}]: ${msg.text}`);

      if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') return GroupController(msg);
      if (msg.chat.type === 'private') return PMController(msg);

      return bot.sendPhoto(msg.chat.id, `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoHWLFJuyEnP3g8pASP6OKlyaE9ZENmqX9gQ&s`);
    });



    BirthdayNotifyService.startCRON();
  } catch (e) {
    Logger.error(`[System/Init]: FATAL ERROR OCCURED. MESSAGE: `, e);

    // Delay app crash to ensure that crash log has been collected
    setTimeout(() => {
      throw e;
    }, 1000);
  }
}

runtime();



/** Connect to the mongodb */
async function ConnectMongoDB() {
  mongoose.set('strictQuery', false);
  await mongoose.connect(`mongodb+srv://${env('MONGODB_USR')}:${env('MONGODB_PWD')}@${env('MONGODB_HOST')}`, {
    retryWrites: true,
  });
}