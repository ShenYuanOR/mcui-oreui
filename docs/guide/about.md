# 与官方 ore-ui 的区别

“Ore UI” 这个名字有两层含义，务必区分：

| | Mojang/ore-ui（官方） | 本库（mcui-oreui） |
|---|---|---|
| 性质 | 官方开源，仅含 `@react-facet` 状态管理库 | 第三方复刻的 **视觉组件库** |
| Minecraft 视觉资产 | ❌ 不包含 | ✅ 像素字体 / 配色 / 组件 |
| 技术栈 | React + TypeScript | Vue 3 + TypeScript |
| 来源 | github.com/Mojang/ore-ui | 移植自 github.com/Spectrollay-OreUI/OreUI |

- 官方仓库开源的是“引擎/工具层”（性能基础设施），**不含** Minecraft 界面外观。
- 本库的设计语言来自社区第三方项目 **Spectrollay-OreUI**，它用纯原生 HTML/CSS/JS
  复刻了基岩版 Ore UI 的观感。本库进一步把它迁移为 Vue 3 组件。
- **非官方**：与 Mojang 工作室无任何从属关系，不含 Minecraft 官方代码或美术资产。MIT 许可。

## 迁移做了哪些现代化适配

保持视觉与交互行为不变，仅做工程化：

- 原 `customElements` Web Components → Vue 3 SFC
- 原 `localStorage` 按 id 持久化 → 标准 `v-model` 受控
- 原全局 `rootPath` 资源路径 → Vite 资源打包
- 原全局 `playSound` → `useSound` composable，音效随库打包
- 原 1700+ 行 CSS **直接复用**（仅修正字体路径），零视觉偏差
