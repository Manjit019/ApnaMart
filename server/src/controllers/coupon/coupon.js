import { Coupon } from "../../models/index.js";


export const applyCoupon = async (req,reply) => {

    const {code,cartTotal} = req.body;

    try {
        const coupon = await Coupon.findOne({code : code.toUpperCase(),isActive : true});

        if(!coupon){
            return reply.status(404).send({message : "Invalid Coupon Code"});
        }

        if(new Date() > new Date(coupon.expiry)){
            return reply.status(400).send({message : "Coupon Expired"});
        }
        
        if(coupon.usageCount >= coupon.usageLimit){
            return reply.status(400).send({message : "Coupon Usages Limit reached"});
        }

        if(cartTotal < coupon.minOrderAmount){
            return reply.status(400).send({message : `Minimum order amount ₹${coupon.minOrderAmount} is Required.`});
        }

        let discount = 0;

        if(coupon.type === 'flat'){
            discount = coupon.value;
        }else if(coupon.type === 'percentage'){
            discount = (coupon.value / 100) * cartTotal;
        }

        if(coupon.maxDiscount){
            discount = Math.min(discount,coupon.maxDiscount);
        };

        const finalTotal = cartTotal - discount;

        coupon.usageCount = coupon.usageCount+1;
        coupon.save();

        return reply.send({
            message : "Coupon Applied",
            discount, 
            finalTotal,
            coupon : coupon.code,
            couponId : coupon._id
        });

    } catch (error) {
        console.log("Apply coupon error ", error);   
        return reply.status(500).send({message : "An Error Occured while applying coupon"});
    }
}