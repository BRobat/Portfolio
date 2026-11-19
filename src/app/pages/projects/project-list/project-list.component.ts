import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../../../content/generated';
import { SeoService } from '../../../core/seo.service';

@Component({
  selector: 'app-project-list',
  imports: [RouterLink],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent {
  protected readonly projects = PROJECTS;

  constructor() {
    inject(SeoService).set({ title: 'Projects', path: '/projects' });
  }
}
