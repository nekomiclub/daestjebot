import mongoose from 'mongoose';
import { bot, config } from './config.js';
import { Logger } from './services/LoggerService.js';
import GroupController from './controllers/group-controller.js';
import PMController from './controllers/pm-controller.js';
import BirthdayNotifyService from './services/BirthdayNotifyService.js';



//* Establish mongodb connection
mongoose.set('strictQuery', false);
mongoose.connect(config.mongodbUrl, {
  retryWrites: true,
}).catch(e => {
  Logger.fail('[System]: MongoDB connection failed', e);
});



(async function () {
  try {
    console.log(`
    ----------------------------
    BOT STARTED UP
  
    Date: ${config.startedAt} UTC
    Mode: ${config.startedMode}
    ----------------------------
      `);

    bot.on('message', msg => {
      Logger.trace(`[${msg.from?.username ?? msg.from?.id}/${msg.chat.id}]: ${msg.text}`);

      if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') return GroupController(msg);
      if (msg.chat.type === 'private') return PMController(msg);

      return bot.sendPhoto(msg.chat.id, `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoHWLFJuyEnP3g8pASP6OKlyaE9ZENmqX9gQ&s`);
    });



    BirthdayNotifyService.startCRON();
  } catch (e) {
    Logger.fail(`[Startup]: An error ocured while startup`, e);
  }
})();