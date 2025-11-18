import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-galaxy-sim',
  templateUrl: './galaxy-sim.component.html',
  styleUrls: ['./galaxy-sim.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalaxySimComponent implements OnInit {
  windowHeight = window.innerHeight;

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'Galaxy Simulator - Three.js GPGPU',
      description:
        'A galaxy simulation written in Three.js making use of GPGPU for high-performance particle rendering.',
      keywords: 'galaxy simulation, Three.js, GPGPU, WebGL, particles',
      url: 'https://bartrobat.com/galaxy-sim',
    });
  }
}
