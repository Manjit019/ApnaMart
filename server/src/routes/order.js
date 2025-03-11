import { confirmOrder, createOrder, getOrderbyId, getOrders, updateOrderStatus } from "../controllers/order/order.js";
import { verifyToken } from "../middleware/auth.js"


export const orderRoutes = async (fastify,options) =>{
    fastify.addHook("preHandler", async(request,reply)=>{
        const isAuthenticated = await verifyToken(request,reply);
        if(!isAuthenticated){
            return reply.code(401).send({message : "Unauthenticated"});
        }
    });

    fastify.post("/order",createOrder);
    fastify.get("/order/",getOrders);
    fastify.get("/order/:orderId",getOrderbyId);
    fastify.post("/order/:orderId/confirm",confirmOrder);
    fastify.patch("/order/:orderId/status",updateOrderStatus);

}