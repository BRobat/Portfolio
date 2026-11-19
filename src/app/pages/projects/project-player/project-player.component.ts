import { Component, computed, effect, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ProjectMeta } from '../../../content/content.model';
import { SeoService } from '../../../core/seo.service';

/** Fullscreen project iframe; the navbar is hidden via route data `immersive`. */
@Component({
  selector: 'app-project-player',
  imports: [RouterLink],
  template: `
    <iframe [src]="src()" [title]="project().title" allow="fullscreen; gamepad; xr-spatial-tracking" allowfullscreen></iframe>
    <a class="back" [routerLink]="['/projects', project().slug]" aria-label="Back to project">← back</a>
  `,
  styleUrl: './project-player.component.scss',
})
export class ProjectPlayerComponent {
  private readonly sanitizer = inject(DomSanitizer);
  /** Bound from the route resolver. */
  readonly project = input.required<ProjectMeta>();
  protected readonly src = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.project().iframe ?? ''));

  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      const p = this.project();
      seo.set({ title: p.title, description: p.summary, image: p.cover, path: `/projects/${p.slug}/play`, noindex: true });
    });
  }
}
