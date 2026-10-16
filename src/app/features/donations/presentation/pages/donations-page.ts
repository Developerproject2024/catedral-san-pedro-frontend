import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-donations-page',
  template: `
    <section class="donations-hero">
      <div class="section-wrap donations-hero-inner">
        <p class="eyebrow"><span></span> Un gesto que sostiene nuestra comunidad</p>
        <h1>Tu generosidad<br /><em>mantiene viva la fe.</em></h1>
        <p>
          Con tu aporte ayudas a cuidar la Catedral San Pedro y a mantener sus
          espacios de oración y encuentro para toda la comunidad.
        </p>
        <a class="donations-learn-link" routerLink="/contacto">¿Tienes preguntas? Escríbenos <span aria-hidden="true">→</span></a>
      </div>
    </section>

    <section class="donations-content">
      <div class="section-wrap donations-layout">
        <div class="donations-message">
          <span class="donations-symbol" aria-hidden="true">✳</span>
          <p class="eyebrow"><span></span> Gracias por tu apoyo</p>
          <h2>Cada aporte, por pequeño que sea, ayuda a cuidar este lugar de encuentro.</h2>
          <p>
            Elige libremente un valor. Tu aporte es voluntario y no es necesario
            para visitar la Catedral ni participar de sus actividades.
          </p>
          <div class="donation-use-note">
            <strong>Con el servicio habilitado</strong>
            <span>Podrás realizar tu aporte mediante un medio de pago seguro.</span>
          </div>
        </div>

        <form class="donation-form" (ngSubmit)="requestDonation()">
          <p class="donation-form-eyebrow">Tu aporte</p>
          <h2>Elige un monto</h2>
          <fieldset class="donation-amount-options">
            <legend class="visually-hidden">Selecciona el monto de tu donación</legend>
            @for (amount of suggestedAmounts; track amount) {
              <label class="donation-amount-option" [class.is-selected]="selectedAmountCOP === amount && !isCustomAmount()">
                <input
                  type="radio"
                  name="donationAmount"
                  [checked]="selectedAmountCOP === amount && !isCustomAmount()"
                  (change)="selectAmount(amount)"
                />
                <span>{{ formatCOP(amount) }}</span>
              </label>
            }
            <label class="donation-amount-option" [class.is-selected]="isCustomAmount()">
              <input
                type="radio"
                name="donationAmount"
                [checked]="isCustomAmount()"
                (change)="selectCustomAmount()"
              />
              <span>Otro valor</span>
            </label>
          </fieldset>

          @if (isCustomAmount()) {
            <label class="donation-field-label" for="custom-donation-amount">Monto en pesos colombianos</label>
            <div class="donation-custom-input">
              <span>$</span>
              <input
                id="custom-donation-amount"
                name="customDonationAmount"
                type="number"
                min="1000"
                max="10000000"
                step="1000"
                [(ngModel)]="customAmountCOP"
                placeholder="Escribe el valor"
                required
              />
              <span>COP</span>
            </div>
          }

          <label class="donation-field-label" for="donor-name">Nombre (opcional)</label>
          <input
            class="donation-name-input"
            id="donor-name"
            name="donorName"
            type="text"
            maxlength="80"
            autocomplete="name"
            [(ngModel)]="donorName"
            placeholder="Tu nombre"
          />

          <div class="donation-unavailable" role="status">
            <span aria-hidden="true">ⓘ</span>
            <p>Los medios de pago aún no están habilitados. No se realizará ningún cobro.</p>
          </div>
          <button class="button button-primary donation-submit" type="submit">
            {{ submitMessage() ? 'Revisar aporte' : 'Continuar' }}
            <span aria-hidden="true">→</span>
          </button>
          @if (submitMessage()) {
            <p class="donation-submit-message" aria-live="polite">{{ submitMessage() }}</p>
          }
          <p class="donation-secure-note">Tu aporte será voluntario. No ingreses datos de tarjetas en este sitio.</p>
        </form>
      </div>
    </section>
  `,
})
export class DonationsPage {
  protected readonly suggestedAmounts = [10000, 20000, 50000];
  protected readonly submitMessage = signal('');
  protected selectedAmountCOP: number | null = 10000;
  protected customAmountCOP: number | null = null;
  protected donorName = '';

  protected isCustomAmount(): boolean {
    return this.selectedAmountCOP === null;
  }

  protected selectAmount(amount: number): void {
    this.selectedAmountCOP = amount;
    this.submitMessage.set('');
  }

  protected selectCustomAmount(): void {
    this.selectedAmountCOP = null;
    this.submitMessage.set('');
  }

  protected formatCOP(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  protected requestDonation(): void {
    const amount = this.selectedAmountCOP ?? this.customAmountCOP;
    if (amount === null || !Number.isInteger(amount) || amount < 1000 || amount > 10_000_000) {
      this.submitMessage.set('Ingresa un monto válido entre $ 1.000 y $ 10.000.000 COP.');
      return;
    }

    this.submitMessage.set(
      `Seleccionaste ${this.formatCOP(amount)}. El medio de pago todavía no está disponible y no se realizó ningún cobro.`,
    );
  }
}
