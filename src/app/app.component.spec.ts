import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

@Component({ template: '' })
class DummyComponent {}

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([
          { path: 'page', component: DummyComponent },
          { path: 'play', component: DummyComponent, data: { immersive: true } },
        ]),
      ],
    });
  });

  it('hides the navbar on immersive routes', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    const el = fixture.nativeElement as HTMLElement;

    await router.navigateByUrl('/page');
    fixture.detectChanges();
    expect(el.querySelector('app-navbar')).not.toBeNull();

    await router.navigateByUrl('/play');
    fixture.detectChanges();
    expect(el.querySelector('app-navbar')).toBeNull();
  });
});
