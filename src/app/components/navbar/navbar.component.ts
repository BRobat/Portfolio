import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';

/** Floating glass pill with the main section links. */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterLinkActive, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  protected readonly links = [
    { path: '/projects', label: 'projects' },
    { path: '/news', label: 'news' },
    { path: '/about', label: 'about' },
    { path: '/contact', label: 'contact' },
  ];

  private readonly router = inject(Router);

  /** `/` renders the projects list, so "projects" is highlighted there too. */
  protected readonly atRoot = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects.split(/[?#]/)[0] === '/'),
    ),
    { initialValue: this.router.url === '/' },
  );
}
