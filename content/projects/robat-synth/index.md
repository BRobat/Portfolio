---
iframe: https://brobat.github.io/Robat-synth/
---

# Robat Synth

A keyboard-driven, node-based synthesizer for live-coded, algorave-style performance, written in Rust.

![Robat Synth node graph](cover.png)

Sequencers, synths, filters, drive, delay, chorus and reverb are nodes you patch together with cables (loops allowed). Patterns use a Tidal-style mini-notation where one cycle is one bar, and everything is driven with Vim-style keys.

On the desktop it streams multichannel audio into Logic Pro: each `out` node writes to its own stereo pair, so every voice lands on its own track. The same engine is compiled to WebAssembly for the browser version, which has a touch UI for phones.

Source: [github.com/BRobat/Robat-synth](https://github.com/BRobat/Robat-synth)
