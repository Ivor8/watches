import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    id: { type: Number, default: 1 },
    shop_name: { type: String, default: 'Original Watches' },
    whatsapp: { type: String, default: '+1 (541) 780-8979' },
    email: { type: String, default: 'sales@originalwatches.shop' },
    telegram_url: String,
    shipping_fee: { type: Number, default: 4809 },
    promo_text: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Settings', settingsSchema);
