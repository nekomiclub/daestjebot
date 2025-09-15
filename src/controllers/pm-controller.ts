import { Message } from 'node-telegram-bot-api';
import { Logger } from '../services/LoggerService';
import getUser from '../handlers/get-user';
import { messageDTO } from '../handlers/DTOs';
import { CommandsList, ICommandProps } from '../types/types';
import { config } from '../config';
import changeBirthdayCommand from '../commands/change-birthday';
import reconnectMongodb from '../commands/reconnect-mongodb';



export default async function PMController(msg: Message) {
  try {
    const { chat, chatId, from, text } = messageDTO(msg);

    // Drop undefined
    if (!from || !text) return;

    // Get user
    const user = await getUser(msg);
    const cp: ICommandProps = { msg, user };



    if (text.match(CommandsList.CHANGE_BIRTHDAY) && user.id === config.superadminId) await changeBirthdayCommand(cp);
    if (text.match(CommandsList.RECONNECT_MONGODB) && user.id === config.superadminId) await reconnectMongodb();
  } catch (e) {
    Logger.error(`[PM]: An error occured at private chat`, e);
  }
}