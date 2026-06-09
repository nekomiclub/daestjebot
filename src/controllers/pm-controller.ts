import { Message } from 'node-telegram-bot-api';
import getUser from '~/utils/get-user';
import { messageDTO } from '~/utils/DTOs';
import { CommandsList, ICommandProps } from '~/types/types';
import Logger from '~/services/LoggerService';
import PMHelpCommand from '~/commands/pm/PMHelp';
import PingCommand from '~/commands/Ping';
import MyBirthdayCommand from '~/commands/pm/MyBirthday';
import SetMyBirthday from '~/commands/pm/SetMyBirthday';



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
    if (text.match(CommandsList.HELP)) return await PMHelpCommand(command);
    if (text.match(CommandsList.MY_BIRTHDAY)) return await MyBirthdayCommand(command);
    if (text.match(CommandsList.SET_MY_BIRTHDAY)) return await SetMyBirthday(command);
  } catch (e) {
    Logger.error(`[PM]: An error occured at private chat`, e);
  }
}