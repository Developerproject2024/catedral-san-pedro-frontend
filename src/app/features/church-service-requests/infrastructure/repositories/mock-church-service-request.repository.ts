import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ChurchServiceRequestUnavailableError } from '../../application/errors/church-service-request-service-unavailable.error';
import { ChurchServiceRequest } from '../../domain/entities/church-service-request';
import { ChurchService } from '../../domain/entities/church-service';
import { CHURCH_SERVICES_MOCK } from '../data-sources/church-services.mock';

@Injectable({ providedIn: 'root' })
export class MockChurchServiceRequestRepository {
  listServices(): Observable<ChurchService[]> {
    return of(CHURCH_SERVICES_MOCK);
  }

  submit(_request: ChurchServiceRequest): Observable<void> {
    return throwError(() => new ChurchServiceRequestUnavailableError());
  }
}
