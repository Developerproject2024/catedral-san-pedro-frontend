import { ParishGroup } from '../../domain/entities/parish-group';

export const PARISH_GROUPS_MOCK: ParishGroup[] = [
  {
    id: 'parejas',
    name: 'Parejas y matrimonios',
    category: 'Familia',
    description:
      'Un espacio para crecer en pareja, compartir experiencias y fortalecer la vida familiar desde la fe.',
    meetingInfo: 'Encuentros y horarios por confirmar con la parroquia.',
  },
  {
    id: 'adoracion',
    name: 'Adoración eucarística',
    category: 'Oración',
    description:
      'Personas que acompañan al Santísimo en oración y colaboran en los espacios de adoración.',
    meetingInfo: 'Turnos y disponibilidad por coordinar.',
  },
  {
    id: 'jovenes',
    name: 'Jóvenes',
    category: 'Comunidad',
    description:
      'Encuentros para compartir, formarse y vivir la fe junto a otros jóvenes de la comunidad.',
    meetingInfo: 'Edades, encuentros y horarios por confirmar.',
  },
  {
    id: 'coro',
    name: 'Coro y música litúrgica',
    category: 'Liturgia',
    description:
      'Participa con tu voz o instrumento en la preparación musical de las celebraciones.',
    meetingInfo: 'Ensayos y disponibilidad por coordinar.',
  },
  {
    id: 'catequesis',
    name: 'Catequesis',
    category: 'Formación',
    description:
      'Acompaña procesos de formación en la fe y preparación para los sacramentos.',
    meetingInfo: 'Requisitos y horarios por confirmar.',
  },
  {
    id: 'lectores',
    name: 'Lectores y ministros',
    category: 'Liturgia',
    description:
      'Colabora en los servicios litúrgicos de la Catedral de acuerdo con tu disponibilidad.',
    meetingInfo: 'Formación, turnos y requisitos por confirmar.',
  },
];
