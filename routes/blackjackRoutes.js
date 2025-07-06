const express = require('express')
const router = express.Router()
const {protect,adminProtect}=require('../middleware/authMiddleware.js')
const { blackJackBet, blackjackAction, blackjackStatus } = require('../controllers/blackjackController.js');

router.post('/bet',protect,blackJackBet)
router.post('/action',protect,blackjackAction)
router.get('/status',protect,blackjackStatus)

module.exports=router