import foodModel from '../models/foodModel.js';
import fs from 'fs';

//add food item

const addFood = async (req, res) => {
    
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: image_filename,
        category: req.body.category,
    })

    try {
        await food.save();
        res.status(201).json({success: true, message: "Food item added successfully"});
    } catch (error) {
        res.status(500).json({success: false, message: "Failed to add food item"});
    }

}

// all food items
const listFood = async (req, res) => {
    try {
        const food = await foodModel.find({});
        res.status(200).json({success: true, data: food});
    } catch (error) {
        res.status(500).json({success: false, message: "Failed to list food items"});
        console.log(error);
    }

}

// delete food item
const removeFood = async (req, res) => {
    try{
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.status(200).json({success: true, message: "Food item deleted successfully"});
    } catch (error) {
        res.status(500).json({success: false, message: "Failed to delete food item"});
        console.log(error);
    }
}

export { addFood, listFood, removeFood };