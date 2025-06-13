const asyncHandler=require('express-async-handler')
const User=require('../models/userModel')
const generateToken=require('../utils/generateToken')
const { CurrencyManager } =require('../utils/currencyManager.js')

// Auth user, set token
// POST /api/users/auth
const authUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body

    const user=await User.findOne({email})

    

    if (user && (await user.matchPasswords(password))){
        if (user.role==='blocked' ){
            return res.status(401).json({message:'Your account has been blocked'})
        }
        generateToken(res,user._id,user.role)
        res.status(201).json({
            _id: user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            balance:user.balance
        })
    } else{
        res.status(401);
        throw new Error('Invalid email or password')
    }
    
})

// Register new user
// POST /api/users/register
const registerUser=asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body

    const userExists=await User.findOne({email})
    if(userExists){
        res.status(400);
        throw new Error('User with this email already exists')
    }

    const user=await User.create({
        name,
        email,
        password
    })

    if (user){
        generateToken(res,user._id,user.role)
        res.status(201).json({
            _id: user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            balance:user.balance
        })
    } else{
        res.status(400);
        throw new Error('Invalid user data')
    }
})

// logout user
// POST /api/users/logout
const logoutUser=asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires: new Date(0)
    })
    res.status(200).json({message:"Logged out"})
})

// Get user profile
// GET /api/users/profile
const getUser=asyncHandler(async(req,res)=>{
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    }

    res.status(200).json({user})
})

const confirmUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId).select('-password').lean();
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance:user.balance
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });

// Update user profile
// PUT /api/users/profile
const updateUser=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user.userId);
    if(user){
        user.name=req.body.name || user.name;
        user.email=req.body.email || user.email;

        if(req.body.password){
            user.password=req.body.password
        }
        const updatedUser=await user.save()
        res.status(200).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            role:user.role
        })
    }else{
        res.status(404).json({message:'User not found'})
    }
})

const getAllUsers=asyncHandler(async(req,res)=>{
    const users=await User.find({role:{$ne:'admin'}}).exec()
    res.status(200).json(users)
})

const deleteUser=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id);
    if(!user)return res.status(404).json({message:'user does not exist!'});

    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({id:req.params.id})
})

const toggleBlock=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id);
    if(!user)return res.status(404).json({message:'user does not exist!'});

    let set;

    user.role==='user' ? set='blocked' : set='user'
        
    await User.findByIdAndUpdate(
        req.params.id,
        {
            role:set
        }
    )
    res.status(200).json({message:`user ${user.name} status was set to ${set}`})
})

const getBalance =asyncHandler( async (req, res) => {
    const  userId  = req.params.id; 
    console.log(userId)
  
    try {
      const balance = await CurrencyManager.getBalance(userId);
      res.status(200).json({ success: true, balance });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

module.exports = {
    authUser,
    registerUser,
    logoutUser,
    getUser,
    updateUser,
    confirmUser,
    getAllUsers,
    deleteUser,
    toggleBlock,
    getBalance
};