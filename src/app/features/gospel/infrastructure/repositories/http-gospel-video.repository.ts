import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../../core/config/api-base-url';
import { GospelVideo } from '../../domain/entities/gospel-video';

type GospelVideoResponse =
  | { status: 'not_available'; date: string }
  | {
      status: 'available';
      video: {
        title: string;
        url: string;
        publishedAt: string;
      };
    };

export class HttpGospelVideoRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getTodayVideo(): Observable<GospelVideo | null> {
    const baseUrl = this.apiBaseUrl.replace(/\/+$/, '');
    return this.http
      .get<GospelVideoResponse>(`${baseUrl}/api/gospel/video-of-the-day`)
      .pipe(map((response) => this.toDomain(response)));
  }

  private toDomain(response: GospelVideoResponse): GospelVideo | null {
    if (response.status === 'not_available') {
      return null;
    }

    const { title, url, publishedAt } = response.video;
    const facebookUrl = this.validateFacebookUrl(url);
    if (
      typeof title !== 'string' ||
      !title.trim() ||
      !facebookUrl ||
      typeof publishedAt !== 'string' ||
      Number.isNaN(Date.parse(publishedAt))
    ) {
      throw new Error('La respuesta del servicio de Evangelio tiene datos inválidos.');
    }

    return { title: title.trim(), facebookUrl, publishedAt, isSample: false };
  }

  private validateFacebookUrl(value: unknown): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    try {
      const url = new URL(value);
      const isFacebookHost = ['facebook.com', 'www.facebook.com'].includes(url.hostname);
      const isVideoPath = /^\/(?:reel\/|[^/]+\/videos\/)/.test(url.pathname);
      return url.protocol === 'https:' && isFacebookHost && isVideoPath ? url.toString() : null;
    } catch {
      return null;
    }
  }
}
