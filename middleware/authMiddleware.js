const jwt =require('jsonwebtoken')
const asyncHandler=require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async(req,res,next)=>{
    let token;

    token=req.cookies.jwt;

    if(token){
        try{
            const decoded=jwt.verify(token, process.env.JWT_SECRET)
            req.user= {
                userId: decoded.userId,
                role: decoded.userRole
            };

            next();
        } catch(error){
            res.status(401).json({message:'Not authorized, invalid token'})
        }

    }else{
        res.status(401).json({ message: 'Not authorized, no token' })
    }
});

const adminProtect = asyncHandler(async(req,res,next)=>{
    if (req.user.role !== 'admin'){
        res.status(403);
        throw new Error('Forbidden: Admin access required')
    }
    next();
})


module.exports={protect,adminProtect}