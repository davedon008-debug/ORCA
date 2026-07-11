import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true }
}, { timestamps: true });

const productSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' }, // admin who added the product
  name: { type: String, required: true },
  images: [{ type: String, required: true }],
  brand: { type: String, required: true },
  category: { type: String, required: true }, // keeping it simple as String as per earlier requirements, or ObjectId. Since categories are "Living Room, Bedroom" we can use String for ease of querying, but we have a Category model. Let's use String to match the user's "Home appliance and furniture mall". Wait, the prompt says Categories: "Living Room, Bedroom...". Let's stick to String.
  description: { type: String, required: true },
  specifications: { type: Map, of: String }, // e.g. { "Weight": "5kg", "Dimensions": "10x10x10" }
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
  color: { type: String },
  CB: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;