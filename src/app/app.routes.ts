import { Routes } from '@angular/router';
import { CathedralPage } from './features/cathedral/presentation/pages/cathedral-page';
import { ContactPage } from './features/contact/presentation/pages/contact-page';
import { AdorationPage } from './features/adoration/presentation/pages/adoration-page';
import { DonationsPage } from './features/donations/presentation/pages/donations-page';
import { ChurchServiceRequestsPage } from './features/church-service-requests/presentation/pages/church-service-requests-page';
import { GospelPage } from './features/gospel/presentation/pages/gospel-page';
import { HistoryPage } from './features/history/presentation/pages/history-page';
import { HomePage } from './features/home/presentation/pages/home-page';
import { PrayerRequestsPage } from './features/prayer-requests/presentation/pages/prayer-requests-page';
import { ParishGroupsPage } from './features/parish-groups/presentation/pages/parish-groups-page';
import { ServicesPage } from './features/services/presentation/pages/services-page';

export const routes: Routes = [
  {
    path: 'administracion',
    loadComponent: () =>
      import('./features/admin-crm/presentation/pages/admin-crm-page').then(
        (module) => module.AdminCrmPage,
      ),
    title: 'Administración CRM | Catedral San Pedro',
  },
  { path: '', component: HomePage, title: 'Inicio | Catedral San Pedro' },
  { path: 'catedral', component: CathedralPage, title: 'La Catedral | Catedral San Pedro' },
  { path: 'historia', component: HistoryPage, title: 'Historia | Catedral San Pedro' },
  { path: 'servicios', component: ServicesPage, title: 'Servicios | Catedral San Pedro' },
  {
    path: 'solicitudes',
    component: ChurchServiceRequestsPage,
    title: 'Solicitar un servicio | Catedral San Pedro',
  },
  {
    path: 'adoracion',
    component: AdorationPage,
    title: 'Adoración al Santísimo | Catedral San Pedro',
  },
  { path: 'donaciones', component: DonationsPage, title: 'Donaciones | Catedral San Pedro' },
  {
    path: 'peticiones',
    component: PrayerRequestsPage,
    title: 'Peticiones de oración | Catedral San Pedro',
  },
  {
    path: 'grupos',
    component: ParishGroupsPage,
    title: 'Grupos parroquiales | Catedral San Pedro',
  },
  { path: 'evangelio', component: GospelPage, title: 'Evangelio del día | Catedral San Pedro' },
  { path: 'contacto', component: ContactPage, title: 'Contacto | Catedral San Pedro' },
  { path: '**', redirectTo: '' },
];
