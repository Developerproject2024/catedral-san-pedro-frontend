import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { GospelVideo } from '../../domain/entities/gospel-video';
import { GOSPEL_VIDEO_REPOSITORY } from '../../application/ports/gospel-video.repository';
import { GospelReading } from '../../domain/entities/gospel-reading';
import { GOSPEL_READING_MOCK } from '../../infrastructure/data-sources/gospel-reading.mock';

@Component({
  imports: [RouterLink],
  selector: 'app-gospel-page',
  template: `
    <section class="gospel-hero">
      <div class="section-wrap gospel-hero-inner">
        <p class="eyebrow"><span></span> La Palabra nos acompaña</p>
        <h1>Evangelio<br /><em>del día.</em></h1>
        <p>Un espacio para leer, meditar y llevar la Palabra de Jesús a la vida cotidiana.</p>
      </div>
    </section>

    <section class="gospel-content">
      <article class="gospel-reading gospel-video-card">
        <div class="gospel-reading-heading">
          <span class="gospel-cross" aria-hidden="true">✝</span>
          <p class="gospel-date">
            @if (video()?.isSample) {
              Vista previa con datos de muestra
            } @else if (video()) {
              Publicado el {{ publishedDate() }}
            } @else {
              Video del día
            }
          </p>
        </div>
        <p class="gospel-label">Video de la Palabra</p>

        @if (loading()) {
          <p class="gospel-video-status" role="status">Cargando el video del día…</p>
        } @else if (error()) {
          <div class="gospel-video-status gospel-video-error" role="alert">
            <p>{{ error() }}</p>
            <button
              class="button button-primary gospel-video-link"
              type="button"
              (click)="loadVideo()"
            >
              Intentar de nuevo
            </button>
          </div>
        } @else if (video(); as todayVideo) {
          <h2>{{ todayVideo.title }}</h2>
          <p class="gospel-reference">Catedral San Pedro - Buga Valle · Facebook</p>
          @if (todayVideo.isSample) {
            <p class="gospel-sample-note">
              Este video es solo una muestra. Se reemplazará automáticamente cuando el backend esté
              conectado.
            </p>
          }
          @if (embedUrl()) {
            <div class="gospel-video-frame">
              <iframe
                [src]="embedUrl()"
                [title]="'Video de la Palabra: ' + todayVideo.title"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
          }
          <p class="gospel-update-note">
            Si el reproductor no carga, puedes abrir el video directamente en Facebook.
          </p>
          <a
            class="button button-primary gospel-video-link"
            [href]="todayVideo.facebookUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver video en Facebook <span aria-hidden="true">↗</span>
          </a>
        } @else {
          <h2>El video de hoy aún no está disponible</h2>
          <p class="gospel-update-note">
            Cuando la Catedral publique el video del día, aparecerá aquí.
          </p>
        }
      </article>

      <div class="gospel-main-column">
        <aside class="gospel-reflection">
          <p class="eyebrow"><span></span> Para meditar</p>
          <h2>Haz silencio.<br /><em>Abre el corazón.</em></h2>
          <p>
            Lee despacio. ¿Qué palabra te invita hoy a confiar, agradecer o acercarte a los demás?
          </p>
          <div class="gospel-prayer">
            <span aria-hidden="true">✳</span>
            <p>
              Señor Jesús, acompáñame para vivir tu Palabra con fe y compartirla con amor. Amén.
            </p>
          </div>
          <a class="text-link" routerLink="/contacto"
            >Comparte una intención de oración <span aria-hidden="true">→</span></a
          >
        </aside>

        <article class="gospel-reading gospel-scripture">
          <div class="gospel-reading-heading">
            <span class="gospel-cross" aria-hidden="true">✝</span>
            <p class="gospel-date">{{ readingDate() }}</p>
          </div>
          <p class="gospel-label">Evangelio</p>
          <h2>{{ reading.reference }}</h2>
          <p class="gospel-scripture-intro">Lectura del santo Evangelio según san Lucas</p>
          <div class="gospel-scripture-text">
            @for (verse of reading.verses; track verse.number) {
              <p>
                <sup>{{ verse.number }}</sup> {{ verse.text }}
              </p>
            }
          </div>
          <p class="gospel-scripture-ending">Palabra del Señor.</p>
          <p class="gospel-update-note">
            Texto de muestra en {{ reading.translation }}. Corresponde a la lectura litúrgica del
            {{ readingDate() }}; el contenido no se actualiza automáticamente.
            <a [href]="reading.sourceUrl" target="_blank" rel="noopener noreferrer"
              >Consultar la fuente ↗</a
            >
          </p>
        </article>

      </div>
    </section>
  `,
})
export class GospelPage implements OnInit {
  private readonly repository = inject(GOSPEL_VIDEO_REPOSITORY);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly reading: GospelReading = GOSPEL_READING_MOCK;
  protected readonly loading = signal(true);
  protected readonly video = signal<GospelVideo | null>(null);
  protected readonly error = signal('');
  protected readonly publishedDate = computed(() => {
    const publishedAt = this.video()?.publishedAt;
    return publishedAt
      ? new Intl.DateTimeFormat('es-CO', {
          dateStyle: 'long',
          timeZone: 'America/Bogota',
        }).format(new Date(publishedAt))
      : '';
  });
  protected readonly readingDate = computed(() =>
    new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'long',
      timeZone: 'America/Bogota',
    }).format(new Date(`${this.reading.liturgicalDate}T12:00:00-05:00`)),
  );
  protected readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const facebookUrl = this.video()?.facebookUrl;
    if (!facebookUrl || !this.isFacebookVideoUrl(facebookUrl)) {
      return null;
    }
    const url = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(facebookUrl)}&show_text=false&width=500`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  ngOnInit(): void {
    this.loadVideo();
  }

  protected loadVideo(): void {
    this.loading.set(true);
    this.error.set('');
    this.repository.getTodayVideo().subscribe({
      next: (todayVideo) => {
        this.video.set(todayVideo);
        this.loading.set(false);
      },
      error: () => {
        this.video.set(null);
        this.error.set('No pudimos cargar el video del día. Inténtalo de nuevo más tarde.');
        this.loading.set(false);
      },
    });
  }

  private isFacebookVideoUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return (
        url.protocol === 'https:' &&
        ['facebook.com', 'www.facebook.com'].includes(url.hostname) &&
        /^\/(?:reel\/|[^/]+\/videos\/)/.test(url.pathname)
      );
    } catch {
      return false;
    }
  }
}
