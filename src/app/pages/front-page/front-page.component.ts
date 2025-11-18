import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../../models/project.model';
import { ProjectsService } from '../../services/projects.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'rbt-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrontPageComponent implements OnInit {
  projects$!: Observable<Project[]>;

  constructor(
    private projectsService: ProjectsService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.projects$ = this.projectsService.getProjects();

    this.seoService.updateMetaTags({
      title: 'Bart Robat - Web Projects Library',
      description:
        'Portfolio of web development projects including simulations, games, and interactive experiences built with Angular, Three.js, and WebGL.',
      keywords: 'web development, Angular, Three.js, WebGL, simulations, portfolio',
      url: 'https://bartrobat.com/projects',
    });
  }
}
