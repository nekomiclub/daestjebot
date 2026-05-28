import TelegramApi from 'node-telegram-bot-api';
import env from './utils/env';



export const DevelopmentMode = process.argv.includes('devMode');
export const ProductionMode = process.argv.includes('prodMode');
export const TestMode = process.argv.includes('testMode');

export const adminId = 1030829551;



export const bot = new TelegramApi(env('TELEGRAM_BOT_TOKEN'), {
  polling: {
    autoStart: true,
    params: {
      offset: -1 // ignore past updates
    }
  }
});

export const conf = {
  superadminId: 1030829551,
  curatorsIds: [697514948, 1386161279, 531261619],
  mainChatId: ProductionMode ? -1003067202557 : -1002939508402,

  variables: {
    volumes: {
      logs: env('ID_DOCKER') ? '/logs' : './logs'
    },
  },
};

export default conf;