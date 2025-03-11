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
            options: {

                listProperties: ["name", "phone", "role", "isActivated"],
                filterProperties: ["phone", "role", "isActivated"],
            }
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
            options: {
                listProperties: ["name", "price", "discountPrice", "category"],
                filterProperties: ["name", "price", "category"],
            }
        },
        { resource: Models.Order ,
            options : {
                listProperties: ["orderId","customer","deliveryPartner","branch","items","totalPrice" ,"status"]
            }
         },
        { resource: Models.Counter }
    ],
    branding: {
        companyName: "Blinkit",
        withMadeWithLove: false,
        defaultTheme: dark.id,
        availableTheme: [dark, light, noSidebar],
    },
    rootPath: "/admin",
    defaultTheme: dark.id,
    availableThemes: [dark, light, noSidebar],
})


export const buildAdminRouter = async (app) => {
    await AdminJSFastify.buildAuthenticatedRouter(admin, {
        authenticate,
        cookiePassword: COOKIE_PASSWORD,
        cookieName: "admin",
    },
        app, {
        store: sessionStore,
        saveUnintialized: true,
        secret: COOKIE_PASSWORD,
        cookie: {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
        }
    })
}