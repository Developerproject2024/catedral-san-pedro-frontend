import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PrayerRequestServiceUnavailableError } from '../../application/errors/prayer-request-service-unavailable.error';
import { PRAYER_REQUEST_REPOSITORY } from '../../application/ports/prayer-request.repository';
import { PrayerRequest } from '../../domain/entities/prayer-request';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-prayer-requests-page',
  template: `
    <section class="page-hero prayer-requests-hero">
      <div class="section-wrap page-hero-inner">
        <p class="eyebrow"><span></span> Oramos en comunidad</p>
        <h1>Comparte tu petición<br /><em>con confianza.</em></h1>
        <p>
          Déjanos tu intención de oración. Puedes acompañarla con un aporte voluntario; no es
          necesario para enviar tu petición.
        </p>
      </div>
    </section>

    <section class="prayer-requests-section section-wrap">
      <aside class="prayer-requests-intro">
        <span class="prayer-requests-symbol" aria-hidden="true">✳</span>
        <p class="eyebrow"><span></span> Una intención, una oración</p>
        <h2>Tu petición tiene<br /><em>un lugar aquí.</em></h2>
        <p>
          Completa el formulario para compartir tu intención con la comunidad de la Catedral. El
          aporte es completamente opcional y no se procesa ningún pago desde este formulario.
        </p>
        <div class="prayer-requests-note">
          <strong>Tu intención no se publicará en el sitio.</strong>
          <span>
            El formulario aún no está conectado a un servidor. Al enviarlo ahora, los datos no se
            transmiten ni quedan guardados.
          </span>
        </div>
        <a class="text-link" routerLink="/donaciones">
          Conoce otras formas de apoyar <span aria-hidden="true">→</span>
        </a>
      </aside>

      <form
        class="prayer-request-form"
        #requestForm="ngForm"
        (ngSubmit)="submitRequest(requestForm.valid === true)"
      >
        <p class="prayer-request-form-eyebrow">Formulario de intención</p>
        <h2>¿Por quién oramos?</h2>

        <label class="prayer-request-label" for="request-full-name">Nombre completo</label>
        <input
          class="prayer-request-input"
          id="request-full-name"
          name="fullName"
          type="text"
          autocomplete="name"
          maxlength="100"
          [(ngModel)]="fullName"
          required
          placeholder="Escribe tu nombre"
        />

        <div class="prayer-request-fields">
          <div>
            <label class="prayer-request-label" for="request-email">Correo electrónico</label>
            <input
              class="prayer-request-input"
              id="request-email"
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
            <label class="prayer-request-label" for="request-phone">Teléfono (opcional)</label>
            <input
              class="prayer-request-input"
              id="request-phone"
              name="phone"
              type="tel"
              autocomplete="tel"
              maxlength="30"
              [(ngModel)]="phone"
              placeholder="Número de contacto"
            />
          </div>
        </div>

        <label class="prayer-request-label" for="request-message">Tu petición de oración</label>
        <textarea
          class="prayer-request-input prayer-request-textarea"
          id="request-message"
          name="message"
          rows="5"
          maxlength="2000"
          [(ngModel)]="message"
          required
          placeholder="Comparte tu intención (máximo 2.000 caracteres)"
        ></textarea>

        <fieldset class="prayer-donation-options">
          <legend class="prayer-request-label">
            Elige un monto <span>(aporte voluntario, opcional)</span>
          </legend>
          @for (option of donationOptions; track option.value) {
            <label
              class="prayer-donation-option"
              [class.is-selected]="donationSelection === option.value"
            >
              <input
                type="radio"
                name="donation"
                [value]="option.value"
                [checked]="donationSelection === option.value"
                (change)="selectDonation(option.value)"
              />
              <span>{{ option.label }}</span>
            </label>
          }
        </fieldset>
        @if (donationSelection === 'custom') {
          <label class="prayer-request-label" for="request-custom-donation"
            >Valor en pesos colombianos</label
          >
          <input
            class="prayer-request-input prayer-request-custom-donation"
            id="request-custom-donation"
            name="customDonation"
            type="number"
            min="1000"
            max="10000000"
            step="1000"
            [(ngModel)]="customDonationAmountCOP"
            placeholder="Mínimo $ 1.000"
          />
        }
        <p class="prayer-request-payment-note">
          El aporte es voluntario. Los pagos todavía no están habilitados; no ingreses datos de
          tarjetas.
        </p>

        <label class="prayer-request-consent">
          <input type="checkbox" name="consent" [(ngModel)]="consentToDataProcessing" required />
          <span>
            Autorizo el uso de estos datos para gestionar mi petición y contactarme en relación con
            ella. Entiendo que la información no se enviará hasta que el servicio esté habilitado.
          </span>
        </label>

        <button
          class="button button-primary prayer-request-submit"
          type="submit"
          [disabled]="submitting()"
        >
          Enviar petición <span aria-hidden="true">→</span>
        </button>
        @if (submitMessage()) {
          <p
            class="prayer-request-feedback"
            [class.is-error]="submitError()"
            [attr.role]="submitError() ? 'alert' : 'status'"
            aria-live="polite"
          >
            {{ submitMessage() }}
          </p>
        }
      </form>
    </section>
  `,
})
export class PrayerRequestsPage {
  private readonly repository = inject(PRAYER_REQUEST_REPOSITORY);

  protected readonly donationOptions = [
    { value: 'none', label: 'Sin aporte' },
    { value: '10000', label: '$ 10.000' },
    { value: '20000', label: '$ 20.000' },
    { value: '50000', label: '$ 50.000' },
    { value: 'custom', label: 'Otro monto' },
  ];
  protected readonly submitting = signal(false);
  protected readonly submitMessage = signal('');
  protected readonly submitError = signal(false);
  protected fullName = '';
  protected email = '';
  protected phone = '';
  protected message = '';
  protected donationSelection = 'none';
  protected customDonationAmountCOP: number | null = null;
  protected consentToDataProcessing = false;

  protected selectDonation(value: string): void {
    this.donationSelection = value;
    this.submitMessage.set('');
  }

  protected submitRequest(formIsValid: boolean): void {
    this.submitMessage.set('');
    this.submitError.set(false);
    if (!formIsValid || !this.fullName.trim() || !this.email.trim() || !this.message.trim()) {
      this.submitError.set(true);
      this.submitMessage.set('Completa los campos requeridos y acepta el uso de tus datos.');
      return;
    }

    const donationAmountCOP = this.getDonationAmount();
    if (donationAmountCOP === false) {
      this.submitError.set(true);
      this.submitMessage.set('El aporte debe estar entre $ 1.000 y $ 10.000.000 COP.');
      return;
    }

    const request: PrayerRequest = {
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      ...(this.phone.trim() ? { phone: this.phone.trim() } : {}),
      message: this.message.trim(),
      ...(donationAmountCOP ? { donationAmountCOP } : {}),
      consentToDataProcessing: true,
    };

    this.submitting.set(true);
    this.repository.submit(request).subscribe({
      next: () => {
        this.submitMessage.set('Tu petición fue enviada. Gracias por compartirla con nosotros.');
        this.submitting.set(false);
      },
      error: (error: unknown) => {
        this.submitError.set(true);
        this.submitMessage.set(
          error instanceof PrayerRequestServiceUnavailableError
            ? 'El envío aún no está habilitado. Tus datos no se transmitieron ni quedaron guardados.'
            : 'No pudimos confirmar el envío. Para evitar duplicar tu petición, contacta a la Catedral antes de intentarlo de nuevo.',
        );
        this.submitting.set(false);
      },
    });
  }

  private getDonationAmount(): number | false | null {
    if (this.donationSelection === 'none') {
      return null;
    }
    if (this.donationSelection === 'custom') {
      return this.isValidDonation(this.customDonationAmountCOP)
        ? this.customDonationAmountCOP
        : false;
    }

    const amount = Number(this.donationSelection);
    return this.isValidDonation(amount) ? amount : false;
  }

  private isValidDonation(value: number | null): value is number {
    return value !== null && Number.isInteger(value) && value >= 1000 && value <= 10_000_000;
  }
}
