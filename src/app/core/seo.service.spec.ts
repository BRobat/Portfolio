import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let seo: SeoService;
  let meta: Meta;

  beforeEach(() => {
    seo = TestBed.inject(SeoService);
    meta = TestBed.inject(Meta);
  });

  it('sets title, description, canonical and absolute og:image', () => {
    seo.set({ title: 'SOLS', description: 'Sim', image: '/content/projects/sols/cover.png', path: '/projects/sols' });

    expect(TestBed.inject(Title).getTitle()).toBe('SOLS · Bart Robat');
    expect(meta.getTag("name='description'")?.content).toBe('Sim');
    expect(meta.getTag("property='og:image'")?.content).toBe('https://bartrobat.com/content/projects/sols/cover.png');
    const canonical = TestBed.inject(DOCUMENT).head.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe('https://bartrobat.com/projects/sols');
  });

  it('toggles noindex and clears og:image', () => {
    seo.set({ path: '/a', image: '/x.png', noindex: true });
    expect(meta.getTag("name='robots'")?.content).toBe('noindex');

    seo.set({ path: '/b' });
    expect(meta.getTag("name='robots'")).toBeNull();
    expect(meta.getTag("property='og:image'")).toBeNull();
  });
});
