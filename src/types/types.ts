import { HydratedDocument } from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import IUser from './IUser';



export const CommandsList = {
  PING: /^\/ping/gi,
  HELP: /^\/help/gi,
};



export interface ICommandProps {
  message: Message
  user: HydratedDocument<IUser>
}