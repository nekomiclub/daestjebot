import mongoose from 'mongoose';
import { bot, DevelopmentMode, ProductionMode } from './conf';
import env from './utils/env';
import Logger from './services/LoggerService';
import { getUTC } from './utils/utils';
import PMController from './controllers/pm-controller';
import ChatController from './controllers/chat-controller';
import CallbackController from './controllers/callback-controller';
import { CallbackType } from './types/types';
import NewChatMembersController from './controllers/new-chat-members-controller';
import LeftChatMemberController from './controllers/left-chat-member-controller';



async function runtime() {
  try {
    // === Establish database connection
    await ConnectMongoDB();

    // === Connect telegram client
    // await client.start({ botAuthToken: env('TELEGRAM_BOT_TOKEN') });



    console.log(`
      ----------------------------
      BOT STARTED UP
    
      Date: ${getUTC().fulldate} ${getUTC().time} UTC
      Mode: ${ProductionMode ? 'Production' : DevelopmentMode ? 'Development' : 'UNKNOWN'}
      ----------------------------
        `);



    // === Set hint commands for default chat type 
    bot.setMyCommands([
      { command: '/help', description: 'ℹ️ Інформація' }
    ], { scope: { type: 'default' } });



    // === Handle messages
    bot.on('message', message => {
      if (message.chat.type === 'group' || message.chat.type === 'supergroup') return ChatController(message);
      if (message.chat.type === 'private') return PMController(message);

      return bot.sendPhoto(message.chat.id, `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoHWLFJuyEnP3g8pASP6OKlyaE9ZENmqX9gQ&s`, {
        caption: '😶‍🌫️ Бот не підтримує такий тип чатів'
      });
    });



    // === Handle callback queries 
    bot.on('callback_query', query => {
      if (!query.message) return;

      // Reassign query message from
      query.message.from = query.from;

      return CallbackController(query.message, query.data as CallbackType | undefined);
    });



    // === Handle appear in chats
    bot.on('new_chat_members', NewChatMembersController);

    // === Handle left from chats
    bot.on('left_chat_member', LeftChatMemberController);
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