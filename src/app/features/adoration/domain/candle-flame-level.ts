import { PrayerCandle } from './entities/prayer-candle';

const FLAME_LEVEL_STEPS = 10;

export function getCandleFlameLevel(candle: PrayerCandle, now: number): number {
  const lifetime = candle.expiresAt - candle.createdAt;
  if (lifetime <= 0 || now >= candle.expiresAt) {
    return 0;
  }

  const elapsed = Math.max(0, now - candle.createdAt);
  const elapsedSteps = Math.floor((elapsed / lifetime) * FLAME_LEVEL_STEPS);
  return Math.max(0, 100 - elapsedSteps * (100 / FLAME_LEVEL_STEPS));
}
