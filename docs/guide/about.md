# 与 OreUI 的区别

本库从 OreUI 风格与 [Spectrollay-OreUI/OreUI](https://github.com/Spectrollay-OreUI/OreUI) 原始实现迁移而来，本轮视觉固定对照 MIT revision [`0bf8f466`](https://github.com/Spectrollay-OreUI/OreUI/commit/0bf8f46655878da872e4ddfa03db9ac663212438)，但定位不是直接复刻原项目结构，而是面向 Vue 3 的组件库封装。

|            | Spectrollay-OreUI / 原始实现            | 本库（mcui-oreui）                          |
| ---------- | --------------------------------------- | ------------------------------------------- |
| 定位       | 原生 HTML/CSS/JS 风格实现               | Vue 3 + TypeScript 组件库                   |
| 使用方式   | 依赖自定义元素与全局脚本                | 标准 Vue 组件、Props、事件、插槽、`v-model` |
| 状态管理   | 多处依赖 DOM / `localStorage` / id 约定 | 受控数据流，适合 Vue 应用集成               |
| 资源路径   | 依赖全局 `rootPath`                     | 字体、图标与音效使用显式可选入口            |
| 音效       | 全局函数触发                            | App 作用域的 `useSound` / `mcui.services`   |
| 文档与类型 | 原始示例为主                            | VitePress 实时 Demo + TypeScript 类型声明   |

- 本库保留 OreUI 风格中的配色、像素描边、立体按钮、面板、滚动条与弹窗等视觉体验；像素字体保持可选。
- 本库去掉了面向原生页面的全局式用法，改为可组合、可按需导入、可类型检查的 Vue 组件。
- **非官方**：与 Mojang 工作室无任何从属关系，不含 Minecraft 官方代码或美术资产。MIT 许可。

::: tip 与官方 `Mojang/mc-ui` 的关系
官方 `Mojang/mc-ui` 仓库开源的是 `@react-facet` 等性能基础设施，不包含 Minecraft 界面外观；本库讨论的 OreUI 风格迁移与它不是同一个项目。
:::

## 迁移做了哪些现代化适配

在视觉原语基础上做 Vue 化与无障碍工程改造：

- 原 `customElements` Web Components → Vue 3 SFC
- 原 `localStorage` 按 id 持久化 → 标准 `v-model` 受控
- 原全局 `rootPath` 资源路径 → Vite 资源打包
- 原全局 `playSound` → App 作用域的 `useSound` 或 `mcui.services.sounds`，音效通过可选入口配置
- 原全局 CSS → 主题 Token、宿主隔离的组件样式与 `.mc-page` opt-in 页面环境
