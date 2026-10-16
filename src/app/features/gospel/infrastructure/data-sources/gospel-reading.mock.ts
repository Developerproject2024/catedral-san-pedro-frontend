import { GospelReading } from '../../domain/entities/gospel-reading';

export const GOSPEL_READING_MOCK: GospelReading = {
  reference: 'Lucas 12, 1-7',
  liturgicalDate: '2026-10-16',
  translation: 'Reina-Valera Antigua',
  sourceUrl: 'https://www.biblegateway.com/passage/?search=Lucas%2012%3A1-7&version=RVA',
  isSample: true,
  verses: [
    {
      number: 1,
      text: 'En esto, juntándose muchas gentes, tanto que unos á otros se hollaban, comenzó á decir á sus discípulos, primeramente: Guardaos de la levadura de los Fariseos, que es hipocresía.',
    },
    {
      number: 2,
      text: 'Porque nada hay encubierto, que no haya de ser descubierto; ni oculto, que no haya de ser sabido.',
    },
    {
      number: 3,
      text: 'Por tanto, las cosas que dijisteis en tinieblas, á la luz serán oídas; y lo que hablasteis al oído en las cámaras, será pregonado en los terrados.',
    },
    {
      number: 4,
      text: 'Mas os digo, amigos míos: No temáis de los que matan el cuerpo, y después no tienen más que hacer.',
    },
    {
      number: 5,
      text: 'Mas os enseñaré á quién temáis: temed á aquel que después de haber quitado la vida, tiene poder de echar en la Gehenna: así os digo: á éste temed.',
    },
    {
      number: 6,
      text: '¿No se venden cinco pajarillos por dos blancas? pues ni uno de ellos está olvidado delante de Dios.',
    },
    {
      number: 7,
      text: 'Y aun los cabellos de vuestra cabeza están todos contados. No temáis pues: de más estima sois que muchos pajarillos.',
    },
  ],
};
