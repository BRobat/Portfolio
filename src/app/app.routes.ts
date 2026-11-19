import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { NewsDetailComponent } from './pages/news/news-detail/news-detail.component';
import { NewsListComponent } from './pages/news/news-list/news-list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProjectDetailComponent } from './pages/projects/project-detail/project-detail.component';
import { ProjectListComponent } from './pages/projects/project-list/project-list.component';
import { ProjectPlayerComponent } from './pages/projects/project-player/project-player.component';
import { newsResolver, playableProjectResolver, projectResolver } from './content/content.resolvers';

export const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },

  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/:slug', component: ProjectDetailComponent, resolve: { entry: projectResolver } },
  {
    path: 'projects/:slug/play',
    component: ProjectPlayerComponent,
    resolve: { project: playableProjectResolver },
    data: { immersive: true },
  },

  { path: 'news', component: NewsListComponent },
  { path: 'news/page/:page', component: NewsListComponent },
  { path: 'news/:slug', component: NewsDetailComponent, resolve: { entry: newsResolver } },

  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },

  // Old URLs (also 301-redirected in firebase.json).
  { path: 'sols', redirectTo: 'projects/sols' },
  { path: 'galaxy-sim', redirectTo: 'projects/galaxy-sim' },
  { path: 'blog', redirectTo: 'news' },

  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];
