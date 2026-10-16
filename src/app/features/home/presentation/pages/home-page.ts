import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-home-page',
  template: `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> Un lugar de fe en el corazón de Buga</p>
        <h1>Un hogar para la fe, <em>un encuentro para todos.</em></h1>
        <p class="hero-description">
          Te damos la bienvenida a la Catedral San Pedro Apóstol. Un espacio de
          oración, historia y comunidad en Guadalajara de Buga.
        </p>
        <div class="hero-actions">
          <a class="button button-primary" routerLink="/servicios">
            Conoce nuestros servicios <span aria-hidden="true">→</span>
          </a>
          <a class="text-link" routerLink="/catedral">Descubre la Catedral</a>
        </div>
        <div class="hero-note">
          <span class="note-icon" aria-hidden="true">✳</span>
          <span>Un espacio abierto para la comunidad y sus visitantes.</span>
        </div>
      </div>
      <div class="hero-art">
        <div class="art-label"><span></span> Guadalajara de Buga · Valle del Cauca</div>
        <img
          src="/images/catedral-buga-exterior.jpg"
          alt="Vista exterior de la Catedral San Pedro Apóstol de Buga"
          fetchpriority="high"
        />
        <div class="art-caption">
          <span class="caption-rule"></span>
          <span>Fe que reúne.<br /><strong>Historia que permanece.</strong></span>
        </div>
        <a
          class="photo-credit"
          href="https://commons.wikimedia.org/wiki/File:La_Catedral_de_Buga,_Iglesia_de_San_Pedro..JPG"
          target="_blank"
          rel="noopener noreferrer"
        >
          Foto: Hernán Ordóñez Valverde · CC BY-SA 3.0
        </a>
      </div>
    </section>

    <section class="welcome-strip" aria-label="Bienvenida">
      <p>UN LUGAR PARA <span>PAUSAR</span></p>
      <span class="strip-star" aria-hidden="true">✳</span>
      <p>UN LUGAR PARA <span>COMPARTIR</span></p>
      <span class="strip-star" aria-hidden="true">✳</span>
      <p>UN LUGAR PARA <span>ENCONTRARTE</span></p>
    </section>

    <section class="home-intro section-wrap">
      <div>
        <p class="eyebrow"><span></span> Nuestra casa</p>
        <h2>Conoce un lugar<br /><em>que nos une.</em></h2>
      </div>
      <div>
        <p>
          En el corazón de Guadalajara de Buga, la Catedral recibe a quienes
          llegan a orar, celebrar su fe o descubrir el patrimonio espiritual de
          la ciudad.
        </p>
        <a class="text-link" routerLink="/catedral">Conoce la Catedral <span aria-hidden="true">→</span></a>
      </div>
    </section>

    <section class="daily-gospel-promo">
      <div class="section-wrap daily-gospel-promo-inner">
        <span class="daily-gospel-icon" aria-hidden="true">✝</span>
        <div>
          <p class="eyebrow"><span></span> Un momento para la Palabra</p>
          <h2>Haz una pausa.<br /><em>Escucha el Evangelio de hoy.</em></h2>
          <p>Encuentra la cita del día, una reflexión y el enlace a la publicación de nuestra comunidad.</p>
        </div>
        <a class="button button-primary" routerLink="/evangelio">
          Leer el Evangelio <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>

    <section class="home-visit">
      <div class="section-wrap home-visit-inner">
        <div>
          <p class="eyebrow eyebrow-light"><span></span> Te esperamos</p>
          <h2>Tu camino te trae a <em>Buga.</em></h2>
        </div>
        <a class="button button-light" routerLink="/contacto">
          Información para tu visita <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  `,
})
export class HomePage {}
