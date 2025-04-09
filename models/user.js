import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  picture: String,

}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
