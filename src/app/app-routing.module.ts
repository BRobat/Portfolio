import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontPageComponent } from './pages/front-page/front-page.component';
import { SolsComponent } from './pages/sols/sols.component';
import { GalaxySimComponent } from './pages/galaxy-sim/galaxy-sim.component';
import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';

const routes: Routes = [
  { path:'', component : FrontPageComponent },
  { path:'sols', component: SolsComponent},
  { path:'galaxy-sim', component: GalaxySimComponent},
  { path: 'about', component: AboutComponent},
  { path: 'blog', component: BlogComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
