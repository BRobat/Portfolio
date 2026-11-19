import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="content">
      <div class="title">
        <h1>Nothing here.</h1>
        <p><a class="pill" routerLink="/projects">Back to projects</a></p>
      </div>
    </div>
  `,
  })
export class NotFoundComponent {
  constructor() {
    inject(SeoService).set({ title: 'Not found', path: '/404', noindex: true });
  }
}
