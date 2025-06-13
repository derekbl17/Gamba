const User=require('../models/userModel')

const CurrencyManager = {
  deduct: async (userId, amount) => {
    const user = await User.findOneAndUpdate(
      { _id: userId, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { new: true }
    );
    if (!user) throw new Error("Insufficient funds");
    return user.balance;
  },

  add: async (userId, amount) => {
    await User.findByIdAndUpdate(userId, { $inc: { balance: amount } });
  },

  getBalance: async (userId) => {
    const user = await User.findById(userId).lean();
    if (!user) throw new Error("User not found");
    return parseFloat(user.balance.toString()); // Returns Decimal128 (or number)
  },
};
  
module.exports = {CurrencyManager};