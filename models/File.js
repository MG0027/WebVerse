import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  workId: { type: String, required: true, unique: true },
  filesData: { type: String, required: true }
}, { strict: false });

export default mongoose.models.File || mongoose.model('File', FileSchema);
