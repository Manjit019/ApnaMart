import "dotenv/config.js";
import crypto from "crypto";
import {
    Branch,
    Coupon,
    Customer,
    DeliveryPartner,
    Order,
} from "../../models/index.js";
import Transaction from "../../models/transaction.js";

export const createOrder = async (req, reply) => {
    try {
        const { userId } = req.user;
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
            branch,
            totalPrice,
            coupon,
            discount = 0,
            finalTotal,
            deliveryLocation,
            pickupLocation,
            method,
            notes,
            paymentMode,
        } = req.body;

        // Input validation
        if (!userId) {
            return reply
                .status(401)
                .send({ success: false, message: "User authentication required" });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return reply
                .status(400)
                .send({ success: false, message: "Items are required" });
        }

        if (!branch) {
            return reply
                .status(400)
                .send({ success: false, message: "Branch is required" });
        }

        if (!totalPrice || totalPrice <= 0) {
            return reply
                .status(400)
                .send({ success: false, message: "Valid total price is required" });
        }

        if (!paymentMode || ![ "COD", "Online" ].includes(paymentMode)) {
            return reply
                .status(400)
                .send({ success: false, message: "Valid payment mode is required" });
        }

        // Fetch customer and branch data
        const [ customerData, branchData ] = await Promise.all([
            Customer.findById(userId),
            Branch.findById(branch),
        ]);

        if (!customerData) {
            return reply
                .status(404)
                .send({ success: false, message: "Customer not found" });
        }

        if (!branchData) {
            return reply
                .status(404)
                .send({ success: false, message: "Branch not found" });
        }

        // Set default locations if not provided
        const defaultDeliveryLocation = deliveryLocation || {
            latitude: customerData.liveLocation?.latitude,
            longitude: customerData.liveLocation?.longitude,
            address: customerData.address || "No Address Available",
        };

        const defaultPickupLocation = pickupLocation || {
            latitude: branchData.location?.latitude,
            longitude: branchData.location?.longitude,
            address: branchData.address || "No Address Available",
        };

        // Validate required location data
        if (
            !defaultDeliveryLocation.latitude ||
            !defaultDeliveryLocation.longitude
        ) {
            return reply.status(400).send({
                success: false,
                message: "Delivery location coordinates are required",
            });
        }

        if (!defaultPickupLocation.latitude || !defaultPickupLocation.longitude) {
            return reply.status(400).send({
                success: false,
                message: "Pickup location coordinates are required",
            });
        }

        const calculatedFinalTotal = finalTotal || totalPrice;

        // Handle COD orders
        if (paymentMode === "COD") {
            const newOrder = new Order({
                customer: userId,
                items: items.map((item) => ({
                    id: item.id,
                    item: item.item,
                    itemCount: item.count,
                })),
                branch,
                totalPrice: totalPrice,
                deliveryLocation: defaultDeliveryLocation,
                pickupLocation: defaultPickupLocation,
                coupon,
                discount,
                finalTotal: calculatedFinalTotal,
                paymentMode: "COD",
                paymentStatus: "pending",
            });

            let orderData = await newOrder.save();
            orderData = await orderData.populate([ { path: "items.item" } ]);

            console.log("✅ Order created, Cash on delivery");

            return reply.status(201).send({
                success: true,
                message: "Order created, Cash on Delivery",
                order: orderData,
            });
        }

        // Handle Online payment orders
        if (paymentMode === "Online") {
            // Validate payment data
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                return reply.status(400).send({
                    success: false,
                    message: "Payment verification data is incomplete",
                });
            }

            const key_secret = process.env.RAZORPAY_KEY_SECRET;
            if (!key_secret) {
                console.error("Razorpay key secret not configured");
                return reply.status(500).send({
                    success: false,
                    message: "Payment configuration error",
                });
            }

            // Verify payment signature
            const generated_signature = crypto
                .createHmac("sha256", key_secret)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest("hex");

            const isSignatureValid = generated_signature === razorpay_signature;

            if (!isSignatureValid) {
                return reply.status(400).send({
                    success: false,
                    message: "Invalid payment signature",
                });
            }

            // Convert amount to rupees (Razorpay sends in paise)
            const amountInRupees = calculatedFinalTotal;

            // Create transaction record
            const transaction = await Transaction.create({
                userId,
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
                status: "Paid",
                amount: amountInRupees,
                method,
                notes,
            });

            // Create order
            const newOrder = new Order({
                customer: userId,
                items: items.map((item) => ({
                    id: item.id,
                    item: item.item,
                    itemCount: item.count,
                })),
                branch,
                totalPrice: totalPrice,
                deliveryLocation: defaultDeliveryLocation,
                pickupLocation: defaultPickupLocation,
                coupon,
                discount,
                finalTotal: amountInRupees,
                transaction: transaction._id,
                paymentMode: "Online",
                paymentStatus: "paid",
            });

            let orderData = await newOrder.save();
            orderData = await orderData.populate([ { path: "items.item" } ]);

            // Link transaction to order
            transaction.orderRef = orderData._id;
            await transaction.save();

            console.log("✅ Payment verified and order created");

            return reply.status(201).send({
                success: true,
                message: "Payment verified and order created",
                order: orderData,
            });
        }
    } catch (error) {
        console.error("❌ Failed to create transaction or order:", error);
        return reply.status(500).send({
            success: false,
            message: "Failed to create transaction or order",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

export const confirmOrder = async (req, reply) => {
    try {
        const { orderId } = req.params;
        const { userId } = req.user;
        const { deliveryPersonLocation } = req.body;

        // Input validation
        if (!orderId) {
            return reply.status(400).send({ message: "Order ID is required" });
        }

        if (!userId) {
            return reply
                .status(401)
                .send({ message: "User authentication required" });
        }

        if (
            !deliveryPersonLocation ||
            typeof deliveryPersonLocation.latitude !== "number" ||
            typeof deliveryPersonLocation.longitude !== "number"
        ) {
            return reply.status(400).send({
                message: "Valid delivery person location is required",
            });
        }

        const deliveryPerson = await DeliveryPartner.findById(userId);
        if (!deliveryPerson) {
            return reply.status(404).send({ message: "Delivery person not found" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return reply.status(404).send({ message: "Order not found" });
        }

        if (order.status !== "available") {
            return reply.status(400).send({
                message: "Order is not available for delivery",
            });
        }

        // Update order
        order.status = "confirmed";
        order.deliveryPartner = userId;
        order.deliveryPersonLocation = {
            latitude: deliveryPersonLocation.latitude,
            longitude: deliveryPersonLocation.longitude,
            address: deliveryPersonLocation?.address || "No Address Available",
        };

        await order.save();

        // Emit socket event
        if (req.server?.io) {
            req.server.io.to(orderId).emit("orderConfirmed", order);
        }

        return reply.status(200).send({
            success: true,
            message: "Order confirmed successfully",
            order: order,
        });
    } catch (error) {
        console.error("Error confirming order:", error);
        return reply.status(500).send({
            message: "Failed to confirm order",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

export const updateOrderStatus = async (req, reply) => {
    try {
        const { orderId } = req.params;
        const { status, deliveryPersonLocation } = req.body;
        const { userId } = req.user;

        // Input validation
        if (!orderId) {
            return reply.status(400).send({ message: "Order ID is required" });
        }

        if (!userId) {
            return reply
                .status(401)
                .send({ message: "User authentication required" });
        }

        if (!status) {
            return reply.status(400).send({ message: "Status is required" });
        }

        const validStatuses = [ "confirmed", "arriving", "delivered", "cancelled" ];
        if (!validStatuses.includes(status)) {
            return reply.status(400).send({ message: "Invalid status" });
        }

        if (
            !deliveryPersonLocation ||
            typeof deliveryPersonLocation.latitude !== "number" ||
            typeof deliveryPersonLocation.longitude !== "number"
        ) {
            return reply.status(400).send({
                message: "Valid delivery person location is required",
            });
        }

        const deliveryPerson = await DeliveryPartner.findById(userId);
        if (!deliveryPerson) {
            return reply.status(404).send({ message: "Delivery person not found" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return reply.status(404).send({ message: "Order not found" });
        }

        if ([ "cancelled", "delivered" ].includes(order.status)) {
            return reply.status(400).send({
                message: "Order is already cancelled or delivered",
            });
        }

        if (order.deliveryPartner?.toString() !== userId) {
            return reply.status(403).send({
                message: "You are not authorized to update this order",
            });
        }

        // Update order status and location
        order.status = status;
        order.deliveryPersonLocation = deliveryPersonLocation;

        if (order.status === "delivered" && order.paymentMode === "COD") {
            order.paymentStatus = "paid";
        }

        await order.save();

        // Emit socket event
        if (req.server?.io) {
            req.server.io.to(orderId).emit("liveTrackingUpdates", order);
        }

        return reply.status(200).send({
            success: true,
            message: "Order status updated successfully",
            order: order,
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        return reply.status(500).send({
            message: "Failed to update order status",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

export const getOrders = async (req, reply) => {
    try {
        const { status, customerId, deliveryPartnerId, branchId } = req.query;

        let query = {};

        // Build query object
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

        const orders = await Order.find(query)
            .populate("customer items.item branch deliveryPartner")
            .sort({ createdAt: -1 }); // Sort by newest first

        return reply.status(200).send({
            success: true,
            count: orders.length,
            orders: orders,
        });
    } catch (error) {
        console.error("Error retrieving orders:", error);
        return reply.status(500).send({
            message: "Failed to retrieve orders",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

export const getOrderbyId = async (req, reply) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return reply.status(400).send({ message: "Order ID is required" });
        }

        const order = await Order.findById(orderId).populate(
            "customer deliveryPartner branch items.item"
        );

        if (!order) {
            return reply.status(404).send({ message: "Order not found" });
        }

        return reply.status(200).send({
            success: true,
            order: order,
        });
    } catch (error) {
        console.error("Error retrieving order:", error);
        return reply.status(500).send({
            message: "Failed to retrieve order",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

export const makeOrderPayment = async (req, reply) => {
    const { userId } = req.user;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
        req.body;

    console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId );
    

    try {
        // Input validation
        if (!userId) {
            return reply
                .status(401)
                .send({ success: false, message: "User authentication required" });
        }

        if (!orderId) {
            return reply
                .status(400)
                .send({ success: false, message: "OrderId is required" });
        }

        // Validate payment data
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return reply.status(400).send({
                success: false,
                message: "Payment verification data is incomplete",
            });
        };

        const order = await Order.findById(orderId);

        if (order.paymentStatus === 'paid') {
            return reply
                .status(400)
                .send({ success: false, message: "Payment is already done for this order." });
        }

        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        // Verify payment signature
        const generated_signature = crypto
            .createHmac("sha256", key_secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const isSignatureValid = generated_signature === razorpay_signature;

        if (!isSignatureValid) {
            return reply.status(400).send({
                success: false,
                message: "Invalid payment signature",
            });
        }

        // Convert amount to rupees (Razorpay sends in paise)
        const amountInRupees = order.finalTotal * 100;

        // Create transaction record
        const transaction = await Transaction.create({
            userId,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            status: "Paid",
            amount: amountInRupees,
        });

        //Update order
        const updatedOrder = await Order.findByIdAndUpdate(orderId,
            {
                paymentStatus: 'paid',
                paymentMode: 'Online',
                transaction: transaction._id,
            }
        );

        let orderData = await updatedOrder.save();
        orderData = await orderData.populate([ { path: "items.item" } ]);

        // Link transaction to order
        transaction.orderRef = orderData._id;
        await transaction.save();

        console.log("✅ Payment verified and order updated");

        return reply.status(201).send({
            success: true,
            message: "Payment verified and order updated",
            order: orderData,
        });


    } catch (error) {
        console.error("❌ Payment Failed for this order :", error);
        return reply.status(500).send({
            success: false,
            message: "Payment Failed! ,Something went wrong.",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
