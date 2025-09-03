import { Message } from 'node-telegram-bot-api';



export function messageDTO(msg: Message) {
  return {
    from: msg.from,
    text: msg.text ?? '',
    chat: msg.chat,
    chatId: msg.chat.id,
  };
}