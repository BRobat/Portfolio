---
iframe: https://brobat.github.io/udrea/
---

# Ea-nasir's Copper Gazette

A news aggregator for copper, a meme, high quality.

![Ea-nasir's Copper Gazette](cover.png)



- **News:** copper headlines collected from RSS feeds (Google News queries and trade publications), filtered by keyword.
- **Charts:** copper and copper-miner price history with a 1M–5Y range picker, a crosshair and a table view.
- **Ticker:** COMEX copper futures and EUR/USD, with a "stale" badge when the latest fetch fails.

Browsers can't read RSS feeds or Yahoo Finance directly because of CORS, so a scheduled GitHub Action does the fetching and commits the results as JSON. The site itself is static and hosted on GitHub Pages.

Source: [github.com/BRobat/udrea](https://github.com/BRobat/udrea)
