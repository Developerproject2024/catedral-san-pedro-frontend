import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { PrayerRequestServiceUnavailableError } from '../../application/errors/prayer-request-service-unavailable.error';
import { PrayerRequest } from '../../domain/entities/prayer-request';

@Injectable({ providedIn: 'root' })
export class UnavailablePrayerRequestRepository {
  submit(_request: PrayerRequest): Observable<void> {
    return throwError(() => new PrayerRequestServiceUnavailableError());
  }
}
