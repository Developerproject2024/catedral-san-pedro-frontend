import { InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GospelVideo } from '../../domain/entities/gospel-video';
import { MockGospelVideoRepository } from '../../infrastructure/repositories/mock-gospel-video.repository';

export interface GospelVideoRepository {
  getTodayVideo(): Observable<GospelVideo | null>;
}

export const GOSPEL_VIDEO_REPOSITORY = new InjectionToken<GospelVideoRepository>(
  'GOSPEL_VIDEO_REPOSITORY',
  {
    providedIn: 'root',
    factory: () => inject(MockGospelVideoRepository),
  },
);
