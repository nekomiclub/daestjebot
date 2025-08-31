import { Message } from 'node-telegram-bot-api';
import { Logger } from './services/LoggerService';
import { UserModel } from './models/UserModel';
import IUser from './types/IUser';
import { bot } from './config';



export default async function GroupController(msg: Message) {
  try {
    const from = msg.from;
    const text = msg.text;
    const chat = msg.chat;
    const chatId = chat.id;

    // Drop bots
    if (from?.is_bot) return;

    // Drop i
    if (!from || !text) return;

    let user = await UserModel.findOne({ id: from.id });
    if (!user) {
      const payload: IUser = {
        id: from.id,
        name: from.first_name,
        username: from.username
      };

      user = new UserModel(payload);
      Logger.info(`New user has been created. [@${payload.username ?? payload.name}; ${payload.id}]`);

      await user.save();
    }

    await bot.sendMessage(chatId, `hello @${user.username ?? user.name}`);
  } catch (e) {
    Logger.error(`[Group]: An error occured at group chat`, e);
  }
}