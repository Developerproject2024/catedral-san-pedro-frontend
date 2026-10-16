export type ChurchServiceFieldType = 'text' | 'date' | 'email' | 'textarea';

export interface ChurchServiceField {
  key: string;
  label: string;
  type: ChurchServiceFieldType;
  required: boolean;
  placeholder?: string;
}

export interface ChurchService {
  id: string;
  name: string;
  description: string;
  fields: ChurchServiceField[];
}
