import mongoose, { Schema } from 'mongoose';
import TUser from '~/types/TUser';



export const UserModel = mongoose.model<TUser>('user', new Schema({
  id: Number,
  name: String,
  username: String,
  birthday: Object,
  variables: Object
}));