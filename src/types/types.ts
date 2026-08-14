import { HydratedDocument } from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import TUser from './TUser';



export interface ICommandProps {
  message: Message
  user: HydratedDocument<TUser> | null
}



export const PMCallbackList = {
  /** After that should be ";{UTC timestamp}" */
  CONFIRM_BIRTHDAY: /confirm_birthday;/gi,

  /** Agree notifications about birthdays */
  ENABLE_BIRTHDAY_NOTIFY: /enable_birthday_notify/gi,

  /** Decline notifications about birthdays */
  DISABLE_BIRTHDAY_NOTIFY: /disable_birthday_notify/gi,
} as const;

export const PMCommandsList = {
  PING: /^\/ping/gi,
  HELP: /^\/help/gi,
  MY_BIRTHDAY: /^\/my_birthday/gi,
  SET_MY_BIRTHDAY: /^\/set_birthday\s/gi,
  BIRTHDAY_NOTIFY: /^\/birthday_notify/gi,
} as const;

export type PMCallbackType = Lowercase<keyof typeof PMCallbackList>



export const GroupCallbackList = {
  /** Enable participant birthday notification  */
  ENABLE_BIRTHDAY_NOTIFICATIONS: /group_enable_birthday_notifications/gi,

  /** Disable participant birthday notification  */
  DISABLE_BIRTHDAY_NOTIFICATIONS: /group_disable_birthday_notifications/gi,
} as const;

export const GroupCommandsList = {
  PING: /^\/ping/gi,
  HELP: /^\/help/gi,
  PING_EVERYONE: /^\/all/gi,
  BIRTHDAYS: /^\/birthdays/gi,
  PINGS: /^\/pings/gi,
};

export type GroupCallbackType = Lowercase<keyof typeof GroupCallbackList>