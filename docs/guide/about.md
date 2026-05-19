# 与 OreUI 的区别

本库从 OreUI 风格与 [Spectrollay-OreUI/OreUI](https://github.com/Spectrollay-OreUI/OreUI) 原始实现迁移而来，但定位不是直接复刻原项目结构，而是面向 Vue 3 的组件库封装。

| | Spectrollay-OreUI / 原始实现 | 本库（mcui-oreui） |
|---|---|---|
| 定位 | 原生 HTML/CSS/JS 风格实现 | Vue 3 + TypeScript 组件库 |
| 使用方式 | 依赖自定义元素与全局脚本 | 标准 Vue 组件、Props、事件、插槽、`v-model` |
| 状态管理 | 多处依赖 DOM / `localStorage` / id 约定 | 受控数据流，适合 Vue 应用集成 |
| 资源路径 | 依赖全局 `rootPath` | 由 Vite 打包字体与音效资源 |
| 音效 | 全局函数触发 | `useSound` / `playSound` / 全局开关 |
| 文档与类型 | 原始示例为主 | VitePress 实时 Demo + TypeScript 类型声明 |

- 本库保留 OreUI 风格中的像素字体、配色、立体按钮、面板、滚动条、弹窗等视觉体验。
- 本库去掉了面向原生页面的全局式用法，改为可组合、可按需导入、可类型检查的 Vue 组件。
- **非官方**：与 Mojang 工作室无任何从属关系，不含 Minecraft 官方代码或美术资产。MIT 许可。

::: tip 与官方 `Mojang/mc-ui` 的关系
官方 `Mojang/mc-ui` 仓库开源的是 `@react-facet` 等性能基础设施，不包含 Minecraft 界面外观；本库讨论的 OreUI 风格迁移与它不是同一个项目。
:::

## 迁移做了哪些现代化适配

保持视觉与交互行为不变，仅做工程化：

- 原 `customElements` Web Components → Vue 3 SFC
- 原 `localStorage` 按 id 持久化 → 标准 `v-model` 受控
- 原全局 `rootPath` 资源路径 → Vite 资源打包
- 原全局 `playSound` → `useSound` composable，音效随库打包
- 原 1700+ 行 CSS **直接复用**（仅修正字体路径），零视觉偏差
