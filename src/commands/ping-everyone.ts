import { bot } from '../config';
import { messageDTO } from '../handlers/DTOs';
import { UserModel } from '../models/UserModel';
import { ICommandProps } from '../types/types';



export default async function pingEveryoneCommand({ msg }: ICommandProps) {
  const { chatId, text } = messageDTO(msg);

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