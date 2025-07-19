import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    quantity: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String },
    images: [
        { type: String }
    ],
    description: { type: String },
    inStock: { type: Boolean, default: true },
    rating: { type: Number, min: 0, max: 5 },
    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
        review: { type: String, required: true },
        rating: { type: Number, min: 0, max: 5 }
    }],

    nutritionalInfo: {
        calories: String,
        protein: String,
        carbs: String,
        fat: String,
        fiber: String,
    },
    ingredients: [{ type: String }],
    shelfLife: { type: String },
    storage: { type: String },
    benefits: [{ type: String }],

}, { timestamps: true });

productSchema.index({
    name: 'text',
    description: 'text',
    category: 'text',
    brand: 'text'
});

const Product = mongoose.model('Product', productSchema);

export default Product;