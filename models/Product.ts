import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    id: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        default: "INR",
    },
    visibility: {
        type: String,
        enum: ["public", "paid"],
        default: "paid",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
