import mongoose, { Schema } from 'mongoose';
import { TGroup } from '~/types/TGroup';



export const ChatModel = mongoose.model<TGroup>('chat', new Schema({
  id: Number,
  title: String,
  is_active: Boolean,
  participants: Array,
  variables: Object
}));