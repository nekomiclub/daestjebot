import mongoose from 'mongoose';
import { bot, config } from '../config';
import { Logger } from '../services/LoggerService';



export default async function reconnectMongodb() {
  await mongoose.disconnect();
  await mongoose.connect(config.mongodbUrl, {
    retryWrites: true,
  }).catch(e => {
    Logger.fail('[ReconnectMongodb]: MongoDB connection failed', e);
  });

  await bot.sendMessage(config.superadminId, `mongodb reconnect succeeded`);

  Logger.info(`[ReconnectMongodb]: Mongodb reconnected`);
}