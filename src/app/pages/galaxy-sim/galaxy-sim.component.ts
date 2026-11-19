import { Component } from '@angular/core';

@Component({
    selector: 'app-galaxy-sim',
    templateUrl: './galaxy-sim.component.html',
    styleUrls: ['./galaxy-sim.component.scss'],
    standalone: false
})
export class GalaxySimComponent {
  windowHeight = window.innerHeight;
}
