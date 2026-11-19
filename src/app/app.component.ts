import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NavbarComponent, RouterOutlet],
})
export class AppComponent {
  title = 'Portfolio';

  private readonly router = inject(Router);

  /** True on routes with `data: { immersive: true }` (fullscreen project player). */
  protected readonly immersive = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => {
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) route = route.firstChild;
        return !!route.data['immersive'];
      }),
    ),
    { initialValue: false },
  );

}
