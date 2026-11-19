import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProjectPlayerComponent } from './project-player.component';

describe('ProjectPlayerComponent', () => {
  it('embeds the iframe with a back link to the project page', () => {
    TestBed.configureTestingModule({ imports: [ProjectPlayerComponent], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ProjectPlayerComponent);
    fixture.componentRef.setInput('project', {
      slug: 'demo', title: 'Demo', summary: '', date: null, cover: null, coverImage: null,
      draft: false, pinned: false, order: null, iframe: 'https://example.com/',
    });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('iframe')?.getAttribute('src')).toBe('https://example.com/');
    expect(el.querySelector('a.back')?.getAttribute('href')).toBe('/projects/demo');
  });
});
