import jwt from "jsonwebtoken";
import {User} from "../Models/userModel.js";
import asynsHandler from "express-async-handler";

const protect = asynsHandler(async(req,res,next)=>{
 let token;
 if(
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
 ){
    try{
        token= req.headers.authorization.split(" ")[1];
        //decode token
        const decode = jwt.verify(token,process.env.JWT_SECRET)

        req.user =await User.findById(decode.id).select("-password");
        next();
    }catch(error){
        res.status(401);
        throw new Error("Not authorized,token failed ")
    }
 }

if(!token){
    res.status(401);
    throw new Error("Not authorized, no token")
}
});


export {protect};