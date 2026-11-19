import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarkdownContentComponent } from '../../../components/markdown-content/markdown-content.component';
import { ContentEntry, relatedNews } from '../../../content/content.resolvers';
import { ProjectMeta } from '../../../content/content.model';
import { SeoService } from '../../../core/seo.service';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, MarkdownContentComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent {
  /** Bound from the route resolver. */
  readonly entry = input.required<ContentEntry<ProjectMeta>>();
  protected readonly project = computed(() => this.entry().meta);
  protected readonly news = computed(() => relatedNews(this.project().slug));

  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      const p = this.project();
      seo.set({ title: p.title, description: p.summary, image: p.cover, path: `/projects/${p.slug}` });
    });
  }
}
