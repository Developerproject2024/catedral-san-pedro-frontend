import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../../core/config/api-base-url';
import { GroupRegistration } from '../../domain/entities/group-registration';
import { ParishGroup } from '../../domain/entities/parish-group';

@Injectable({ providedIn: 'root' })
export class HttpParishGroupRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  listGroups(): Observable<ParishGroup[]> {
    const baseUrl = this.apiBaseUrl.replace(/\/+$/, '');
    return this.http.get<ParishGroup[]>(`${baseUrl}/api/parish-groups`);
  }

  register(request: GroupRegistration): Observable<void> {
    const baseUrl = this.apiBaseUrl.replace(/\/+$/, '');
    return this.http
      .post<void>(`${baseUrl}/api/parish-group-registrations`, request)
      .pipe(map(() => undefined));
  }
}
