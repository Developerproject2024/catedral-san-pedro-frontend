import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../../core/config/api-base-url';
import { ChurchServiceRequest } from '../../domain/entities/church-service-request';
import { HttpChurchServiceRequestRepository } from './http-church-service-request.repository';

describe('HttpChurchServiceRequestRepository', () => {
  let repository: HttpChurchServiceRequestRepository;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpChurchServiceRequestRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.example.org/' },
      ],
    });
    repository = TestBed.inject(HttpChurchServiceRequestRepository);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('loads the service catalog from the backend', async () => {
    const response = firstValueFrom(repository.listServices());
    const request = httpTesting.expectOne('https://api.example.org/api/church-services');
    expect(request.request.method).toBe('GET');
    request.flush([
      {
        id: 'matrimonio',
        name: 'Matrimonio',
        description: 'Solicita información.',
        fields: [
          {
            key: 'ceremonyDate',
            label: 'Fecha deseada',
            type: 'date',
            required: true,
          },
        ],
      },
    ]);
    await expect(response).resolves.toEqual([
      {
        id: 'matrimonio',
        name: 'Matrimonio',
        description: 'Solicita información.',
        fields: [
          {
            key: 'ceremonyDate',
            label: 'Fecha deseada',
            type: 'date',
            required: true,
          },
        ],
      },
    ]);
  });

  it('sends the selected service and personal details to the backend', async () => {
    const payload: ChurchServiceRequest = {
      serviceId: 'matrimonio',
      fullName: 'Ana María',
      email: 'ana@example.com',
      phone: '3001234567',
      details: { ceremonyDate: '2027-06-12' },
      consentToDataProcessing: true,
    };
    const response = firstValueFrom(repository.submit(payload));
    const request = httpTesting.expectOne('https://api.example.org/api/church-service-requests');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush(null);
    await expect(response).resolves.toBeUndefined();
  });
});
