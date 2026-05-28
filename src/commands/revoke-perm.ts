import { bot } from '../conf';
import { messageDTO } from '../handlers/DTOs';
import { UserModel } from '../models/UserModel';
import { Logger } from '../services/LoggerService.old';
import { USER_RIGHTS } from '../types/IUser';
import { ICommandProps } from '../types/types';



export default async function revokePermCommand({ msg }: ICommandProps) {
  const { chatId, text } = messageDTO(msg);

  const userId = msg.reply_to_message?.from?.id;
  const list = text.replace('/revoke ', '').split(' ');

  if (!userId || !list.length) return console.log(`no user id or perms list to revoke`);

  const user = await UserModel.findOne({ id: userId });
  if (!user) return bot.sendMessage(chatId, `who?`);

  const prevRights = [...user.rights];

  for (const key in USER_RIGHTS) {
    const right = USER_RIGHTS[key];

    if (list.includes(right)) user.rights = user.rights.filter(el => el !== right);
  }

  if (prevRights.length !== user.rights.length) {
    Logger.debug(`User (${userId}) right been updated by ${user.id} (${prevRights.join(', ')} > ${user.rights.join(', ')})`);

    await bot.deleteMessage(chatId, msg.message_id);

    user.markModified('rights');
    await user.save();
  }
}