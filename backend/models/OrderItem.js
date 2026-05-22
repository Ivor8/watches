import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    order_id: mongoose.Schema.Types.ObjectId,
    product_id: mongoose.Schema.Types.ObjectId,
    variant_id: String,
    product_name: String,
    variant_title: String,
    sku: String,
    quantity: Number,
    unit_price: Number,
    total: Number,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('OrderItem', orderItemSchema);
