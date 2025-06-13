import { CurrencyManager } from '../utils/currencyManager.js';
import BlackjackGame from '../models/blackjackGameModel.js';

// Helper function to calculate hand value (Aces can be 1 or 11)
function calculateHandValue(hand) {
  let value = hand.reduce((total, card) => total + Math.min(card.value, 10), 0);
  const aces = hand.filter(card => card.value === 1).length;
  
  // Handle Aces as 11 if possible
  for (let i = 0; i < aces; i++) {
    if (value + 10 <= 21) {
      value += 10;
    }
  }
  
  return value;
}

// Helper to create a shuffled deck (6 decks as in casinos)
function createShuffledDeck() {
  const suits = ['H', 'D', 'C', 'S'];
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let deck = [];
  
  // 6 decks
  for (let i = 0; i < 6; i++) {
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value });
      }
    }
  }
  
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
}

export const blackJackBet = async (req, res) => {
  const { amount } = req.body;
  const { userId } = req.user;

  if (amount < 1) return res.status(400).json({ message: "Minimum bet is 1 credit" });

  try {
    // Check for existing game
    let game = await BlackjackGame.findOne({ 
      userId, 
      status: 'active'
    });

    if (game) {
      return res.status(400).json({ 
        success: false, 
        error: "You already have an active game" 
      });
    }

    // Deduct bet amount
    await CurrencyManager.deduct(userId, amount);
    
    // Create new game
    game = new BlackjackGame({
      userId,
      deck: createShuffledDeck(),
      playerHand: [],
      dealerHand: [],
      betAmount: amount,
      status: 'active'
    });

    // Deal initial cards
    game.playerHand.push(game.deck.pop());
    game.dealerHand.push(game.deck.pop());
    game.playerHand.push(game.deck.pop());
    game.dealerHand.push(game.deck.pop());

    // Check for blackjack
    const playerValue = calculateHandValue(game.playerHand);
    const dealerValue = calculateHandValue(game.dealerHand);
    let result = null;
    let payout = 0;

    if (playerValue === 21) {
      if (dealerValue === 21) {
        result = "push";
        payout = amount;
      } else {
        result = "blackjack";
        payout = amount * 2.5;
      }
      
      game.status = 'completed';
      if (payout > 0) {
        await CurrencyManager.add(userId, payout);
      }
    }

    await game.save();

    // Return game state
    res.status(200).json({
      success: true,
      gameState: {
        playerHand: game.playerHand,
        dealerHand: [game.dealerHand[0], { suit: 'X', value: 0 }],
        playerValue,
        dealerFirstCardValue: calculateHandValue([game.dealerHand[0]]),
        dealerValue: result ? dealerValue : null,
        status: game.status,
        betAmount: amount
      },
      result,
      payout,
      newBalance: await CurrencyManager.getBalance(userId)
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const blackjackAction = async (req, res) => {
  const { action } = req.body;
  const { userId } = req.user;

  try {
    let game = await BlackjackGame.findOne({ 
      userId, 
      status: 'active'
    });

    if (!game) {
      return res.status(400).json({ success: false, error: "No active game found" });
    }

    let result = null;
    let payout = 0;

    if (action === "hit") {
      game.playerHand.push(game.deck.pop());
      
      const playerValue = calculateHandValue(game.playerHand);
      
      if (playerValue > 21) {
        result = "lose";
        payout = 0;
        game.status = 'completed';
      }
    } 
    else if (action === "stand") {
      // Dealer draws until they have at least 17
      while (calculateHandValue(game.dealerHand) < 17) {
        game.dealerHand.push(game.deck.pop());
      }

      const playerValue = calculateHandValue(game.playerHand);
      const dealerValue = calculateHandValue(game.dealerHand);

      if (dealerValue > 21) {
        result = "win";
        payout = game.betAmount * 2;
      } else if (playerValue > dealerValue) {
        result = "win";
        payout = game.betAmount * 2;
      } else if (playerValue < dealerValue) {
        result = "lose";
        payout = 0;
      } else {
        result = "push";
        payout = game.betAmount;
      }

      game.status = 'completed';
    }

    // Save game state
    await game.save();

    // Add winnings if any
    if (payout > 0) {
      await CurrencyManager.add(userId, payout);
    }

    // Return updated game state
    res.status(200).json({
      success: true,
      gameState: {
        playerHand: game.playerHand,
        dealerHand: action === "stand" ? game.dealerHand : [game.dealerHand[0], { suit: 'X', value: 0 }],
        playerValue: calculateHandValue(game.playerHand),
        dealerFirstCardValue: calculateHandValue([game.dealerHand[0]]),
        dealerValue: result ? calculateHandValue(game.dealerHand) : null,
        status: game.status,
        betAmount: game.betAmount
      },
      result,
      payout,
      newBalance: await CurrencyManager.getBalance(userId)
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const blackjackStatus = async (req, res) => {
  const { userId } = req.user;

  try {
    const game = await BlackjackGame.findOne({ 
      userId,
      status: 'active'
    });

    if (!game) {
      return res.status(404).json({ message: 'No active game found' });
    }

    res.json({
      gameState: {
        playerHand: game.playerHand,
        dealerHand: [game.dealerHand[0], { suit: 'X', value: 0 }],
        playerValue: calculateHandValue(game.playerHand),
        dealerFirstCardValue: calculateHandValue([game.dealerHand[0]]),
        status: game.status,
        betAmount: game.betAmount
      },
      betAmount: game.betAmount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const blackjackSurrender = async (req, res) => {
  const { userId } = req.user;

  try {
    const game = await BlackjackGame.findOneAndUpdate(
      { userId, status: 'active' },
      { status: 'completed' },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({ message: 'No active game found' });
    }

    // Return half of the bet
    const refundAmount = Math.floor(game.betAmount / 2);
    await CurrencyManager.add(userId, refundAmount);

    res.json({
      success: true,
      refundAmount,
      newBalance: await CurrencyManager.getBalance(userId)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};