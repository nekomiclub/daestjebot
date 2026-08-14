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
  recieve_birthday_notifications: Boolean,
  birthday_notified_year: Number,
  birthday_warned_year: Number,
}));