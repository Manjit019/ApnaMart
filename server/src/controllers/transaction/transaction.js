import razorpayInstance from "../../lib/razorpay.js";


export const createTransaction = async (req,reply) => {
    const {amount,userId} = req.body;

    const options = {
        amount : amount,
        currency : 'INR',
        receipt : `receipt-${Date.now()}` 
    }

    try { 
        if(!amount || !userId){
            return reply.status(400).send({
                success : false,
                message : "Amount and User Id is Required",
            })
        }

        const razorpayOrder = await razorpayInstance.orders.create(options);

        return reply.status(201).send({
            success : true,
            message  : "RGP Order Created Successfully",
            key : process.env.RAZORPAY_KEY_ID,
            amount : razorpayOrder.amount,
            currency : razorpayOrder.currency,
            order_id : razorpayOrder.id,
            method : razorpayOrder.method,
            notes : razorpayOrder.notes,
        })

    } catch (error) {
        reply.status(500).send({
            success : false,
            message : "Failed to create transaction order..",
            error : process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }

}
