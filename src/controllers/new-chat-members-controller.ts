import { Message, User } from 'node-telegram-bot-api';
import ChatHelpCommand from '~/commands/chat/ChatHelp';
import conf from '~/conf';
import Logger from '~/services/LoggerService';
import { ICommandProps } from '~/types/types';
import { messageDTO } from '~/utils/DTOs';
import getChat from '~/utils/get-chat';
import getUser from '~/utils/get-user';



/** new_chat_members event controller */
export default async function NewChatMembersController(message: Message) {
  try {
    const { chat, chatId, from, text } = messageDTO(message);

    const command: ICommandProps = { message, user: null };



    // Map new members
    for (const key in message.new_chat_members) {
      const member: User = message.new_chat_members[key];

      // Handle daestje bot appear
      if (member.is_bot && member.id === conf.botId) {
        const chat = await getChat(message);
        chat.is_active = true;

        await chat.save();

        Logger.debug(`[Chat]: Bot has been appeared in the new chat [chatId:${chatId}]`);

        await ChatHelpCommand(command);

        continue;
      }



      //! Drop bots
      if (member.is_bot) continue;



      // Handle user appear
      const user = await getUser(message, member);
      if (!user) continue;

      if (!user.participate_at.includes(chatId)) user.participate_at.push(chatId);
      user.markModified('participate_at');

      await user.save();

      Logger.debug(`[Chat]: New user has been appeared in the chat [id:${user.id};chatId:${chatId}]`);
    }
  } catch (e) {
    Logger.error(`[Chat]: An error occured at the chat [new_chat_members]`, e);
  }
}