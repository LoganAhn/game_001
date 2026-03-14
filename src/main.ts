import './style.css';

// Sprint 1: 핵심 모듈 동작 확인
import { Deck } from './core/Deck';
import { HandEvaluator } from './core/HandEvaluator';
import { cardToString } from './core/Card';

function testHandEvaluator() {
  const deck = new Deck();
  deck.shuffle();

  const holeCards = deck.dealMultiple(2);
  const communityCards = deck.dealMultiple(5);

  console.log('Hole Cards:', holeCards.map(cardToString).join(' '));
  console.log('Community Cards:', communityCards.map(cardToString).join(' '));

  const result = HandEvaluator.evaluate(holeCards, communityCards);
  console.log('Best Hand:', result.bestFive.map(cardToString).join(' '));
  console.log('Category:', result.description);
  console.log('Rank Value:', result.rankValue);
}

const app = document.getElementById('app')!;

const heading = document.createElement('h1');
heading.textContent = '♠ Texas Hold\'em Poker';
heading.style.color = 'white';
heading.style.fontFamily = 'monospace';
heading.style.padding = '2rem';

const info = document.createElement('p');
info.textContent = 'Sprint 1 완료 - 콘솔에서 핸드 평가 결과를 확인하세요. (F12)';
info.style.color = '#aaa';
info.style.fontFamily = 'monospace';
info.style.paddingLeft = '2rem';

app.appendChild(heading);
app.appendChild(info);

console.log('=== Texas Hold\'em - Sprint 1 Test ===');
for (let i = 0; i < 5; i++) {
  console.log(`\n--- Hand ${i + 1} ---`);
  testHandEvaluator();
}
