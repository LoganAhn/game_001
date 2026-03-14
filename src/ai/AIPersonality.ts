export interface AIPersonality {
  name: string;
  tightness: number;    // 0~1: 높을수록 적은 핸드만 플레이
  aggression: number;   // 0~1: 높을수록 레이즈 선호
  bluffFrequency: number; // 0~1: 블러핑 확률
  skill: number;        // 0~1: 판단 정확도 (낮으면 노이즈 증가)
}

/** 5명의 AI 프로필 — playerId 1~5에 매핑 */
export const AI_PROFILES: Record<number, AIPersonality> = {
  1: { name: 'Alex',    tightness: 0.7, aggression: 0.8, bluffFrequency: 0.15, skill: 0.8 },
  2: { name: 'Bella',   tightness: 0.3, aggression: 0.8, bluffFrequency: 0.4,  skill: 0.7 },
  3: { name: 'Charlie', tightness: 0.8, aggression: 0.3, bluffFrequency: 0.05, skill: 0.5 },
  4: { name: 'Diana',   tightness: 0.3, aggression: 0.3, bluffFrequency: 0.1,  skill: 0.4 },
  5: { name: 'Eddie',   tightness: 0.5, aggression: 0.6, bluffFrequency: 0.2,  skill: 0.9 },
};
