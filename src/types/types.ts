import { HydratedDocument } from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import IUser from './IUser';



export interface ICommandProps {
  msg: Message
  user: HydratedDocument<IUser>
}