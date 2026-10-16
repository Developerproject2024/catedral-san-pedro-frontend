import { afterEach, describe, expect, it, vi } from 'vitest';
import { DemoPrayerCandleRepository, PRAYER_CANDLE_LIFETIME_MS } from './demo-prayer-candle.repository';

describe('DemoPrayerCandleRepository', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('expires candles after 24 hours and removes their names', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-16T12:00:00Z'));
    const repository = new DemoPrayerCandleRepository();

    const candle = await repository.create('María', 8);
    expect(candle.slotIndex).toBe(8);
    expect(candle.expiresAt - candle.createdAt).toBe(PRAYER_CANDLE_LIFETIME_MS);
    expect((await repository.list()).map(({ name }) => name)).toEqual(['María']);

    vi.setSystemTime(new Date(candle.expiresAt - 1));
    expect(await repository.list()).toHaveLength(1);

    vi.setSystemTime(new Date(candle.expiresAt));
    expect(await repository.list()).toEqual([]);
  });

  it('stores candles in the selected slot and rejects occupied slots', async () => {
    const repository = new DemoPrayerCandleRepository();
    await repository.create('María', 8);
    await repository.create('José', 3);

    expect((await repository.list()).map(({ slotIndex }) => slotIndex)).toEqual([3, 8]);
    await expect(repository.create('Ana', 8)).rejects.toThrow('El espacio seleccionado no está disponible.');
  });
});
