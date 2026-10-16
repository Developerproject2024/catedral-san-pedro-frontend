import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-page',
  template: `
    <section class="page-hero">
      <div class="section-wrap page-hero-inner">
        <p class="eyebrow"><span></span> Te esperamos</p>
        <h1>Ven a encontrarte<br /><em>con Buga.</em></h1>
        <p>
          Planea tu visita a la Catedral San Pedro Apóstol en Guadalajara de
          Buga, Valle del Cauca.
        </p>
      </div>
    </section>

    <section class="contact-page-section section-wrap">
      <div class="contact-information">
        <p class="eyebrow"><span></span> Información para tu visita</p>
        <h2>Estamos en<br /><em>Guadalajara de Buga.</em></h2>
        <p>
          La Catedral se encuentra en el centro de Guadalajara de Buga. Abre el
          mapa para ver la ubicación y organizar cómo llegar.
        </p>
        <div class="contact-detail">
          <span class="detail-icon" aria-hidden="true">⌖</span>
          <div><strong>Ubicación</strong><span>Guadalajara de Buga, Valle del Cauca, Colombia</span></div>
        </div>
        <div class="contact-detail">
          <span class="detail-icon" aria-hidden="true">◷</span>
          <div><strong>Horarios</strong><span>Consulta los horarios vigentes antes de tu visita.</span></div>
        </div>
        <a
          class="button button-primary"
          href="https://www.google.com/maps/search/?api=1&query=Catedral+San+Pedro+Buga"
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir ubicación en Google Maps <span aria-hidden="true">↗</span>
        </a>
      </div>

      <a
        class="contact-map"
        href="https://www.google.com/maps/search/?api=1&query=Catedral+San+Pedro+Buga"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ver Catedral San Pedro en Google Maps"
      >
        <span class="map-road road-one"></span>
        <span class="map-road road-two"></span>
        <span class="map-road road-three"></span>
        <span class="map-block block-one"></span>
        <span class="map-block block-two"></span>
        <span class="map-block block-three"></span>
        <span class="map-block block-four"></span>
        <span class="map-pin">
          <svg viewBox="0 0 32 40" fill="none"><path d="M16 37s12-13 12-22A12 12 0 1 0 4 15c0 9 12 22 12 22Z" /><path d="M16 10v10m-4-6h8" /></svg>
        </span>
        <span class="map-label">Catedral San Pedro · Ver mapa ↗</span>
      </a>
    </section>
  `,
})
export class ContactPage {}
