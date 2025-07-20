import AdminJS from "adminjs";
import AdminJSFastify from "@adminjs/fastify"
import * as  AdminJSMongoose from "@adminjs/mongoose";
import * as Models from "../models/index.js";
import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js";
import { dark, light, noSidebar } from "@adminjs/themes"

AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
    resources: [
        {
            resource: Models.Customer,
        },
        {
            resource: Models.DeliveryPartner,
            options: {
                listProperties: ["name", "email", "role", "isActivated"],
                filterProperties: ["email", "role", "isActivated"],
            }
        },
        {
            resource: Models.Admin,
            options: {
                listProperties: ["name", "email", "role", "isActivated"],
                filterProperties: ["email", "role", "isActivated"],
            }
        },
        { resource: Models.Branch },
        { resource: Models.Category },

        {
            resource: Models.Product,
        
        },
        {
            resource: Models.Coupon,
        
        },
        { resource: Models.Order ,
            options : {
                listProperties: ["orderId","customer","deliveryPartner","branch","items","totalPrice" ,"status"]
            }
         },
        { resource: Models.Counter }
    ],
    branding: {
        companyName: "ApnaMart",
        withMadeWithLove: false,
        defaultTheme: dark.id,
        availableTheme: [dark, light, noSidebar],
        favicon : 'https://res.cloudinary.com/dkp5txigu/image/upload/v1741696157/app_icon_jra1d5.jpg',
        
    },
    rootPath: "/admin",
    defaultTheme: dark.id,
    availableThemes: [dark, light, noSidebar],
});


export const buildAdminRouter = async (app) => {
    await AdminJSFastify.buildAuthenticatedRouter(admin, {
        authenticate,
        cookiePassword: COOKIE_PASSWORD,
        cookieName: "admin",
    },
        app, {
        store: sessionStore,
        saveUnintialized: false,
        resave : false,
        secret: COOKIE_PASSWORD || 'supersecretT20sfffsfwrwfsdfgsffsdfsfwer23dfsfsdfs',
        cookie: {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
            maxAge:1000*60*60*24,
            sameSite: "lax" 
        }
    })
}