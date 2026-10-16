import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-cathedral-page',
  template: `
    <section class="page-hero">
      <div class="section-wrap page-hero-inner">
        <p class="eyebrow"><span></span> Nuestra casa</p>
        <h1>La Catedral,<br /><em>corazón de Buga.</em></h1>
        <p>
          Un lugar de fe, encuentro y patrimonio para la comunidad de
          Guadalajara de Buga y para quienes nos visitan.
        </p>
      </div>
    </section>

    <section class="cathedral-content section-wrap">
      <div class="cathedral-image">
        <img
          src="/images/catedral-buga-fachada.jpg"
          alt="Fotografía de la fachada y la espadaña de la Catedral San Pedro de Buga"
          loading="lazy"
        />
        <a
          class="image-credit"
          href="https://commons.wikimedia.org/wiki/File:Fachada_de_la_Catedral_de_Buga,_Valle_del_Cauca,_Colombia.JPG"
          target="_blank"
          rel="noopener noreferrer"
        >
          Foto: Diego Carrejo Murillo · CC BY-SA 3.0
        </a>
      </div>
      <div class="cathedral-story">
        <p class="eyebrow"><span></span> Un espacio para todos</p>
        <h2>Fe que se vive<br /><em>en comunidad.</em></h2>
        <p>
          La Catedral San Pedro Apóstol forma parte de la vida espiritual de
          Guadalajara de Buga. Sus puertas reciben a personas que buscan un
          momento de oración, participan en celebraciones o desean conocer este
          lugar significativo de la ciudad.
        </p>
        <p>
          Te invitamos a visitarnos con respeto por quienes se encuentran en
          oración y a consultar los horarios de atención antes de planear tu
          recorrido.
        </p>
        <a class="button button-primary" routerLink="/contacto">
          Cómo visitarnos <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>

    <section class="cathedral-values">
      <div class="section-wrap value-grid">
        <article><span>01</span><h3>Fe</h3><p>Un espacio para vivir y compartir la espiritualidad.</p></article>
        <article><span>02</span><h3>Comunidad</h3><p>Un punto de encuentro para quienes hacen parte de Buga.</p></article>
        <article><span>03</span><h3>Patrimonio</h3><p>Un lugar representativo de la identidad de la ciudad.</p></article>
      </div>
    </section>
  `,
})
export class CathedralPage {}
