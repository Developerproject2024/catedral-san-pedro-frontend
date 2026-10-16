import { InjectionToken } from '@angular/core';

export interface DonationCheckout {
  checkoutUrl: string;
  reference: string;
}

export interface DonationPaymentGateway {
  createCheckout(input: {
    amountCOP: number;
    donorName?: string;
  }): Promise<DonationCheckout>;
}

export const DONATION_PAYMENT_GATEWAY = new InjectionToken<DonationPaymentGateway>(
  'DONATION_PAYMENT_GATEWAY',
);
