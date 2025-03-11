import "dotenv/config";
import fastifySession from "@fastify/session";
import { Admin } from "../models/index.js";
import connectMongodbSession from "connect-mongodb-session";

const MongoDBStore = connectMongodbSession(fastifySession);

export const sessionStore = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
    databaseName : "ApnaMart"
})

sessionStore.on("error",(error)=>{
    console.log("Session store error: " + error);
})

export const authenticate = async (email, password) => {
    if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
        return Promise.resolve({email: email, password: password});
    }
    else{
        return null;
    }
}

export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;