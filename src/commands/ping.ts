import { bot } from '../conf';
import { messageDTO } from '../handlers/DTOs';
import { ICommandProps } from '../types/types';



export default async function ping({ msg }: ICommandProps) {
  const { chat, chatId } = messageDTO(msg);

  await bot.sendMessage(chatId, `🏓 pong!`);
}