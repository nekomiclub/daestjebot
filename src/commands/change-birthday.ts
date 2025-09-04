import { bot } from '../config';
import { messageDTO } from '../handlers/DTOs';
import { getUTC } from '../handlers/service';
import { UserModel } from '../models/UserModel';
import { Logger } from '../services/LoggerService';
import { CommandsList, ICommandProps } from '../types/types';



export default async function changeBirthdayCommand({ msg }: ICommandProps) {
  const { chatId, text } = messageDTO(msg);

  const params = text.replace(CommandsList.CHANGE_BIRTHDAY, '').split(' ');

  const username = params[0].replace('@', '');
  const dateParts = params[1].split('.');
  const date = new Date();

  date.setUTCFullYear(Number(dateParts[2]));
  date.setUTCMonth(Number(dateParts[1]) - 1);
  date.setUTCDate(Number(dateParts[0]));
  date.setUTCHours(0, 0, 0, 0);

  const user = await UserModel.findOne({ username });
  if (!user) return bot.sendMessage(chatId, `no user found with this username`);
  if (isNaN(+date)) return bot.sendMessage(chatId, `invalid date (should be dd.mm.yyyy)`);

  Logger.debug(`User (${user.id}) birthday changed (${new Date(user.birthday ?? 0).toUTCString()} > ${new Date(getUTC(+date).timestamp).toUTCString()})`);
  user.birthday = getUTC(+date).timestamp;

  await user.save();

  await bot.sendMessage(chatId, `Birthday of @${username} changed to ${new Date(date).toUTCString()}`);
}