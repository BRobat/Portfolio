import { Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Renders HTML produced at build time by scripts/build-content.mjs.
 * The content is authored by the site owner, so it is trusted (keeps iframes/embeds).
 */
@Component({
  selector: 'app-markdown-content',
  template: `<div class="markdown" [innerHTML]="safeHtml()"></div>`,
  styleUrl: './markdown-content.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MarkdownContentComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly html = input.required<string>();
  protected readonly safeHtml = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.html()));
}
