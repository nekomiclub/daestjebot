import mongoose from 'mongoose';
import { bot, config } from './config.js';
import { Logger } from './services/LoggerService.js';
import GroupController from './group-controller.js';



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
      if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') return GroupController(msg);

      return bot.sendPhoto(msg.chat.id, `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoHWLFJuyEnP3g8pASP6OKlyaE9ZENmqX9gQ&s`);
    });
  } catch (e) {
    Logger.fail(`[Startup]: An error ocured while startup`, e);
  }
})();