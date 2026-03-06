import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//place order
const placeOrder = async (req, res) => {

    const frontend_url = process.env.FRONTEND_ORIGIN;

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, {cartData: {}});

        const line_items = req.body.items.map((item)=> ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }))

        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Delivery Fee',
                },
                unit_amount: 200,
            },
            quantity: 1,
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({success: true, session_url: session.url});

    } catch (error) {
        res.status(500).json({success: false, message: "Failed to place order"});
    }
}

//verify order
const verifyOrder = async (req, res) => {
    const {success, orderId} = req.body;
    try {
        if(success==='true'){
            await orderModel.findByIdAndUpdate(orderId, {payment: true});
            res.json({success: true, message: "Order Paid"});

        }else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({success: false, message: "Order Not Paid"});
        }
    } catch (error) {
        res.status(500).json({success: false, message: "Failed to verify order"});
    }
}

// user orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId: req.body.userId});
        res.json({success: true, data: orders});
    } catch (error) {
        res.status(500).json({success: false, message: "Failed to get user orders"});
    }
}

//listing orders for admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success: true, data: orders});
    } catch (error) {
        res.status(500).json({success: false, message: "Failed to list orders"});
    }
}

//update order status
const updateOrderStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status})
        res.json({success: true, message: "Order status updated"});
    } catch (error) {
        res.status(500).json({success: false, message: "Failed to update order status"});
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateOrderStatus };