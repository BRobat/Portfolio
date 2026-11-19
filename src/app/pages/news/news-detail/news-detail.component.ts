import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarkdownContentComponent } from '../../../components/markdown-content/markdown-content.component';
import { ContentEntry, projectsBySlugs } from '../../../content/content.resolvers';
import { NewsMeta } from '../../../content/content.model';
import { SeoService } from '../../../core/seo.service';

@Component({
  selector: 'app-news-detail',
  imports: [RouterLink, MarkdownContentComponent],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss',
})
export class NewsDetailComponent {
  /** Bound from the route resolver. */
  readonly entry = input.required<ContentEntry<NewsMeta>>();
  protected readonly post = computed(() => this.entry().meta);
  protected readonly projects = computed(() => projectsBySlugs(this.post().projects));

  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      const n = this.post();
      seo.set({ title: n.title, description: n.summary, image: n.cover, path: `/news/${n.slug}`, type: 'article' });
    });
  }
}
