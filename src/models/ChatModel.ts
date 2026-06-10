import mongoose, { Schema } from 'mongoose';
import { TChat } from '~/types/TChat';



export const ChatModel = mongoose.model<TChat>('chat', new Schema({
  id: Number,
  title: String,
  is_active: Boolean,
  participants: Array
}));