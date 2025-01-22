import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generatetokenandsetcookie from "../utils/generatetokens.js";


export const signup =async(req,res)=>{
    try {
        const {fullname,username,password,confrimpassword,gender} = req.body;

        
        if(password !== confrimpassword){
        //    return res.status(400).json({error:"password doesn't match"})
        }

        if(password.length < 6){
            return res.status(400).json({error:"password length must contain 6"})
        }

        const user = await User.findOne({username});//findone in to find the user in mongodb

        if(user){
            return res.status(400).json({error:"username already exist"})
        }

        // HASH PASS HERE
        const salt = await bcrypt.genSalt(10) //the value 10 denotes the time interval
        const hashedpassword = await bcrypt.hash(password,salt)

        const newuser = new User({
            fullname,
            username,
            password:hashedpassword,
            gender,
        })

        if(newuser){

            generatetokenandsetcookie(newuser._id,res);

            await newuser.save();

            res.status(201).json({
                _id:newuser._id,
                fullname:newuser.fullname,
                username:newuser.username,
                password:newuser.password,
            })// insterd of .json ,json makes err
        }
        else{
            res.status(400).json({error:"invalid user data"})
        }

    } catch (error) {
        console.log("error in signup controller", error.message)
        res.status(500).json({error:"internal server error"})
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "User not found. Please sign up." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                fullname: user.fullname,
                username: user.username,
            },
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};


export const logout =(req,res)=>{
    try {//want to clear the cookie to logout

        res.cookie("jwt","",{maxAge:0});//token is empty & {maxAge} is 0

        res.status(200).json({message:"logged out successfully"});

    } catch (error) {

        console.log("error in logout controller", error.message)
        res.status(500).json({error:"internal server error"})
    }
};
