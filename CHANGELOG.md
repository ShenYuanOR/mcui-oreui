# Changelog

All notable changes to this project are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [2.0.0] - 2026-07-31

### Added

- App-scoped Theme, Defaults, Locale, Display, Icons, Sounds, Overlay, Form, and Pop services through `createMcUI()`.
- Sixty-three public Vue 3 components with explicit component, composable, icon, sound, and style subpaths.
- SSR, hydration, accessibility, visual, interaction, consumer, size, and package-contract tests.

### Changed

- Component CSS now follows the component implementation and remains tree-shakeable.
- Built-in icons use validated structured SVG nodes instead of raw HTML strings.
- Utilities, fonts, sounds, and icon sets remain explicit opt-ins.

### Removed

- Unscoped `showPop`, `popState`, `playSound`, `playSoundType`, and `setSoundEnabled` root helpers.
- Legacy CSS, unused fonts and images, and the accidental `useTooltipFlip` subpath.

[Unreleased]: https://github.com/ShenYuanOR/mcui-oreui/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/ShenYuanOR/mcui-oreui/compare/v1.2.2...v2.0.0
