import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
})

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
export default Payment;