import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChurchServiceRequestUnavailableError } from '../../application/errors/church-service-request-service-unavailable.error';
import { CHURCH_SERVICE_REQUEST_REPOSITORY } from '../../application/ports/church-service-request.repository';
import { ChurchServiceRequest } from '../../domain/entities/church-service-request';
import { ChurchService, ChurchServiceField } from '../../domain/entities/church-service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-church-service-requests-page',
  template: `
    <section class="page-hero church-service-hero">
      <div class="section-wrap page-hero-inner">
        <p class="eyebrow"><span></span> Servicios de la Catedral</p>
        <h1>Estamos contigo<br /><em>en cada celebración.</em></h1>
        <p>
          Cuéntanos qué servicio necesitas. Seleccionaremos contigo los detalles y nos pondremos en
          contacto para orientarte.
        </p>
      </div>
    </section>

    <section class="church-service-section section-wrap">
      <aside class="church-service-intro">
        <span class="church-service-symbol" aria-hidden="true">✝</span>
        <p class="eyebrow"><span></span> Acompañamiento pastoral</p>
        <h2>Un paso importante<br /><em>en tu camino de fe.</em></h2>
        <p>
          Matrimonios, bautismos, intenciones de misa y otras celebraciones forman parte de la vida
          de nuestra comunidad. Envíanos tu solicitud para recibir información.
        </p>
        <div class="church-service-notice">
          <strong>Solicitud de información, no reserva confirmada.</strong>
          <span>
            El equipo de la Catedral deberá confirmar disponibilidad, requisitos, fechas y cualquier
            aporte directamente contigo.
          </span>
        </div>
        <a class="text-link" routerLink="/contacto">
          Información de contacto <span aria-hidden="true">→</span>
        </a>
      </aside>

      <form
        class="church-service-form"
        #serviceRequestForm="ngForm"
        (ngSubmit)="submitRequest(serviceRequestForm.valid === true)"
      >
        <p class="church-service-form-eyebrow">Formulario de solicitud</p>
        <h2>¿Qué servicio necesitas?</h2>

        @if (loading()) {
          <p class="church-service-status" role="status">Cargando servicios disponibles…</p>
        } @else if (loadError()) {
          <div class="church-service-status is-error" role="alert">
            <p>{{ loadError() }}</p>
            <button class="text-link" type="button" (click)="loadServices()">
              Intentar de nuevo
            </button>
          </div>
        } @else if (services().length === 0) {
          <p class="church-service-status" role="status">
            No hay servicios disponibles para solicitar por este medio en este momento.
          </p>
        } @else {
          <label class="church-service-label" for="church-service">Servicio</label>
          <select
            class="church-service-input"
            id="church-service"
            name="serviceId"
            [(ngModel)]="selectedServiceId"
            (ngModelChange)="onServiceChange()"
            required
          >
            @for (service of services(); track service.id) {
              <option [value]="service.id">{{ service.name }}</option>
            }
          </select>
          @if (selectedService(); as service) {
            <p class="church-service-description">{{ service.description }}</p>
          }

          <div class="church-service-contact-fields">
            <label class="church-service-label" for="church-request-name">Nombre completo</label>
            <input
              class="church-service-input"
              id="church-request-name"
              name="fullName"
              type="text"
              autocomplete="name"
              maxlength="100"
              [(ngModel)]="fullName"
              required
              placeholder="Escribe tu nombre"
            />

            <div class="church-service-contact-row">
              <div>
                <label class="church-service-label" for="church-request-email"
                  >Correo electrónico</label
                >
                <input
                  class="church-service-input"
                  id="church-request-email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  maxlength="254"
                  [(ngModel)]="email"
                  required
                  email
                  placeholder="nombre@correo.com"
                />
              </div>
              <div>
                <label class="church-service-label" for="church-request-phone">Teléfono</label>
                <input
                  class="church-service-input"
                  id="church-request-phone"
                  name="phone"
                  type="tel"
                  autocomplete="tel"
                  maxlength="30"
                  [(ngModel)]="phone"
                  required
                  placeholder="Número de contacto"
                />
              </div>
            </div>
          </div>

          @if (selectedService(); as service) {
            @if (service.fields.length > 0) {
              <div class="church-service-dynamic-fields">
                <h3>Detalles del servicio</h3>
                @for (field of service.fields; track field.key) {
                  <div class="church-service-dynamic-field">
                    <label class="church-service-label" [for]="'church-field-' + field.key">
                      {{ field.label }}
                      @if (!field.required) {
                        <span>(opcional)</span>
                      }
                    </label>
                    @if (field.type === 'textarea') {
                      <textarea
                        class="church-service-input church-service-textarea"
                        [id]="'church-field-' + field.key"
                        [name]="'service-' + field.key"
                        [required]="field.required"
                        [maxlength]="2000"
                        [(ngModel)]="details[field.key]"
                        [placeholder]="field.placeholder ?? ''"
                      ></textarea>
                    } @else {
                      <input
                        class="church-service-input"
                        [id]="'church-field-' + field.key"
                        [name]="'service-' + field.key"
                        [type]="field.type"
                        [required]="field.required"
                        [maxlength]="field.type === 'date' ? null : 200"
                        [(ngModel)]="details[field.key]"
                        [placeholder]="field.placeholder ?? ''"
                      />
                    }
                  </div>
                }
              </div>
            }
          }

          <label class="church-service-consent">
            <input type="checkbox" name="consent" [(ngModel)]="consent" required />
            <span>
              Autorizo el uso de mis datos para responder a esta solicitud. Aún no se enviarán
              mientras el backend no esté habilitado.
            </span>
          </label>

          <button
            class="button button-primary church-service-submit"
            type="submit"
            [disabled]="submitting()"
          >
            Enviar solicitud <span aria-hidden="true">→</span>
          </button>
          @if (feedback()) {
            <p
              class="church-service-feedback"
              [class.is-error]="feedbackError()"
              [attr.role]="feedbackError() ? 'alert' : 'status'"
              aria-live="polite"
            >
              {{ feedback() }}
            </p>
          }
        }
      </form>
    </section>
  `,
})
export class ChurchServiceRequestsPage implements OnInit {
  private readonly repository = inject(CHURCH_SERVICE_REQUEST_REPOSITORY);

  protected readonly services = signal<ChurchService[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadError = signal('');
  protected readonly submitting = signal(false);
  protected readonly feedback = signal('');
  protected readonly feedbackError = signal(false);
  protected selectedServiceId = '';
  protected fullName = '';
  protected email = '';
  protected phone = '';
  protected details: Record<string, string> = {};
  protected consent = false;

  ngOnInit(): void {
    this.loadServices();
  }

  protected selectedService(): ChurchService | null {
    return this.services().find((service) => service.id === this.selectedServiceId) ?? null;
  }

  protected onServiceChange(): void {
    this.details = {};
    this.feedback.set('');
    this.feedbackError.set(false);
  }

  protected loadServices(): void {
    this.loading.set(true);
    this.loadError.set('');
    this.repository.listServices().subscribe({
      next: (services) => {
        this.services.set(services);
        this.selectedServiceId = services[0]?.id ?? '';
        this.details = {};
        this.loading.set(false);
      },
      error: () => {
        this.services.set([]);
        this.loading.set(false);
        this.loadError.set('No pudimos cargar los servicios. Inténtalo de nuevo más tarde.');
      },
    });
  }

  protected submitRequest(formIsValid: boolean): void {
    this.feedback.set('');
    this.feedbackError.set(false);
    if (
      !formIsValid ||
      !this.fullName.trim() ||
      !this.email.trim() ||
      !this.phone.trim() ||
      !this.selectedService()
    ) {
      this.feedbackError.set(true);
      this.feedback.set('Completa los datos requeridos y acepta el uso de tu información.');
      return;
    }

    const service = this.selectedService();
    if (!service) {
      this.feedbackError.set(true);
      this.feedback.set('Selecciona un servicio disponible.');
      return;
    }

    const details = Object.fromEntries(
      service.fields
        .filter((field: ChurchServiceField) => this.details[field.key]?.trim())
        .map((field: ChurchServiceField) => [field.key, this.details[field.key].trim()]),
    );
    const request: ChurchServiceRequest = {
      serviceId: service.id,
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
      details,
      consentToDataProcessing: true,
    };

    this.submitting.set(true);
    this.repository.submit(request).subscribe({
      next: () => {
        this.feedback.set('Tu solicitud fue enviada. La Catedral se pondrá en contacto contigo.');
        this.submitting.set(false);
      },
      error: (error: unknown) => {
        this.feedbackError.set(true);
        this.feedback.set(
          error instanceof ChurchServiceRequestUnavailableError
            ? 'El envío aún no está habilitado. Tus datos no se transmitieron ni quedaron guardados.'
            : 'No pudimos confirmar el envío. Contacta a la Catedral antes de intentarlo de nuevo.',
        );
        this.submitting.set(false);
      },
    });
  }
}
