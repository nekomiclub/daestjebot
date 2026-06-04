import { Message } from 'node-telegram-bot-api';
import getUser from '~/handlers/get-user';
import { messageDTO } from '~/handlers/DTOs';
import { CommandsList, ICommandProps } from '~/types/types';
import Logger from '~/services/LoggerService';
import PingCommand from '~/commands/ping';



/** PM controller */
export default async function PMController(message: Message) {
  try {
    const { chat, chatId, from, text } = messageDTO(message);

    // Drop undefined
    if (!from || !text) return;

    // Get user
    const user = await getUser(message);
    const command: ICommandProps = { message, user };



    if (text.match(CommandsList.PING)) return await PingCommand(command);
  } catch (e) {
    Logger.error(`[PM]: An error occured at private chat`, e);
  }
}