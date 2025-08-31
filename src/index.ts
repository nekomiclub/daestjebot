import mongoose from 'mongoose';
import { bot, config } from './config.js';
import GroupController from './group-controller.js';
import { Logger } from './services/LoggerService.js';



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

    bot.on('message', GroupController);
  } catch (e) {
    Logger.fail(`[Startup]: An error ocured while startup`, e);
  }
})();