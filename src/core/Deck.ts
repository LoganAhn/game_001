import { Card, Suit, Rank } from './Card';

export class Deck {
  private cards: Card[] = [];

  constructor() {
    this.reset();
  }

  reset(): void {
    this.cards = [];
    for (let s = Suit.Spades; s <= Suit.Clubs; s++) {
      for (let r = Rank.Two; r <= Rank.Ace; r++) {
        this.cards.push({ suit: s, rank: r });
      }
    }
  }

  shuffle(): void {
    // Fisher-Yates shuffle
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i]!, this.cards[j]!] = [this.cards[j]!, this.cards[i]!];
    }
  }

  deal(): Card {
    const card = this.cards.pop();
    if (!card) throw new Error('Deck is empty');
    return card;
  }

  dealMultiple(count: number): Card[] {
    const result: Card[] = [];
    for (let i = 0; i < count; i++) {
      result.push(this.deal());
    }
    return result;
  }

  get remaining(): number {
    return this.cards.length;
  }
}
