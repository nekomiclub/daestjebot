import { Message } from 'node-telegram-bot-api';
import getUser from '~/utils/get-user';
import { messageDTO } from '~/utils/DTOs';
import { ICommandProps, GroupCommandsList } from '~/types/types';
import PingPongCommand from '~/commands/PingPong';
import Logger from '~/services/LoggerService';
import Command from '~/commands/group/_index';



/** Groups controller */
export default async function ChatController(message: Message) {
  try {
    const { chat, chatId, from, text } = messageDTO(message);

    // Drop undefined
    if (!from || !text) return;

    // Drop bots
    if (from.is_bot) return;

    // Get user
    const user = await getUser(message);
    const command: ICommandProps = { message, user };



    if (text.match(GroupCommandsList.PING)) return await PingPongCommand(command);

    if (text.match(GroupCommandsList.HELP)) return await Command.ChatHelpCommand(command);
    if (text.match(GroupCommandsList.PING_EVERYONE)) return await Command.PingEveryoneCommand(command);
    if (text.match(GroupCommandsList.BIRTHDAYS)) return await Command.BirthdaysCommand(command);
  } catch (e) {
    Logger.error(`[Chat]: An error occured at the chat`, e);
  }
}