export interface GospelReading {
  reference: string;
  liturgicalDate: string;
  translation: string;
  sourceUrl: string;
  isSample: boolean;
  verses: Array<{ number: number; text: string }>;
}
