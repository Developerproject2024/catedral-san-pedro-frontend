export interface ChurchServiceRequest {
  serviceId: string;
  fullName: string;
  email: string;
  phone: string;
  details: Record<string, string>;
  consentToDataProcessing: true;
}
