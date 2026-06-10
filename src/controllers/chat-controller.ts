import { Message } from 'node-telegram-bot-api';
import getUser from '~/utils/get-user';
import { messageDTO } from '~/utils/DTOs';
import { CommandsList, ICommandProps } from '~/types/types';
import PingCommand from '~/commands/Ping';
import Logger from '~/services/LoggerService';
import ChatHelpCommand from '~/commands/chat/ChatHelp';



/** Groups controller */
export default async function ChatController(message: Message) {
  try {
    const { chat, chatId, from, text } = messageDTO(message);

    // Drop undefined
    if (!from || !text) return;

    // Drop bots
    if (from.is_bot) return;

    // Get user
    const user = await getUser(message);
    const command: ICommandProps = { message, user };



    // if (text.match('/kek')) {
    //   const participants = await client.invoke(new Api.channels.GetParticipants({
    //     channel: chatId,
    //     filter: new Api.ChannelParticipantsRecent(),
    //     offset: 0,
    //     limit: 200
    //   }));

    //   // @ts-ignore
    //   console.log(participants.users.map(el => el.id.value.toString()));
    // }



    if (text.match(CommandsList.PING)) return await PingCommand(command);
    if (text.match(CommandsList.HELP)) return await ChatHelpCommand(command);
  } catch (e) {
    Logger.error(`[Срфе]: An error occured at the chat`, e);
  }
}