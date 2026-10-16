import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { GroupRegistrationUnavailableError } from '../../application/errors/group-registration-unavailable.error';
import { GroupRegistration } from '../../domain/entities/group-registration';
import { ParishGroup } from '../../domain/entities/parish-group';
import { PARISH_GROUPS_MOCK } from '../data-sources/parish-groups.mock';

@Injectable({ providedIn: 'root' })
export class MockParishGroupRepository {
  listGroups(): Observable<ParishGroup[]> {
    return of(PARISH_GROUPS_MOCK);
  }

  register(_request: GroupRegistration): Observable<void> {
    return throwError(() => new GroupRegistrationUnavailableError());
  }
}
