import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'About Bart Robat - Web Developer',
      description:
        'Web developer specializing in Angular and WebGL, with a background in theoretical physics. Passionate about creating interactive simulations and visual experiences.',
      keywords: 'web developer, Angular developer, WebGL, Three.js, theoretical physics',
      url: 'https://bartrobat.com/about',
    });
  }
}
