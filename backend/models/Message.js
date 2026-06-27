import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  room: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
