import mongoose from 'mongoose';
import { bot, config } from '../config';
import { Logger } from '../services/LoggerService';
import MongoDBService from '../services/MongoDBService';



export default async function reconnectMongodb() {
  await mongoose.disconnect();
  await MongoDBService.connect();

  await bot.sendMessage(config.superadminId, `mongodb reconnect succeeded`);

  Logger.info(`[ReconnectMongodb]: Mongodb reconnected`);
}