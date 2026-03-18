import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private projects: Project[] = [
    {
      id: 'mushroom-picking',
      title: 'Mushroom Picking demo',
      description: 'An early version of a very graphically unintensive game about picking mushrooms.',
      imagePath: '/assets/images/mushroom-picking.png',
      imageAlt: 'A pig',
      route: '/mushroom-picking',
    },
    {
      id: 'orbit-trader',
      title: 'Orbit Trader demo',
      description: 'A demo of a game with orbital movement as main mechanic. Currently on hold.',
      imagePath: '/assets/images/orbit-trader.png',
      imageAlt: 'Orbit Trader game screenshot showing orbital mechanics',
      route: '/orbit-trader',
    },
    {
      id: 'sols',
      title: 'SOLS',
      description:
        'A Simple Organism Life Simulator on a planet. Enjoy looking at the little creatures spreading and fighting over resources.',
      imagePath: '/assets/images/sols.png',
      imageAlt: 'SOLS simulation showing organisms on a planet',
      route: '/sols',
    },
    {
      id: 'galaxy-sim',
      title: 'Galaxy sim',
      description: 'Even simpler galaxy simulation written in threejs and making use of GPGPU.',
      imagePath: '/assets/images/galaxy-sim.png',
      imageAlt: 'Galaxy simulation visualization',
      route: '/galaxy-sim',
    },
  ];

  constructor() {}

  getProjects(): Observable<Project[]> {
    return of(this.projects);
  }

  getProjectById(id: string): Observable<Project | undefined> {
    return of(this.projects.find(project => project.id === id));
  }
}
