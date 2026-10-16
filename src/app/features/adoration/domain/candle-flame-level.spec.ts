import { describe, expect, it } from 'vitest';
import { PrayerCandle } from './entities/prayer-candle';
import { getCandleFlameLevel } from './candle-flame-level';

describe('getCandleFlameLevel', () => {
  const createdAt = 1_000_000;
  const candle: PrayerCandle = {
    id: 'candle-1',
    name: 'María',
    slotIndex: 0,
    createdAt,
    expiresAt: createdAt + 24 * 60 * 60 * 1000,
  };
  const stepDuration = (candle.expiresAt - candle.createdAt) / 10;

  it('starts fully lit and decreases in 10 percent steps', () => {
    expect(getCandleFlameLevel(candle, createdAt)).toBe(100);
    expect(getCandleFlameLevel(candle, createdAt + stepDuration - 1)).toBe(100);
    expect(getCandleFlameLevel(candle, createdAt + stepDuration)).toBe(90);
    expect(getCandleFlameLevel(candle, createdAt + stepDuration * 2)).toBe(80);
    expect(getCandleFlameLevel(candle, candle.expiresAt - 1)).toBe(10);
    expect(getCandleFlameLevel(candle, candle.expiresAt)).toBe(0);
  });
});
