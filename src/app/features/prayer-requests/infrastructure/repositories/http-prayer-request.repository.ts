import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../../core/config/api-base-url';
import { PrayerRequest } from '../../domain/entities/prayer-request';

@Injectable({ providedIn: 'root' })
export class HttpPrayerRequestRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  submit(request: PrayerRequest): Observable<void> {
    const baseUrl = this.apiBaseUrl.replace(/\/+$/, '');
    return this.http
      .post<void>(`${baseUrl}/api/prayer-requests`, request)
      .pipe(map(() => undefined));
  }
}
