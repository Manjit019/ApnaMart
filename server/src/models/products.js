import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    quantity: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand : {type : String},
    images : [
        {type : String}
    ],
    description : {type : String}
});

productSchema.index({
    name: 'text',
    description: 'text',
    category: 'text',
    brand: 'text'
});

const Product = mongoose.model('Product', productSchema);

export default Product;