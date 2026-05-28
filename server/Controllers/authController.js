import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateToken=(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1hr"})
    }

export const register =async (req, res)=>{


    try{
        const {name, email, password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }

        const existingUser  = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                   success:false,
                message:"Username already exists"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await  User.create({name, email, password:hashPassword});
        const token = generateToken(user._id);
        res.status(200).json({success:true, token, user});
    }       catch (error){
        console.log("Register Error:", error.message)
        res.status(500).json({success:false, message:"Unable to register"});
    }
}

export const login =async (req, res)=>{
    try{

        const { email, password}=req.body;
        if( !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }

        const user  = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        //Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        const token = generateToken(user._id);
        res.status(200).json({success:true, token, user});
    }catch (error){
        console.log("Login Error:", error.message)
        res.status(500).json({success:false, message:"Unable to login"});
    }
}
//get Current User
export const getUser = async (req, res)=>{
    try{
        const user  =await  User.find(req.userId).select(-password);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        res.json({success:true, user});

    }catch(err){
        console.log("getUser Error:", err);
        res.status(500).json({success:false, message:"Unable to getUser"});
    }

}