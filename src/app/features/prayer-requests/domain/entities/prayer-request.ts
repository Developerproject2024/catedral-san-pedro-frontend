export interface PrayerRequest {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  donationAmountCOP?: number;
  consentToDataProcessing: true;
}
