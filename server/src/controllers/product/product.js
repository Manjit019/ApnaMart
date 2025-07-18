import Product from "../../models/products.js";

export const getProductByCategoryId = async (req, reply) => {
    const { categoryId } = req.params;
    try {
        const products = await Product.find({ category: categoryId })
            .select("-category")
            .exec();
        return reply.send(products);
    } catch (error) {
        return reply.status(500).send({ message: "An error occured", error });
    }
};

export const getProductById = async (req, reply) => {
    
    const {productId} = req.params;
    try {
        const product = await Product.findById(productId).populate("category");

        if(!product){
            return res.status(404).send({message : "No product found for this id"});
        }

        return reply.send(product);

    } catch (error) {
        return res.status(500).send({message : "An Internal server error occured : ",error})
    }
}

export const getAllProducts = async (req, reply) => {
    try {
        const products = await Product.find().select("-category").exec();
        return reply.send(products);
    } catch (error) {
        return reply.status(500).send({ message: "An error occured", error });
    }
};


export const searchProduct = async (req, reply) => {
    try {
        const {
            q,
            page = 1,
            limit = 10,
            category = '',
            brand = '',
            sort = "relevance",
            order = "asc",
            minPrice,
            maxPrice,
        } = req.query;

        const filters = {};

        if (q) {
            filters.$or = [
                { name: { $regex: q, $options: "i" } },
                { brand: { $regex: q, $options: "i" } },
            ];
        } 

        if (category) filters.category = category;
        if (brand) filters.brand = brand;
        if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice) filters.price.$gte = Number(minPrice);
            if (maxPrice) filters.price.$lte = Number(maxPrice);
        }

        const sortOptions = {};

        if (sort !== "relevance") {
            sortOptions[sort] = order === "desc" ? -1 : 1;
        }
     
        const skip = (Number(page) - 1) * Number(limit);

        await Product.syncIndexes();

        const products = await Product.find(filters)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(filters);

        return reply.send({
            products,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
        });
        
    } catch (error) {
        return reply.status(500).send({ message: "An error occured ", error });
    }
};
