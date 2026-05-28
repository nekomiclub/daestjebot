import { Message } from 'node-telegram-bot-api';
import getUser from '~/handlers/get-user';
import { messageDTO } from '~/handlers/DTOs';
import { CommandsList, ICommandProps } from '~/types/types';
import { conf } from '~/conf';
import changeBirthdayCommand from '~/commands/change-birthday';
import Logger from '~/services/LoggerService';



export default async function PMController(msg: Message) {
  try {
    const { chat, chatId, from, text } = messageDTO(msg);

    // Drop undefined
    if (!from || !text) return;

    // Get user
    const user = await getUser(msg);
    const cp: ICommandProps = { msg, user };



    if (text.match(CommandsList.CHANGE_BIRTHDAY) && user.id === conf.superadminId) await changeBirthdayCommand(cp);
  } catch (e) {
    Logger.error(`[PM]: An error occured at private chat`, e);
  }
}