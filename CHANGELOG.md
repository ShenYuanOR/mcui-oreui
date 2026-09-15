# Changelog

All notable changes to this project are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [2.0.1] - 2026-09-15

### Changed

- 开发线基准从已发布的 `2.0.0` 推进到 `2.0.1`，供 `next` 预发布 `2.0.1-dev.<run>`。
- README 与快速开始恢复文档站入口：<https://shenyuanor.github.io/mcui-oreui/>。

## [2.0.0] - 2026-09-15

### Added

- App-scoped Theme, Defaults, Locale, Display, Icons, Sounds, Overlay, Form, and Pop services through `createMcUI()`.
- Sixty-nine public Vue 3 components with explicit component, composable, icon, sound, and style subpaths.
- `McAvatar` for image, icon, and text avatars, with size presets, variants, rounding, and image fallback.
- Vuetify-style Card compound components: `McCardItem`, `McCardTitle`, `McCardSubtitle`, `McCardText`, and `McCardActions`.
- SSR, hydration, accessibility, visual, interaction, consumer, size, and package-contract tests.

### Changed

- Component CSS now follows the component implementation and remains tree-shakeable.
- Built-in icons use validated structured SVG nodes instead of raw HTML strings.
- Utilities, fonts, sounds, and icon sets remain explicit opt-ins.
- `McDataTable` selection now uses `McCheckbox` (including indeterminate header state) and page size uses `McSelect`.
- Display SSR 默认宽度改为 `md`（960）。未传 `ssrWidth` 时，hydration 前按中等断点计算，不再把未知宽度当成超窄屏。
- `useMcForm()` 只返回当前 `McForm` 祖先；`createMcUI()` 不再向整棵应用 provide 全局 Form。
- `registerMcIcons()` / `getMcIcon()` 优先使用当前 App 安装的图标服务。
- `McThemeProvider` 的 `name` 变化会同步局部主题键，而不是只在创建时求值一次。
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

- Overlay 快速开关不再把过期的滚动锁、焦点陷阱和定位监听套到已关闭的浮层上；Menu 用 Tab 关闭时不再把焦点抢回触发器。
- Snackbar / PopHost / Overlay 在客户端就绪前禁用 Teleport，避免 SSR 把内容挂到不存在的 `body`。
- 空数组 `errorMessages` 不再被当成错误；布尔必填只把 `true` 算已填。
- 异步校验与 `reset()` 竞态只采纳最后一次结果；挂载后捕获初值，reset 不再立刻重新校验。
- `McRadioGroup` 内的 `McRadio` 不再各自向 Form 注册；`McFileInput` 的类型错误进入 `rules` / `valid`。
- Autocomplete 失焦关闭不再打断选项点击；Select 空列表不再吞掉 Enter。
- List 任意项键盘与 roving tabindex；Tabs / Stepper 非法 `v-model` 不再伪装选中。
- VirtualScroll `itemHeight <= 0` 按 1px 处理；DataTable 对象选择键用 `Object.is` 比较。
- Tooltip 支持 Escape 与触摸关闭；Confirm 的 Escape / 遮罩关闭路径发出 `cancel`。
- Textarea `autoGrow` 跟随外部 `v-model`；SkinViewer 卸载后不再处理过期的 `Image.onload`。
- FileInput 在 `disabled` / `readonly` 时不进入拖放态。
- `McSkeleton` now treats unitless string dimensions from template attributes as pixels instead of collapsing to zero height.
- Form documentation demos now constrain fixed-width controls, use shrinkable action columns, and restore the validation example's page state, preventing overflow and Vue render warnings.
- `McFileInput` now uses a dedicated full-surface button while keeping the native file input out of the tab order, preserving whole-area activation without nested interactive controls.
- `McConfirm` now styles its own action wrapper instead of reaching into `McDialog`'s private selectors.

### Removed

- Unscoped `showPop`, `popState`, `playSound`, `playSoundType`, and `setSoundEnabled` root helpers.
- Legacy CSS, unused fonts and images, and the accidental `useTooltipFlip` subpath.
- `McPanel` `bordered` and `elevated` props; the Ore UI frame and section dividers are now its default layout appearance.

[Unreleased]: https://github.com/ShenYuanOR/mcui-oreui/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/ShenYuanOR/mcui-oreui/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/ShenYuanOR/mcui-oreui/compare/v1.2.2...v2.0.0
