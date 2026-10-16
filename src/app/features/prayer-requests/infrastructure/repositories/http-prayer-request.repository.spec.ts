import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../../core/config/api-base-url';
import { PrayerRequest } from '../../domain/entities/prayer-request';
import { HttpPrayerRequestRepository } from './http-prayer-request.repository';

describe('HttpPrayerRequestRepository', () => {
  let repository: HttpPrayerRequestRepository;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpPrayerRequestRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.example.org/' },
      ],
    });
    repository = TestBed.inject(HttpPrayerRequestRepository);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('posts personal data and the optional donation to the backend endpoint', async () => {
    const request: PrayerRequest = {
      fullName: 'Ana María',
      email: 'ana@example.com',
      phone: '3001234567',
      message: 'Por mi familia',
      donationAmountCOP: 20000,
      consentToDataProcessing: true,
    };
    const response = firstValueFrom(repository.submit(request));
    const httpRequest = httpTesting.expectOne('https://api.example.org/api/prayer-requests');

    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);
    httpRequest.flush(null);

    await expect(response).resolves.toBeUndefined();
  });
});
