import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    session_id: { type: String, required: true },
    sender: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('ChatMessage', chatMessageSchema);
