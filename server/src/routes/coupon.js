import { applyCoupon } from "../controllers/coupon/coupon.js"


export const couponRoutes = async (fastify,options) => {
    fastify.post("/coupon/apply",applyCoupon)
}