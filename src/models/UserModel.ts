import mongoose, { Schema } from 'mongoose';
import TUser from '~/types/TUser';



export const UserModel = mongoose.model<TUser>('user', new Schema({
  id: Number,
  name: String,
  username: String,
  rights: Array,
  birthday: Number,
  birthday_changed_at: String,
  birthday_at: String,
}));