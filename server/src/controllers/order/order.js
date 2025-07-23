import { Branch, Coupon, Customer, DeliveryPartner, Order } from "../../models/index.js";

export const createOrder = async (req, reply) => {
    try {
        const { userId } = req.user;
        const { items, branch, totalPrice,coupon , discount,finalTotal ,deliveryLocation,pickupLocation} = req.body;

        const customerData = await Customer.findById(userId);
        const branchData = await Branch.findById(branch);

        if (!customerData) {
            return reply.status(404).send({ message: "Customer not found" });
        }

        const newOrder = new Order({
            customer: userId,
            items: items.map((item) => ({
                id: item.id,
                item: item.item,
                itemCount: item.count
            })),
            branch,
            totalPrice,
            deliveryLocation: deliveryLocation || {
                latitude: customerData.liveLocation.latitude,
                longitude: customerData.liveLocation.longitude,
                address: customerData.address || "No Address Available"
            },
            pickupLocation: pickupLocation || {
                latitude: branchData.location.latitude,
                longitude: branchData.location.longitude,
                address: branchData.address || "No Address Available"
            },
            coupon,
            discount,
            finalTotal,
            
        });

      
        let savedOrder = await newOrder.save();

        savedOrder = await savedOrder.populate([
            { path: "items.item" }
        ])

        return reply.status(201).send(savedOrder);

    } catch (error) {
        return reply.status(500).send({ message: "Failed to create order", error })
    }
}



export const confirmOrder = async (req, reply) => {
    try {
        const { orderId } = req.params;
        const { userId } = req.user;
        const { deliveryPersonLocation } = req.body;


        const deliveryPerson = await DeliveryPartner.findById(userId);

        if (!deliveryPerson) {
            return reply.status(404).send({ message: "Delivery Person not found" });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return reply.status(404).send({ message: "Order not found" });
        }

        if (order.status !== "available") {
            return reply.status(400).send({ message: "Order is not available for delivery" });
        }
        order.status = 'confirmed';
        order.deliveryPartner = userId;
        order.deliveryPersonLocation = {
            latitude: deliveryPersonLocation.latitude,
            longitude: deliveryPersonLocation.longitude,
            address: deliveryPersonLocation?.address || "No Address Available"
        }

        req.server.io.to(orderId).emit("orderConfirmed", order)

        await order.save();
        return reply.status(200).send(order);

    } catch (error) {
        return reply.status(500).send({ message: "Failed to confirm order", error })
    }
}

export const updateOrderStatus = async (req, reply) => {
    try {
        const { orderId } = req.params;
        const { status, deliveryPersonLocation } = req.body;
        const { userId } = req.user;

        const deliveryPerson = await DeliveryPartner.findById(userId);
        if (!deliveryPerson) {
            return reply.status(404).send({ message: "Delivery Person not found" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return reply.status(404).send({ message: "Order not found" });
        }
        if (['cancelled', 'delivered'].includes(order.status)) {
            return reply.status(400).send({ message: "Order is already cancelled or delivered" });
        }
        if (order.deliveryPartner.toString() !== userId) {
            return reply.status(403).send({ message: "You are not authorized to update this order" });
        }

        order.status = status;
        order.deliveryPersonLocation = deliveryPersonLocation;

        await order.save();

        req.server.io.to(orderId).emit("liveTrackingUpdates", order)

        return reply.status(200).send(order);

    } catch (error) {
        return reply.status(500).send({ message: "Failed to update order status", error })
    }
}


export const getOrders = async (req, reply) => {

    try {
        const { status, customerId, deliveryPartnerId, branchId } = req.query;

        let query = {};

        if (status) {
            query.status = status.toString();
        }
        if (customerId) {
            query.customer = customerId;
        }
        if (branchId) {
            query.branch = branchId;
        }
        if (deliveryPartnerId) {
            query.deliveryPartner = deliveryPartnerId;
        }

        const orders = await Order.find(query).populate("customer items.item branch deliveryPartner");

        if (!orders) {
            return reply.status(404).send({ message: "No orders found" });
        }

        return reply.status(200).send(orders);

    } catch (error) {
        return reply.status(500).send({ message: "Failed to retrieve orders", error });
    }
}



export const getOrderbyId = async (req, reply) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId).populate('customer deliveryPartner branch items.item ');

        if (!order) {
            return reply.status(404).send({ message: "Order not found" });
        }

        return reply.status(200).send(order);

    } catch (error) {
        return reply.status(500).send({ message: "Failed to retrieve orders", error });
    }
}
