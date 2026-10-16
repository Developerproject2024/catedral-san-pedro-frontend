import { InjectionToken, inject } from '@angular/core';
import { PrayerCandle } from '../../domain/entities/prayer-candle';
import { DemoPrayerCandleRepository } from '../../infrastructure/repositories/demo-prayer-candle.repository';

export interface PrayerCandleRepository {
  list(): Promise<PrayerCandle[]>;
  create(name: string, slotIndex: number): Promise<PrayerCandle>;
}

export const PRAYER_CANDLE_REPOSITORY = new InjectionToken<PrayerCandleRepository>(
  'PRAYER_CANDLE_REPOSITORY',
  {
    providedIn: 'root',
    factory: () => inject(DemoPrayerCandleRepository),
  },
);
