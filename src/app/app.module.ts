import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontPageComponent } from './pages/front-page/front-page.component';
import { SolsComponent } from './pages/sols/sols.component';
import { GalaxySimComponent } from './pages/galaxy-sim/galaxy-sim.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';
import { OrbitTraderComponent } from './pages/orbit-trader/orbit-trader.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { GlobalErrorHandler } from './services/error-handler.service';

@NgModule({
  declarations: [
    AppComponent,
    FrontPageComponent,
    SolsComponent,
    GalaxySimComponent,
    NavbarComponent,
    AboutComponent,
    BlogComponent,
    OrbitTraderComponent,
    NotFoundComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
  bootstrap: [AppComponent],
})
export class AppModule {}
