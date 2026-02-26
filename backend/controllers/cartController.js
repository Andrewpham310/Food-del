import userModel from '../models/userModel.js';

//add to cart
const addToCart = async (req, res) => {

    try{
        let userData = await userModel.findOne({_id: req.body.userId});
        let cartData = await userData.cartData;
        if(!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1; 

        } else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success: true, message: "Item added to cart successfully"});
    } catch (error) {
        res.json({success: false, message: "Failed to add item to cart"});
        console.log(error);
    }
}

//remove from cart
const removeFromCart = async (req, res) => {
    try {
        let userData  = await userModel.findOne({_id: req.body.userId});
        let cartData  =  await userData.cartData;
        if(cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        } 
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success: true, message: "Item removed from cart successfully"});
    } catch (error) {
        res.json({success: false, message: "Failed to remove item from cart"});
        console.log(error);
    }
}

// fetch cart
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({_id: req.body.userId});
        let cartData = await userData.cartData;
        res.json({success: true, message: "Cart fetched successfully", cartData: cartData});
    } catch (error) {
        res.json({success: false, message: "Failed to fetch cart"});
        console.log(error);
    }
}

export {addToCart, removeFromCart, getCart};