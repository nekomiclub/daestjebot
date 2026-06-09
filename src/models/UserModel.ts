import mongoose, { Schema } from 'mongoose';
import TUser from '~/types/TUser';



export const UserModel = mongoose.model<TUser>('user', new Schema({
  id: Number,
  name: String,
  username: String,
  participateChatsIds: Array,
  rights: Array,
  birthday: Number,
  birthday_changed_at: String,
  participate_at: Array,
  birthday_at: String,
}));