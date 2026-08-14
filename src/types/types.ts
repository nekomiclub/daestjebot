import { HydratedDocument } from 'mongoose';
import { Message } from 'node-telegram-bot-api';
import TUser from './TUser';



export type CallbackType =
  | 'confirm_birthday' // After that should be ";{UTC timestamp}"
  | 'birthday_notify_agree' // Agree pm notifications about birthdays
  | 'birthday_notify_decline' // Decline pm notifications about birthdays
  | 'group_enable_birthday_notifications' // Enable group participant birthday notification 
  | 'group_disable_birthday_notifications' // Disable group participant birthday notification 



export const CallbackList: Record<Uppercase<CallbackType>, RegExp> = {
  CONFIRM_BIRTHDAY: /confirm_birthday;/gi,
  BIRTHDAY_NOTIFY_AGREE: /birthday_notify_agree/gi,
  BIRTHDAY_NOTIFY_DECLINE: /birthday_notify_decline/gi,
  GROUP_ENABLE_BIRTHDAY_NOTIFICATIONS: /group_enable_birthday_notifications/gi,
  GROUP_DISABLE_BIRTHDAY_NOTIFICATIONS: /group_disable_birthday_notifications/gi,
};

export const PMCommandsList = {
  PING: /^\/ping/gi,
  HELP: /^\/help/gi,
  MY_BIRTHDAY: /^\/my_birthday/gi,
  SET_MY_BIRTHDAY: /^\/set_birthday\s/gi,
  BIRTHDAY_NOTIFY: /^\/birthday_notify/gi,
};

export const GroupCommandsList = {
  PING: /^\/ping/gi,
  HELP: /^\/help/gi,
  PING_EVERYONE: /^\/all/gi,
  BIRTHDAYS: /^\/birthdays/gi,
  PINGS: /^\/pings/gi,
};



export interface ICommandProps {
  message: Message
  user: HydratedDocument<TUser> | null
}