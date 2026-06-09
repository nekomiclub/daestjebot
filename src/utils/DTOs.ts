import { Message } from 'node-telegram-bot-api';



/** Extract required fields from message */
export function messageDTO(message: Message) {
  return {
    from: message.from,
    text: message.text ?? '',
    chat: message.chat,
    chatId: message.chat.id,
  };
}