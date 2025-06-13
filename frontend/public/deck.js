// deck.js
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // Ace through King

export class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
    this.id = `${suit}-${value}`; // Unique ID for React keys
  }

  toString() {
    const valueNames = {1: 'Ace', 11: 'Jack', 12: 'Queen', 13: 'King'};
    const displayValue = valueNames[this.value] || this.value;
    return `${displayValue} of ${this.suit}`;
  }

  get imageName() {
    const valueNames = {1: 'ace', 11: 'jack', 12: 'queen', 13: 'king'};
    const valuePart = valueNames[this.value] || this.value;
    const suitPart = this.suit.toLowerCase().slice(0, -1); // Remove last 's'
    return `${valuePart}_of_${suitPart}`;
  }

  // Blackjack-specific value (Ace can be 1 or 11)
  get blackjackValue() {
    if (this.value >= 10) return 10; // Face cards are worth 10
    return this.value; // Number cards are worth their number
  }
}

export class Deck {
  constructor(numberOfDecks = 1) {
    this.cards = [];
    this.numberOfDecks = numberOfDecks;
    this.reset();
  }

  reset() {
    this.cards = [];
    for (let i = 0; i < this.numberOfDecks; i++) {
      for (const suit of suits) {
        for (const value of values) {
          this.cards.push(new Card(suit, value));
        }
      }
    }
  }

  // More thorough shuffle algorithm
  shuffle() {
    let currentIndex = this.cards.length;
    while (currentIndex > 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [this.cards[currentIndex], this.cards[randomIndex]] = 
        [this.cards[randomIndex], this.cards[currentIndex]];
    }
  }

  draw() {
    if (this.cards.length === 0) {
      this.reset();
      this.shuffle();
      console.log('Deck was empty - reshuffling');
    }
    return this.cards.pop();
  }

  get count() {
    return this.cards.length;
  }

  // For card counting systems (optional)
  get remainingDecks() {
    return (this.cards.length / 52).toFixed(1);
  }
}

// Helper to create a shuffled deck
export function createBlackjackDeck(numberOfDecks = 6) {
  const deck = new Deck(numberOfDecks);
  deck.shuffle();
  return deck;
}