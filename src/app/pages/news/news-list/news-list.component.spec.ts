import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NewsListComponent } from './news-list.component';

describe('NewsListComponent', () => {
  it('creates and falls back to page 1 for invalid page params', () => {
    TestBed.configureTestingModule({ imports: [NewsListComponent], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(NewsListComponent);
    fixture.componentRef.setInput('page', 'abc');
    fixture.detectChanges();
    expect((fixture.componentInstance as any).current()).toBe(1);
  });
});
