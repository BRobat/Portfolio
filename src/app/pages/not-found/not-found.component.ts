import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: '404 - Page Not Found | Bart Robat',
      description: 'The page you are looking for does not exist.',
      url: 'https://bartrobat.com',
    });
  }
}
