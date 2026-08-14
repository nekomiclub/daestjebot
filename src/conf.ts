import TelegramApi from 'node-telegram-bot-api';
import env from './utils/env';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import ms from 'ms';



export const IsDevelopment = env('NODE_ENV') === 'development';
export const IsProduction = env('NODE_ENV') === 'production';



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
  superadminId: 1030829551,

  botId: Number(env('TELEGRAM_BOT_TOKEN').split(':')[0]),

  variables: {
    volumes: {
      logs: env('IS_DOCKER') ? '/logs' : './logs'
    },

    changeBirthdayTimeout: ms('0.5y'),
    everyoneInvokeTimeout: ms('30s')
  },
};

export default conf;