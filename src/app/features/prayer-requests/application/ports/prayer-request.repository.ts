import { InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PrayerRequest } from '../../domain/entities/prayer-request';
import { UnavailablePrayerRequestRepository } from '../../infrastructure/repositories/unavailable-prayer-request.repository';

export interface PrayerRequestRepository {
  submit(request: PrayerRequest): Observable<void>;
}

export const PRAYER_REQUEST_REPOSITORY = new InjectionToken<PrayerRequestRepository>(
  'PRAYER_REQUEST_REPOSITORY',
  {
    providedIn: 'root',
    factory: () => inject(UnavailablePrayerRequestRepository),
  },
);
