import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../../core/config/api-base-url';
import { ChurchServiceRequest } from '../../domain/entities/church-service-request';
import { ChurchService } from '../../domain/entities/church-service';

@Injectable({ providedIn: 'root' })
export class HttpChurchServiceRequestRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  listServices(): Observable<ChurchService[]> {
    const baseUrl = this.apiBaseUrl.replace(/\/+$/, '');
    return this.http.get<ChurchService[]>(`${baseUrl}/api/church-services`);
  }

  submit(request: ChurchServiceRequest): Observable<void> {
    const baseUrl = this.apiBaseUrl.replace(/\/+$/, '');
    return this.http
      .post<void>(`${baseUrl}/api/church-service-requests`, request)
      .pipe(map(() => undefined));
  }
}
