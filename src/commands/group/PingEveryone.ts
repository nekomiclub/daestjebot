import { sleep } from 'telegram/Helpers';
import { bot } from '~/conf';
import { ICommandProps } from '~/types/types';
import { CHECK_isNotAdmin } from '~/utils/check-access';
import { messageDTO } from '~/utils/DTOs';
import getGroup from '~/utils/get-group';
import { getGroupParticipants } from '~/utils/MTProto';
import { randomBetween } from '~/utils/utils';



/** Max mentions per messages that will generate notification */
const MAX_MENTIONS_PER_MESSAGE = 5;

const UnnamedEmojis = ['😀', '😂', '😍', '🥳', '😎', '🤔', '😭', '😴', '🤯', '😮‍💨', '👍', '🙏', '🔥', '🎉', '🌟'];



/** Ping everyone in chat */
export default async function PingEveryoneCommand({ message }: ICommandProps) {
  const { chat, chatId, from, text } = messageDTO(message);

  const group = await getGroup(message);

  // Reject invokation if user is not admin and allow public invoke everyone is disabled
  if (!group.variables.allow_public_everyone && await CHECK_isNotAdmin(message)) return;

  const participants = (await getGroupParticipants(chatId)).filter(el => !el.bot);
  const replyId = message.reply_to_message?.message_id;

  // Update chat participants
  group.participants = participants.map(el => Number(el.id.value.toString()));

  await group.save();

  // Construct messages
  const messages: string[][] = [];
  let stack: string[] = [];

  participants.forEach(member => {
    const name = member.username ? `@${member.username}` : member.firstName ?? UnnamedEmojis[randomBetween(0, UnnamedEmojis.length - 1)];
    const message = `[${name}](tg://user?id=${member.id})`;

    if (stack.length !== MAX_MENTIONS_PER_MESSAGE) {
      // Append message to the stack
      stack.push(message);
    } else {
      // Push stack to the messages and reset it
      messages.push(stack);
      stack = [message];
    }
  });

  // Append partial stack
  if (stack.length !== 0) messages.push(stack);



  // Send messages
  for (const key in messages) {
    const message = messages[key];

    await sleep(250);

    await bot.sendMessage(chatId, message.join(', '), {
      protect_content: true,
      parse_mode: 'Markdown',
      reply_to_message_id: replyId
    });
  }
}