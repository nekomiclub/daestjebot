import TelegramApi from 'node-telegram-bot-api';
import env from './utils/env';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import ms from 'ms';



export const DevelopmentMode = env('NODE_ENV') === 'development';
export const ProductionMode = env('NODE_ENV') === 'production';

export const adminId = 1030829551;



export const bot = new TelegramApi(env('TELEGRAM_BOT_TOKEN'), {
  polling: {
    autoStart: true,
    params: {
      offset: -1 // ignore past updates
    }
  }
});

export const client = new TelegramClient(new StringSession(), env('TELEGRAM_API_ID'), env('TELEGRAM_API_HASH'), {
  connectionRetries: 5
});

export const conf = {
  superadminId: adminId,
  curatorsIds: [697514948, 1386161279, 531261619],
  mainChatId: ProductionMode ? -1003067202557 : -1002939508402,

  variables: {
    volumes: {
      logs: env('IS_DOCKER') ? '/logs' : './logs'
    },

    changeBirthdayTimeout: ms('0.5y')
  },
};

export default conf;