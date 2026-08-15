import { Message } from 'node-telegram-bot-api';
import getUser from '~/utils/get-user';
import { messageDTO } from '~/utils/DTOs';
import { PMCommandsList, ICommandProps } from '~/types/types';
import Logger from '~/services/LoggerService';
import Command from '~/commands/pm/_index';
import PingPongCommand from '~/commands/PingPong';



/** PM controller */
export default async function PMController(message: Message) {
  try {
    const { chat, chatId, from, text } = messageDTO(message);

    // Drop undefined
    if (!from || !text) return;

    // Get user
    const user = await getUser(message);
    const command: ICommandProps = { message, user };



    if (text.match(PMCommandsList.PING)) return await PingPongCommand(command);

    if (text.match(PMCommandsList.START)) return await Command.PMHelpCommand(command);
    if (text.match(PMCommandsList.HELP)) return await Command.PMHelpCommand(command);
    if (text.match(PMCommandsList.MY_BIRTHDAY)) return await Command.MyBirthdayCommand(command);
    if (text.match(PMCommandsList.SET_MY_BIRTHDAY)) return await Command.SetMyBirthday(command);
    if (text.match(PMCommandsList.BIRTHDAY_NOTIFY)) return await Command.BirthdayNotifyCommand(command);
  } catch (e) {
    Logger.error(`[PM]: An error occured at the private chat`, e);
  }
}