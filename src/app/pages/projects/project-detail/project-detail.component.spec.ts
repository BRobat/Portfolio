import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProjectDetailComponent } from './project-detail.component';
import { ProjectMeta } from '../../../content/content.model';

const meta: ProjectMeta = {
  slug: 'demo', title: 'Demo', summary: 'A demo', date: null, cover: null,
  draft: false, pinned: false, order: null, iframe: 'https://example.com',
};

describe('ProjectDetailComponent', () => {
  it('renders markdown and a launch link when the project has an iframe', () => {
    TestBed.configureTestingModule({ imports: [ProjectDetailComponent], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ProjectDetailComponent);
    fixture.componentRef.setInput('entry', { meta, html: '<p>Hello <b>world</b></p>' });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h2')?.textContent).toContain('Demo');
    expect(el.querySelector('.markdown b')?.textContent).toBe('world');
    expect(el.querySelector('a.launch')?.getAttribute('href')).toBe('/projects/demo/play');
  });
});
