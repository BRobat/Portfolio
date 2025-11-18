import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'rbt-sols',
  templateUrl: './sols.component.html',
  styleUrls: ['./sols.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolsComponent implements OnInit {
  windowHeight = window.innerHeight;

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'SOLS - Simple Organism Life Simulator',
      description:
        'A Simple Organism Life Simulator on a planet. Watch little creatures spread and fight over resources in this interactive simulation.',
      keywords: 'simulation, life simulator, organisms, game, Angular',
      url: 'https://bartrobat.com/sols',
    });
  }
}
