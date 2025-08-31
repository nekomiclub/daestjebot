import { bot, config } from './config.js';
import { Logger } from './services/LoggerService.js';



(async function () {
  try {
    console.log(`
    ----------------------------
    BOT STARTED UP
  
    Date: ${config.startedAt} UTC
    Mode: ${config.startedMode}
    ----------------------------
      `);

    bot.onText(/\w+/gi, (msg) => {
      console.log(msg);
    });
  } catch (e) {
    Logger.fail(`[Startup]: An error ocured while startup`, e);
  }
})();