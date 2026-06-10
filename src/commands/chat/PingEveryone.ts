import { bot } from '~/conf';
import { ICommandProps } from '~/types/types';
import { messageDTO } from '~/utils/DTOs';
import getChat from '~/utils/get-chat';
import { getParticipants } from '~/utils/MTProto';
import { randomBetween } from '~/utils/utils';



/** Max mentions per messages that will generate notification */
const TELEGRAM_MAX_MENTIONS = 5;

const UnnamedEmojis = ['😀', '😂', '😍', '🥳', '😎', '🤔', '😭', '😴', '🤯', '😮‍💨', '👍', '🙏', '🔥', '🎉', '🌟'];



/** Ping everyone in chat */
export default async function PingEveryoneCommand({ message }: ICommandProps) {
  const { chat, chatId, from, text } = messageDTO(message);

  const tgChat = await getChat(message);
  const participants = (await getParticipants(chatId)).filter(el => !el.bot);
  const replyId = message.reply_to_message?.message_id;

  // Update chat participants
  tgChat.participants = participants.map(el => Number(el.id.value.toString()));

  await tgChat.save();

  // Construct messages
  const messages: string[][] = [];
  let stack: string[] = [];

  participants.forEach(member => {
    const name = member.username ? `@${member.username}` : member.firstName ?? UnnamedEmojis[randomBetween(0, UnnamedEmojis.length - 1)];
    const message = `[${name}](tg://user?id=${member.id})`;

    console.log(message);

    if (stack.length !== TELEGRAM_MAX_MENTIONS) {
      // Append message to the stack
      stack.push(message);
    } else {
      // Push stack to the messages and reset it
      messages.push(stack);
      stack = [message];
    }
  });

  // Append not full stack
  if (stack.length !== 0) messages.push(stack);



  // Send messages
  for (const key in messages) {
    const message = messages[key];

    await bot.sendMessage(chatId, message.join(', '), {
      protect_content: true,
      parse_mode: 'Markdown',
      reply_to_message_id: replyId
    });
  }
}