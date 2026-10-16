import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupRegistrationUnavailableError } from '../../application/errors/group-registration-unavailable.error';
import { PARISH_GROUP_REPOSITORY } from '../../application/ports/parish-group.repository';
import { GroupRegistration } from '../../domain/entities/group-registration';
import { ParishGroup } from '../../domain/entities/parish-group';

@Component({
  imports: [FormsModule],
  selector: 'app-parish-groups-page',
  template: `
    <section class="page-hero parish-groups-hero">
      <div class="section-wrap page-hero-inner">
        <p class="eyebrow"><span></span> Comunidad parroquial</p>
        <h1>Crezcamos juntos<br /><em>en comunidad.</em></h1>
        <p>
          Encuentra un grupo para compartir tus dones, fortalecer tu fe y caminar junto a otras
          personas de la parroquia.
        </p>
      </div>
    </section>

    <section class="parish-groups-section section-wrap">
      <div class="parish-groups-heading">
        <div>
          <p class="eyebrow"><span></span> Hay un lugar para ti</p>
          <h2>Conoce nuestros <em>grupos.</em></h2>
        </div>
        <p>
          El catálogo es de muestra. La parroquia confirmará actividades, horarios, edades y
          disponibilidad antes de tu incorporación.
        </p>
      </div>

      @if (loading()) {
        <p class="parish-groups-status" role="status">Cargando grupos parroquiales…</p>
      } @else if (loadError()) {
        <div class="parish-groups-status is-error" role="alert">
          <p>{{ loadError() }}</p>
          <button class="text-link" type="button" (click)="loadGroups()">Intentar de nuevo</button>
        </div>
      } @else {
        <div class="parish-group-grid">
          @for (group of groups(); track group.id; let index = $index) {
            <article class="parish-group-card">
              <span class="parish-group-number">{{ (index + 1).toString().padStart(2, '0') }}</span>
              <p class="parish-group-category">{{ group.category }}</p>
              <h3>{{ group.name }}</h3>
              <p class="parish-group-description">{{ group.description }}</p>
              <p class="parish-group-meeting"><span aria-hidden="true">◷</span> {{ group.meetingInfo }}</p>
              <button
                class="parish-group-select"
                type="button"
                (click)="openRegistration(group.id, $event)"
              >
                Me interesa <span aria-hidden="true">→</span>
              </button>
            </article>
          }
        </div>
      }

      <div class="parish-registration-cta" id="inscripcion">
        <div>
          <p class="eyebrow"><span></span> Da el primer paso</p>
          <h2>¿Te gustaría participar?</h2>
          <p>Elige un grupo y pulsa “Me interesa” para dejar tus datos.</p>
        </div>
      </div>

      @if (registrationModalOpen()) {
        <div
          class="parish-modal-backdrop"
          (click)="onModalBackdropClick($event)"
          (keydown.escape)="closeRegistrationModal()"
        >
          <section
            class="parish-registration-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="parish-modal-title"
            aria-describedby="parish-modal-description"
            (keydown)="trapModalFocus($event)"
          >
            <div class="parish-modal-heading">
              <div>
                <p class="church-service-form-eyebrow">Formulario de interés</p>
                <h2 id="parish-modal-title">Inscripción: {{ selectedGroup()?.name }}</h2>
              </div>
              <button
                class="parish-modal-close"
                type="button"
                aria-label="Cerrar formulario"
                (click)="closeRegistrationModal()"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <p class="parish-modal-description" id="parish-modal-description">
              Déjanos tus datos y una persona de la parroquia se pondrá en contacto contigo para
              orientarte sobre este grupo.
            </p>
            <div class="church-service-notice parish-modal-notice">
              <strong>Esto no confirma tu inscripción.</strong>
              <span>
                Mientras el backend no esté habilitado, tus datos no se transmiten ni guardan. La
                participación y los horarios deben ser confirmados por la parroquia.
              </span>
            </div>

            <form
              class="parish-registration-form"
              #groupRegistrationForm="ngForm"
              (ngSubmit)="submitRegistration(groupRegistrationForm.valid === true)"
            >
              <label class="church-service-label" for="group-full-name">Nombre completo</label>
              <input
                class="church-service-input"
                id="group-full-name"
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
                  <label class="church-service-label" for="group-email">Correo electrónico</label>
                  <input
                    class="church-service-input"
                    id="group-email"
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
                  <label class="church-service-label" for="group-phone">Teléfono</label>
                  <input
                    class="church-service-input"
                    id="group-phone"
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

              <label class="church-service-label" for="group-message">
                Cuéntanos algo más <span>(opcional)</span>
              </label>
              <textarea
                class="church-service-input church-service-textarea"
                id="group-message"
                name="message"
                maxlength="1000"
                [(ngModel)]="message"
                placeholder="Comparte brevemente tu interés o experiencia"
              ></textarea>

              <label class="church-service-consent">
                <input type="checkbox" name="consent" [(ngModel)]="consent" required />
                <span>
                  Autorizo el uso de mis datos para que la parroquia se ponga en contacto conmigo.
                  Aún no se enviarán mientras el backend no esté habilitado.
                </span>
              </label>

              <button
                class="button button-primary church-service-submit"
                type="submit"
                [disabled]="submitting()"
              >
                Enviar mi interés <span aria-hidden="true">→</span>
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
            </form>
          </section>
        </div>
      }
    </section>
  `,
})
export class ParishGroupsPage implements OnInit {
  private readonly repository = inject(PARISH_GROUP_REPOSITORY);

  protected readonly groups = signal<ParishGroup[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadError = signal('');
  protected readonly submitting = signal(false);
  protected readonly feedback = signal('');
  protected readonly feedbackError = signal(false);
  protected readonly registrationModalOpen = signal(false);
  protected selectedGroupId = '';
  protected fullName = '';
  protected email = '';
  protected phone = '';
  protected message = '';
  protected consent = false;
  private modalOpener: HTMLElement | null = null;

  protected selectedGroup(): ParishGroup | undefined {
    return this.groups().find((group) => group.id === this.selectedGroupId);
  }

  ngOnInit(): void {
    this.loadGroups();
  }

  protected loadGroups(): void {
    this.loading.set(true);
    this.loadError.set('');
    this.repository.listGroups().subscribe({
      next: (groups) => {
        this.groups.set(groups);
        this.loading.set(false);
      },
      error: () => {
        this.groups.set([]);
        this.loading.set(false);
        this.loadError.set('No pudimos cargar los grupos. Inténtalo de nuevo más tarde.');
      },
    });
  }

  protected openRegistration(groupId: string, event: MouseEvent): void {
    this.modalOpener = event.currentTarget as HTMLElement;
    this.selectedGroupId = groupId;
    this.feedback.set('');
    this.feedbackError.set(false);
    this.registrationModalOpen.set(true);
    setTimeout(() => document.getElementById('group-full-name')?.focus());
  }

  protected closeRegistrationModal(): void {
    this.registrationModalOpen.set(false);
    this.modalOpener?.focus();
    this.modalOpener = null;
  }

  protected onModalBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeRegistrationModal();
    }
  }

  protected trapModalFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }
    const dialog = event.currentTarget as HTMLElement;
    const focusable = dialog?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
    );
    if (!focusable?.length) {
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  protected submitRegistration(formIsValid: boolean): void {
    this.feedback.set('');
    this.feedbackError.set(false);
    if (!formIsValid || !this.fullName.trim() || !this.email.trim() || !this.phone.trim()) {
      this.feedbackError.set(true);
      this.feedback.set('Completa los datos requeridos y autoriza el uso de tu información.');
      return;
    }

    const group = this.selectedGroup();
    if (!group) {
      this.feedbackError.set(true);
      this.feedback.set('Selecciona un grupo disponible desde la lista de grupos.');
      return;
    }

    const request: GroupRegistration = {
      groupId: this.selectedGroupId,
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
      message: this.message.trim(),
      consentToDataProcessing: true,
    };

    this.submitting.set(true);
    this.repository.register(request).subscribe({
      next: () => {
        this.feedback.set('Tu interés fue enviado. La parroquia se pondrá en contacto contigo.');
        this.submitting.set(false);
      },
      error: (error: unknown) => {
        this.feedbackError.set(true);
        this.feedback.set(
          error instanceof GroupRegistrationUnavailableError
            ? 'La inscripción aún no está habilitada. Tus datos no se transmitieron ni quedaron guardados.'
            : 'No pudimos confirmar el envío. Contacta a la parroquia antes de intentarlo de nuevo.',
        );
        this.submitting.set(false);
      },
    });
  }
}
