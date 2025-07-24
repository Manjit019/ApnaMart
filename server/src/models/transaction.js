import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Customer",
        required : true
    },
    orderRef : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Order",
    },
    orderId : {
        type : String,
        required : true,
        unique : true
    },
    paymentId : {type : String,required : true},
    signature : String,
    amount : {type : Number,required : true},
    currency : {type : String, default : "INR"},
    method : String,
    reciept : String,
    status : {
        type : String,
        enum : ['Created','Paid','Failed'],
        default : 'Created'
    },
    notes : {
        type : Object,
        default : {}
    }

},{timestamps : true});

const Transaction = mongoose.model('Transaction',transactionSchema);

export default Transaction;