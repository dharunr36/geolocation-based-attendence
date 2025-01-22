import jwt from "jsonwebtoken";

const generatetokenandsetcookie =(userId,res)=>{
    const token =jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {expiresIn:"15d"}
    )
    res.cookie("jwt",token,{
        maxAge: 15*24*60*60*1000,//15 days 24 hours 60 min 60 sec 1000ms
        httpOnly: true, // prevent xss attacks cross-site scripting attacks
        sameSite:"strict",//csrf attacks cross-site request forgery attacks
        secure:process.env.NODE_ENV !=="development",  //true or false
    });
};

export default generatetokenandsetcookie;
