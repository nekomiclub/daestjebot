import TelegramApi from 'node-telegram-bot-api';
import { config as dotenvCfg } from 'dotenv';
import { getUTC } from './handlers/service';
import path from 'path';



// Preflight
dotenvCfg();



const env = {
  BOT_TOKEN: String(process.env['BOT_TOKEN'])
};



export const DevelopmentMode = process.argv.includes('devMode');
export const ProductionMode = process.argv.includes('prodMode');
export const TestMode = process.argv.includes('testMode');

export const adminId = 1030829551;
const logsDir = `${path.resolve()}/logs`;



export const bot = new TelegramApi(env.BOT_TOKEN, {
  polling: true
});

export const config = {
  logsDir,
  startedAt: `${getUTC().fulldate} ${getUTC().timeAccurate}`,
  startedMode: `${ProductionMode ? 'Production' : DevelopmentMode ? 'Development' : 'UNKNOWN'}`
};