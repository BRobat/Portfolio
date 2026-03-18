import { Component } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-mushroom-picking',
  standalone: true,
  imports: [],
  templateUrl: './mushroom-picking.component.html',
  styleUrl: './mushroom-picking.component.scss'
})
export class MushroomPickingComponent {
  windowHeight = window.innerHeight;

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'Mushroom picking - cozy game about picking mushrooms',
      description:
        'A cozy game about picking mushrooms where you travel through woods searching for mushrroms which can be exchanged for items.',
      keywords: 'cozy mushrooms pig woods trees boars',
      url: 'https://bartrobat.com/mushroom-picking',
    });
  }
}
