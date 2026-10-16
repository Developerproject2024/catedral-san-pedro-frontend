import { InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ChurchServiceRequest } from '../../domain/entities/church-service-request';
import { ChurchService } from '../../domain/entities/church-service';
import { MockChurchServiceRequestRepository } from '../../infrastructure/repositories/mock-church-service-request.repository';

export interface ChurchServiceRequestRepository {
  listServices(): Observable<ChurchService[]>;
  submit(request: ChurchServiceRequest): Observable<void>;
}

export const CHURCH_SERVICE_REQUEST_REPOSITORY = new InjectionToken<ChurchServiceRequestRepository>(
  'CHURCH_SERVICE_REQUEST_REPOSITORY',
  {
    providedIn: 'root',
    factory: () => inject(MockChurchServiceRequestRepository),
  },
);
