import { Message } from 'node-telegram-bot-api';
import { Logger } from './services/LoggerService';
import { UserModel } from './models/UserModel';
import { USER_RIGHTS } from './types/IUser';
import { bot, config } from './config';
import getUser from './handlers/get-user';
import grantPermCommand from './commands/grant-perm';
import { messageDTO } from './handlers/DTOs';



export default async function GroupController(msg: Message) {
  try {
    const { chat, chatId, from, text } = messageDTO(msg);

    // Drop bots
    if (from?.is_bot) return;

    // Drop undefined
    if (!from || !text) return;

    // Get user
    const user = await getUser(msg);



    // Grant perms
    if (text.match(/^\/grant\s/gi) && user.id === config.superadminId) await grantPermCommand({ msg, user });

    // Revoke perms
    if (text.match(/^\/revoke\s/gi) && user.id === config.superadminId) {
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

    // Ping everyone
    if (text.match(/^@all|^@everyone/gi) && user.rights.includes(USER_RIGHTS.CAN_PING)) {
      const label = text.replace(/@all\s?|@everyone\s?/gi, '') || '☀ Прокидаємось';

      const users = await UserModel.find({
        participateChatsIds: {
          $in: [chatId]
        }
      });

      await bot.sendMessage(chatId, `${label} ${users.map(el => `[${el.username ? `@${el.username}` : el.name}](tg://user?id=${el.id})`).join(' ')}`, {
        protect_content: true,
        parse_mode: 'Markdown'
      });
    }
  } catch (e) {
    Logger.error(`[Group]: An error occured at group chat`, e);
  }
}