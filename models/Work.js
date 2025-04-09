import mongoose from 'mongoose';

const WorkSchema = new mongoose.Schema({
  workId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  inputs: [
    {
      message: String,
      role: {
        type: String,
        enum: ['user', 'ai'],
        default: 'user',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  
  
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Work || mongoose.model('Work', WorkSchema);
