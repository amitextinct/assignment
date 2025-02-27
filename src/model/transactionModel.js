import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, "please enter the amount"],
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: [true, "select a category"]
    }
}, { timestamps: true })

// Fix the model initialization
const Transaction = mongoose.models.transactions || mongoose.model("transactions", transactionSchema);

export default Transaction;