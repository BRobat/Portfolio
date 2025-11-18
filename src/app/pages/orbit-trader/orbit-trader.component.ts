import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-orbit-trader',
  templateUrl: './orbit-trader.component.html',
  styleUrls: ['./orbit-trader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrbitTraderComponent implements OnInit {
  windowHeight = window.innerHeight;

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'Orbit Trader Demo - Orbital Mechanics Game',
      description:
        'Demo of an upcoming game with orbital movement as the main mechanic. Experience realistic space physics.',
      keywords: 'game, orbital mechanics, space game, simulation, demo',
      url: 'https://bartrobat.com/orbit-trader',
    });
  }
}
