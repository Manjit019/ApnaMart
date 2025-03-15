import "dotenv/config";
import fastify from "fastify";
import { connectDB } from "./src/config/connect.js";
import { PORT } from "./src/config/config.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";

const start = async () => {

    await connectDB(process.env.MONGO_URI);

    const app = fastify({
        logger: true,
        trustProxy : true,
    });

    app.register(fastifySocketIO, {
        cors: {
            origin: "*",
        },
        credentials : true,
        pingTimeout: 10000, 
        pingInterval: 5000,
        transports: ["websocket"],
        cookie : true
    })

    await registerRoutes(app);

    await buildAdminRouter(app);

    app.listen({ port: PORT, host: "0.0.0.0" },
        (err, addr) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(`ApnaMart Started on http://localhost:${PORT}${admin.options.rootPath}`);
            }
        });

    app.ready().then(() => {
        app.io.on('connection',(socket)=>{
            console.log("A User connected✅");
            
            socket.on("joinRoom",(orderId)=>{
                socket.join(orderId);
                console.log(`🤖 User joined order room : ${orderId}`);      
            });

            socket.on("disconnect",()=>{
                console.log("User Disconnected❌");
                
            })
        })
    });
};

start();