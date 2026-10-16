export type CrmRequestCategory = 'prayer' | 'service' | 'group' | 'adoration' | 'donation';

export interface CrmRequest {
  id: string;
  category: CrmRequestCategory;
  categoryLabel: string;
  subject: string;
  fullName: string;
  email: string;
  phone: string;
  receivedAt: string;
  status: string;
  summary: string;
  amountCOP?: number;
}
