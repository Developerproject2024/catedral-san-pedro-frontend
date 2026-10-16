import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GospelVideo } from '../../domain/entities/gospel-video';
import { GOSPEL_VIDEO_MOCK } from '../data-sources/gospel-video.mock';

@Injectable({ providedIn: 'root' })
export class MockGospelVideoRepository {
  getTodayVideo(): Observable<GospelVideo | null> {
    return of(GOSPEL_VIDEO_MOCK);
  }
}
