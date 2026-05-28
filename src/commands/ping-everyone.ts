import { bot, conf } from '~/conf';
import { messageDTO } from '~/handlers/DTOs';
import { UserModel } from '~/models/UserModel';
import { CommandsList, ICommandProps } from '~/types/types';
import { mentionUser } from '~/utils/utils';



export default async function pingEveryoneCommand({ msg }: ICommandProps) {
  const { chatId, text } = messageDTO(msg);

  const label = text.replace(CommandsList.PING_EVERYONE, '') || '☀ Прокидаємось';

  const users = await UserModel.find({
    participateChatsIds: {
      $in: [chatId]
    }
  });

  await bot.sendMessage(chatId, `${label} ${users.map(el => mentionUser(el)).join(' ')}`, {
    protect_content: true,
    parse_mode: 'Markdown'
  });
}



export async function pingStudents({ msg }: ICommandProps) {
  const { chatId, text } = messageDTO(msg);

  const label = text.replace(CommandsList.PING_STUDENTS, '') || '☀ Студєнти';

  const users = (await UserModel.find({
    participateChatsIds: {
      $in: [chatId]
    }
  })).filter(el => !conf.curatorsIds.includes(el.id));

  await bot.sendMessage(chatId, `${label} ${users.map(el => mentionUser(el)).join(' ')}`, {
    protect_content: true,
    parse_mode: 'Markdown'
  });
}



export async function pingCurators({ msg }: ICommandProps) {
  const { chatId, text } = messageDTO(msg);

  const label = text.replace(CommandsList.PING_CURATORS, '') || '☀ Куратори';

  const users = (await UserModel.find({
    participateChatsIds: {
      $in: [chatId]
    }
  })).filter(el => conf.curatorsIds.includes(el.id));

  await bot.sendMessage(chatId, `${label} ${users.map(el => mentionUser(el)).join(' ')}`, {
    protect_content: true,
    parse_mode: 'Markdown'
  });
}