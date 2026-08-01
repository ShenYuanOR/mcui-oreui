# Changelog

All notable changes to this project are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [2.0.1] - 2026-08-01

### Added

- Vuetify-style Card compound components: `McCardItem`, `McCardTitle`, `McCardSubtitle`, `McCardText`, and `McCardActions`.

### Changed

- `McCard` now delegates header, text, and action layout to its public child components; named slots remain as compound-component shorthand.
- `McButton` loading state now uses a circular spinner while preserving its existing size and stepped rotation.
- `McPanel` is now a full-width workspace layout with fixed header/footer rows and a stretchable, independently scrollable body.
- `McDataTable` now preserves its measured body height while loading, accepts fixed pixel or row-count loading heights, presents page size as a compact dropdown, and renders a dedicated empty state.
- `McMenu` now owns its vertical menu-item layout and interaction styles instead of relying on demo-only CSS.
- `McTooltip` custom multi-line slot content now renders inside one continuous tooltip surface.
- `McConfirm` now uses `McDialog` body and action sections directly, restores its documented `body` Teleport default, and shares the Dialog documentation page.
- `McDialog` title styles now resist host heading rules when rendered without Teleport.
- VitePress now presents Vue examples in collapsed source panels with automatic JS, HTML, and CSS tabs, normalized indentation, syntax highlighting, and copy support.
- Component API tables now use a full-width, horizontally scrollable layout and document every public parameter with its type, default, and purpose.
- Global documentation messaging now focuses on this Vue component library; upstream attribution remains in the dedicated README and comparison page instead of the homepage and footer.

### Fixed

- `McSkeleton` now treats unitless string dimensions from template attributes as pixels instead of collapsing to zero height.
- Form documentation demos now constrain fixed-width controls, use shrinkable action columns, and restore the validation example's page state, preventing overflow and Vue render warnings.
- `McFileInput` now uses a dedicated full-surface button while keeping the native file input out of the tab order, preserving whole-area activation without nested interactive controls.
- `McConfirm` now styles its own action wrapper instead of reaching into `McDialog`'s private selectors.

### Removed

- `McPanel` `bordered` and `elevated` props; the Ore UI frame and section dividers are now its default layout appearance.

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
