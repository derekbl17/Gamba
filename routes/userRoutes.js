const express = require('express')
const router = express.Router()
const { 
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
} = require('../controllers/userController.js');
const {protect,adminProtect}=require('../middleware/authMiddleware.js')

router.get('/me',protect,confirmUser)
router.post('/auth', authUser)
router.post('/register', registerUser)
router.post('/logout',logoutUser)
router.route('/profile').get(protect,getUser).put(protect,updateUser)
router.get('/all',protect,adminProtect,getAllUsers)
router.delete('/:id',protect,adminProtect,deleteUser)
router.patch('/:id',protect,adminProtect,toggleBlock)
router.get('/balance/:id',protect, getBalance);

router.get('/admin',protect,adminProtect,(req,res)=>{
    console.log('hi admin')
    res.json({admin:true})
})

module.exports= router