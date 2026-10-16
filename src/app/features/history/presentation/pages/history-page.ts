import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-history-page',
  template: `
    <section class="page-hero history-hero">
      <div class="section-wrap page-hero-inner">
        <p class="eyebrow"><span></span> Memoria viva de Guadalajara de Buga</p>
        <h1>Una historia construida<br /><em>con fe y comunidad.</em></h1>
        <p>
          Desde la primera iglesia parroquial hasta su lugar como sede de la
          Diócesis, la historia de la Catedral acompaña la de la ciudad.
        </p>
      </div>
    </section>

    <section class="timeline-section section-wrap">
      <div class="timeline-intro">
        <p class="eyebrow"><span></span> Línea cronológica</p>
        <h2>Siglos de historia,<br /><em>un mismo encuentro.</em></h2>
        <p>
          Estos hitos resumen la historia documentada de la Iglesia Mayor de
          San Pedro. Algunas fechas corresponden al inicio o final de etapas
          constructivas, no a una única obra continua.
        </p>
      </div>

      <ol class="timeline">
        <li class="timeline-event">
          <span class="timeline-marker" aria-hidden="true"></span>
          <span class="timeline-date">Finales del siglo XVI · c. 1574</span>
          <div class="timeline-card">
            <span class="timeline-index">01</span>
            <h3>Los orígenes de la Iglesia Mayor</h3>
            <p>
              La parroquia matriz de Buga se establece durante la formación de
              la ciudad. La tradición histórica sitúa hacia 1574 el comienzo de
              la construcción de una primera iglesia de tierra pisada y techo
              pajizo.
            </p>
          </div>
        </li>
        <li class="timeline-event">
          <span class="timeline-marker" aria-hidden="true"></span>
          <span class="timeline-date">1616</span>
          <div class="timeline-card">
            <span class="timeline-index">02</span>
            <h3>Concluye la primera construcción</h3>
            <p>
              Se da por terminada aquella estructura inicial, que sirvió como
              iglesia parroquial de San Pedro y centro de la vida religiosa
              local.
            </p>
          </div>
        </li>
        <li class="timeline-event">
          <span class="timeline-marker" aria-hidden="true"></span>
          <span class="timeline-date">1766</span>
          <div class="timeline-card">
            <span class="timeline-index">03</span>
            <h3>Un sismo destruye el templo</h3>
            <p>
              Un movimiento sísmico destruye la iglesia que ocupaba el lugar.
              Tras la expulsión de los jesuitas, el edificio había quedado
              abandonado y había sido ampliado y ornamentado con el tiempo.
            </p>
          </div>
        </li>
        <li class="timeline-event">
          <span class="timeline-marker" aria-hidden="true"></span>
          <span class="timeline-date">1775 — 30 de diciembre de 1781</span>
          <div class="timeline-card">
            <span class="timeline-index">04</span>
            <h3>Reconstrucción de la iglesia</h3>
            <p>
              Nueve años después del sismo comienza la reconstrucción con apoyo
              económico de la Corona española. Los trabajos concluyen el 30 de
              diciembre de 1781.
            </p>
          </div>
        </li>
        <li class="timeline-event">
          <span class="timeline-marker" aria-hidden="true"></span>
          <span class="timeline-date">29 de junio de 1966</span>
          <div class="timeline-card">
            <span class="timeline-index">05</span>
            <h3>Se crea la Diócesis de Buga</h3>
            <p>
              El papa Pablo VI erige la Diócesis de Buga mediante la bula
              <em>Apostolico muneri</em>. La Iglesia Mayor de San Pedro pasa a
              ser su iglesia catedral y sede episcopal.
            </p>
          </div>
        </li>
        <li class="timeline-event">
          <span class="timeline-marker" aria-hidden="true"></span>
          <span class="timeline-date">Hoy</span>
          <div class="timeline-card">
            <span class="timeline-index">06</span>
            <h3>Un patrimonio vivo de la ciudad</h3>
            <p>
              La Catedral continúa acogiendo la oración, las celebraciones y la
              vida comunitaria, y forma parte del centro histórico de
              Guadalajara de Buga.
            </p>
          </div>
        </li>
      </ol>
    </section>

    <section class="history-note">
      <div class="section-wrap history-note-inner">
        <span aria-hidden="true">✳</span>
        <div>
          <p class="eyebrow eyebrow-light">Una historia que continúa</p>
          <h2>La próxima página también la escribimos juntos.</h2>
        </div>
        <a class="button button-light" routerLink="/contacto">
          Ven a conocernos <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>

    <section class="history-sources section-wrap" aria-label="Fuentes de referencia">
      <p>
        Fechas de referencia: reseña histórica de la Catedral de San Pedro y
        reseña histórica de la Diócesis de Buga.
      </p>
      <a href="https://es.wikipedia.org/wiki/Catedral_de_San_Pedro_(Buga)" target="_blank" rel="noopener noreferrer">
        Consultar referencias de la Catedral <span aria-hidden="true">↗</span>
      </a>
      <a href="https://es.wikipedia.org/wiki/Di%C3%B3cesis_de_Buga" target="_blank" rel="noopener noreferrer">
        Consultar referencias de la Diócesis <span aria-hidden="true">↗</span>
      </a>
    </section>
  `,
})
export class HistoryPage {}
