import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'Blog - Bart Robat',
      description: 'Thoughts and articles about web development, simulations, and technology.',
      keywords: 'blog, web development, programming, Angular, WebGL',
      url: 'https://bartrobat.com/blog',
    });
  }
}
