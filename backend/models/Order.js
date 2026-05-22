import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    customer_id: mongoose.Schema.Types.ObjectId,
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'], default: 'pending' },
    subtotal: Number,
    tax: { type: Number, default: 0 },
    shipping: Number,
    total: Number,
    shipping_address: {
      name: String,
      line1: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
      phone: String,
      email: String,
    },
    notes: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Order', orderSchema);
