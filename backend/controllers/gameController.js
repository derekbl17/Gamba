import { CurrencyManager } from '../utils/currencyManager.js';

export const placeBet = async (req, res) => {
  const { amount } = req.body;
  const { userId } = req.user

  if (amount<1) return res.status(400).json({message:"Minimum bet is 1 credit"})

  try {
    // 1. Deduct bet amount (atomic update)
    await CurrencyManager.deduct(userId, amount);

    // 2. 50% chance to win
    const isWin = Math.random() < 0.5;
    const payout = isWin ? amount * 2 : 0;

    // 3. Add winnings (if any)
    if (isWin) {
      await CurrencyManager.add(userId, payout);
    }

    // 4. Return result
    res.status(200).json({
      success: true,
      result: isWin ? "win" : "lose",
      payout,
      newBalance: await CurrencyManager.getBalance(userId),
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};