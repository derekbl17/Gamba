const express = require('express')
const router = express.Router()
const {protect,adminProtect}=require('../middleware/authMiddleware.js')
const {placeBet}=require('../controllers/gameController.js')

router.post("/bet",protect,placeBet)

module.exports=router