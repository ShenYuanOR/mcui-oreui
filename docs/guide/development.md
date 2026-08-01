# 2.0 开发指南

本文面向组件维护者，说明 mcui-oreui 2.x 的目录结构、实现约束、测试矩阵和发布前检查。组件使用方式请先阅读[快速开始](./getting-started)和[配置选项](./configuration)。

## 环境与初始化

- Node.js `>=20 <23`
- npm `10.8.2`（项目只维护 `package-lock.json`）
- Vue 3.5+

```bash
npm ci
npm run typecheck
npm test
npm run build
```

修改依赖后必须同步 lock：

```bash
npm install --package-lock-only
```

## 配置文件与生效范围

mcui-oreui 没有约定式的 `mcui.config.ts`。配置是否生效取决于它被哪个命令读取，或是否在应用启动时被显式导入和安装：

| 配置内容                                                          | 所在项目与推荐文件                                                              | 生效方式                                                    |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `createMcUI({ theme, defaults, locale, icons, sounds, display })` | **消费应用**的 `src/main.ts`，或 `src/plugins/mcui.ts`                          | 每个 App 创建一个实例，在 `mount()` 前执行 `app.use(mcui)`  |
| 组件必要 CSS                                                      | **本仓库**的 `src/components/*/style.css`                                       | 由组件 JS 入口静态导入，消费应用无需手工加载                |
| `styles/components.css`、`utilities.css`、`fonts.css`、`base.css` | **消费应用**的 `src/main.ts`                                                    | 仅在全量预加载、Utilities、字体或页面环境确有需要时显式导入 |
| `<mc-app>`                                                        | **消费应用**的根组件 `App.vue`                                                  | 在该组件子树应用主题变量和 Locale `dir`                     |
| 库多入口与 external                                               | **本仓库**的 `vite.config.ts`                                                   | `npm run build` 读取                                        |
| npm 子路径、peer、scripts                                         | **本仓库**的 `package.json`                                                     | npm、Node 和发布流程读取                                    |
| dist 内本地包元数据                                               | **本仓库**的 `scripts/write-dist-package.mjs`                                   | `npm run build` 在 Vite 构建后执行                          |
| 文档导航、base、VitePress 选项                                    | **本仓库**的 `docs/.vitepress/config.ts`                                        | `npm run docs:dev` / `docs:build` 读取                      |
| Vitest / Playwright                                               | **本仓库**的 `vitest.config.ts`、`vitest.workspace.ts` / `playwright.config.ts` | 对应测试命令读取                                            |

消费应用的推荐拆分方式：

```ts
// src/plugins/mcui.ts
import { createMcUI } from 'mcui-oreui'

export const mcui = createMcUI({
  locale: { locale: 'zh-CN', fallback: 'en' },
})
```

```ts
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { mcui } from './plugins/mcui'

createApp(App).use(mcui).mount('#app')
```

`src/plugins/mcui.ts` 只是便于维护的普通模块：若没有被 `src/main.ts` 导入，里面的配置不会执行。每个 Vue App 应共享一个插件实例，不要分别为 Theme、Icons 或 Sounds 多次调用 `app.use(createMcUI(...))`，也不要把同一插件实例安装到另一个 App。

## 目录结构

```text
src/
├─ components/       每组件一个目录：.vue、index.ts、style.css、component.css
│  ├─ McButton/      Button 实现、公共入口与专属样式
│  └─ _shared/       仅供组件实现共享的 TypeScript 类型/上下文
├─ composables/      公开 composable 与兼容能力
├─ framework/        Theme、Defaults、Locale、Display、Form、Overlay 等服务
├─ generated/        由组件目录生成的公共组件导出与插件注册表
├─ icons/            normal、key、x、all 显式 icon-set
├─ sounds/           可选声音资产入口
├─ styles/           component-core、中性共享层、生成式聚合、tokens、utilities、base
├─ utils/            图标注册和 Minecraft 格式化文本工具
└─ index.ts           createMcUI、全局组件、公共类型与工具导出
scripts/
├─ component-metadata.json  按组件键维护的描述、Props 与事件元数据
├─ public-entries.json      composable、icon、sound 与 style 显式子路径白名单
├─ generate-components.mjs 扫描 Mc* 目录并生成全部公共组件契约
└─ generate-icons.mjs      校验并生成安全结构化内置图标数据
tests/
├─ unit/             组件、axe 与 hydration 测试
├─ ssr/              Vue SSR renderer 测试
├─ e2e/              Playwright 浏览器交互测试
└─ fixtures/         消费端类型与 E2E 应用 fixture
```

`src/components/Mc*` 目录扫描结果是公共组件名称的唯一事实来源。`generate-components.mjs` 生成根组件导出、插件注册表、GlobalComponents、web-types 标签、显式 package exports、组件 CSS 依赖和全量聚合 CSS；`npm run check:generated` 会拒绝漂移。非组件入口只来自 `public-entries.json` 显式白名单，内部 `validation.ts` 等文件不会意外成为包子路径。

组件 SFC 实现模块静态导入 Core、中性共享层和本地 `style.css`，目录 `index.ts` 只负责公共导出。标准 `vite-plugin-lib-inject-css` 根据实现 chunk 写入静态 CSS import，不创建运行时 `<style>`，也不在 `generateBundle` 阶段正则改写构建代码；`cssCodeSplit` 保持开启，JS sourcemap 随包生成。

## 基础设施约定

`createMcUI()` 负责创建并注入以下服务：

- Theme：当前主题、颜色、变量和字体 CSS 变量。
- Defaults：全局默认 prop 与按组件默认 prop。
- Locale：消息、fallback、RTL 和 `dir`。
- Display：断点、移动端判断与 SSR 初始宽度。
- Icons：默认 icon set、别名与显式注册的图标集合。
- Sounds：开关、声音映射与播放 adapter。
- Overlay：叠层栈、z-index 和滚动锁计数。
- Form：当前 App 的字段注册、校验与重置状态。
- Pop：只读消息状态、显示/关闭方法及计时器资源。

服务实现放在 `src/framework/`，公开按需入口放在 `src/composables/`。可在 setup 中直接使用 `useMcTheme()`、`usePop()`、`useSound()` 等组合式 API；组件外通过创建时保存的 `mcui.services` 调用。未安装插件时，各服务按 `appContext` 提供 WeakMap fallback，禁止新增模块级可变业务状态。

插件统一在 `app.onUnmount()` 释放资源。Display 的浏览器监听必须引用计数；Overlay 栈按 App 隔离，但滚动锁和单调递增 z-index 由同一 `Document` 协调；Pop 的计时器/rAF、Sounds 的活动音频也必须由实例拥有并可释放。

涉及浏览器对象时必须满足 SSR 安全：

- setup 和服务创建阶段不得无条件访问 `window`、`document` 或 `HTMLElement`。
- DOM 监听放在 `onMounted()`，并在 `onBeforeUnmount()` 清理。
- 组件 ID 使用 Vue `useId()`，不要使用模块级递增计数器，否则 SSR 与 hydration ID 会不一致。
- Teleport 组件必须支持 `false` 或服务端安全降级。

## 样式分层

| 入口                         | 用途                                  | 约束                                                                                                                          |
| ---------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `styles/tokens.css`          | 主题变量                              | 只允许作用于 `.mc-theme`、`.mc-app`、`[data-mc-theme]`                                                                        |
| `styles/component-core.css`  | 内部组件核心层                        | 导入 Tokens，只放主题容器、无组件归属的基础规则与共享 motion；由每个组件实现模块独立导入                                      |
| `styles/shared/*.css`        | 中性结构共享层                        | 只能包含没有公共组件归属的类（当前如 `.mc-input`）；由实际渲染这些类的组件实现模块直接导入，禁止包含任何 `McX` 兄弟组件选择器 |
| `components/*/component.css` | 单组件布局、状态、交互和动画          | 只能包含当前组件自己的 `.mc-x`、`.mc-x__*`、`.mc-x--*` 选择器；不使用 `scoped`                                                |
| `styles/components.css`      | 生成式全量组件聚合入口                | 由 `scripts/generate-component-styles.mjs` 确定性生成；不得手改，不包含 Utilities                                             |
| `styles/utilities.css`       | 显式可选的 Vuetify 对等工具类         | 由 `scripts/generate-utilities.mjs` 生成；每个工具声明使用 `!important`，组件不得自动依赖                                     |
| `styles/fonts.css`           | Minecraft Ten / Seven / Five 字体声明 | 可选入口，默认组件样式不得自动导入                                                                                            |
| `styles/base.css`            | `.mc-page` 页面环境                   | 只允许显式 opt-in，不承担兼容视觉                                                                                             |

普通组件不得通过默认入口修改 `:root`、`html`、`body`、`*`、裸 `header/main/a/button`、宿主 `overflow` 或全局 `user-select`。组件内部元素可以使用原生标签，但对应 CSS 必须以组件根类开头，例如 `.mc-dialog__header button`。

新增样式时：

1. 类名使用 `mc-组件名__元素--状态`。
2. 优先使用 `--mc-*` token，不在新组件中复制整套硬编码色板。
3. 组件专属规则写入同目录 `component.css`；`style.css` 只聚合同目录的 `component.css`。Core、中性共享 CSS 和本地样式由 SFC 实现分别静态导入，不能通过 `style.css` 相互转引。
4. 修改组件目录或样式归属后运行 `npm run generate:components`，提交生成的 `styles/components.css`；Utilities 仍只由自己的生成器维护。
5. 文档站不得全局引入 `base.css`。Demo 需要保持在 `.mc-demo` / `.ore-demo` 范围内，避免污染 VitePress；完整视觉由文档主题显式导入 `fonts.css`。

如果 A 的模板真实渲染 B，应在 A 的 Vue/TypeScript 实现中从 `../McB` 导入 B，让 JS 依赖链自然携带 B 的入口样式；A 的 `component.css` 不得直接写 `.mc-b*`，共享 CSS 也不得同时收纳 A、B 的公共选择器。这样依赖方向始终由组件实现决定，不会出现 `A.css → B.css → A.css` 或 A 入口被错误标记为 B 样式资源。

## 新增或修改组件

实现组件时按以下顺序检查：

1. 优先使用原生 `button`、`input`、`textarea`、`a` 等语义元素。
2. 为 label、description、hint、error 和控件建立稳定 ID 关联。
3. 自定义复合控件实现完整键盘模型、禁用项跳过、Escape 和焦点行为。
4. 表单字段通过 `useMcValidation()` 接入 `McForm`，暴露 `validate()`、`reset()`、`resetValidation()`。
5. Overlay 类行为复用 `McOverlay`，不要在各组件中重新实现滚动锁或全局 Escape 监听。
6. 运行 `npm run generate:components`，由生成器同步根导出、插件注册、GlobalComponents、web-types 和 package exports；公开类型在组件入口导出。
7. 更新 `scripts/component-metadata.json`、README 和对应组件文档。
8. 为键盘、ARIA、事件次数、SSR 或 hydration 风险补充测试。

组件名称、根入口、编辑器类型和标签元数据的结构由生成器维护；描述、Props、事件和文档语义仍需人工维护。组合组件内部从兄弟目录公共入口导入组件（例如 `../McOverlay`）。构建契约会拒绝错误 CSS 依赖和 `component.css` 引用其他公共组件的选择器。

## 图标、声音与可选资产

核心入口和普通组件不得导入完整图标集、音频或字体二进制：

```ts
import { mcNormalIconSet } from 'mcui-oreui/icons/normal'
import { mcDefaultSounds } from 'mcui-oreui/sounds/default'
```

- 普通 Minecraft 图标放入 normal set。
- 键盘/手柄提示分别放入 key 或 x set。
- `icons/all` 只能作为使用方主动选择的聚合入口。
- 注册图标必须使用经过校验的 `McIconDefinition` 结构化 `svg/path/image` 节点；禁止原始 SVG 字符串、`v-html`、事件属性、脚本节点、外部图片 URL 和 `javascript:`。
- 声音资源只能由 `sounds/default` 或使用方 adapter 显式加载。
- Button、Icon、Container 和核心插件 fixture 中不得出现音频、字体或完整图标集标记。

## 测试矩阵

| 命令                          | 覆盖内容                                                         |
| ----------------------------- | ---------------------------------------------------------------- |
| `npm run format:check`        | Prettier、UTF-8/LF 与手写文件格式                                |
| `npm run lint`                | ESLint 9、Vue/TypeScript 与 Stylelint                            |
| `npm run check:generated`     | 组件、图标、Utilities、exports 与 web-types 生成漂移             |
| `npm run check:docs-examples` | 组件页实时 Demo 与完整 Vue SFC 源码的一一对应关系                |
| `npm run typecheck`           | SFC 与公共 TypeScript 类型                                       |
| `npm run test:coverage`       | Vitest、axe、SSR、hydration；语句/行/函数 90%，分支 85%          |
| `npm run build`               | 多入口 JS、静态 CSS import、声明文件、本地 dist 包及构建样式契约 |
| `npm run check:size`          | 消费端 tree-shaking、可选资产扫描、gzip 预算                     |
| `npm run test:consumer`       | 包子路径、GlobalComponents、web-types 相关声明                   |
| `npm run docs:build`          | VitePress 客户端和 SSR 文档构建                                  |
| `npm run test:e2e`            | 组件交互及文档 Drawer、搜索、目录、首页、404 和 axe 浏览器回归   |
| `npm audit --omit=dev`        | 运行时依赖漏洞                                                   |
| `npm run check:release`       | 全部检查、三浏览器 E2E、版本/CHANGELOG/pack 与运行时 audit       |

单组件 fixture 的 JS 预算为 25 KB gzip（不含 Vue 和显式可选资产），自动组件 CSS 预算为 30 KB gzip，组件与 Utilities 的完整可选组合预算为 60 KB gzip。

本地 Playwright 默认使用已安装的 Microsoft Edge；PR CI 安装 Chromium，`dev/main` 发布闸门安装 Chromium、Firefox 和 WebKit。若修改 Overlay、Select、Autocomplete、Tabs 或焦点行为，应同时更新 E2E fixture。

## 文档开发

```bash
npm run docs:dev
npm run docs:build
```

修改组件目录、公共元数据或共置样式后运行 `npm run generate:components`；修改内置 SVG 后运行 `npm run generate:icons`；修改工具类配置后运行 `npm run generate:utilities`。提交所有生成产物；`npm run build` 会先执行 `check:generated`。

### 文档主题架构

主题入口继续扩展 VitePress 默认主题以保留 Markdown、代码块与本地搜索能力，但 `docs/.vitepress/theme/DocsLayout.vue` 覆盖默认 `Layout`，用 `McApp → McLayout → McAppbar / McDrawer / McMain` 构建页面外壳。相关职责如下：

- `docs-navigation.ts` 是纯数据层，统一标准化 `themeConfig.sidebar`，并推导活动分组、面包屑与前后页；站内链接必须通过 `withBase()`，非 clean URL 构建还要保留 `.html` 后缀，确保 GitHub Project Pages 可直接打开。Appbar 中部不放重复的文档入口，右侧固定按“搜索、贡献者、GitHub”排列。
- `DocsSidebarTree.vue` 只渲染标准化后的分组和链接。桌面 Drawer 的展开状态保存在 `localStorage`；移动端使用 MCUI temporary Drawer 自带的遮罩、滚动锁、焦点陷阱和 Esc 行为，路由变化后关闭。
- `DocsOutline.vue` 消费 `page.headers` 的 H2/H3 数据，并用 `IntersectionObserver` 标记当前位置。`markdown.headers` 不得关闭，否则 SSR 页面数据不会包含目录；无 Observer 时链接仍必须可用。
- `docs-theme.css` 负责文档外壳、正文、表格、代码块、搜索弹窗和响应式视觉。断点固定为 `<960px` 临时 Drawer、`960–1279px` 常驻左栏加正文顶部目录、`>=1280px` 左栏加右侧 sticky 目录。

首页通过 `sidebar: false` 隐藏两侧栏；`layout: false` 页面只渲染 VitePress `Content`；404 由同一 Layout 根据 `page.isNotFound` 渲染。不要重新引入 `.VPNav*`、`.VPSidebar` 等默认外壳选择器，只有仍实际复用的 `VPNavBarSearch` / `VPLocalSearchBox` 可以保留针对性样式。

文档站不得全局导入 `src/styles/index.css` 或 `styles/base.css`。组件 Demo 继续限制在 `.mc-demo` / `.ore-demo`，`oreui-base.scoped.css` 的隔离契约不变；修改主题后至少运行 `npm run docs:build` 和 `npx playwright test tests/e2e/docs-layout.spec.ts`。

组件页采用“效果优先、源码紧随”的示例规范：

1. 每个示例使用独立的二级标题，标题后先放带 `mc-demo` class 的实时效果。
2. Demo 后的下一个内容块必须是 `vue` 代码块，中间不插入解释文字。
3. 源码必须是可独立复制的完整 SFC，至少包含 `<script setup lang="ts">` 与 `<template>`；状态、数据和事件处理不能依赖代码块外的隐藏实现。
4. 多状态组件按语义、尺寸、交互、校验或结构模式拆分展示；hover、focus、pressed 等瞬时状态交给实时交互，不伪造静态状态。
5. Props、Events、Slots 与实现说明放在相关示例之后。修改 Demo 后运行 `npm run check:docs-examples`，该检查还会比对实时模板与紧随其后的源码模板。
6. Props 表统一使用“名称、类型、默认、说明”四列，每个公开 Prop 独占一行并写明用途；无公开 Props 的组件应直接说明，不生成空表。参数表由 Markdown 渲染器自动撑满正文，窄屏时只在表格容器内横向滚动。

文档主题会把 `vue` 示例在构建时拆成 JS、HTML、CSS 三个标签，并放入默认收起的“示例代码”折叠面板；空代码段不会生成标签。示例源码仍写成完整 SFC，不要在 Markdown 中手工维护重复的标签或折叠结构。拆分后的代码统一使用 2 空格视觉缩进，保留 VitePress 的语法高亮与复制能力。

每次新增组件、prop、事件或行为时，同一轮必须更新：

- 对应的 `docs/components/*.md` Props、Events、Slots 与实时 Demo。
- `docs/components/overview.md` 和必要的侧边栏入口。
- `README.md` 的安装、迁移或组件能力说明。
- `web-types.json` 与全局组件声明。

## 分支与发布

发布由 CI 驱动：

1. 功能完成后先在本地执行 `npm run check:release`；PR CI 使用 Chromium 和可取消并发验证全部非发布契约。
2. 更新 `package.json` 版本并同步 `package-lock.json`。
3. 推送 `dev`，不可取消的 CI 通过三浏览器矩阵后发布唯一的开发版本到 `next`。
4. 在独立消费端安装 `mcui-oreui@next`，验证全局插件、按需组件、图标和基础样式。
5. 只有预览版确认后才推送 `main`，由同样的完整矩阵发布正式 `latest`；文档部署只在主分支完整验证成功后触发。

推送 `main` 会触发正式发布。日常开发、文档预览或普通验证不得把 `main` push 当作测试步骤。发布凭据只由 CI 管理，不要写入源码、文档、日志或 fixture。

## 提交前清单

- [ ] 公共 API、类型声明、web-types 与文档一致。
- [ ] 默认 CSS 没有新增宿主级选择器。
- [ ] 每个公共组件入口仍有静态 CSS import，Utilities 没有进入组件必要依赖。
- [ ] 新组件没有隐式打入完整 SVG、音频或字体资源。
- [ ] 键盘、ARIA、焦点、SSR 与 hydration 风险已有测试。
- [ ] `package.json` 与 `package-lock.json` 同步。
- [ ] 全部测试矩阵通过，运行时 audit 为 0。
- [ ] `npm pack --dry-run --json` 不包含本地状态、AI 配置或其他私有文件。
