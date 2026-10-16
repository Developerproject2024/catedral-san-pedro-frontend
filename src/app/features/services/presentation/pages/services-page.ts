import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-services-page',
  template: `
    <section class="page-hero">
      <div class="section-wrap page-hero-inner">
        <p class="eyebrow"><span></span> Acompañamos tu camino</p>
        <h1>Servicios para<br /><em>cada momento.</em></h1>
        <p>
          Celebraciones y espacios de oración forman parte de la vida de nuestra
          comunidad. Consulta los horarios vigentes antes de tu visita.
        </p>
      </div>
    </section>

    <section class="service-page-section">
      <div class="section-wrap">
        <div class="service-page-grid">
          <article class="service-page-card">
            <span class="service-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none"><path d="M16 3v9m-4-5h8M7 28V18l9-6 9 6v10M12 28v-6h8v6M7 19h18" /></svg>
            </span>
            <span class="service-number">01</span>
            <h2>Celebraciones</h2>
            <p>
              Encuentros para vivir la fe en comunidad y celebrar momentos
              importantes del camino espiritual.
            </p>
          </article>
          <article class="service-page-card">
            <span class="service-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none"><path d="M16 4v8m-4-4h8M9 28l2-12 5-3 5 3 2 12M11 19l5 3 5-3M13 28v-6m6 6v-6" /></svg>
            </span>
            <span class="service-number">02</span>
            <h2>Oración</h2>
            <p>
              Un lugar de silencio y recogimiento para hacer una pausa y
              encontrar un momento de paz.
            </p>
          </article>
          <article class="service-page-card">
            <span class="service-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none"><path d="M5 27h22M8 27V13l8-6 8 6v14M13 27v-8h6v8M5 13h22M16 3v7m-3-4h6" /></svg>
            </span>
            <span class="service-number">03</span>
            <h2>Vida sacramental</h2>
            <p>
              Acompañamiento en el camino de fe y en la preparación de los
              sacramentos.
            </p>
          </article>
          <a class="service-page-card adoration-service-card" routerLink="/adoracion">
            <span class="service-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none"><path d="M16 3v5m-9 7h18M10 15c0-5 2-8 6-8s6 3 6 8v8H10v-8Zm-3 8h18v4H7zM13 27v2m6-2v2" /></svg>
            </span>
            <span class="service-number">04</span>
            <h2>Adoración al Santísimo</h2>
            <p>
              Un espacio de silencio y oración ante Jesús presente en la
              Eucaristía.
            </p>
            <span class="service-card-link">Conoce este espacio <span aria-hidden="true">→</span></span>
          </a>
        </div>
        <div class="schedule-callout">
          <span aria-hidden="true">✳</span>
          <p>
            Los horarios de celebraciones y la disponibilidad de servicios
            pueden variar. Para confirmar información actualizada, contáctanos
            o acércate a la Catedral.
          </p>
          <a class="text-link" routerLink="/contacto">Ver contacto <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  `,
})
export class ServicesPage {}
