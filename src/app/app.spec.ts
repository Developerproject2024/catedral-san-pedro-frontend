import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { AdminCrmPage } from './features/admin-crm/presentation/pages/admin-crm-page';
import {
  AdminChartData,
  AdminChartHandle,
  AdminChartRenderer,
} from './features/admin-crm/presentation/services/admin-chart-renderer.service';

let barChartSelections: Array<(index: number) => void>;
let doughnutChartSelections: Array<(index: number) => void>;
let barChartUpdates: AdminChartData[][];

describe('App', () => {
  beforeEach(async () => {
    barChartSelections = [];
    doughnutChartSelections = [];
    barChartUpdates = [];
    const createHandle = (updates: AdminChartData[]): AdminChartHandle => ({
      update: (data) => updates.push(data),
      destroy: () => undefined,
    });
    const chartRendererMock = {
      createBarChart: (
        _canvas: HTMLCanvasElement,
        _data: AdminChartData,
        onSelect: (index: number) => void,
      ) => {
        const updates: AdminChartData[] = [];
        barChartUpdates.push(updates);
        barChartSelections.push(onSelect);
        return createHandle(updates);
      },
      createDoughnutChart: (
        _canvas: HTMLCanvasElement,
        _data: AdminChartData,
        onSelect: (index: number) => void,
      ) => {
        doughnutChartSelections.push(onSelect);
        return createHandle([]);
      },
    };
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    })
      .overrideComponent(AdminCrmPage, {
        set: { providers: [{ provide: AdminChartRenderer, useValue: chartRendererMock }] },
      })
      .compileComponents();
  });

  it('should render the home page and shared navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Un hogar para la fe');
    expect(compiled.querySelectorAll('#main-navigation a')).toHaveLength(11);
    expect(compiled.querySelectorAll('.nav-dropdown-trigger')).toHaveLength(3);
    expect(compiled.querySelectorAll('.nav-submenu')).toHaveLength(3);
    expect(compiled.querySelector('.hero-art img')?.getAttribute('src')).toBe(
      '/images/catedral-buga-exterior.jpg',
    );
    expect(compiled.querySelector('.photo-credit')?.textContent).toContain('CC BY-SA 3.0');
    expect(compiled.querySelector('.daily-gospel-promo')?.textContent).toContain(
      'Escucha el Evangelio de hoy',
    );
    expect(compiled.querySelector('.daily-gospel-promo a[routerLink="/evangelio"]')).not.toBeNull();
    expect(
      compiled.querySelector('.site-footer .footer-nav a[routerLink="/catedral"]'),
    ).not.toBeNull();
    expect(
      compiled.querySelector('.site-footer .footer-community a[routerLink="/adoracion"]'),
    ).not.toBeNull();
    expect(compiled.querySelector('.site-footer .footer-social-link')?.getAttribute('href')).toBe(
      'https://www.facebook.com/catedralsanpedrodebuga',
    );
  });

  it('should navigate to the separate history, services, and contact pages', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/historia');
    await fixture.whenStable();
    fixture.detectChanges();
    let compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Una historia construida');
    expect(compiled.querySelectorAll('.timeline-event')).toHaveLength(6);
    expect(compiled.querySelector('.timeline')?.textContent).toContain('30 de diciembre de 1781');

    await router.navigateByUrl('/adoracion');
    await fixture.whenStable();
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Adoración al');
    expect(compiled.querySelectorAll('.adoration-candle')).toHaveLength(4);
    expect(compiled.querySelectorAll('.prayer-steps li')).toHaveLength(3);
    expect(compiled.querySelectorAll('.prayer-candle.is-lit')).toHaveLength(0);
    expect(compiled.querySelectorAll('.prayer-candle.is-unlit')).toHaveLength(20);
    expect(compiled.querySelector('.candle-visibility-note')?.textContent).toContain(
      'no se comparten',
    );
    expect(compiled.querySelector('.candle-wall-caption')?.textContent).toContain('24 horas');
    expect(compiled.querySelector('.candle-modal')).toBeNull();
    (
      compiled.querySelector('[aria-label="Elegir veladora disponible 7"]') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(compiled.querySelector('.candle-modal')?.getAttribute('aria-modal')).toBe('true');
    expect(compiled.querySelector('.selected-candle-slot')?.textContent).toContain('veladora 7');
    expect(compiled.querySelectorAll('input[name="donationAmount"]')).toHaveLength(4);
    expect(compiled.querySelector('.donation-payment-notice')?.textContent).toContain(
      'no se procesa',
    );
    expect(compiled.textContent).not.toContain('demostración');

    const nameInput = compiled.querySelector('#prayer-name') as HTMLInputElement;
    nameInput.value = '  Ana María  ';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    const donationInput = compiled.querySelectorAll<HTMLInputElement>(
      'input[name="donationAmount"]',
    )[2];
    donationInput.click();
    const consentInput = compiled.querySelector(
      'input[name="publicNameConsent"]',
    ) as HTMLInputElement;
    consentInput.click();
    fixture.detectChanges();
    compiled
      .querySelector('.candle-prayer-form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.querySelector('.candle-modal')).toBeNull();
    expect(compiled.querySelectorAll('.prayer-candle-grid > .prayer-candle')).toHaveLength(20);
    expect(compiled.querySelectorAll('.prayer-candle.is-lit')).toHaveLength(1);
    expect(compiled.querySelectorAll('.prayer-candle.is-unlit')).toHaveLength(19);
    const candleCards = compiled.querySelectorAll('.prayer-candle-grid > .prayer-candle');
    expect(candleCards[6].classList).toContain('is-lit');
    expect(candleCards[6].textContent).toContain('Ana María');
    expect(compiled.querySelector('.candle-count')?.textContent).toContain('1 encendida');
    expect(compiled.querySelector('.prayer-candle-votive .prayer-candle-wax')).not.toBeNull();
    expect(compiled.querySelector('.prayer-candle-votive .prayer-candle-holder')).not.toBeNull();
    expect(compiled.querySelector('.donation-confirmation')?.textContent).toContain(
      'aporte voluntario',
    );
    expect(compiled.querySelector('.donation-confirmation')?.textContent).toContain('10.000');
    expect(compiled.querySelector('.donation-confirmation')?.textContent).toContain(
      'No se realizó ningún cobro',
    );

    (compiled.querySelector('.candle-modal-trigger button') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const secondNameInput = compiled.querySelector('#prayer-name') as HTMLInputElement;
    secondNameInput.value = 'Carlos';
    secondNameInput.dispatchEvent(new Event('input', { bubbles: true }));
    (compiled.querySelector('input[name="publicNameConsent"]') as HTMLInputElement).click();
    fixture.detectChanges();
    compiled
      .querySelector('.candle-prayer-form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.prayer-candle.is-lit')).toHaveLength(2);
    expect(compiled.querySelectorAll('.prayer-candle.is-unlit')).toHaveLength(18);
    expect(compiled.querySelector('.candle-count')?.textContent).toContain('2 encendidas');
    expect(compiled.querySelector('.donation-confirmation')?.textContent).toContain(
      'continuar sin aporte',
    );

    for (let index = 3; index <= 20; index++) {
      (compiled.querySelector('.candle-modal-trigger button') as HTMLButtonElement).click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const nextNameInput = compiled.querySelector('#prayer-name') as HTMLInputElement;
      nextNameInput.value = `Persona ${index}`;
      nextNameInput.dispatchEvent(new Event('input', { bubbles: true }));
      (compiled.querySelector('input[name="publicNameConsent"]') as HTMLInputElement).click();
      fixture.detectChanges();
      compiled
        .querySelector('.candle-prayer-form')
        ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await fixture.whenStable();
      fixture.detectChanges();
    }

    expect(compiled.querySelectorAll('.prayer-candle.is-lit')).toHaveLength(20);
    expect(compiled.querySelectorAll('.prayer-candle.is-unlit')).toHaveLength(20);
    expect(compiled.querySelectorAll('.prayer-candle-grid > .prayer-candle')).toHaveLength(40);

    await router.navigateByUrl('/servicios');
    await fixture.whenStable();
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Servicios para');
    await router.navigateByUrl('/catedral');
    await fixture.whenStable();
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.cathedral-image img')?.getAttribute('src')).toBe(
      '/images/catedral-buga-fachada.jpg',
    );
    expect(compiled.querySelector('.image-credit')?.textContent).toContain('Diego Carrejo Murillo');

    await router.navigateByUrl('/contacto');
    await fixture.whenStable();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain(
      'Ven a encontrarte',
    );

    await router.navigateByUrl('/adoracion');
    await fixture.whenStable();
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('.prayer-candle.is-lit')).toHaveLength(20);
    expect(compiled.querySelector('.prayer-candle-grid')?.textContent).toContain('Ana María');
    expect(compiled.querySelector('.prayer-candle-grid')?.textContent).toContain('Carlos');
  });

  it('should toggle and close the mobile navigation after selecting a route', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();
    const toggle = fixture.nativeElement.querySelector('.menu-toggle') as HTMLButtonElement;

    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    const aboutMenu = fixture.nativeElement.querySelector(
      '.nav-dropdown-trigger[aria-controls="nav-about"]',
    ) as HTMLButtonElement;
    aboutMenu.click();
    fixture.detectChanges();
    expect(aboutMenu.getAttribute('aria-expanded')).toBe('true');
    expect(
      fixture.nativeElement.querySelector('#nav-about a[routerLink="/historia"]'),
    ).not.toBeNull();

    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(aboutMenu.getAttribute('aria-expanded')).toBe('false');

    toggle.click();
    fixture.detectChanges();
    aboutMenu.click();
    fixture.detectChanges();
    const historyLink = fixture.nativeElement.querySelector(
      'a[routerLink="/historia"]',
    ) as HTMLAnchorElement;
    historyLink.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(TestBed.inject(Router).url).toBe('/historia');
  });

  it('should provide a separate donation page without pretending to process payment', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/donaciones');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('mantiene viva la fe');
    expect(compiled.querySelectorAll('.donation-amount-option')).toHaveLength(4);
    expect(compiled.querySelector('.donation-unavailable')?.textContent).toContain(
      'No se realizará ningún cobro',
    );
    expect(compiled.querySelector('#main-navigation a.active-link')?.textContent).toContain(
      'Donaciones',
    );

    (
      compiled.querySelector('.donation-amount-option:last-child input') as HTMLInputElement
    ).click();
    fixture.detectChanges();
    expect(compiled.querySelector('#custom-donation-amount')).not.toBeNull();
    const customAmount = compiled.querySelector('#custom-donation-amount') as HTMLInputElement;
    customAmount.value = '500';
    customAmount.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    (compiled.querySelector('.donation-form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    expect(compiled.querySelector('.donation-submit-message')?.textContent).toContain(
      'Ingresa un monto válido',
    );

    customAmount.value = '15000';
    customAmount.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    (compiled.querySelector('.donation-form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    fixture.detectChanges();
    expect(compiled.querySelector('.donation-submit-message')?.textContent).toContain(
      'no se realizó ningún cobro',
    );
  });

  it('should show the prayer request form and make the optional donation clear', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/peticiones');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Comparte tu petición');
    expect(compiled.querySelectorAll('.prayer-request-form input[required]')).toHaveLength(3);
    expect(compiled.querySelector('#request-message')).not.toBeNull();
    expect(compiled.querySelector('.prayer-donation-options legend')?.textContent).toContain(
      'Elige un monto',
    );
    expect(compiled.querySelectorAll('input[name="donation"]')).toHaveLength(5);
    expect(
      (compiled.querySelector('input[name="donation"][value="none"]') as HTMLInputElement).checked,
    ).toBe(true);
    (compiled.querySelector('input[name="donation"][value="20000"]') as HTMLInputElement).click();
    fixture.detectChanges();
    expect(
      compiled
        .querySelector('input[name="donation"][value="20000"]')
        ?.closest('.prayer-donation-option')
        ?.classList.contains('is-selected'),
    ).toBe(true);
    expect(compiled.querySelector('.prayer-requests-note')?.textContent).toContain(
      'no se transmiten ni quedan guardados',
    );
    expect(compiled.querySelector('#main-navigation a.active-link')?.textContent).toContain(
      'Peticiones',
    );

    const setField = (selector: string, value: string, eventName = 'input') => {
      const field = compiled.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
      field.value = value;
      field.dispatchEvent(new Event(eventName, { bubbles: true }));
    };
    setField('#request-full-name', 'Ana María');
    setField('#request-email', 'ana@example.com');
    setField('#request-message', 'Por mi familia');
    (compiled.querySelector('.prayer-request-consent input') as HTMLInputElement).click();
    fixture.detectChanges();
    compiled
      .querySelector('.prayer-request-form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.querySelector('.prayer-request-feedback')?.textContent).toContain(
      'El envío aún no está habilitado',
    );
    expect(compiled.querySelector('.prayer-request-feedback')?.textContent).toContain(
      'no se transmitieron',
    );
  });

  it('should load church service options and change fields for the selected service', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/solicitudes');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Estamos contigo');
    expect(compiled.querySelectorAll('#church-service option')).toHaveLength(4);
    expect(compiled.querySelector('#church-field-partnerNames')).not.toBeNull();
    expect(compiled.querySelector('#church-field-ceremonyDate')?.getAttribute('type')).toBe('date');
    expect(compiled.querySelector('.church-service-notice')?.textContent).toContain(
      'no reserva confirmada',
    );

    const serviceSelect = compiled.querySelector('#church-service') as HTMLSelectElement;
    serviceSelect.value = 'aniversario-fallecido';
    serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.querySelector('#church-field-deceasedName')).not.toBeNull();
    expect(compiled.querySelector('#church-field-anniversaryDate')?.getAttribute('type')).toBe(
      'date',
    );
    expect(compiled.querySelector('#church-field-partnerNames')).toBeNull();
    expect(compiled.querySelector('#main-navigation a.active-link')?.textContent).toContain(
      'Solicitar un servicio',
    );
  });

  it('should show parish groups and keep registration disabled until the backend is ready', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/grupos');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Crezcamos juntos');
    expect(compiled.querySelectorAll('.parish-group-card')).toHaveLength(6);
    expect(compiled.querySelector('.parish-group-card')?.textContent).toContain(
      'Parejas y matrimonios',
    );
    expect(compiled.querySelector('[role="dialog"]')).toBeNull();
    (compiled.querySelector('.parish-group-select') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(compiled.querySelector('[role="dialog"]')?.getAttribute('aria-modal')).toBe('true');
    expect(compiled.querySelector('.parish-modal-notice')?.textContent).toContain(
      'no confirma tu inscripción',
    );
    expect(compiled.querySelector('#parish-modal-title')?.textContent).toContain(
      'Parejas y matrimonios',
    );
    expect(compiled.querySelector('#parish-group')).toBeNull();
    expect(compiled.querySelector('#main-navigation a.active-link')?.textContent).toContain(
      'Grupos parroquiales',
    );

    const nameInput = compiled.querySelector('#group-full-name') as HTMLInputElement;
    nameInput.value = 'Ana María';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    const emailInput = compiled.querySelector('#group-email') as HTMLInputElement;
    emailInput.value = 'ana@example.com';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    const phoneInput = compiled.querySelector('#group-phone') as HTMLInputElement;
    phoneInput.value = '3001234567';
    phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
    (compiled.querySelector('.parish-registration-form input[name="consent"]') as HTMLInputElement)
      .click();
    fixture.detectChanges();
    compiled
      .querySelector('.parish-registration-form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.querySelector('.parish-registration-form .church-service-feedback')?.textContent)
      .toContain('aún no está habilitada');
    expect(compiled.querySelector('.parish-registration-form .church-service-feedback')?.textContent)
      .toContain('no se transmitieron');

    (compiled.querySelector('.parish-modal-close') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(compiled.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should show the clearly labeled CRM demo and filter sample requests', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/administracion');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Acceso al CRM');
    expect(compiled.querySelector('.admin-demo-warning')?.textContent).toContain(
      'no autentica usuarios',
    );
    expect((compiled.querySelector('#admin-password') as HTMLInputElement).disabled).toBe(true);
    expect(compiled.querySelector('.admin-crm-shell')).toBeNull();

    (compiled.querySelector('.admin-login-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(compiled.querySelector('.admin-demo-banner')?.textContent).toContain(
      'completamente ficticios',
    );
    expect(compiled.querySelector('#admin-dashboard-title')?.textContent).toContain(
      'Resumen de actividad',
    );
    expect(compiled.querySelectorAll('.admin-chart-card')).toHaveLength(3);
    expect(compiled.querySelectorAll('.admin-chart-card canvas')).toHaveLength(3);
    expect(barChartSelections).toHaveLength(2);
    expect(doughnutChartSelections).toHaveLength(1);
    expect(compiled.querySelectorAll('.admin-request-table thead th')).toHaveLength(5);
    expect(compiled.querySelector('.admin-request-table')?.tagName).toBe('TABLE');
    expect(compiled.querySelector('.admin-donation-chart')?.textContent).toContain(
      'Pagos procesados0',
    );
    expect(compiled.querySelector('.admin-donation-warning')?.textContent).toContain(
      'Ningún monto representa dinero recibido',
    );
    expect(compiled.querySelectorAll('.admin-request-row')).toHaveLength(5);
    expect(compiled.querySelector('.admin-page-summary')?.textContent).toContain('1–5 de 10');
    const nextPageButton = compiled.querySelector(
      '.admin-page-controls button[aria-label="Página siguiente"]',
    ) as HTMLButtonElement;
    expect(nextPageButton.disabled).toBe(false);
    nextPageButton.click();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.admin-request-row')).toHaveLength(5);
    expect(compiled.querySelector('.admin-page-controls')?.textContent).toContain('Página 2 de 2');
    (
      compiled.querySelector(
        '.admin-page-controls button[aria-label="Página anterior"]',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();

    const statusFilter = compiled.querySelector('#admin-status-filter') as HTMLSelectElement;
    statusFilter.value = 'Nueva';
    statusFilter.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.admin-request-row')).toHaveLength(5);
    expect(compiled.querySelector('.admin-page-controls')?.textContent).toContain('Página 1 de 1');
    statusFilter.value = 'all';
    statusFilter.dispatchEvent(new Event('change', { bubbles: true }));
    const pageSizeSelect = compiled.querySelector(
      '.admin-page-size select',
    ) as HTMLSelectElement;
    pageSizeSelect.value = '10';
    pageSizeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.admin-request-row')).toHaveLength(10);

    const categoryFilter = compiled.querySelector('#admin-category-filter') as HTMLSelectElement;
    categoryFilter.value = 'service';
    categoryFilter.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.admin-request-row')).toHaveLength(2);
    categoryFilter.value = 'all';
    categoryFilter.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    barChartSelections[0](2);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.admin-request-row')).toHaveLength(2);
    expect(categoryFilter.value).toBe('group');
    categoryFilter.value = 'all';
    categoryFilter.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    doughnutChartSelections[0](0);
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.admin-request-row')).toHaveLength(5);
    expect(statusFilter.value).toBe('Nueva');
    (compiled.querySelector('.admin-clear-filters') as HTMLButtonElement).click();
    fixture.detectChanges();

    const dateFrom = compiled.querySelector('#admin-date-from') as HTMLInputElement;
    dateFrom.value = '2026-10-16';
    dateFrom.dispatchEvent(new Event('change', { bubbles: true }));
    const dateTo = compiled.querySelector('#admin-date-to') as HTMLInputElement;
    dateTo.value = '2026-10-16';
    dateTo.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.admin-request-row')).toHaveLength(2);
    (compiled.querySelector('.admin-clear-filters') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.admin-request-row')).toHaveLength(10);

    categoryFilter.value = 'donation';
    categoryFilter.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.admin-request-row')).toHaveLength(2);
    expect(compiled.querySelectorAll('.admin-request-donation')).toHaveLength(2);
    expect(compiled.querySelector('.admin-request-donation')?.textContent).toContain('No pagada');
    (compiled.querySelector('.admin-request-row') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(compiled.querySelector('.admin-donation-amount')?.textContent).toContain(
      'no se procesó ninguna transacción',
    );

    categoryFilter.value = 'adoration';
    categoryFilter.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.admin-request-row')).toHaveLength(2);
    expect(compiled.querySelector('.admin-request-row')?.textContent).toContain('Adoración');

    categoryFilter.value = 'prayer';
    categoryFilter.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.admin-request-row')).toHaveLength(2);
    expect(compiled.querySelector('.admin-request-row')?.textContent).toContain('Petición');

    (compiled.querySelector('.admin-request-row') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(compiled.querySelector('.admin-request-detail')?.textContent).toContain(
      'no se guardan fuera de esta sesión',
    );

    (compiled.querySelector('.admin-clear-filters') as HTMLButtonElement).click();
    fixture.detectChanges();
    (compiled.querySelector('.admin-create-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const setEditorField = (selector: string, value: string) => {
      const input = compiled.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    setEditorField('#crm-subject', 'Nueva solicitud de prueba');
    setEditorField('#crm-full-name', 'Persona de prueba');
    setEditorField('#crm-email', 'prueba@example.com');
    setEditorField('#crm-summary', 'Registro temporal de prueba.');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const createSubmit = compiled.querySelector(
      '.admin-editor-form button[type="submit"]',
    ) as HTMLButtonElement;
    expect(
      [...compiled.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        '.admin-editor-form input, .admin-editor-form select, .admin-editor-form textarea',
      )]
        .filter((field) => !field.validity.valid)
        .map((field) => `${field.name}:${field.value}`)
        .join('|'),
    ).toBe('');
    expect(createSubmit.disabled).toBe(false);
    createSubmit.click();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.admin-request-row')).toHaveLength(10);
    expect(barChartUpdates[0].at(-1)?.values[0]).toBe(3);
    const createdRow = Array.from(compiled.querySelectorAll<HTMLButtonElement>('.admin-request-row'))
      .find((row) => row.textContent?.includes('Nueva solicitud de prueba'));
    expect(createdRow).toBeDefined();

    (compiled.querySelector('.admin-edit-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    setEditorField('#crm-subject', 'Solicitud editada');
    const statusSelect = compiled.querySelector('#crm-status') as HTMLSelectElement;
    statusSelect.value = 'Contactada';
    statusSelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    (compiled.querySelector('.admin-editor-form button[type="submit"]') as HTMLButtonElement)
      .click();
    fixture.detectChanges();
    expect(compiled.querySelector('.admin-request-detail h2')?.textContent).toContain(
      'Solicitud editada',
    );
    expect(compiled.querySelector('.admin-request-detail .admin-request-status')?.textContent)
      .toContain('Contactada');

    (compiled.querySelector('.admin-delete-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(compiled.querySelector('.admin-delete-confirmation')?.textContent).toContain(
      '¿Eliminar este registro ficticio',
    );
    (compiled.querySelector('.admin-delete-confirmation button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.admin-request-row')).toHaveLength(10);

    (compiled.querySelector('.admin-exit-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(compiled.querySelector('.admin-login-card')).not.toBeNull();
    expect(compiled.querySelector('.admin-crm-shell')).toBeNull();
  });

  it('should show the sample Facebook video of the Word and direct fallback link', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/evangelio');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Evangelio');
    const gospelColumns = compiled.querySelector('.gospel-content')?.children;
    expect(gospelColumns?.[0].classList.contains('gospel-video-card')).toBe(true);
    expect(gospelColumns?.[1].querySelector('.gospel-scripture h2')?.textContent).toBe(
      'Lucas 12, 1-7',
    );
    const rightColumn = gospelColumns?.[1];
    expect(rightColumn?.querySelector('.gospel-reflection h2')?.textContent).toContain(
      'Haz silencio.',
    );
    expect(rightColumn?.firstElementChild?.classList.contains('gospel-reflection')).toBe(true);
    expect(
      rightColumn?.firstElementChild?.nextElementSibling?.classList.contains('gospel-scripture'),
    ).toBe(true);
    expect(compiled.querySelector('.gospel-scripture h2')?.textContent).toBe('Lucas 12, 1-7');
    expect(compiled.querySelectorAll('.gospel-scripture-text p')).toHaveLength(7);
    expect(compiled.querySelector('.gospel-scripture-text')?.textContent).toContain(
      'Jesús advierte a sus discípulos',
    );
    expect(compiled.querySelector('.gospel-scripture .gospel-date')?.textContent).toContain(
      '16 de octubre de 2026',
    );
    expect(compiled.querySelector('.gospel-video-card .gospel-date')?.textContent).toContain(
      'muestra',
    );
    expect(compiled.querySelector('.gospel-sample-note')?.textContent).toContain(
      'solo una muestra',
    );
    expect(compiled.querySelector('.gospel-video-card h2')?.textContent).toContain(
      'Complicar la vida es contrario a la evangelización',
    );
    expect(compiled.querySelector('.gospel-reference')?.textContent).toContain(
      'Catedral San Pedro - Buga Valle',
    );
    expect(compiled.querySelector('.gospel-video-frame iframe')?.getAttribute('src')).toContain(
      'plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1085986171101847%2F',
    );
    expect(compiled.querySelector('.gospel-video-frame iframe')?.getAttribute('title')).toContain(
      'Video de la Palabra',
    );
    expect(compiled.querySelector('.gospel-video-link')?.getAttribute('href')).toBe(
      'https://www.facebook.com/reel/1085986171101847/',
    );
    expect(compiled.querySelector('.gospel-video-link')?.getAttribute('rel')).toContain('noopener');
    expect(compiled.querySelector('#main-navigation a.active-link')?.textContent).toContain(
      'Evangelio',
    );
  });
});
