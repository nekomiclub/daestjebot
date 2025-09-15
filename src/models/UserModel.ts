import mongoose, { Schema } from 'mongoose';
import IUser from '../types/IUser';



export const UserModel = mongoose.model<IUser>('user', new Schema({
  id: Number,
  name: String,
  username: String,
  participateChatsIds: Array,
  rights: Array,
  birthday: Number
}));