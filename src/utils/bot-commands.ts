import { BotCommand } from 'node-telegram-bot-api';
import { bot } from '~/conf';



export const PingEveryone: BotCommand = { command: '/all', description: '[@] Відмітити всіх учасників групи' };

export const GeneralCommands: BotCommand[] = [
  { command: '/ping', description: '🏓 Pong!' },
  { command: '/help', description: 'ℹ️ Інформація' },

];

export const GroupCommands: BotCommand[] = [
  ...GeneralCommands,
];



export default function BotCommands() {
  // All chat admins commands
  bot.setMyCommands([
    ...GroupCommands,
    PingEveryone,
    { command: '/birthdays', description: '📣 Налаштування сповіщення про дні народження в групі' },
    { command: '/pings', description: '👮 Налаштування доступу до відмітки всіх' },
  ], { scope: { type: 'all_chat_administrators' } });

  // Group commands
  bot.setMyCommands([
    ...GroupCommands
  ], { scope: { type: 'all_group_chats' } });

  // PM commands
  bot.setMyCommands([
    ...GeneralCommands,
    { command: '/my_birthday', description: '🍰 Переглянути встановлену дату народження' },
    { command: '/set_birthday', description: '{ДД.ММ.РРРР} 🍰 Налаштування твого дня народження' },
    { command: '/birthday_notify', description: '🍰 Сповіщення про дні народження' },
  ], { scope: { type: 'all_private_chats' } });
}