import { getAllCategories } from "../controllers/product/category.js"
import { getAllProducts, getProductByCategoryId, getProductById, searchProduct } from "../controllers/product/product.js";


export const categoryRoutes = async (fastify,options) => {
    fastify.get("/categories",getAllCategories);
    fastify.get("/categories/:categoryId",getProductByCategoryId);
};

export const productRoutes = async (fastify,options) => {
    fastify.get("/products", getAllProducts);
    fastify.get("/product/:productId",getProductById);
    fastify.get("/product/search",searchProduct);
};

