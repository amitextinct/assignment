import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    amount : {
        type : Number,
        required : [true , "please enter the amount"],
    },
    description : {
        type : String,
    },
    category : {
        type : String,
        required : [true, "select a category"]
    }
},{timestamps : true})

const transaction = mongoose.model.transactions || mongoose.model("transactions",transactionSchema)

export default transaction