import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
  {
    handle: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    image_url: String,
    is_visible: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Collection', collectionSchema);
