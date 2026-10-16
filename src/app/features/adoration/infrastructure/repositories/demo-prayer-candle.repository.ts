import { Injectable } from '@angular/core';
import { PrayerCandle } from '../../domain/entities/prayer-candle';
import { PrayerCandleRepository } from '../../application/ports/prayer-candle.repository';

export const PRAYER_CANDLE_LIFETIME_MS = 24 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class DemoPrayerCandleRepository implements PrayerCandleRepository {
  private candles: PrayerCandle[] = [];
  private nextId = 1;

  async list(): Promise<PrayerCandle[]> {
    this.removeExpiredCandles();
    return this.candles
      .slice()
      .sort((a, b) => a.slotIndex - b.slotIndex)
      .map((candle) => ({ ...candle }));
  }

  async create(name: string, slotIndex: number): Promise<PrayerCandle> {
    this.removeExpiredCandles();
    if (!Number.isInteger(slotIndex) || slotIndex < 0 || this.candles.some((candle) => candle.slotIndex === slotIndex)) {
      throw new Error('El espacio seleccionado no está disponible.');
    }
    const createdAt = Date.now();
    const candle: PrayerCandle = {
      id: `session-${this.nextId++}`,
      name,
      slotIndex,
      createdAt,
      expiresAt: createdAt + PRAYER_CANDLE_LIFETIME_MS,
    };
    this.candles = [...this.candles, candle];
    return { ...candle };
  }

  private removeExpiredCandles(): void {
    const now = Date.now();
    this.candles = this.candles.filter((candle) => candle.expiresAt > now);
  }
}
