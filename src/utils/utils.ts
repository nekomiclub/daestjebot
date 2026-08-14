import { InlineKeyboardButton } from 'node-telegram-bot-api';
import z from 'zod';
import conf from '~/conf';
import TUser from '~/types/TUser';
import { CallbackType } from '~/types/types';



/** 
 * Get UTC date
 * 
 * @param ts ISO/UTC string, timestamp or Date
 */
export function getUTC(ts?: string | number | Date) {
  const now = new Date(ts ?? new Date());

  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const date = String(now.getUTCDate()).padStart(2, '0');
  const weekDay = now.getUTCDay();
  const hrs = String(now.getUTCHours()).padStart(2, '0');
  const mins = String(now.getUTCMinutes()).padStart(2, '0');
  const secs = String(now.getUTCSeconds()).padStart(2, '0');
  const ms = String(now.getUTCMilliseconds()).padStart(4, '0');

  return {
    year,
    month: +month - 1,
    date: +date,
    weekDay,
    hrs: +hrs,
    mins: +mins,
    secs: +secs,
    ms: +ms,
    timestamp: now.getTime(),
    fulldate: `${date}.${month}.${year}`,
    time: `${hrs}:${mins}:${secs}`,

    /** Stringified values (with pads) */
    str: { month, date, hrs, mins, secs, ms },

    ISO: now.toISOString(),
  };
}



/** Get days between two dates within the same year */
export function daysBetween(start: string, end: string) {
  const baseYear = new Date().getUTCFullYear();

  const parseDayMonth = (value: string, year: number): Date | null => {
    const match = /^(\d{2})\.(\d{2})$/.exec(value);

    // Reject date
    if (!match) return null;

    const [, dayStr, monthStr] = match;
    const day = Number(dayStr);
    const month = Number(monthStr) - 1;

    const date = new Date();

    date.setUTCFullYear(year, month, day);
    date.setUTCHours(0, 0, 0, 0);

    // Validate that the resulting date matches the input
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month ||
      date.getUTCDate() !== day
    ) {
      return null; // Invalid calendar date
    }

    return date;
  };

  const startDate = parseDayMonth(start, baseYear);
  let endDate = parseDayMonth(end, baseYear);

  if (!startDate || !endDate) return null;



  // If end is earlier in the calendar, assume next year
  if (endDate < startDate) endDate = parseDayMonth(end, baseYear + 1);
  if (!endDate) return null;

  const msPerDay = 24 * 60 * 60 * 1000;

  return Math.floor(
    (endDate.getTime() - startDate.getTime()) / msPerDay
  );
}



export function endWithin(startedAt: number): string {
  return `${getUTC().timestamp - startedAt}ms`;
}



/** 
 * Trim string and remove all excess spaces
 * 
 * @example "   Hello  World  " > "Hello World"
 */
export function trimString(input: string) {
  return input.trim().replace(/\s+/g, ' ');
}



/** Get random number between min and max */
export function randomBetween(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max + 1 - min));
}



/** Parse zod booleanish ("false") values to real boolean (false) */
export const zBoolean = z.preprocess((value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}, z.boolean());



export function mentionUser(user: TUser) {
  return `[${user.username ? `@${user.username}` : user.name}](tg://user?id=${user.id})`;
}



/** Join substring with null filtering */
export function joinString(subs: Array<string | null | undefined | number | false>) {
  return subs.filter(el => Boolean(el)).join(' ');
}



/** Get user's birthday props */
export function getUserBirthday(user: TUser) {
  const birthdayTimeout = user.birthday_changed_at ? getUTC(user.birthday_changed_at).timestamp + conf.variables.changeBirthdayTimeout : 0;
  const canChangeBirthday = !birthdayTimeout ? true : getUTC().timestamp > getUTC(birthdayTimeout).timestamp;

  return { birthdayTimeout, canChangeBirthday, date: user.birthday_changed_at };
}



/** Wrapper for CallbackType string */
export const callbackType = (value: CallbackType): CallbackType => value;




/** Word declination
 * @example
 * wordDeclination(1, ['чашка', 'чашки', 'чашок']) => чашка
 * wordDeclination(2, ['чашка', 'чашки', 'чашок']) => чашки
 */
export function wordDeclination(number: number, words_arr: string[]) {
  number = Math.abs(number);
  if (Number.isInteger(number)) {
    let options = [2, 0, 1, 1, 1, 2];
    return words_arr[(number % 100 > 4 && number % 100 < 20) ? 2 : options[(number % 10 < 5) ? number % 10 : 5]];
  }
  return words_arr[1];
}



export function BirthdayNotifyKeyboard(isNotify: boolean): InlineKeyboardButton[] {
  return [{
    text: isNotify ? '❌ Ні' : '✅ Так',
    callback_data: isNotify ? callbackType('birthday_notify_decline') : callbackType('birthday_notify_agree')
  }];
}



export function GroupBirthdayNotificationKeyboard(enabled: boolean): InlineKeyboardButton[] {
  return [{
    text: enabled ? '❌ Вимкнути' : '✅ Увімкнути',
    callback_data: enabled ? callbackType('group_disable_birthday_notifications') : callbackType('group_enable_birthday_notifications')
  }];
}