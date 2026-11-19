import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="content">
      <div class="title">
        <h2>Nothing here.</h2>
        <p><a routerLink="/projects">Back to projects</a></p>
      </div>
    </div>
  `,
  styles: `a { color: #0aa; }`,
})
export class NotFoundComponent {
  constructor() {
    inject(SeoService).set({ title: 'Not found', path: '/404', noindex: true });
  }
}
