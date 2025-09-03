import TelegramApi from 'node-telegram-bot-api';
import { config as dotenvCfg } from 'dotenv';
import { getUTC } from './handlers/service';
import path from 'path';



// Preflight
dotenvCfg();



const env = {
  BOT_TOKEN: String(process.env['BOT_TOKEN']),
  ATLAS_USR: String(process.env['ATLAS_USR']),
  ATLAS_PWD: String(process.env['ATLAS_PWD']),
  ISPROD: process.env['ISPROD'] == 'true',
};



export const DevelopmentMode = process.argv.includes('devMode');
export const ProductionMode = process.argv.includes('prodMode');
export const TestMode = process.argv.includes('testMode');

export const adminId = 1030829551;
const logsDir = `${path.resolve()}/logs`;



export const bot = new TelegramApi(env.BOT_TOKEN, {
  polling: {
    autoStart: true,
    params: {
      offset: -1 // ignore past updates
    }
  }
});

export const config = {
  logsDir,
  mongodbUrl: `mongodb+srv://${env.ATLAS_USR}:${env.ATLAS_PWD}@default.saj4se1.mongodb.net/${env.ISPROD ? 'production' : 'development'}?retryWrites=true&w=majority&appName=default`,
  startedAt: `${getUTC().fulldate} ${getUTC().timeAccurate}`,
  startedMode: `${ProductionMode ? 'Production' : DevelopmentMode ? 'Development' : 'UNKNOWN'}`,
  superadminId: 1030829551,

  env,
};