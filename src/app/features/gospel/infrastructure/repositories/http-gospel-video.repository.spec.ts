import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../../core/config/api-base-url';
import { HttpGospelVideoRepository } from './http-gospel-video.repository';

describe('HttpGospelVideoRepository', () => {
  let repository: HttpGospelVideoRepository;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpGospelVideoRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.example.org/' },
      ],
    });
    repository = TestBed.inject(HttpGospelVideoRepository);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('loads and maps the video published today from the backend contract', async () => {
    const result = firstValueFrom(repository.getTodayVideo());
    const request = httpTesting.expectOne('https://api.example.org/api/gospel/video-of-the-day');
    expect(request.request.method).toBe('GET');
    request.flush({
      status: 'available',
      video: {
        title: 'Evangelio del día',
        url: 'https://www.facebook.com/reel/123456789/',
        publishedAt: '2026-10-16T08:00:00-05:00',
      },
    });

    await expect(result).resolves.toEqual({
      title: 'Evangelio del día',
      facebookUrl: 'https://www.facebook.com/reel/123456789/',
      publishedAt: '2026-10-16T08:00:00-05:00',
      isSample: false,
    });
  });

  it('returns null when the backend has no video for today', async () => {
    const result = firstValueFrom(repository.getTodayVideo());
    httpTesting.expectOne('https://api.example.org/api/gospel/video-of-the-day').flush({
      status: 'not_available',
      date: '2026-10-16',
    });

    await expect(result).resolves.toBeNull();
  });

  it('rejects video links outside Facebook', async () => {
    const result = firstValueFrom(repository.getTodayVideo());
    httpTesting.expectOne('https://api.example.org/api/gospel/video-of-the-day').flush({
      status: 'available',
      video: {
        title: 'Evangelio del día',
        url: 'https://example.org/reel/123456789/',
        publishedAt: '2026-10-16T08:00:00-05:00',
      },
    });

    await expect(result).rejects.toThrow('datos inválidos');
  });
});
