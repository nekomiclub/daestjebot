import { HydratedDocument } from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import IUser from './IUser';



export const CommandsList = {
  GRANT_PERM: /^\/grant\s/gi,
  REVOKE_PERM: /^\/revoke\s/gi,
  PING_EVERYONE: /^@all|^@everyone/gi,
  PING_STUDENTS: /^@st|^@студєнти/gi,
  PING_CURATORS: /^@cr|^@куратори/gi,
  START: /^\/start/gi,
  CHANGE_BIRTHDAY: /^\/bd\s/gi,
};



export interface ICommandProps {
  msg: Message
  user: HydratedDocument<IUser>
}