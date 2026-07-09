import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  parent: { type: String, default: null }, // e.g., "Accessories"
  image: { type: String },
  description: { type: String }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;
