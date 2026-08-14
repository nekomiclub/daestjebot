import { HydratedDocument } from 'mongoose';
import { CallbackQuery, Message } from 'node-telegram-bot-api';
import TUser from './TUser';



export interface ICommandProps {
  message: Message
  user: HydratedDocument<TUser> | null

  query?: CallbackQuery
}



export const PMCommandsList = {
  PING: /^\/ping$/gi,
  HELP: /^\/help$/gi,
  MY_BIRTHDAY: /^\/my_birthday$/gi,
  SET_MY_BIRTHDAY: /^\/set_birthday\s/gi,
  BIRTHDAY_NOTIFY: /^\/birthday_notify$/gi,
} as const;

export const PMCallbackList = {
  /** After that should be ";{UTC timestamp}" */
  CONFIRM_BIRTHDAY: /confirm_birthday;/gi,

  /** Agree notifications about birthdays */
  ENABLE_BIRTHDAY_NOTIFY: /enable_birthday_notify/gi,

  /** Decline notifications about birthdays */
  DISABLE_BIRTHDAY_NOTIFY: /disable_birthday_notify/gi,
} as const;

export type PMCallbackType = Lowercase<keyof typeof PMCallbackList>



export const GroupCommandsList = {
  PING: /^\/ping$/gi,
  HELP: /^\/help$/gi,
  PING_EVERYONE: /^\/all$/gi,
  BIRTHDAYS: /^\/birthdays$/gi,
  PINGS: /^\/pings$/gi,
};

export const GroupCallbackList = {
  /** Enable participant birthday notification  */
  ENABLE_BIRTHDAY_NOTIFICATIONS: /enable_birthday_notifications/gi,

  /** Disable participant birthday notification  */
  DISABLE_BIRTHDAY_NOTIFICATIONS: /disable_birthday_notifications/gi,

  /** Enable participant birthday notification  */
  ENABLE_PUBLIC_EVERYONE: /enable_public_everyone/gi,

  /** Disable participant birthday notification  */
  DISABLE_PUBLIC_EVERYONE: /disable_public_everyone/gi,
} as const;

export type GroupCallbackType = Lowercase<keyof typeof GroupCallbackList>