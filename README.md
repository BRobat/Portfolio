# Portfolio

This is my portfolio/blog/cv/whatever page. You can check it here to see what bad practices I used or here: https://bartrobat.com/


## Development

```sh
npm start        # dev server + content watcher (drafts visible). Don't use `ng serve` directly.
npm run build    # production build: regenerates content without drafts, prerenders every page
npm test
firebase deploy
```

## Writing news and projects

Content lives in `content/` as Markdown, one folder per entry:

```
content/news/2026-11-19-hello-world/index.md   -> /news/hello-world (dated 2026-11-19)
content/news/2026-11-19-hello-world/photo.jpg
content/projects/sols/index.md                  -> /projects/sols
```

- **Title** = first heading (any level). **Summary** = first paragraph. **Preview image** = first image.
- Images/GIFs sit next to the `.md`: `![alt](photo.jpg)` or Obsidian's `![[photo.jpg]]`.
- Optional properties (frontmatter) override or add things:
  - all: `title`, `summary`, `cover`, `date`, `draft`
  - news: `project` — related project folder name(s), e.g. `project: [sols]`
  - projects: `pinned`, `order`, `iframe` (URL opened by the Launch button)
- `draft: true` shows only in `npm start`, never in production builds.
- With `npm start` running, saving a `.md` file updates the page automatically.
