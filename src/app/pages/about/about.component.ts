import { Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
    selector: 'app-about',
    imports: [],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent {
  constructor() {
    inject(SeoService).set({
      title: 'About',
      description: "Hi, I'm Bart — a web developer focused on Angular, WebGL and Three.js simulations.",
      path: '/about',
    });
  }
}
