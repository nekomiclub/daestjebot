import { HydratedDocument } from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import IUser from './IUser';



export type CallbackType =
  | 'confirm_birthday' // After that should be ";{UTC timestamp}"



export const CallbackList: Record<Uppercase<CallbackType>, RegExp> = {
  CONFIRM_BIRTHDAY: /confirm_birthday;/gi
};

export const CommandsList = {
  PING: /^\/ping/gi,
  HELP: /^\/help/gi,
  MY_BIRTHDAY: /^\/my_birthday/gi,
  SET_MY_BIRTHDAY: /^\/set_birthday\s/gi,
};



export interface ICommandProps {
  message: Message
  user: HydratedDocument<IUser>
}