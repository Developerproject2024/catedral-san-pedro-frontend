import { InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupRegistration } from '../../domain/entities/group-registration';
import { ParishGroup } from '../../domain/entities/parish-group';
import { MockParishGroupRepository } from '../../infrastructure/repositories/mock-parish-group.repository';

export interface ParishGroupRepository {
  listGroups(): Observable<ParishGroup[]>;
  register(request: GroupRegistration): Observable<void>;
}

export const PARISH_GROUP_REPOSITORY = new InjectionToken<ParishGroupRepository>(
  'PARISH_GROUP_REPOSITORY',
  {
    providedIn: 'root',
    factory: () => inject(MockParishGroupRepository),
  },
);
