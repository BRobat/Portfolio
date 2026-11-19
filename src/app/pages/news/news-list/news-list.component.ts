import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NEWS, NEWS_PAGE_SIZE } from '../../../content/generated';
import { SeoService } from '../../../core/seo.service';

@Component({
  selector: 'app-news-list',
  imports: [RouterLink],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss',
})
export class NewsListComponent {
  /** Route param from `news/page/:page`; absent on `/news`. */
  readonly page = input<string>();

  protected readonly pageCount = Math.max(1, Math.ceil(NEWS.length / NEWS_PAGE_SIZE));
  protected readonly current = computed(() => {
    const n = Number(this.page() ?? 1);
    return Number.isInteger(n) && n >= 1 ? n : 1;
  });
  protected readonly items = computed(() =>
    NEWS.slice((this.current() - 1) * NEWS_PAGE_SIZE, this.current() * NEWS_PAGE_SIZE),
  );

  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      const page = this.current();
      seo.set(
        page === 1
          ? { title: 'News', path: '/news' }
          : { title: `News · page ${page}`, path: `/news/page/${page}` },
      );
    });
  }

  protected pageLink(page: number): string {
    return page <= 1 ? '/news' : `/news/page/${page}`;
  }
}
