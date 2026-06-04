import { bot } from '~/conf';
import { messageDTO } from '~/handlers/DTOs';
import { ICommandProps } from '~/types/types';



/** Ping/Pong command */
export default async function PingCommand({ message }: ICommandProps) {
  const { chat, chatId } = messageDTO(message);

  await bot.sendMessage(chatId, `🏓 pong!`);
}