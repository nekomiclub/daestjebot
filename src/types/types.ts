import { HydratedDocument } from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import IUser from './IUser';



export const CommandsList = {
  GRANT_PERM: /^\/grant\s/gi,
  REVOKE_PERM: /^\/revoke\s/gi,
  PING_EVERYONE: /^@all|^@everyone/gi,
};



export interface ICommandProps {
  msg: Message
  user: HydratedDocument<IUser>
}