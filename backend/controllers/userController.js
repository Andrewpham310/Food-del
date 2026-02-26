import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';


//login
const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: "User not found"});
        };

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.json({success: false, message: "Invalid password"});
        };

        const token = createToken(user._id);
        res.json({success: true, message: "User logged in successfully", token: token});

    } catch (error) {
        res.json({success: false, message: "Failed to login user"});
    }
}

//token
const createToken =  (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

// register
const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        //check if user already exists
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success: false, message: "User already exists"});
        }

        // validate email and password
        if (!validator.isEmail(email)) {
            return res.json({success: false, message: "Invalid email"});
        }

        if (!validator.isStrongPassword(password)) {
            return res.json({success: false, message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character"});
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create user
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        return res.json({success: true, message: "User registered successfully", token: token});

    } catch (error) {
        return res.json({success: false, message: "Failed to register user"});
    }
};

export { loginUser, registerUser };