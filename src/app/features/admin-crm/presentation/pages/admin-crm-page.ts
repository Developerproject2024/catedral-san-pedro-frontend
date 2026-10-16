import {
  Component,
  ElementRef,
  OnDestroy,
  effect,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CrmRequest, CrmRequestCategory } from '../../domain/entities/crm-request';
import { CRM_REQUESTS_MOCK } from '../../infrastructure/data-sources/crm-requests.mock';
import {
  AdminChartData,
  AdminChartHandle,
  AdminChartRenderer,
} from '../services/admin-chart-renderer.service';

@Component({
  imports: [FormsModule],
  providers: [AdminChartRenderer],
  selector: 'app-admin-crm-page',
  styleUrl: './admin-crm-page.css',
  template: `
    <section class="admin-crm-page">
      @if (!demoOpen()) {
        <div class="admin-login-wrap">
          <section class="admin-login-card" aria-labelledby="admin-login-title">
            <div class="admin-brand-mark" aria-hidden="true">✝</div>
            <p class="eyebrow"><span></span> Administración</p>
            <h1 id="admin-login-title">Acceso al <em>CRM.</em></h1>
            <p class="admin-login-description">
              El espacio administrativo de la Catedral para revisar solicitudes recibidas y darles
              seguimiento.
            </p>
            <div class="admin-demo-warning" role="note">
              <strong>Inicio de sesión aún no conectado</strong>
              <span>
                Esta vista previa no autentica usuarios, no verifica roles y no contiene datos
                reales. No escribas aquí contraseñas ni información privada.
              </span>
            </div>
            <label class="admin-login-label" for="admin-email">Correo administrador</label>
            <input
              class="admin-login-input"
              id="admin-email"
              type="email"
              autocomplete="off"
              placeholder="Se habilitará con el backend"
              disabled
            />
            <label class="admin-login-label" for="admin-password">Contraseña</label>
            <input
              class="admin-login-input"
              id="admin-password"
              type="password"
              autocomplete="off"
              placeholder="Autenticación pendiente"
              disabled
            />
            <button
              class="button button-primary admin-login-button"
              type="button"
              (click)="openDemo()"
            >
              Explorar CRM de demostración <span aria-hidden="true">→</span>
            </button>
            <p class="admin-login-footnote">
              Los cambios de la demostración se restablecen al salir.
            </p>
          </section>
        </div>
      } @else {
        <div class="admin-crm-shell">
          <header class="admin-crm-header">
            <div class="admin-crm-brand">
              <span class="admin-brand-mark" aria-hidden="true">✝</span>
              <div>
                <p class="admin-crm-kicker">Catedral San Pedro Apóstol</p>
                <h1>Dashboard administrativo</h1>
              </div>
            </div>
            <div class="admin-crm-header-actions">
              <span class="admin-readonly-badge">Demostración · CRUD temporal</span>
              <button class="admin-exit-button" type="button" (click)="closeDemo()">
                Salir de la demo
              </button>
            </div>
          </header>

          <div class="admin-demo-banner" role="status">
            <strong>Datos completamente ficticios.</strong>
            Puedes probar el CRUD; los cambios solo existen mientras esta demo esté abierta y
            no afectan solicitudes reales.
          </div>

          <section class="admin-crm-welcome">
            <div>
              <p class="eyebrow"><span></span> Panel administrativo</p>
              <h2>Resumen pastoral</h2>
              <p>Indicadores y solicitudes para dar seguimiento desde una sola vista.</p>
            </div>
            <span class="admin-crm-date">Vista de prueba</span>
          </section>

          <section class="admin-crm-stats" aria-label="Resumen de solicitudes">
            <article class="admin-stat-card">
              <span class="admin-stat-icon is-gold" aria-hidden="true">✉</span>
              <div>
                <p>Total de solicitudes</p>
                <strong>{{ requests().length }}</strong>
              </div>
            </article>
            <article class="admin-stat-card">
              <span class="admin-stat-icon is-green" aria-hidden="true">◷</span>
              <div>
                <p>Nuevas por revisar</p>
                <strong>{{ newRequestsCount }}</strong>
              </div>
            </article>
            <article class="admin-stat-card">
              <span class="admin-stat-icon is-blue" aria-hidden="true">♧</span>
              <div>
                <p>Donaciones de muestra · No pagadas</p>
                <strong>{{ formatCurrency(totalDeclaredDonationsCOP) }}</strong>
              </div>
            </article>
          </section>

          <section class="admin-dashboard" aria-labelledby="admin-dashboard-title">
            <div class="admin-dashboard-heading">
              <div>
                <p class="eyebrow"><span></span> Analítica</p>
                <h2 id="admin-dashboard-title">Resumen de actividad</h2>
              </div>
              <span class="admin-dashboard-demo">Datos de demostración</span>
            </div>
            <div class="admin-chart-grid">
              <article class="admin-chart-card">
                <div class="admin-chart-heading">
                  <div>
                    <h3>Solicitudes por sección</h3>
                    <p>Distribución de los registros de ejemplo</p>
                  </div>
                  <span aria-hidden="true">▥</span>
                </div>
                <div class="admin-chart-canvas-wrap">
                  <canvas
                    #categoryChartCanvas
                    role="img"
                    aria-label="Gráfica de barras interactiva de solicitudes por sección"
                  >
                    Gráfica de solicitudes por sección.
                  </canvas>
                </div>
                <p class="admin-chart-caption">
                  Selecciona una barra para filtrar la tabla. Total: {{ requests().length }}
                  registros ficticios.
                </p>
              </article>

              <article class="admin-chart-card">
                <div class="admin-chart-heading">
                  <div>
                    <h3>Solicitudes por estado</h3>
                    <p>Seguimiento de la bandeja de ejemplo</p>
                  </div>
                  <span aria-hidden="true">◷</span>
                </div>
                <div class="admin-chart-canvas-wrap admin-status-canvas-wrap">
                  <canvas
                    #statusChartCanvas
                    role="img"
                    aria-label="Gráfica circular interactiva de solicitudes por estado"
                  >
                    Gráfica de solicitudes por estado.
                  </canvas>
                </div>
                <p class="admin-chart-caption">
                  Selecciona un segmento para filtrar por estado. Las cifras reflejan los cambios
                  de la demostración.
                </p>
              </article>

              <article class="admin-chart-card admin-donation-chart">
                <div class="admin-chart-heading">
                  <div>
                    <h3>Donaciones de muestra</h3>
                    <p>Montos ingresados en registros ficticios</p>
                  </div>
                  <span aria-hidden="true">$</span>
                </div>
                <div class="admin-chart-canvas-wrap admin-donation-canvas-wrap">
                  <canvas
                    #donationChartCanvas
                    role="img"
                    aria-label="Gráfica de barras de montos declarados en registros de donación ficticios"
                  >
                    Gráfica de montos de donación de muestra.
                  </canvas>
                </div>
                <div class="admin-donation-chart-metrics">
                  <div>
                    <span>Registros ficticios</span>
                    <strong>{{ countFor('donation') }}</strong>
                  </div>
                  <div>
                    <span>Pagos procesados</span>
                    <strong>0</strong>
                  </div>
                </div>
                <p class="admin-donation-warning">
                  Selecciona una barra para ver donaciones. Ningún monto representa dinero recibido
                  o una transacción real.
                </p>
              </article>
            </div>
          </section>

          <section class="admin-request-panel">
            <div class="admin-request-heading">
              <div>
                <p class="eyebrow"><span></span> Bandeja de entrada</p>
                <h2>Solicitudes recibidas</h2>
              </div>
              <div class="admin-request-actions">
                <label class="admin-search">
                  <span aria-hidden="true">⌕</span>
                  <input
                    type="search"
                    aria-label="Buscar solicitudes"
                    placeholder="Buscar nombre o solicitud"
                    [(ngModel)]="searchTerm"
                    (ngModelChange)="resetPage()"
                  />
                </label>
                <button class="admin-create-button" type="button" (click)="openCreateForm()">
                  <span aria-hidden="true">＋</span> Nueva solicitud
                </button>
              </div>
            </div>

            <div class="admin-table-filters" aria-label="Filtros de solicitudes">
            <label class="admin-filter-control" for="admin-category-filter">
              <span>Tipo</span>
              <select
                id="admin-category-filter"
                aria-label="Filtrar por tipo"
                [value]="activeFilter()"
                (change)="onCategoryFilterChange($event)"
              >
                <option value="all">Todos los tipos</option>
                <option value="prayer">Peticiones</option>
                <option value="service">Servicios</option>
                <option value="group">Grupos</option>
                <option value="adoration">Adoraciones</option>
                <option value="donation">Donaciones</option>
              </select>
            </label>
            <label class="admin-filter-control" for="admin-status-filter">
              <span>Estado</span>
              <select
                id="admin-status-filter"
                aria-label="Filtrar por estado"
                [value]="statusFilter()"
                (change)="onStatusFilterChange($event)"
              >
                <option value="all">Todos los estados</option>
                <option value="Nueva">Nueva</option>
                <option value="En revisión">En revisión</option>
                <option value="Contactada">Contactada</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </label>
            <label class="admin-filter-control" for="admin-date-from">
              <span>Desde</span>
              <input
                id="admin-date-from"
                type="date"
                aria-label="Filtrar desde la fecha"
                [value]="dateFrom()"
                (change)="setDateFrom(dateInputValue($event))"
              />
            </label>
            <label class="admin-filter-control" for="admin-date-to">
              <span>Hasta</span>
              <input
                id="admin-date-to"
                type="date"
                aria-label="Filtrar hasta la fecha"
                [value]="dateTo()"
                (change)="setDateTo(dateInputValue($event))"
              />
            </label>
            <button class="admin-clear-filters" type="button" (click)="clearFilters()">
              Limpiar
            </button>
            <span class="admin-filter-result-count" aria-live="polite">
              {{ filteredRequests().length }}
              {{ filteredRequests().length === 1 ? 'resultado' : 'resultados' }}
            </span>
            </div>

            <div class="admin-request-list">
            <table class="admin-request-table">
              <thead>
                <tr>
                  <th scope="col">Solicitante</th>
                  <th scope="col">Solicitud</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Recibida</th>
                </tr>
              </thead>
              <tbody>
                @for (request of paginatedRequests(); track request.id) {
                  <tr
                    class="admin-request-row"
                    [class.is-selected]="selectedRequest()?.id === request.id"
                    [attr.aria-selected]="selectedRequest()?.id === request.id"
                    [attr.aria-label]="request.categoryLabel + ': ' + request.subject"
                    tabindex="0"
                    (click)="selectRequest(request)"
                    (keydown.enter)="selectRequest(request)"
                    (keydown.space)="$event.preventDefault(); selectRequest(request)"
                  >
                    <td>
                      <span class="admin-table-person">
                        <span class="admin-request-avatar" [attr.data-category]="request.category">
                          {{ initials(request.fullName) }}
                        </span>
                        <span class="admin-request-name">{{ request.fullName }}</span>
                      </span>
                    </td>
                    <td>
                      <span class="admin-request-subject">{{ request.subject }}</span>
                      @if (request.category === 'donation' && request.amountCOP !== undefined) {
                        <span class="admin-request-donation">
                          {{ formatCurrency(request.amountCOP) }} · No pagada
                        </span>
                      }
                    </td>
                    <td><span class="admin-request-type">{{ request.categoryLabel }}</span></td>
                    <td>
                      <span class="admin-request-status" [attr.data-status]="request.status">
                        {{ request.status }}
                      </span>
                    </td>
                    <td><span class="admin-request-date">{{ formatDate(request.receivedAt) }}</span></td>
                  </tr>
                } @empty {
                  <tr>
                    <td class="admin-empty-state" colspan="5" role="status">
                      No hay solicitudes que coincidan con los filtros.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
            </div>
            <div class="admin-pagination" aria-label="Paginación de solicitudes">
              <label class="admin-page-size">
                Filas por página
                <select
                  aria-label="Filas por página"
                  [ngModel]="pageSize()"
                  (ngModelChange)="setPageSize($event)"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </label>
              <span class="admin-page-summary">
                @if (filteredRequests().length > 0) {
                  Mostrando {{ pageStart() }}–{{ pageEnd() }} de {{ filteredRequests().length }}
                } @else {
                  Mostrando 0 resultados
                }
              </span>
              <div class="admin-page-controls">
                <button
                  type="button"
                  aria-label="Página anterior"
                  [disabled]="pageNumber() <= 1"
                  (click)="previousPage()"
                >
                  Anterior
                </button>
                <span aria-live="polite">Página {{ pageNumber() }} de {{ totalPages() }}</span>
                <button
                  type="button"
                  aria-label="Página siguiente"
                  [disabled]="pageNumber() >= totalPages()"
                  (click)="nextPage()"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </section>

          @if (selectedRequest(); as request) {
            <section class="admin-request-detail" aria-live="polite">
              <div class="admin-detail-heading">
                <div>
                  <p class="admin-request-type">{{ request.categoryLabel }}</p>
                  <h2>{{ request.subject }}</h2>
                </div>
                <span class="admin-request-status" [attr.data-status]="request.status">
                  {{ request.status }}
                </span>
              </div>
              <p class="admin-detail-summary">{{ request.summary }}</p>
              <div class="admin-detail-contact">
                <span><strong>Contacto de muestra</strong>{{ request.fullName }}</span>
                <span><strong>Correo</strong>{{ request.email }}</span>
                <span><strong>Teléfono</strong>{{ request.phone }}</span>
                <span><strong>Recibida</strong>{{ formatDate(request.receivedAt) }}</span>
              </div>
              @if (request.category === 'donation' && request.amountCOP !== undefined) {
                <div class="admin-donation-amount">
                  <strong>Monto de muestra</strong>
                  <span>{{ formatCurrency(request.amountCOP) }}</span>
                  <em>No pagada · no se procesó ninguna transacción</em>
                </div>
              }
              <div class="admin-detail-actions">
                <p class="admin-detail-notice">
                  Registro de demostración. Los cambios no se guardan fuera de esta sesión.
                </p>
                <div class="admin-detail-buttons">
                  <button type="button" class="admin-edit-button" (click)="openEditForm(request)">
                    Editar solicitud
                  </button>
                  <button
                    type="button"
                    class="admin-delete-button"
                    (click)="toggleDeleteConfirmation(request.id)"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              @if (deleteConfirmationId() === request.id) {
                <div class="admin-delete-confirmation" role="alert">
                  <p>¿Eliminar este registro ficticio de la demostración?</p>
                  <button type="button" (click)="deleteRequest(request.id)">
                    Sí, eliminar
                  </button>
                  <button type="button" (click)="toggleDeleteConfirmation('')">Cancelar</button>
                </div>
              }
            </section>
          }

          @if (editorOpen()) {
            <div
              class="admin-editor-backdrop"
              (click)="onEditorBackdropClick($event)"
              (keydown.escape)="closeEditor()"
            >
              <section
                class="admin-editor-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="admin-editor-title"
                (click)="$event.stopPropagation()"
              >
                <div class="admin-editor-heading">
                  <div>
                    <p class="eyebrow"><span></span> CRUD de demostración</p>
                    <h2 id="admin-editor-title">
                      {{ editingRequestId() ? 'Editar solicitud' : 'Crear solicitud' }}
                    </h2>
                  </div>
                  <button
                    type="button"
                    class="parish-modal-close"
                    aria-label="Cerrar formulario"
                    (click)="closeEditor()"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <p class="admin-editor-note">
                  Estos cambios son temporales, usan datos ficticios y se borran al salir de la demo.
                </p>
                <form class="admin-editor-form" #requestEditorForm="ngForm" (ngSubmit)="saveRequest()">
                  <label for="crm-category">Tipo de solicitud</label>
                  <select
                    id="crm-category"
                    name="category"
                    [(ngModel)]="editorCategory"
                    required
                  >
                    <option value="prayer">Petición de oración</option>
                    <option value="service">Solicitud de servicio</option>
                    <option value="group">Interés en grupo</option>
                    <option value="adoration">Adoración</option>
                    <option value="donation">Donación</option>
                  </select>
                  @if (editorCategory === 'donation') {
                    <label for="crm-amount">Monto de muestra (COP)</label>
                    <input
                      id="crm-amount"
                      name="amountCOP"
                      type="number"
                      min="1000"
                      max="10000000"
                      step="1000"
                      [(ngModel)]="editorAmountCOP"
                      required
                    />
                  }
                  <label for="crm-subject">Asunto</label>
                  <input id="crm-subject" name="subject" [(ngModel)]="editorSubject" required maxlength="120" />
                  <label for="crm-full-name">Nombre</label>
                  <input id="crm-full-name" name="fullName" [(ngModel)]="editorFullName" required maxlength="100" />
                  <div class="admin-editor-contact">
                    <div>
                      <label for="crm-email">Correo electrónico</label>
                      <input
                        id="crm-email"
                        name="email"
                        type="email"
                        [(ngModel)]="editorEmail"
                        required
                        email
                        maxlength="254"
                      />
                    </div>
                    <div>
                      <label for="crm-phone">Teléfono</label>
                      <input id="crm-phone" name="phone" [(ngModel)]="editorPhone" maxlength="30" />
                    </div>
                  </div>
                  <label for="crm-status">Estado</label>
                  <select id="crm-status" name="status" [(ngModel)]="editorStatus" required>
                    <option value="Nueva">Nueva</option>
                    <option value="En revisión">En revisión</option>
                    <option value="Contactada">Contactada</option>
                  </select>
                  <label for="crm-summary">Detalle</label>
                  <textarea
                    id="crm-summary"
                    name="summary"
                    [(ngModel)]="editorSummary"
                    required
                    maxlength="1000"
                    rows="3"
                  ></textarea>
                  <div class="admin-editor-actions">
                    <button type="button" class="admin-edit-button" (click)="closeEditor()">
                      Cancelar
                    </button>
                    <button type="submit" class="admin-create-button" [disabled]="!requestEditorForm.valid">
                      {{ editingRequestId() ? 'Guardar cambios' : 'Crear solicitud' }}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          }
        </div>
      }
    </section>
  `,
})
export class AdminCrmPage implements OnDestroy {
  private readonly categoryChartCanvas =
    viewChild<ElementRef<HTMLCanvasElement>>('categoryChartCanvas');
  private readonly statusChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('statusChartCanvas');
  private readonly donationChartCanvas =
    viewChild<ElementRef<HTMLCanvasElement>>('donationChartCanvas');
  private categoryChartHandle: AdminChartHandle | null = null;
  private statusChartHandle: AdminChartHandle | null = null;
  private donationChartHandle: AdminChartHandle | null = null;

  protected readonly requests = signal<CrmRequest[]>([...CRM_REQUESTS_MOCK]);
  protected readonly demoOpen = signal(false);
  protected readonly activeFilter = signal<'all' | CrmRequestCategory>('all');
  protected readonly statusFilter = signal('all');
  protected readonly dateFrom = signal('');
  protected readonly dateTo = signal('');
  protected readonly pageNumber = signal(1);
  protected readonly pageSize = signal(5);
  protected readonly selectedRequest = signal<CrmRequest | null>(null);
  protected readonly editorOpen = signal(false);
  protected readonly editingRequestId = signal<string | null>(null);
  protected readonly deleteConfirmationId = signal<string | null>(null);
  protected searchTerm = '';
  protected editorCategory: CrmRequestCategory = 'prayer';
  protected editorSubject = '';
  protected editorFullName = '';
  protected editorEmail = '';
  protected editorPhone = '';
  protected editorStatus = 'Nueva';
  protected editorSummary = '';
  protected editorAmountCOP = 10000;

  constructor(chartRenderer: AdminChartRenderer) {
    effect(() => {
      if (!this.demoOpen()) {
        this.destroyCharts();
        return;
      }

      const categoryCanvas = this.categoryChartCanvas()?.nativeElement;
      const statusCanvas = this.statusChartCanvas()?.nativeElement;
      const donationCanvas = this.donationChartCanvas()?.nativeElement;
      if (!categoryCanvas || !statusCanvas || !donationCanvas) return;

      const categoryData = this.categoryChartData();
      const statusData = this.statusChartData();
      const donationData = this.donationChartData();

      if (this.categoryChartHandle) {
        this.categoryChartHandle.update(categoryData);
      } else {
        this.categoryChartHandle = chartRenderer.createBarChart(
          categoryCanvas,
          categoryData,
          (index) => {
            const category = this.categories()[index]?.category;
            if (category) this.setFilter(category);
          },
          (value) => `${value} solicitudes`,
          'vertical',
        );
      }

      if (this.statusChartHandle) {
        this.statusChartHandle.update(statusData);
      } else {
        this.statusChartHandle = chartRenderer.createDoughnutChart(
          statusCanvas,
          statusData,
          (index) => {
            const status = this.statuses()[index];
            if (status) this.setStatusFilter(status);
          },
        );
      }

      if (this.donationChartHandle) {
        this.donationChartHandle.update(donationData);
      } else {
        this.donationChartHandle = chartRenderer.createBarChart(
          donationCanvas,
          donationData,
          () => this.setFilter('donation'),
          (value) => this.formatCurrency(value),
        );
      }
    });
  }

  protected get newRequestsCount(): number {
    return this.requests().filter((request) => request.status === 'Nueva').length;
  }

  protected get totalDeclaredDonationsCOP(): number {
    return this.requests().reduce(
      (total, request) =>
        total + (request.category === 'donation' ? (request.amountCOP ?? 0) : 0),
      0,
    );
  }

  protected countFor(category: CrmRequestCategory): number {
    return this.requests().filter((request) => request.category === category).length;
  }

  private categories(): Array<{
    category: CrmRequestCategory;
    label: string;
  }> {
    return [
      { category: 'prayer', label: 'Peticiones' },
      { category: 'service', label: 'Servicios' },
      { category: 'group', label: 'Grupos' },
      { category: 'adoration', label: 'Adoraciones' },
      { category: 'donation', label: 'Donaciones' },
    ];
  }

  private statuses(): string[] {
    return ['Nueva', 'En revisión', 'Contactada', 'Pendiente'];
  }

  private categoryChartData(): AdminChartData {
    const colors: Record<CrmRequestCategory, string> = {
      prayer: '#34724f',
      service: '#58788a',
      group: '#b48739',
      adoration: '#738254',
      donation: '#a97938',
    };
    const categories = this.categories();
    return {
      labels: categories.map(({ label }) => label),
      values: categories.map(({ category }) => this.countFor(category)),
      colors: categories.map(({ category }) =>
        this.activeFilter() === 'all' || this.activeFilter() === category
          ? colors[category]
          : '#e8e5dc',
      ),
    };
  }

  private statusChartData(): AdminChartData {
    const colors = ['#b48739', '#58788a', '#34724f', '#a44d39'];
    const statuses = this.statuses();
    return {
      labels: statuses,
      values: statuses.map(
        (status) => this.requests().filter((request) => request.status === status).length,
      ),
      colors: statuses.map((status, index) =>
        this.statusFilter() === 'all' || this.statusFilter() === status
          ? colors[index]
          : '#e8e5dc',
      ),
    };
  }

  private donationChartData(): AdminChartData {
    const donations = this.requests().filter(
      (request) => request.category === 'donation' && request.amountCOP !== undefined,
    );
    return {
      labels: donations.map(({ subject }) => subject),
      values: donations.map(({ amountCOP }) => amountCOP ?? 0),
      colors: donations.map(() => '#b48739'),
    };
  }

  private destroyCharts(): void {
    this.categoryChartHandle?.destroy();
    this.statusChartHandle?.destroy();
    this.donationChartHandle?.destroy();
    this.categoryChartHandle = null;
    this.statusChartHandle = null;
    this.donationChartHandle = null;
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  protected filteredRequests(): CrmRequest[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    return this.requests().filter((request) => {
      const matchesCategory =
        this.activeFilter() === 'all' || request.category === this.activeFilter();
      const matchesStatus =
        this.statusFilter() === 'all' || request.status === this.statusFilter();
      const receivedDate = request.receivedAt.slice(0, 10);
      const matchesDateFrom = !this.dateFrom() || receivedDate >= this.dateFrom();
      const matchesDateTo = !this.dateTo() || receivedDate <= this.dateTo();
      const matchesSearch =
        !query ||
        `${request.fullName} ${request.subject} ${request.categoryLabel}`
          .toLocaleLowerCase()
          .includes(query);
      return matchesCategory && matchesStatus && matchesDateFrom && matchesDateTo && matchesSearch;
    });
  }

  protected paginatedRequests(): CrmRequest[] {
    const start = (this.pageNumber() - 1) * this.pageSize();
    return this.filteredRequests().slice(start, start + this.pageSize());
  }

  protected totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRequests().length / this.pageSize()));
  }

  protected pageStart(): number {
    return (this.pageNumber() - 1) * this.pageSize() + 1;
  }

  protected pageEnd(): number {
    return Math.min(this.pageNumber() * this.pageSize(), this.filteredRequests().length);
  }

  protected setFilter(filter: 'all' | CrmRequestCategory): void {
    this.activeFilter.set(filter);
    this.resetPage();
    this.selectedRequest.set(null);
  }

  protected onCategoryFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'all') {
      this.setFilter('all');
      return;
    }

    const category = (['prayer', 'service', 'group', 'adoration', 'donation'] as const).find(
      (option) => option === value,
    );
    if (category) this.setFilter(category);
  }

  protected onStatusFilterChange(event: Event): void {
    this.setStatusFilter((event.target as HTMLSelectElement).value);
  }

  protected dateInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected setStatusFilter(status: string): void {
    this.statusFilter.set(status);
    this.resetPage();
    this.selectedRequest.set(null);
  }

  protected setDateFrom(date: string): void {
    this.dateFrom.set(date);
    this.resetPage();
    this.selectedRequest.set(null);
  }

  protected setDateTo(date: string): void {
    this.dateTo.set(date);
    this.resetPage();
    this.selectedRequest.set(null);
  }

  protected clearFilters(): void {
    this.activeFilter.set('all');
    this.statusFilter.set('all');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.searchTerm = '';
    this.resetPage();
    this.selectedRequest.set(null);
  }

  protected setPageSize(size: number | string): void {
    this.pageSize.set(Number(size));
    this.resetPage();
  }

  protected resetPage(): void {
    this.pageNumber.set(1);
  }

  protected previousPage(): void {
    this.pageNumber.update((page) => Math.max(1, page - 1));
  }

  protected nextPage(): void {
    this.pageNumber.update((page) => Math.min(this.totalPages(), page + 1));
  }

  protected selectRequest(request: CrmRequest): void {
    this.selectedRequest.set(this.selectedRequest()?.id === request.id ? null : request);
  }

  protected openDemo(): void {
    this.demoOpen.set(true);
    this.requests.set([...CRM_REQUESTS_MOCK]);
    this.selectedRequest.set(null);
    this.activeFilter.set('all');
    this.statusFilter.set('all');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.pageNumber.set(1);
    this.searchTerm = '';
  }

  protected closeDemo(): void {
    this.demoOpen.set(false);
    this.requests.set([...CRM_REQUESTS_MOCK]);
    this.selectedRequest.set(null);
    this.editorOpen.set(false);
    this.deleteConfirmationId.set(null);
    this.searchTerm = '';
    this.statusFilter.set('all');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.pageNumber.set(1);
  }

  protected openCreateForm(): void {
    this.editingRequestId.set(null);
    this.editorCategory = 'prayer';
    this.editorSubject = '';
    this.editorFullName = '';
    this.editorEmail = '';
    this.editorPhone = '';
    this.editorStatus = 'Nueva';
    this.editorSummary = '';
    this.editorAmountCOP = 10000;
    this.editorOpen.set(true);
  }

  protected openEditForm(request: CrmRequest): void {
    this.editingRequestId.set(request.id);
    this.editorCategory = request.category;
    this.editorSubject = request.subject;
    this.editorFullName = request.fullName;
    this.editorEmail = request.email;
    this.editorPhone = request.phone;
    this.editorStatus = request.status;
    this.editorSummary = request.summary;
    this.editorAmountCOP = request.amountCOP ?? 10000;
    this.editorOpen.set(true);
    this.deleteConfirmationId.set(null);
  }

  protected closeEditor(): void {
    this.editorOpen.set(false);
    this.editingRequestId.set(null);
  }

  protected onEditorBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeEditor();
    }
  }

  protected saveRequest(): void {
    const categoryLabels: Record<CrmRequestCategory, string> = {
      prayer: 'Petición de oración',
      service: 'Solicitud de servicio',
      group: 'Interés en grupo',
      adoration: 'Adoración',
      donation: 'Donación',
    };
    const existing = this.editingRequestId()
      ? this.requests().find((request) => request.id === this.editingRequestId())
      : undefined;
    const request: CrmRequest = {
      id: existing?.id ?? `demo-${Date.now()}`,
      category: this.editorCategory,
      categoryLabel: categoryLabels[this.editorCategory],
      subject: this.editorSubject.trim(),
      fullName: this.editorFullName.trim(),
      email: this.editorEmail.trim(),
      phone: this.editorPhone.trim(),
      receivedAt: existing?.receivedAt ?? new Date().toISOString(),
      status: this.editorStatus,
      summary: this.editorSummary.trim(),
      ...(this.editorCategory === 'donation' ? { amountCOP: Number(this.editorAmountCOP) } : {}),
    };
    if (existing) {
      this.requests.update((items) => items.map((item) => (item.id === existing.id ? request : item)));
    } else {
      this.requests.update((items) => [request, ...items]);
    }
    this.activeFilter.set('all');
    this.statusFilter.set('all');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.resetPage();
    this.searchTerm = '';
    this.selectedRequest.set(request);
    this.closeEditor();
  }

  protected toggleDeleteConfirmation(requestId: string): void {
    this.deleteConfirmationId.update((current) => (current === requestId ? null : requestId));
  }

  protected deleteRequest(requestId: string): void {
    this.requests.update((items) => items.filter((item) => item.id !== requestId));
    this.selectedRequest.set(null);
    this.deleteConfirmationId.set(null);
    this.resetPage();
  }

  protected initials(fullName: string): string {
    return fullName
      .split(' ')
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toLocaleUpperCase();
  }

  protected formatDate(date: string): string {
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  }

  protected formatCurrency(amountCOP: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amountCOP);
  }
}
