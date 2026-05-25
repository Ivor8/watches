import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    handle: { type: String, required: true, unique: true },
    vendor: String,
    product_type: String,
    price: { type: Number, required: true },
    compare_at_price: Number,
    is_latest: { type: Boolean, default: false },
    images: [String],
    description: String,
    tags: [String],
    metadata: mongoose.Schema.Types.Mixed,
    inventory_qty: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
    sku: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Product', productSchema);
