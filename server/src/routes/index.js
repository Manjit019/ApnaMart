import { authRoutes } from "./auth.js";
import { couponRoutes } from "./coupon.js";
import { orderRoutes } from "./order.js";
import { categoryRoutes, productRoutes } from "./product.js";

const prefix = '/api';

export const registerRoutes = async (fastify) =>{
    fastify.register(authRoutes,{prefix : prefix});
    fastify.register(categoryRoutes,{prefix : prefix});
    fastify.register(productRoutes,{prefix : prefix});
    fastify.register(orderRoutes,{prefix : prefix});
    fastify.register(couponRoutes,{prefix : prefix})
}