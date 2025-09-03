import { Message } from 'node-telegram-bot-api';
import { Logger } from '../services/LoggerService';
import { USER_RIGHTS } from '../types/IUser';
import { config } from '../config';
import getUser from '../handlers/get-user';
import grantPermCommand from '../commands/grant-perm';
import { messageDTO } from '../handlers/DTOs';
import revokePermCommand from '../commands/revoke-perm';
import pingEveryoneCommand from '../commands/ping-everyone';
import { CommandsList, ICommandProps } from '../types/types';



export default async function GroupController(msg: Message) {
  try {
    const { chat, chatId, from, text } = messageDTO(msg);

    // Drop bots
    if (from?.is_bot) return;

    // Drop undefined
    if (!from || !text) return;

    // Get user
    const user = await getUser(msg);
    const cp: ICommandProps = { msg, user };



    if (text.match(CommandsList.GRANT_PERM) && user.id === config.superadminId) await grantPermCommand(cp);
    if (text.match(CommandsList.REVOKE_PERM) && user.id === config.superadminId) await revokePermCommand(cp);
    if (text.match(CommandsList.PING_EVERYONE) && user.rights.includes(USER_RIGHTS.CAN_PING)) await pingEveryoneCommand(cp);
  } catch (e) {
    Logger.error(`[Group]: An error occured at group chat`, e);
  }
}