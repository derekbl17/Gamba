import mongoose from 'mongoose';

const blackjackGameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deck: { type: Array, required: true },
  playerHand: { type: Array, required: true },
  dealerHand: { type: Array, required: true },
  betAmount: { type: Number, required: true },
  status: { type: String, required: true, enum: ['active', 'completed'] },
  createdAt: { type: Date, default: Date.now, expires: '24h' } // Auto-delete after 24h
});

export default mongoose.model('BlackjackGame', blackjackGameSchema);