import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private titleService: Title,
    private metaService: Meta
  ) {}

  updateMetaTags(config: SEOConfig): void {
    // Update title
    this.titleService.setTitle(config.title);

    // Update meta tags
    this.metaService.updateTag({ name: 'description', content: config.description });

    if (config.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Open Graph tags for social media
    this.metaService.updateTag({ property: 'og:title', content: config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.description });

    if (config.image) {
      this.metaService.updateTag({ property: 'og:image', content: config.image });
    }

    if (config.url) {
      this.metaService.updateTag({ property: 'og:url', content: config.url });
    }

    // Twitter Card tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: config.title });
    this.metaService.updateTag({ name: 'twitter:description', content: config.description });

    if (config.image) {
      this.metaService.updateTag({ name: 'twitter:image', content: config.image });
    }
  }
}
