import { GospelReading } from '../../domain/entities/gospel-reading';


export const GOSPEL_READING_MOCK: GospelReading = {
  reference: 'Lucas 12, 1-7',
  liturgicalDate: '2026-10-16',
  translation: 'Conferencia Episcopal de Colombia',
  sourceUrl:
    'https://mail.cec.org.co/evangelio-diario/16-de-octubre-del-2026-lectura-del-santo-evangelio-segun-san-lucas-lc-12-1-7',
  isSample: true,
  verses: [
    {
      number: 1,
      text: 'Jesús advierte a sus discípulos que se protejan de la hipocresía y vivan con sinceridad.',
    },
    {
      number: 2,
      text: 'Todo lo oculto terminará saliendo a la luz y lo secreto llegará a conocerse.',
    },
    {
      number: 3,
      text: 'Las palabras pronunciadas en secreto llegarán a escucharse públicamente.',
    },
    {
      number: 4,
      text: 'Jesús anima a sus amigos a no temer a quienes pueden quitarles la vida física.',
    },
    {
      number: 5,
      text: 'Les enseña a reconocer la autoridad de Dios y a vivir con reverencia ante él.',
    },
    {
      number: 6,
      text: 'Dios no olvida a sus criaturas, ni siquiera a los pájaros pequeños.',
    },
    {
      number: 7,
      text: 'Dios conoce hasta los cabellos de nuestra cabeza. No debemos tener miedo, porque somos valiosos para él.',
    },
  ],
};

