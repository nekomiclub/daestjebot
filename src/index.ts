import mongoose from 'mongoose';
import conf, { bot, client, IsDevelopment, IsProduction } from './conf';
import env from './utils/env';
import Logger from './services/LoggerService';
import { getUTC } from './utils/utils';
import Controller from './controllers/_index';
import BirthdayNotifyService from './services/BirthdayNotifyService';



async function runtime() {
  try {
    // === Establish database connection
    await ConnectMongoDB();

    // === Connect telegram client
    try {
      await client.start({ botAuthToken: env('TELEGRAM_BOT_TOKEN') });
    } catch (e) {
      Logger.error(`[TelegramClient]: An error occured while connecting to the telegram`, e);

      await bot.sendMessage(conf.superadminId, `💥 Telegram client connection errored. See logs to retrieve more details.\n\n🗒️: ${(e as any)?.message}`);
    }

    new BirthdayNotifyService().startCRON();



    console.log(`
      ----------------------------
      BOT STARTED UP
    
      Date: ${getUTC().fulldate} ${getUTC().time} UTC
      Mode: ${IsProduction ? 'Production' : IsDevelopment ? 'Development' : 'UNKNOWN'}
      ----------------------------
        `);



    // === Set hint commands for default chat type 
    bot.setMyCommands([
      { command: '/help', description: 'ℹ️ Інформація' }
    ], { scope: { type: 'default' } });



    // === Handle messages
    bot.on('message', message => {
      if (message.chat.type === 'group' || message.chat.type === 'supergroup') return Controller.GroupController(message);
      if (message.chat.type === 'private') return Controller.PMController(message);

      return bot.sendPhoto(message.chat.id, `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoHWLFJuyEnP3g8pASP6OKlyaE9ZENmqX9gQ&s`, {
        caption: '😶‍🌫️ Бот не підтримує такий тип чатів'
      });
    });



    // === Handle callback queries 
    bot.on('callback_query', query => {
      return Controller.CallbackController(query);
    });



    // === Handle appear in chats
    bot.on('new_chat_members', Controller.NewChatMembersController);

    // === Handle left from chats
    bot.on('left_chat_member', Controller.LeftChatMemberController);
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
  await mongoose.connect(`mongodb+srv://${env('MONGODB_USR')}:${env('MONGODB_PWD')}@${env('MONGODB_HOST')}/${env('MONGODB_DB')}`, {
    retryWrites: true,
  });
}