import { ChurchService } from '../../domain/entities/church-service';

export const CHURCH_SERVICES_MOCK: ChurchService[] = [
  {
    id: 'matrimonio',
    name: 'Matrimonio',
    description: 'Consulta disponibilidad para la celebración de un matrimonio.',
    fields: [
      {
        key: 'partnerNames',
        label: 'Nombres de los contrayentes',
        type: 'text',
        required: true,
        placeholder: 'Nombres completos',
      },
      {
        key: 'ceremonyDate',
        label: 'Fecha deseada del matrimonio',
        type: 'date',
        required: true,
      },
      {
        key: 'additionalDetails',
        label: 'Información adicional',
        type: 'textarea',
        required: false,
        placeholder: 'Cuéntanos si tienes alguna consulta especial',
      },
    ],
  },
  {
    id: 'aniversario-fallecido',
    name: 'Aniversario de un ser querido fallecido',
    description: 'Solicita información para recordar a un ser querido en una celebración.',
    fields: [
      {
        key: 'deceasedName',
        label: 'Nombre de la persona fallecida',
        type: 'text',
        required: true,
        placeholder: 'Nombre completo',
      },
      {
        key: 'anniversaryDate',
        label: 'Fecha del aniversario que deseas conmemorar',
        type: 'date',
        required: true,
      },
      {
        key: 'additionalDetails',
        label: 'Información adicional',
        type: 'textarea',
        required: false,
        placeholder: 'Comparte algún detalle que debamos tener en cuenta',
      },
    ],
  },
  {
    id: 'bautismo',
    name: 'Bautismo',
    description: 'Solicita información y disponibilidad para celebrar un bautismo.',
    fields: [
      {
        key: 'candidateName',
        label: 'Nombre de quien recibirá el bautismo',
        type: 'text',
        required: true,
        placeholder: 'Nombre completo',
      },
      {
        key: 'birthDate',
        label: 'Fecha de nacimiento',
        type: 'date',
        required: true,
      },
      {
        key: 'desiredDate',
        label: 'Fecha deseada para la celebración',
        type: 'date',
        required: false,
      },
      {
        key: 'additionalDetails',
        label: 'Información adicional',
        type: 'textarea',
        required: false,
        placeholder: 'Escribe aquí tus preguntas',
      },
    ],
  },
  {
    id: 'intencion-misa',
    name: 'Intención de misa',
    description: 'Comparte una intención y la fecha preferida para consultar disponibilidad.',
    fields: [
      {
        key: 'intention',
        label: 'Intención',
        type: 'textarea',
        required: true,
        placeholder: 'Escribe brevemente la intención',
      },
      {
        key: 'preferredDate',
        label: 'Fecha preferida',
        type: 'date',
        required: false,
      },
    ],
  },
];
