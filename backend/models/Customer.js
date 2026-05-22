import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    phone: String,
    address: {
      line1: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Customer', customerSchema);
