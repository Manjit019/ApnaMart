import { getAllCategories } from "../controllers/product/category.js"
import { getAllProducts, getProductByCategoryId } from "../controllers/product/product.js";


export const categoryRoutes = async (fastify,options) => {
    fastify.get("/categories",getAllCategories);
};

export const productRoutes = async (fastify,options) => {
    fastify.get("/product/:categoryId",getProductByCategoryId);
    fastify.get("/products", getAllProducts);
};

