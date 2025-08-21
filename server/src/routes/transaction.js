
import { createTransaction } from "../controllers/transaction/transaction.js";
import { verifyToken } from "../middleware/auth.js";

export const transactionRoutes = async (fastify,options) =>{
    fastify.addHook("preHandler", async(request,reply)=>{
        const isAuthenticated = await verifyToken(request,reply);
        if(!isAuthenticated){
            return reply.code(401).send({message : "Unauthenticated"});
        }
    });

    fastify.post("/transaction",createTransaction);
}
