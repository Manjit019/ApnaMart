import Product from "../../models/products.js";

export const getProductByCategoryId = async (req, reply) => {
    const { categoryId } = req.params;
    try {
        const products = await Product.find({ category: categoryId }).select("-category").exec();
        return reply.send(products);
    } catch (error) {
        return reply.status(500).send({ message: "An error occured", error })
    }
}

export const getAllProducts = async (req, reply) => {
    try {
        const products = await Product.find().select("-category").exec();
        return reply.send(products);
    } catch (error) {
        return reply.status(500).send({ message: "An error occured", error })
    }
}