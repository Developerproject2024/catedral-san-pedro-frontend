import { Component, HostListener, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PRAYER_CANDLE_REPOSITORY } from '../../application/ports/prayer-candle.repository';
import { PrayerCandle } from '../../domain/entities/prayer-candle';
import { getCandleFlameLevel } from '../../domain/candle-flame-level';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-adoration-page',
  template: `
    <section class="adoration-hero">
      <div class="adoration-heading">
        <p class="adoration-eyebrow"><span></span> Un momento de encuentro</p>
        <h1>Adoración al<br /><em>Santísimo Sacramento</em></h1>
        <p class="adoration-lead">
          En la quietud, ponemos nuestra vida ante Jesús presente en la
          Eucaristía. Quédate un momento. Respira. Ora.
        </p>
      </div>

      <div class="chapel-scene" role="img" aria-label="Ilustración devocional de un altar con el Santísimo expuesto y velas encendidas">
        <div class="chapel-window"></div>
        <div class="chapel-halo"></div>
        <div class="chapel-cross" aria-hidden="true"></div>
        <div class="chapel-altar">
          <div class="altar-cloth"></div>
          <div class="monstrance" aria-hidden="true">
            <span class="monstrance-rays"></span>
            <span class="host"><span></span></span>
            <span class="monstrance-neck"></span>
            <span class="monstrance-base"></span>
          </div>
          <span class="altar-front"></span>
        </div>
        <div class="adoration-candles" aria-hidden="true">
          <div class="adoration-candle candle-left"><span class="candle-flame"></span><span class="candle-wick"></span><span class="candle-body"></span><span class="candle-holder"></span></div>
          <div class="adoration-candle candle-left-small"><span class="candle-flame"></span><span class="candle-wick"></span><span class="candle-body"></span><span class="candle-holder"></span></div>
          <div class="adoration-candle candle-right-small"><span class="candle-flame"></span><span class="candle-wick"></span><span class="candle-body"></span><span class="candle-holder"></span></div>
          <div class="adoration-candle candle-right"><span class="candle-flame"></span><span class="candle-wick"></span><span class="candle-body"></span><span class="candle-holder"></span></div>
        </div>
        <p class="chapel-caption">“Quédate con nosotros, Señor”</p>
      </div>
      <p class="adoration-note">
        <span aria-hidden="true">✳</span>
        Las velas de esta ilustración son decorativas. Si enciendes una vela en
        el templo, hazlo únicamente en los lugares dispuestos para ello.
      </p>
    </section>

    <section class="candle-prayer-section">
      <div class="section-wrap candle-prayer-layout">
        <div class="candle-prayer-intro">
          <p class="eyebrow"><span></span> Enciende una luz</p>
          <h2>Una vela, un nombre,<br /><em>una oración.</em></h2>
          <p>
            Elige una veladora disponible en la parrilla y escribe el nombre
            por quien deseas orar. Puedes ofrecerla por ti o por alguien que
            llevas en el corazón.
          </p>
          <p class="candle-visibility-note">
            Las velas permanecen solo durante esta sesión y no se comparten
            entre visitantes. Al cerrar o recargar la página, se borran.
          </p>
        </div>

        <div class="candle-prayer-panel">
          <div class="candle-modal-trigger">
            <p>Elige una veladora disponible para encomendar tu intención.</p>
            <button class="button button-primary" type="button" (click)="openFirstAvailableCandle()">
              Encender una vela <span aria-hidden="true">✳</span>
            </button>
          </div>
          @if (confirmationMessage()) {
            <p class="donation-confirmation" role="status">{{ confirmationMessage() }}</p>
          }
          @if (isCandleModalOpen()) {
            <div
              class="candle-modal-backdrop"
              (click)="closeCandleModal()"
              (keydown.escape)="closeCandleModal()"
            >
              <section
                class="candle-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="candle-modal-title"
                (click)="$event.stopPropagation()"
                (keydown.escape)="closeCandleModal()"
              >
                <button
                  class="candle-modal-close"
                  type="button"
                  aria-label="Cerrar formulario"
                  (click)="closeCandleModal()"
                >×</button>
                <p class="eyebrow"><span></span> Enciende una luz</p>
                <h2 id="candle-modal-title">Una vela, un nombre,<br /><em>una oración.</em></h2>
                <p class="selected-candle-slot">Has elegido la veladora {{ selectedSlot()! + 1 }}.</p>
                <form class="candle-prayer-form" (ngSubmit)="lightCandle()" #candleForm="ngForm">
                  <label for="prayer-name">Tu nombre</label>
                  <div class="candle-form-row">
                    <input
                      id="prayer-name"
                      name="prayerName"
                      type="text"
                      [(ngModel)]="name"
                      autocomplete="name"
                      maxlength="40"
                      placeholder="Escribe tu nombre"
                      required
                      autofocus
                    />
                  </div>
                  <fieldset class="donation-options">
                    <legend>¿Deseas ofrecer un aporte voluntario?</legend>
                    <p class="donation-description">
                      Elige un monto sugerido o continúa sin aporte. No hay medios
                      de pago habilitados, por lo que no se realizará ningún cobro.
                    </p>
                    <div class="donation-choices">
                      @for (option of donationOptions; track option.amountCOP) {
                        <label class="donation-choice" [class.is-selected]="donationAmountCOP === option.amountCOP">
                          <input
                            type="radio"
                            name="donationAmount"
                            [value]="option.amountCOP"
                            [checked]="donationAmountCOP === option.amountCOP"
                            (change)="donationAmountCOP = option.amountCOP"
                          />
                          <span>{{ option.label }}</span>
                        </label>
                      }
                    </div>
                    <p class="donation-payment-notice">
                      El monto es solo una preferencia: no se procesa ni se guarda
                      ninguna donación.
                    </p>
                  </fieldset>
                  <label class="public-name-consent">
                    <input
                      type="checkbox"
                      name="publicNameConsent"
                      [(ngModel)]="publicNameConsent"
                      required
                    />
                    <span>Entiendo que mi nombre aparecerá públicamente cuando se conecte el servicio compartido.</span>
                  </label>
                  <p class="form-message" aria-live="polite" [class.form-error]="errorMessage()">
                    {{ errorMessage() }}
                  </p>
                  <div class="candle-modal-actions">
                    <button class="button button-secondary" type="button" (click)="closeCandleModal()">Cancelar</button>
                    <button class="button button-primary" type="submit" [disabled]="candleForm.invalid">
                      Encender mi vela <span aria-hidden="true">✳</span>
                    </button>
                  </div>
                </form>
              </section>
            </div>
          }

          <div class="prayer-candle-wall">
            <div class="candle-wall-heading">
              <div>
                <p class="candle-wall-eyebrow">Oración encendida</p>
                <h3>Velas de la comunidad</h3>
              </div>
              <p class="candle-count" aria-live="polite" aria-atomic="true">
                <strong>{{ candles().length }}</strong>
                {{ candles().length === 1 ? 'encendida' : 'encendidas' }}
                <span aria-hidden="true">·</span>
                {{ candleSlots().length - candles().length }}
                {{ candleSlots().length - candles().length === 1 ? 'disponible' : 'disponibles' }}
              </p>
            </div>
            <p class="candle-wall-caption">Cada luz permanece encendida durante 24 horas.</p>
            <div class="prayer-candle-grid">
              @for (slot of candleSlots(); track slot) {
                @if (candleAt(slot); as candle) {
                  <article
                    class="prayer-candle is-lit"
                    [style.--life-remaining]="candleLife(candle)"
                    [style.--flame-drop]="flameDrop(candle)"
                    [attr.aria-label]="'Vela encendida por ' + candle.name + ', llama al ' + candleLife(candle) + ' por ciento, se apaga en ' + remainingTime(candle)"
                  >
                    <span class="prayer-candle-votive" aria-hidden="true">
                      <span class="prayer-candle-flame"></span>
                      <span class="prayer-candle-wick"></span>
                      <span class="prayer-candle-body"><span class="prayer-candle-wax"></span></span>
                      <span class="prayer-candle-holder"></span>
                    </span>
                    <span class="prayer-candle-name">{{ candle.name }}</span>
                  </article>
                } @else {
                  <button
                    class="prayer-candle is-unlit"
                    type="button"
                    [attr.aria-label]="'Elegir veladora disponible ' + (slot + 1)"
                    aria-haspopup="dialog"
                    (click)="openCandleModal(slot)"
                  >
                    <span class="prayer-candle-votive" aria-hidden="true">
                      <span class="prayer-candle-wick"></span>
                      <span class="prayer-candle-body"><span class="prayer-candle-wax"></span></span>
                      <span class="prayer-candle-holder"></span>
                    </span>
                    <span class="prayer-candle-empty-label">Disponible</span>
                  </button>
                }
              }
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="adoration-prayer section-wrap">
      <div class="prayer-intro">
        <p class="eyebrow"><span></span> Una guía para orar</p>
        <h2>Haz silencio.<br /><em>Él está aquí.</em></h2>
        <p>
          No necesitas palabras perfectas. Regálate este instante de presencia,
          gratitud y confianza ante Jesús Sacramentado.
        </p>
      </div>
      <ol class="prayer-steps">
        <li>
          <span>01</span>
          <div><h3>Entra en su presencia</h3><p>Respira lentamente. Reconoce que estás ante el Señor y déjale tus preocupaciones.</p></div>
        </li>
        <li>
          <span>02</span>
          <div><h3>Escucha en silencio</h3><p>Permanece unos minutos en quietud. Deja que el silencio también sea oración.</p></div>
        </li>
        <li>
          <span>03</span>
          <div><h3>Presenta tu oración</h3><p>Agradece, pide por quienes amas y encomienda a la comunidad de Buga.</p></div>
        </li>
      </ol>
    </section>

    <section class="adoration-closing">
      <div class="section-wrap adoration-closing-inner">
        <span class="closing-candle" aria-hidden="true"><span></span></span>
        <p>Quédate unos instantes.<br /><em>La oración continúa en tu corazón.</em></p>
        <a class="button button-light" routerLink="/contacto">Planea tu visita <span aria-hidden="true">→</span></a>
      </div>
    </section>
  `,
})
export class AdorationPage implements OnDestroy {
  private readonly prayerCandleRepository = inject(PRAYER_CANDLE_REPOSITORY);
  protected readonly candleBatchSize = 20;
  protected readonly candleSlots = signal(this.createSlots(this.candleBatchSize));
  protected readonly now = signal(Date.now());
  protected readonly donationOptions = [
    { amountCOP: 0, label: 'Sin aporte' },
    { amountCOP: 5000, label: '$ 5.000 COP' },
    { amountCOP: 10000, label: '$ 10.000 COP' },
    { amountCOP: 20000, label: '$ 20.000 COP' },
  ];

  protected name = '';
  protected publicNameConsent = false;
  protected donationAmountCOP = 0;
  protected readonly isCandleModalOpen = signal(false);
  protected readonly candles = signal<PrayerCandle[]>([]);
  protected readonly errorMessage = signal('');
  protected readonly confirmationMessage = signal('');
  protected readonly selectedSlot = signal<number | null>(null);
  private readonly refreshInterval = setInterval(() => {
    this.now.set(Date.now());
    void this.loadCandles();
  }, 60_000);

  constructor() {
    void this.loadCandles();
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshInterval);
  }

  @HostListener('document:visibilitychange')
  protected refreshWhenVisible(): void {
    if (document.visibilityState === 'visible') {
      this.now.set(Date.now());
      void this.loadCandles();
    }
  }

  protected openFirstAvailableCandle(): void {
    const availableSlot = this.candleSlots().find((slot) => !this.candleAt(slot));
    if (availableSlot !== undefined) {
      this.openCandleModal(availableSlot);
    }
  }

  protected openCandleModal(slotIndex: number): void {
    if (this.candleAt(slotIndex)) {
      return;
    }
    this.selectedSlot.set(slotIndex);
    this.name = '';
    this.publicNameConsent = false;
    this.donationAmountCOP = 0;
    this.errorMessage.set('');
    this.confirmationMessage.set('');
    this.isCandleModalOpen.set(true);
  }

  protected closeCandleModal(): void {
    this.isCandleModalOpen.set(false);
    this.selectedSlot.set(null);
    this.errorMessage.set('');
  }

  protected async lightCandle(): Promise<void> {
    const name = this.name.trim();
    this.errorMessage.set('');
    this.confirmationMessage.set('');

    if (name.length < 2 || name.length > 40) {
      this.errorMessage.set('Escribe un nombre de entre 2 y 40 caracteres.');
      return;
    }

    if (!this.publicNameConsent) {
      this.errorMessage.set('Confirma que comprendes que el nombre será público al habilitarse el servicio compartido.');
      return;
    }

    const selectedSlot = this.selectedSlot();
    if (selectedSlot === null || this.candleAt(selectedSlot)) {
      this.errorMessage.set('Elige una veladora que esté disponible.');
      return;
    }

    try {
      const currentCandles = await this.prayerCandleRepository.list();
      this.candles.set(currentCandles);
      if (currentCandles.some((candle) => candle.slotIndex === selectedSlot)) {
        this.errorMessage.set('Esa veladora ya fue encendida. Elige otra disponible.');
        return;
      }
      const candle = await this.prayerCandleRepository.create(name, selectedSlot);
      const nextCandles = [...currentCandles, candle].sort((a, b) => a.slotIndex - b.slotIndex);
      this.candles.set(nextCandles);
      if (nextCandles.length >= this.candleSlots().length && selectedSlot < this.candleSlots().length) {
        this.candleSlots.set(this.createSlots(this.candleSlots().length + this.candleBatchSize));
      }
      this.name = '';
      const donationMessage = this.donationAmountCOP
        ? `Elegiste un aporte voluntario de ${this.formatDonation(this.donationAmountCOP)}.`
        : 'Elegiste continuar sin aporte.';
      this.confirmationMessage.set(
        `Tu vela se encendió en esta sesión. ${donationMessage} No se realizó ningún cobro y el monto elegido no se guardó. La vela no está visible para otros visitantes.`,
      );
      this.donationAmountCOP = 0;
      this.publicNameConsent = false;
      this.isCandleModalOpen.set(false);
      this.selectedSlot.set(null);
    } catch {
      this.errorMessage.set('No se pudo registrar la vela. Inténtalo de nuevo.');
    }
  }

  private formatDonation(amountCOP: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amountCOP);
  }

  private async loadCandles(): Promise<void> {
    try {
      const candles = await this.prayerCandleRepository.list();
      this.candles.set(candles);
      const requiredSlotsForCount =
        (Math.floor(candles.length / this.candleBatchSize) + 1) * this.candleBatchSize;
      const highestSlot = candles.reduce((highest, candle) => Math.max(highest, candle.slotIndex), -1);
      const requiredSlotsForPosition =
        (Math.floor(highestSlot / this.candleBatchSize) + 1) * this.candleBatchSize;
      const requiredSlots = Math.max(
        this.candleBatchSize,
        requiredSlotsForCount,
        requiredSlotsForPosition,
      );
      if (requiredSlots > this.candleSlots().length) {
        this.candleSlots.set(this.createSlots(requiredSlots));
      }
    } catch {
      this.errorMessage.set('No se pudieron cargar las velas. Inténtalo de nuevo más tarde.');
    }
  }

  protected candleLife(candle: PrayerCandle): string {
    return String(getCandleFlameLevel(candle, this.now()) / 100);
  }

  protected candleLifePercent(candle: PrayerCandle): number {
    return getCandleFlameLevel(candle, this.now());
  }

  protected flameDrop(candle: PrayerCandle): string {
    return `${(1 - Number(this.candleLife(candle))) * 18}px`;
  }

  protected remainingTime(candle: PrayerCandle): string {
    const remainingMinutes = Math.max(0, Math.ceil((candle.expiresAt - this.now()) / 60_000));
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    if (minutes === 0) {
      return `${hours} h`;
    }
    return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
  }

  private createSlots(size: number): number[] {
    return Array.from({ length: size }, (_, index) => index);
  }

  protected candleAt(slotIndex: number): PrayerCandle | undefined {
    return this.candles().find((candle) => candle.slotIndex === slotIndex);
  }
}
