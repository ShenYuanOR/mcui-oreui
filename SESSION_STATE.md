# SESSION_STATE

> 当前权威快照：2026-07-31（VitePress 文档站 MCUI 全沉浸重构完成且全矩阵通过）。本区块优先于后面的历史归档。

## [当前进度]（文档主题架构权威快照）

- 已使用自定义 `DocsLayout` 覆盖 VitePress 默认外壳，同时保留 Markdown、路由、本地搜索、Shiki、SSR 和静态构建；页面结构由 `McApp → McLayout → McAppbar / McDrawer / McMain` 构成。
- 顶部 56px Appbar 已接入站点标题、2.0.0 版本、VitePress 本地搜索、贡献者和 GitHub 入口；搜索按钮、Ctrl/Cmd+K 与 `/` 快捷键均通过浏览器回归。
- 顶部 Appbar 已按最新界面约定移除重复的“文档”和“设计 Token”入口；“贡献者”移到右侧 GitHub 之前，当前顺序为“搜索 → 贡献者 → GitHub”。
- 左侧 300px Drawer 在桌面为可收起 persistent 模式并通过 SSR 安全的 `localStorage` 记忆状态；`<960px` 自动使用带遮罩、滚动锁、焦点陷阱与 Esc 的 temporary 模式，路由变化后关闭。侧栏直接标准化现有 `themeConfig.sidebar`，支持折叠分组、活动项和活动分组展开。
- 新增纯数据导航层 `docs-navigation.ts`，统一推导顶部导航、侧栏、面包屑与前后页；站内链接经 `withBase()` 并在非 clean URL 模式补 `.html`，保留静态托管直达能力。
- 普通页面使用原生窗口滚动，正文顶部渲染面包屑与窄屏折叠目录，底部渲染最后更新时间和前后页；`>=1280px` 显示右侧 sticky H2/H3 目录，`960–1279px` 和移动端使用正文顶部目录。目录来自 `page.headers`，活动标题由 `IntersectionObserver` 标记。
- 首页已改为独立 OreUI 落地页并隐藏两侧栏；404 使用 McCard、McButton 与 McIcon；正文标题、链接、表格、代码块、提示块、搜索弹窗和滚动条已统一深色像素视觉，Shiki 改用 `github-dark-high-contrast`，axe 严重/致命违规为 0。
- 已移除针对 `.VPNavScreen`、`.VPSidebar`、`.VPDocAside`、`.VPNavBarMenuLink` 等不再存在的默认外壳覆盖，只保留真实复用的 VitePress 正文与搜索选择器；`.mc-demo/.ore-demo` 作用域契约不变，未全局引入 `src/styles/index.css` 或 `styles/base.css`。
- 已新增导航标准化 Vitest（4 tests）及文档 Playwright（每浏览器 6 tests）；Chromium、Firefox、WebKit 均通过 Drawer 持久化/移动焦点、搜索、目录、首页、普通页、404、横向溢出、锚点 offset 与 axe，文档相关矩阵为 21 passed / 6 个既有 Chromium-only Utilities 用例按设计 skipped。
- 最终验证通过：`format:check`、`lint`、`check:docs-examples`（51 pages）、`typecheck`、导航 Vitest、三浏览器文档 Playwright、`docs:build`（VitePress 客户端 + SSR）与 `git diff --check`；构建仅保留既有大 chunk 提示，无 SSR、链接、无障碍或水平溢出错误。

## [已定义的 API/表结构]（文档主题架构权威快照）

- 文档内部接口：`normalizeSidebar()`、`normalizeNav()`、`createDocsNavigation()`、`normalizeDocsPath()`、`stripDocsBase()`；只供 `docs/.vitepress/theme` 和测试使用，不进入 npm 导出。
- 响应式契约：`<960px` temporary Drawer；`960–1279px` persistent Drawer + 正文顶部目录；`>=1280px` persistent Drawer + 右侧 sticky 目录。桌面 Drawer 存储键为 `mcui-docs-drawer-open`。
- 文档数据源仍为 `themeConfig.nav/sidebar/footer/lastUpdated/search` 与 `page.headers/frontmatter/isNotFound`；公共组件 API 和 npm exports 无变化。
- 数据库表结构：无；项目是纯前端 Vue 组件库。

## [未完成的任务列表]（文档主题架构权威快照）

- 本轮实现与自动化验收无阻塞项；后续调整文档主题需保持三段响应式契约，并同步运行导航单测、`docs:build` 和 `docs-layout.spec.ts`。
- 已获得仅提交并推送当前 `gitea-backup` 到私有 Gitea `origin/gitea-backup` 的明确授权；GitHub、`main` 与 npm publish 仍未获授权，不得操作。

---

> 当前权威快照：2026-07-31（使用指南收敛为“快速开始 / 配置选项”两页）。本区块优先于后面的历史归档。

## [当前进度]（使用指南信息架构权威快照）

- 已将原先职责混杂的“快速开始 / 基础设施 / 音效”三页收敛为两页：`docs/guide/getting-started.md` 只负责 Vue 版本要求、安装、一次插件注册、首个组件和下一步入口；`docs/guide/configuration.md` 统一负责基础使用之外的配置与展示。
- 新“配置选项”页明确每个 Vue App 只创建并安装一个 `createMcUI()` 实例，按 `theme`、`defaults`、`locale`、`display`、`icons`、`sounds` 六个选项分节解释，并保留局部 Provider、按需组件、可选样式、Services 与 Composables 的完整说明。
- 原 `docs/guide/infrastructure.md` 与 `docs/guide/useSound.md` 已删除，音效的内置资源、自定义 URL/adapter、`useSound()` 和 `mcui.services.sounds` 内容完整迁入配置页；侧边栏只保留“快速开始”和“配置选项”两个对应入口。
- `design-tokens.md`、`development.md` 与 README 的相关链接和章节名称已同步，不再存在指向旧基础设施或独立音效页面的引用。
- 本轮指南整理未修改组件实现、公共 API、类型、样式或打包行为；当前完整 2.0 工作区已按用户授权纳入私有 `gitea-backup` 备份提交，不涉及 npm publish。
- 私有 Gitea 备份已同步：完整 2.0 工作区提交 `09cbf04` 已推送到 `origin/gitea-backup`，并核验本地与远端 SHA 一致、领先/落后均为 0；未触碰 GitHub、`main` 或 npm 发布。
- 最终验证通过：`npm run format:check`、`npm run lint`、`npm run check:docs-examples`（51 pages）、`npm run docs:build` 与相关 `git diff --check`；构建产物包含 `guide/getting-started.html` 和 `guide/configuration.html`，不再生成旧 `infrastructure.html` / `useSound.html`。

## [已定义的 API/表结构]（使用指南信息架构权威快照）

- 基础入口：`createApp(App).use(createMcUI()).mount('#app')`；快速开始不再混入图标、声音、按需入口、可选样式或迁移细节。
- 配置入口：`createMcUI(options: McUIOptions)`；公开选项仍为 `theme`、`defaults`、`locale`、`icons`、`sounds`、`display`，本轮仅重组文档，没有改变接口。
- 文档路径：基础使用为 `/guide/getting-started`，其他配置为 `/guide/configuration`。
- 数据库表结构：无；项目是纯前端 Vue 组件库。

## [未完成的任务列表]（使用指南信息架构权威快照）

- 本轮指南拆分和本地验收无阻塞项；后续新增插件配置必须写入“配置选项”，快速开始继续保持只含安装与基础使用。
- 此前未提交的 2.0 重构、组件文档整改及本轮指南改动已合并为一次 `gitea-backup` 完整状态提交。
- 已获得仅推送当前 `gitea-backup` 到私有 Gitea 的明确授权；远端名 `origin` 当前指向 Gitea。仍未获得 npm publish 或任何公开 GitHub 推送授权，不得推送会触发正式发布的 `main`。
- 私有 Gitea 的 `gitea-backup` 已完成同步；后续工作只需继续保持该备份分支按需更新。GitHub、`main` 与 npm publish 仍未获授权，不得操作。

---

> 当前权威快照：2026-07-31（组件文档“效果优先、源码紧随”全量整改完成）。本区块优先于后面的历史归档。

## [当前进度]（组件文档示例规范权威快照）

- 已全量整改 `docs/components` 的 51 个页面（含 `overview.md`）：共 102 个实时 Demo，每个 Demo 都由独立二级标题引导，并立即跟随可复制的完整 Vue TypeScript SFC；另有 5 个高级完整 SFC。组件文档已不存在 `html` 示例片段。
- 实时 Demo 与源码使用同一模板结构；新增 `scripts/check-doc-examples.mjs` 扫描全部页面，校验每页存在 Demo、每个示例有独立二级标题、Demo 后下一内容块是 `vue` fence、源码包含 `<script setup lang="ts">` 与 `<template>`，并归一化格式后比对实时模板与源码模板。脚本支持维护时使用 `--write` 同步源码，但普通检查只读。
- 多状态示例已按语义、尺寸、交互、校验与结构模式扩充：Alert/Snackbar 覆盖语义状态，Button 覆盖主要 variant、尺寸、loading/disabled，表单控件覆盖正常、只读、禁用和错误，Tabs/Slider 覆盖方向与激活模式，Drawer 覆盖 temporary/persistent/permanent，DataTable 覆盖客户端与服务端分页场景。
- Dialog、Drawer、Menu、Overlay、Confirm、Snackbar 等浮层继续保留可操作触发器；Form 包含异步校验与重置，Select/Autocomplete 展示禁用选项及字段状态，DataTable 展示选择、自定义单元格、分页、loading 与 server options。
- Props、Events、Slots 与高级实现说明已统一放到相关实时示例之后；Icon 的结构化图标注册、MDI 与自定义 path 说明也已移至所有实时示例之后。
- `npm run check:docs-examples` 已加入常规 `npm run check`，并接入 PR CI 与 main/dev 发布 CI；README 的检查矩阵说明和 `docs/guide/development.md` 的文档开发规范已同步。
- 本轮未修改组件实现、公共 Props、事件、类型、样式入口或打包行为，也未 commit、push 或 publish。
- 最终验证通过：`npm run format:check`、`npm run lint`、`npm run check:docs-examples`（51 pages）、`npm run docs:build`（VitePress 1.6.4 客户端/SSR 渲染）与 `git diff --check`；后者仅报告 Windows autocrlf 提示，无空白错误。

## [已定义的 API/表结构]（组件文档示例规范权威快照）

- 新增维护命令：`npm run check:docs-examples`，执行 `node scripts/check-doc-examples.mjs`；普通运行只读并在失败时报告具体页面和示例序号。
- 文档示例契约：`## 示例标题` → 带 `mc-demo` class 的实时效果 → 紧邻的 `vue` 完整 SFC；SFC 必须含 `<script setup lang="ts">` 与 `<template>`，模板需与实时 Demo 对应，状态/数据/事件不得依赖代码块外隐藏实现。
- 公共运行时 API 没有变化，继续沿用 `createMcUI()`、63 个公共组件和既有显式 composable/style 子路径。
- 数据库表结构：无；项目是纯前端 Vue 组件库。

## [未完成的任务列表]（组件文档示例规范权威快照）

- 本轮文档整改与本地验收无阻塞项；后续新增或修改组件示例必须运行 `npm run check:docs-examples`，并保持 Demo/源码一一对应。
- 当前工作区仍包含此前未提交的 2.0 大范围重构以及本轮文档改动，维护者仍需人工 review 并确定 commit 边界。
- 未获得 commit、push 或 publish 授权。后续仍应先推 `dev` 并安装 `mcui-oreui@next` 验证；不得直接推送会触发正式发布的 `main`。

---

> 当前权威快照：2026-07-31（MCUI 2.0 工程规范与架构收敛完成）。本区块优先于后面的历史归档。

## [当前进度]（MCUI 2.0 工程规范与架构收敛权威快照）

- 已在本地 `gitea-backup` 工作区完成单包 Vue 3 组件库的 2.0 架构收敛；保留 63 个 `src/components/Mc*` 目录及既有视觉、Props、事件和按需 CSS 契约。本轮未 commit、push 或 publish。
- 所有框架服务均按 Vue App 隔离；无插件场景使用 `appContext` WeakMap fallback。插件卸载统一释放 Display、Pop、Sounds、Overlay 等资源，同一插件实例禁止跨 App 复用。Display 使用引用计数监听，Overlay 使用 App 独立栈与按 Document 共享的滚动锁/单调 z-index 协调器，SSR 与同页多 App 测试通过。
- Pop 与 Sound 已移除模块级可变业务状态。`usePop()`、`useSound()` 从当前 App 获取实例；组件外调用统一使用 `const mcui = createMcUI(); mcui.services.pop.show(...)` / `mcui.services.sounds.play(...)`。未发布 2.0 的根导出 `showPop`、`popState`、`playSound`、`playSoundType`、`setSoundEnabled` 已删除并写入迁移文档。
- SkinViewer 仅在挂载、`autoRotate=true` 且页面可见时运行 rAF；ScrollView 在无 ResizeObserver 时降级到 window resize、MutationObserver 与首次同步；所有停止、隐藏和卸载路径均有资源回收测试。
- McIcon 已完全改为安全结构化 `svg/path/image` 节点，不再使用 `v-html` 或接受任意 SVG 字符串。302 个内置 SVG 由生成器验证并转换为 TS 数据；事件属性、危险标签、外部 URL 与 `javascript:` 会被拒绝。像素化结果使用共享 128 项 LRU，并处理异步竞态、失败与卸载时的 Blob URL 回收。
- 63 个组件目录是公共组件清单的唯一事实来源；生成器统一写入组件导出、插件注册表、GlobalComponents、web-types 标签、样式聚合和显式 package exports。Composable 使用显式 allowlist，旧 `useTooltipFlip` 已移除；`check:generated` 会拒绝漂移。
- 构建已使用静态实现模块 CSS import、`vite-plugin-lib-inject-css`、CSS code split 和 JS sourcemap，不再对最终 bundle 做正则改写。根命名导入/单组件子路径只加载真实依赖，`createMcUI()` 加载全量组件 CSS，Utilities/字体/声音/图标集继续显式可选。
- 已清理旧 CSS、自定义元素白名单、`Default.png`、NotoSans 与未引用字体变体；字体发布严格限定为 `fonts.css` 实际使用的四个文件。图标集和组件注册表声明使用公开接口类型，避免发布字面量展开；构建仍生成 sourcemap，但 npm `files` 白名单不发布 `.map`。
- 已加入 ESLint 9 flat config、typescript-eslint、eslint-plugin-vue、Prettier 3、Stylelint 16、EditorConfig、Node/npm 版本约束、V8 严格覆盖率、CHANGELOG、SECURITY、CODE_OF_CONDUCT、CONTRIBUTING 与 PR 模板。当前目标为 Node `>=20 <23`、npm `10.8.2`；本机 Node 24/npm 11 的 EBADENGINE 提示仅是本地版本不匹配。
- 已新增 PR CI（Chromium、可取消 concurrency）并收紧发布流水线（三浏览器、不可取消 concurrency、npm provenance、Secret 继续使用 `MCUIACTION`）。文档部署只接收 `main` 发布 workflow 成功后的精确 `head_sha`。
- README、VitePress 组件/API/迁移/基础设施/开发指南均已同步。文档站继续只使用 `.ore-demo` 作用域基础样式，不全局引入库的 `src/styles/index.css`。
- 最终验证全部通过：`format:check`、`lint`、`check:generated`、`typecheck`；Vitest 21 files / 69 tests，statements/lines 98.91%、functions 92.45%、branches 86.83%；`build`（302 modules、63 组件样式合同）、`test:consumer`、`docs:build`、`check:size`、`npm audit --omit=dev`（0 vulnerabilities）、`git diff --check`（仅 Windows autocrlf 提示，无空白错误）。
- Playwright 三浏览器运行完成：25 passed、32 个按设计仅适用于 Chromium 的视觉/Utilities 用例 skipped、0 failed；Chromium/Firefox/WebKit 核心交互均通过，Chromium 完整视觉画廊与 Utilities 回归通过。
- 最终 gzip 预算：Button 9,364 B、Icon 2,812 B、Container 322 B、Plugin 49,756 B、Utilities 33,970 B、自动组件 CSS 13,116 B、完整可选 CSS 47,087 B。npm pack 为 487,647 B、解包 1,785,112 B、593 文件，无 sourcemap、AGENTS/CLAUDE/SESSION_STATE、`.codex` 或环境文件；低于 800 KB / 2 MB 门槛。
- npm 线上只读核验：`latest` 仍为 `1.2.2`，`next` 为 `1.2.0-dev.11`，`mcui-oreui@2.0.0` 尚未发布；正式 release 合同（含 registry 检查）通过。

## [已定义的 API/表结构]（MCUI 2.0 工程规范与架构收敛权威快照）

- `createMcUI(options?: McUIOptions): McUIPlugin`；`McUIPlugin = Plugin & { readonly services: Readonly<McUIServices> }`，且每个实例只允许安装到一个 Vue App。
- `McUIServices` 暴露 App 独立的 `theme`、`defaults`、`locale`、`display`、`icons`、`sounds`、`overlay`、`form`、`pop` 实例。
- `McPopInstance` 提供只读 `state`，以及 `show(message, duration?, styleClass?)`、`dismiss(id)`、`clear()`、`dispose()`。
- `McIconDefinition` 使用 `node: McIconNode`；节点名仅允许 `svg | path | image`，属性/子节点为结构化只读数据。`path` Prop 和 Vue Component 图标继续支持。
- 公共入口包括 63 个根组件导出、63 个 `components/Mc*` 子路径、10 个显式 composable 子路径、`icons/{all,key,normal,x}`、`sounds/default` 与 5 个显式样式子路径；内部 composable 不通过 package exports 暴露。
- 样式契约：根命名导入和单组件入口自动携带组件真实 CSS 依赖；`createMcUI()` 携带全部组件 CSS；Utilities、字体、声音和图标集继续显式选择。
- 数据库表结构：无；项目是纯前端 Vue 组件库。

## [未完成的任务列表]（MCUI 2.0 工程规范与架构收敛权威快照）

- 本地实现与自动化验收无阻塞项；维护者仍需人工 review 当前大范围未提交 2.0 差异并确定 commit 边界。
- 未获得 commit、push 或 publish 授权。后续应先推 `dev`，通过 `mcui-oreui@next` 在独立消费项目验证，并观察 GitHub Ubuntu PR/发布 CI；不得直接推送会触发正式发布的 `main`。
- 正式发布前再次确认 `package.json` / `package-lock.json` 版本、对应 CHANGELOG、三浏览器 CI 与 npm pack 审计；继续保留 GitHub Secret 名 `MCUIACTION`。
- 完整开发依赖审计仍报告既有工具链漏洞，需另行评估升级；运行时依赖为 0 vulnerabilities，不执行破坏性的 `npm audit fix --force`。

---

> 当前权威快照：2026-07-31（主流组件库结构与开发规范审查）。本区块优先于后面的历史归档。

## [当前进度]（主流组件库结构与开发规范审查权威快照）

- 已完成只读工程审查，未修改业务代码、构建配置、公共 API 或发布状态。当前单包 Vue 3 组件库结构总体合理：63 个组件目录一致，ESM 根入口/按需子路径、严格 TypeScript、CSS 单一归属、SSR/hydration/axe/E2E、VitePress、体积预算和发布包契约均已建立；静态依赖图扫描 301 个 TS/Vue/CSS 文件、808 条边，循环依赖为 0。
- 公共元数据当前数量一致：根组件导出、createMcUI 注册、PascalCase GlobalComponents、kebab-case GlobalComponents、web-types 均为 63。但它们由多处手工重复维护，尚无单一组件 manifest/codegen，存在后续漂移风险。
- 发布流水线存在高优先级缺口：只在 push main/dev 时执行完整检查，没有 pull_request CI；workflow 只安装 Chromium，而 Playwright 默认配置会运行 Chromium/Firefox/WebKit，GitHub Ubuntu 发布任务可能因缺浏览器失败。
- 运行时实例隔离存在高优先级风险：usePop 使用模块级状态并直接调用 requestAnimationFrame，SSR 主动调用会报错且多 app/请求共享；Sounds 使用模块级 activeSounds；Display provider 监听缺少 app 卸载回收且 fallback 多消费者无引用计数；Overlay 的 document scroll lock 在多 app 管理器间不共享计数。
- 资源生命周期仍需收敛：McSkinViewer 即使 autoRotate=false 也持续 requestAnimationFrame；McScrollView 直接 new ResizeObserver、无能力探测；McIcon 每实例像素缓存无上限并通过 v-html 渲染注册的 SVG 字符串，需明确 trusted-only 或改为结构化图标定义。
- 构建边界存在维护风险：vite.config.ts 扫描除 validation.ts 外的全部 composables，因此未被文档使用的旧 useTooltipFlip 也会成为公开子路径；CSS 所有权插件在 generateBundle 阶段用正则重写最终 chunk code，依赖 SFC chunk/asset 命名，未来启用 sourcemap 或升级 Rollup/Vite 时较脆弱。
- 工程清洁度不足：src/styles 仍有无引用的 mcui-base.css、public.css、loading-mask.css 和未使用的自定义元素编译白名单；write-dist-package 整目录复制字体，使 dist 带入约 1.58 MB 未被 fonts.css 使用的 NotoSans，另有未使用字体变体。源码还有约 614 KB 未引用 Default.png。
- 开发规范缺口：无 ESLint、Prettier、Stylelint、EditorConfig、coverage threshold、PR CI、engines、packageManager、Node 版本文件、CHANGELOG、SECURITY 或版本变更工具；63 个组件中 24 个未在 unit/SSR 测试中被直接点名，虽有 63 组件视觉画廊，但缺少可量化覆盖率门槛。

## [已定义的 API/表结构]（主流组件库结构与开发规范审查权威快照）

- 本轮未改变 API。插件仍为 createMcUI(options?: McUIOptions): Plugin，组件/组合式 API/样式子路径契约保持不变。
- 数据库表结构：无；项目是纯前端 Vue 组件库。

## [未完成的任务列表]（主流组件库结构与开发规范审查权威快照）

- P0：新增不发布的 pull_request/push CI；修正 Playwright 安装/项目矩阵一致性；完成 usePop/Sounds/Display/Overlay 的 SSR、多 app 和卸载隔离。
- P1：建立唯一公共 manifest/codegen 与 composable 显式 allowlist；移除 useTooltipFlip/旧 CSS/自定义元素配置等死代码；字体复制改为精确 allowlist；避免 generateBundle 正则改写最终 chunk。
- P1：补齐 ESLint + Vue/TypeScript、Prettier、Stylelint、EditorConfig、coverage，并让 CI 执行 lint/format/type/test/build/consumer/docs/E2E/size。
- P2：补 engines/packageManager/Node 版本、CHANGELOG/SECURITY/版本变更流程；补直接组件测试、SkinViewer/ScrollView 生命周期测试和 trusted SVG 安全边界。
- 当前工作区仍包含大范围未提交 2.0 改动；整改前需由维护者先确定可 review 的提交边界。未获得 commit、push 或 publish 授权。

---

> 此前权威快照：2026-07-31（CSS 单一归属与无环按需加载修正）。以下内容作为历史归档保留。

## [当前进度]（CSS 单一归属与无环按需加载修正权威快照）

- 已针对“A 的 CSS 含 B、B 的 CSS 又含 A”完成严格纠正。每个 `components/McX/component.css` 现在只允许当前组件自己的 `.mc-x`、`.mc-x__*`、`.mc-x--*` 选择器；组件文件禁止 `@import`，`style.css` 固定只聚合同目录 `component.css`，不再承担 Core 或兄弟样式转引。
- 已删除 `appbar-actions.css`、`form-inputs.css`、`grid.css`、`overlay.css`、`select-controls.css`、`selection-controls.css` 六个会混合公共组件归属的共享文件。`styles/shared/` 目前只保留中性的 `input-control.css`，只含不存在公共 `McInput` 组件归属的 `.mc-input*`，并仅由实际渲染该类的 McAutocomplete、McNumberInput、McTextarea、McTextField 入口导入。
- McAppbarButton/Icon、McFormField、McOverlay、McSelect/Autocomplete、McCheckbox/Radio/Switch、McContainer/Row/Col/Spacer、McApp 等选择器均已回到各自组件目录。McAppbar 不再直接写 `.mc-tooltip`，McButtonTabs/McConfirm 不再直接写 `.mc-button`，组合组件改用自己的命名空间结构类。
- 每个组件 `index.ts` 的 CSS 依赖列表被契约固定为：`component-core.css`、确实使用的中性共享 CSS、非空时的本地 `style.css`。如果 A 的实现真实渲染 B，必须通过 `../McB` 的 JS 公共入口形成依赖，由 B 自己携带样式；禁止 A 直接导入 B 的 CSS 或在 A 的 CSS 中引用 `.mc-b*`。
- 构建继续使用静态 ESM CSS import、`cssCodeSplit` 和 SSR 安全路径。`dist/index.js` 本身不携带全量 CSS；根命名导入和 `components/McX` 只保留实际组件、真实 JS 依赖、Core 与中性共享层。`createMcUI()` 因闭包引用全部注册组件，会加载全部非空组件样式，但仍不加载 Utilities。
- `scripts/check-built-styles.mjs` 会拒绝重复 CSS import、兄弟命名 CSS 资产、缺失 Core、错误 input-control 依赖和运行时 `<style>` 注入；真实 Vite 消费探针覆盖 Container、Select、Autocomplete、Checkbox、RadioGroup、Dialog 与全量插件。全量插件校验改为逐个读取非空 `component.css` 的真实拥有选择器，不再错误假设 DataTable 必须存在未定义的基础 `.mc-data-table` 规则。
- `tests/unit/styles.spec.ts` 会验证 63 个组件的精确 CSS import 列表、共享层中性、组件选择器单一归属、无组件/共享 CSS `@import`、聚合入口确定性与 Utilities 显式可选。README 与开发指南已同步说明单组件只携带自身/真实依赖样式及无环开发约定。
- 最终验证通过：`npm run typecheck`；`npm test`（15 files / 42 tests）；`npm run build`（63 个组件入口、根命名导入隔离、全量插件逐组件样式）；`npm run test:consumer`；`npm run docs:build`；`npm run test:e2e`（25 passed、32 skipped）；`npm run check:size`；`npm pack --dry-run --json`；`npm audit --omit=dev`（0 vulnerabilities）；`git diff --check`（仅既有 CRLF 提示）。
- 最终 gzip：Button 7,949 B、Icon 1,748 B、Container 322 B、全量插件 52,399 B、Utilities 33,970 B、自动组件 CSS 12,870 B、组件 + Utilities 46,861 B。npm dry-run 包为 1,342,296 B，解包 3,341,315 B，共 592 文件，未包含 AGENTS/CLAUDE/SESSION_STATE 或 `.codex` 私有文件。

## [已定义的 API/表结构]（CSS 单一归属与无环按需加载修正权威快照）

- 本轮没有修改组件 Props、事件、Provider、Overlay 或其他运行时 API；`createMcUI(options?: McUIOptions): Plugin` 保持不变。
- 样式加载契约：根命名导入与 `components/*` 自动加载当前组件及真实 JS 依赖的必要 CSS；`createMcUI()` 加载全部组件 CSS；Utilities 仍需显式导入 `mcui-oreui/styles/utilities.css`。
- 内部归属契约：Core 仅承载 Token、主题容器和中性基础；共享 CSS 不得拥有任何公共组件选择器；每个公共组件选择器只能由对应 `component.css` 拥有。
- 数据库表结构：无；项目是纯前端 Vue 组件库。

## [未完成的任务列表]（CSS 单一归属与无环按需加载修正权威快照）

- 本轮 CSS 互相调用问题和本地自动化验收均无阻塞项；仍需维护者人工 review 大范围 2.0 未提交差异并决定 commit 边界。
- GitHub Ubuntu CI 尚未实际运行；首次推送 `dev` 后应核对消费端 CSS 隔离探针和 Chromium 视觉基线。
- 未获得 commit、push 或 publish 授权；不得推送会触发正式发布的 `main`，发布前仍应先通过 `next` 独立消费验证。

---

> 此前权威快照：2026-07-31（组件样式共置与自动按需加载）。以下内容作为历史归档保留。

## [当前进度]（组件样式共置与自动按需加载权威快照）

- 已在本地 `gitea-backup` 工作区完成 `mcui-oreui@2.0.0` 的组件样式共置：63 个公开组件均使用 `src/components/McX/{McX.vue,index.ts,style.css,component.css}` 目录结构，TypeScript 内部共享文件迁入 `src/components/_shared/`。本轮未 commit、push 或 publish，既有 2.0 未提交差异均保留。
- 样式职责已拆分为 `component-core.css`、6 个真实复用族的 `styles/shared/*.css`、各组件 `component.css` 与独立 `utilities.css`。组件选择器保持 `.mc-*` / `.mc-theme` 命名空间；McIcon、McSkinViewer 已移除 SFC `scoped` 并迁入命名空间组件 CSS，Core 的主题容器使用低特异性 `:where(.mc-theme)`，避免晚加载基础 Token 覆盖语义组件状态。
- `scripts/generate-component-styles.mjs` 确定性生成全量 `styles/components.css` 聚合入口，`npm run check:components` 校验 63 个组件及生成漂移。Utilities 不再属于默认组件依赖，使用方需要显式导入 `mcui-oreui/styles/utilities.css`；`base.css`、`fonts.css` 职责不变。
- 已加入 `vite-plugin-lib-inject-css@2.2.2`，启用 CSS code split 并关闭 transitive import hoist；根入口和 `./components/McX` 入口使用静态 CSS import，不使用运行时 DOM 注入，保持 SSR 安全。内部组合组件通过公开兄弟入口传递依赖样式；根入口命名导入可 tree-shake 未使用组件样式，`createMcUI` 全量安装会携带所有组件样式但不携带 Utilities。
- 构建后的 63 个 `dist/components/McX.js` 均含 CSS import；`scripts/check-built-styles.mjs` 还验证实现 chunk 注入、Icon/SkinViewer/Button 样式、无运行时 style 注入，以及真实 Vite 消费端的单组件排除与全量插件样式行为。发布包 exports、sideEffects、dist package、样式复制和 63 个平铺 `.d.ts` 代理均已同步。
- 表单视觉回归根因已修复：11 个输入组件曾重复导入 `shared/form-inputs.css`，晚加载的通用 `.mc-input` 覆盖组件层并使全画廊缩短 18px；现由 `McFormField` 唯一拥有共享表单 CSS，依赖组件通过 JS/CSS 依赖链获得样式。固定 1440×4369 的 63 组件画廊无需更新快照即恢复一致。
- README、入门/开发/迁移指南、组件总览、VitePress 主题与 E2E fixture 已统一说明“组件入口自动带样式、Utilities 显式可选”，并移除按需组件仍需手动导入 `components.css` 的旧约定。
- 最终验证通过：`npm run typecheck`；`npm test`（15 files / 41 tests）；`npm run build`（63 个组件样式契约）；`npm run test:consumer`；`npm run docs:build`；`npm run test:e2e`（25 passed、32 个非适用浏览器用例按设计 skipped，所有视觉、交互、Teleport、组合组件和主题/RTL 回归通过）；`npm run check:size`；`npm pack --dry-run --json`；`npm audit --omit=dev`（0 vulnerabilities）；`git diff --check`（仅既有 CRLF 提示，无空白错误）。
- 最终 gzip：Button 7,949 B、Icon 1,749 B、Container 323 B、全量插件 52,391 B、Utilities 33,970 B、自动组件 CSS 12,418 B、组件 + Utilities 46,443 B。npm dry-run 包为 1,346,096 B，解包 3,473,219 B，共 587 文件；包含 63 个组件 JS 入口、63 个平铺声明、63 个目录声明、126 个组件 CSS、6 个共享 CSS，以及 Components/Core/Utilities 样式入口。

## [已定义的 API/表结构]（组件样式共置与自动按需加载权威快照）

- 本轮未修改任何组件 Props、事件、Provider、Overlay 或其他运行时 API。
- 默认导入契约：`import { McButton } from 'mcui-oreui'` 与 `import McButton from 'mcui-oreui/components/McButton'` 均自动携带必要组件 CSS；`createMcUI()` 携带全量组件 CSS。Utilities 需显式导入 `mcui-oreui/styles/utilities.css`。
- 手动样式子路径保留 `styles/{tokens,components,utilities,base,fonts}.css`；`styles/components.css` 是不含 Utilities 的确定性全量组件聚合入口。
- 数据库表结构：无；项目是纯前端 Vue 组件库。

## [未完成的任务列表]（组件样式共置与自动按需加载权威快照）

- 本轮实现和本地自动化验收无阻塞项；仍需维护者人工 review 大范围 2.0 未提交差异并决定 commit 边界。
- GitHub Ubuntu CI 尚未实际运行；首次推送 `dev` 后应核对构建、消费端探针与 Chromium 视觉快照。
- 未获得 commit、push 或 publish 授权。发布前仍应先推 `dev` 生成 `next` 并在独立项目实测；不得直接推送会触发正式发布的 `main`。
- 运行时依赖审计为 0；既有开发工具链漏洞仍需单独评估，不应在本轮执行破坏性的 `npm audit fix --force`。

---

> 此前权威快照：2026-07-31（Ore UI/API 收敛）。以下内容作为历史归档保留。

## [当前进度]（Ore UI/API 收敛权威快照）

- 已在本地 `gitea-backup` 工作区完成 `mcui-oreui@2.0.0` 的 63 组件 API 全量收敛与 Ore UI 视觉恢复；固定视觉参考为 Spectrollay-OreUI MIT revision `0bf8f46655878da872e4ddfa03db9ac663212438`。本轮尚未 commit、push 或 publish。
- 样式层已重构：`tokens.css` 提供 Ore UI 色板、像素边框、凹凸阴影、尺寸、间距、字体与 motion Token；新增生成式 `utilities.css`，`components.css` 默认包含 Utilities；`base.css` 只作用于显式 `.mc-page`；可选 `fonts.css` 只声明 Minecraft Ten / Seven / Five。默认 CSS 审计确认不包含裸 `html/body/:root/*/header/main/a/button` 宿主选择器。
- 2026-07-29 一次性补齐 Vuetify 4.1.6 对等 Utilities：公开类名保持 `d-flex`、`ma-4`、`justify-center`；覆盖 Display/Print、Float/RTL、Flex、Spacing/Gap、Overflow、Border/Radius、Text/Typography、Position/Sizing、Cursor/Opacity、Helpers、`elevation-0–24` 和内置 Theme `text/bg/border` 色彩。固定使用项目 `sm/md/lg/xl/xxl` 断点与 `--mc-spacer: 4px`，间距为 `0–16`、auto margin 和 `n1–n16` 负 margin；所有工具声明使用 `!important`。Grid、图片适配、宽高比等组件能力未伪装成 Utilities。
- 新增确定性生成器 `scripts/generate-utilities.mjs`：同一配置生成 `src/styles/utilities.css`、4,152 类的完整搜索目录与按章节拆分的轻量目录，`--check` 校验所有产物漂移、4,167 个唯一选择器和非法声明；`npm run build` 与单测均执行检查。
- 2026-07-31 Utilities 文档采用“样式”分类下的 14 个直属路由：分辨率、Display/Print、Flex、Spacing/Gap、Overflow、Border/Radius、Text/Typography、Position/Float、Sizing、Cursor/Opacity、Helpers、Elevation、Theme colors 与全量类名索引；已删除重复的“样式工具类总览”章节及全部入口，并将 Float 与 Position 合并为“定位与浮动”、将 Sizing 独立为“尺寸”。侧边栏与页面一级标题统一采用“中文 / English”名称（如“弹性布局 / Flex”“间距与间隙 / Spacing & Gap”）。每个工具族页面均提供真实可交互 Demo、代码示例和只加载本章数据的搜索表；目录将同一功能的 `sm/md/lg/xl/xxl` 具体类汇总为 `{breakpoint}` 写法，仍可用 `ma-md-4` 等真实类名命中对应组。“分辨率 / Breakpoints”章集中展示断点区间、命名模式、范围隐藏与 800/1000px 视口下的实际切换。“显示与打印”章明确打印指浏览器 `Ctrl+P` / 打印预览 / 导出 PDF，并区分 `d-print-block` 与 `d-none d-print-block`；Chromium 同时验证 screen/print 媒体可见性切换。全量 4,152 类只在独立索引加载。文档构建无大 chunk 警告，Chromium 已验证 Display/Flex/Position/Float/Sizing/Elevation/Theme color 计算样式、直接章节导航、汇总搜索和章节搜索隔离。
- Button、Checkbox、Radio、Switch、Slider、TextField、Tabs、List、Card、Appbar、Panel、Select、Autocomplete、Menu、Dialog、Drawer、DataTable、反馈与数据组件均已统一 Ore UI 像素描边、内阴影、按压层级、焦点、禁用、选中、错误与 loading 状态；Slider 已完全覆盖浏览器原生 range 外观。
- 2026-07-29 视觉回归复核后修复 Slider/Switch 风格丢失：Slider 使用“36px 透明原生 range 交互层 + 独立 12px 轨道/填充 + 20px 像素手柄”，手柄/轨道比例约 1.67、贴近黄金比且不缩小热区；Switch 恢复 62×28 双色轨道、开关图标、32px 凸起手柄与各交互状态。关键阴影变量均带主题外回退值，后段语义样式不再覆盖手柄视觉。
- 2026-07-29 修复 ButtonTabs 横向溢出与选中态失效：适配 McButton 的包装型 Attr 路由，让标签包装器在容器内等分收缩、真实 `.mc-button` 占满分配宽度，长文本安全省略；选中/自定义颜色样式改为命中真实按钮。Chromium 回归会把 4 个标签压入 320px 容器并校验边界、等宽和选中背景。
- 2026-07-29 修复 List 未知左侧内边距：根 `<ul>` 使用 `.mc-list.mc-list` 的命名空间重复选择器稳定重置 `margin/padding/list-style`，可覆盖 VitePress `.vp-doc ul` 等宿主列表规则而无需 `!important`；浏览器回归模拟宿主 `padding-left: 20px`，确认计算值仍为 0 且列表项只偏移 2px 组件边框。
- 2026-07-29 修复 Checkbox 字体勾号：McCheckbox 与 List 多选指示器统一使用现有 `check-white.svg` crispEdges 像素资产，不再渲染字体 `✓`；indeterminate 状态改用 12×3 CSS 像素横杠，不再渲染字体 `−`。单元测试覆盖普通、mixed 与 List 多选 DOM，Chromium 覆盖 16×16 尺寸和 pixelated 渲染。
- 2026-07-29 修复单行输入文字垂直偏移：40px `.mc-input` 使用 20px 整数行高与 8px 对称上下内边距，连同 2px 上下边框恰好组成固定高度；Textarea 保留多行顶部起始排版。Chromium 几何回归校验上下 padding 相等且完整盒模型总和为 40px。
- 2026-07-29 修复 AppbarButton/AppbarIcon 文档 Demo 脱离容器：所有独立 Appbar 示例显式设置 `:fixed="false"`，不再固定到 VitePress 视口顶部；同步把遗留 `bg-color` 示例改为 2.0 `color`。本机文档页实测 5 个 Appbar 均为 `position: static`、40px 高并位于各自 Demo 内。
- 2026-07-29 修复 ScrollView 内容越界且无法滚动：根节点恢复固定高度 flex 裁剪，内部 viewport 使用原生 `overflow:auto`，自定义 track/thumb 恢复 Ore UI 视觉；ResizeObserver 同时观察 viewport 与内容，滚轮、触摸、拖拽和 pointercancel 均可正确同步。文档页实测 `clientHeight=216`、`scrollHeight=928`，滚轮 `scrollTop: 0 → 120`。
- 2026-07-29 修复 Breadcrumbs、ExpansionPanel 与 Stepper 在 VitePress 中的未知偏移：用命名空间重复选择器稳定覆盖 `.vp-doc ol`、`.vp-doc li + li`、`.vp-doc h3` 的宿主 margin/padding/list-style/字号规则，不使用 `!important`；三个面包屑与三个步骤头顶边完全对齐，扩展面板标题恢复 16px/24px 排版。
- 2026-07-29 修复 VirtualScroll 文档 Demo 空白：绝对定位的虚拟窗口无法贡献 flex 固有宽度，导致根节点收缩为 0；根节点现使用 `width:100%; min-width:0`，默认填满父容器并可安全收缩。实际文档页计算宽度为 636px、渲染 13 个可视条目，首行“0 · 区块 1”可见；新增 Chromium flex 宿主回归。
- 2026-07-29 重构 VitePress 组件信息架构：侧边栏改为“基础、表单、导航、布局、数据展示、浮层、反馈”职责分组；51 个组件入口统一使用“中文 / English”格式（如“按钮 / Button”“对话框 / Dialog”），以斜线明确分隔用途说明和公开组件名。Drawer 归回布局，Overlay/Dialog/Menu/Tooltip/Confirm 独立为浮层，反馈只保留 Alert/Snackbar/Progress/Spinner/Skeleton/LoadingMask/Pop。删除 advanced-inputs/data/navigation-flow/primitives 四个拥挤的合并页，新增 20 个独立组件页，并把 Select、TextField、Radio、Overlay 现有页收敛为单组件文档；Grid、ExpansionPanels 等紧密组件族继续共页。README 与组件总览已同步。`npm run docs:build` 通过，51 个组件侧边栏目标全部存在，浏览器逐页验证 22 个新增/拆分 Demo 均可渲染且无路由或组件解析错误（唯一 404 为既有 `/favicon.ico`）；双语长标签“自动补全 / Autocomplete”“应用栏按钮 / AppbarButton”在 208px 链接区内无水平溢出。
- API 已破坏性收敛：所有 `bgcolor/bgColor` 改为 `color`；Alert/Progress/Snackbar 的语义状态统一为 `variant`；ARIA 包装 Props 删除，改用标准 `aria-*`；TextField 使用 `filter` + 标准 `type`；Alert/Card/Chip/Snackbar 的重复文本 Props 删除并改用插槽；DataTable 只使用 `options/update:options` 管理 page/itemsPerPage/sortBy/search，主 `v-model` 只管理选择。
- TextField、Textarea、Select、Autocomplete、Checkbox、Radio、RadioGroup、Switch、Slider、FileInput、NumberInput 统一 `label/description/hint/disabled/readonly/required/rules/errorMessages/validateOn/id` 扁平契约。`class/style/data-*` 路由到外层，原生/ARIA/监听器路由到真实控件；Overlay、Dialog、Drawer、Menu、Progress、Snackbar、LoadingMask、PopHost 等包装/Teleport 组件也已补齐语义 Attr 路由。
- Overlay、Dialog、Drawer、Menu、Select、Autocomplete、Tooltip、Snackbar、LoadingMask 与 PopHost 的 Teleport 内容会携带当前 Theme 类名、CSS 变量与 Locale `dir`；已有 Overlay 栈、connected/static 定位、焦点陷阱、Escape、滚动策略、SSR/hydration 能力保持不变。
- 根导出、63 个 PascalCase + kebab-case GlobalComponents、逐组件类型、`web-types.json`、README、VitePress API/Demo、设计/开发指南与完整 `migration-2.md` 已同步；`web-types.json` 可解析且恰好包含 63 个标签，公开源码与元数据旧名称扫描为 clean。
- 新增 Chromium 视觉回归画廊 `tests/e2e/fixture/src/VisualGallery.vue`，显式导入可选字体并覆盖全部 63 个组件；维护 5 张平台无关快照，覆盖全画廊、hover/focus/selected/disabled/error/loading、active、Menu 与 Tooltip。固定参考 revision 同时记录在 README、关于页、迁移指南与画廊。
- 最终验证通过：`npm run check:utilities`；`npm run typecheck`；`npm test`（14 files / 38 tests，含 Utilities 生成契约、API/Attr、Form、Overlay、providers、axe、SSR、hydration、Checkbox/List 像素标记）；`npm run build`；`npm run test:consumer`；`npm run docs:build`；`npm run check:size`；完整 `npm run test:e2e` 基线为 24 passed、30 个非 Chromium Utilities/文档/视觉测试按设计 skipped，断点文档调整后专门的 Chromium 文档回归为 3/3 passed；Utilities 浏览器计算样式覆盖 display 覆盖、响应式间距/Flex、负/auto margin、RTL、打印、Typography、主题色、Border、Opacity、Cursor、Position/Sizing、Elevation、SR-only、pointer helper，并直接验证独立样式章节的实际效果、`{breakpoint}` 汇总搜索、章节搜索隔离与 800/1000px 真实断点切换；既有 63 组件视觉/交互回归继续通过；`npm audit --omit=dev`（0 vulnerabilities）；`npm pack --dry-run --json`；CSS 宿主隔离审计；`git diff --check`（仅 CRLF 提示，无空白错误）。
- 最终 gzip：Button 8,016 B、Icon 1,827 B、Container 322 B、完整插件 52,436 B、`utilities.css` 33,970 B、完整默认 CSS（tokens + utilities + components）45,503 B，低于 60 KB 预算。npm 干运行包 1,359,104 B，解包 3,584,978 B，共 280 个文件。运行时 `dependencies` 为空，唯一 peer dependency 为 Vue。
- `npm install --package-lock-only` 已同步 lock；完整开发依赖审计仍报告 22 项（8 moderate、13 high、1 critical），但运行时依赖审计为 0。未执行自动 `npm audit fix`，避免未经评估的工具链升级。
- 2026-07-31 组件库能力/稳定性复审：`npm test`（14 files / 38 tests）、`npm run build`、`npm run check:size`、`npm run test:consumer` 与 `npm audit --omit=dev` 均通过。按能力覆盖判断，OreUI 游戏 UI/后台/表单类站点约可覆盖 80%–90% 常见需求；通用企业站点仍约 65%–75%，缺日期时间/日历、图片/头像、树/树表、轮播、评分/颜色选择器、多选/可创建 Select、远程 Autocomplete、拖拽上传等高频能力。生产风险复核发现：McSkinViewer 每实例持续 requestAnimationFrame、McScrollView 无 ResizeObserver 能力探测、McOverlay 删除中间项后可能复用 z-index、createMcUI/useSound/pop 状态存在跨 app 全局共享、McIcon 像素缓存无上限且 Canvas 光栅化在高频动态图标下可能抖动；DataTable/List/VirtualScroll/Stepper 等对重复/缺失 key 缺少防护，默认仅固定高度虚拟化。上述问题尚未修复。

## [已定义的 API/表结构]（Ore UI/API 收敛权威快照）

- 插件：`createMcUI(options?: McUIOptions): Plugin`；配置键为 `theme`、`defaults`、`locale`、`icons`、`sounds`、`display`。
- Providers/Composables：`McThemeProvider/useMcTheme`、`McDefaultsProvider/useMcDefaults`、`McLocaleProvider/useMcLocale`、`useMcDisplay`、`useMcOverlay`、`useMcForm`，以及 Icons、Sounds、Pop 能力。
- 表单：`McForm` 以主 `v-model` 表示有效状态；输入共享 `label/description/hint/disabled/readonly/required/rules/errorMessages/validateOn/id`，用户确认型变化发出 `change`。
- 视觉/API：色彩 Prop 统一 `color`，语义状态统一 `variant`，标准 ARIA/原生 Attr 直接写在组件上；TextField 使用 `filter` 与标准 `type`。
- Overlay：`McOverlay` 支持 static/connected、逻辑 location、offset、四种 scrollStrategy、三种 focusStrategy、Teleport、persistent、scrim 与 Escape；Teleport 继承 Theme CSS 变量和 Locale `dir`。
- 数据：DataTable 通过单一 `options/update:options` 管理 page/itemsPerPage/sortBy/search，主 `v-model` 管理选择并发出 `change`；server 模式不发起网络请求。
- 发布子路径：`styles/{tokens,utilities,components,base,fonts}.css`、`components/*`、`composables/*`、`icons/{normal,key,x,all}`、`sounds/default`。
- 数据库表结构：无；项目是纯前端 Vue 组件库。

## [未完成的任务列表]（Ore UI/API 收敛权威快照）

- 本轮实现与本地自动化验收无阻塞项；仍需维护者对大范围未提交差异、Utilities 生成产物/文档目录和 5 张视觉基线做人工 review，并决定 commit 边界。
- GitHub Ubuntu CI 尚未实际运行；通用 Chromium 快照路径已移除平台名，首次推送 `dev` 时应确认 CI 的 bundled Chromium 与本地基线在 1% 容差内。
- 发布流程尚未执行：人工 review/commit 后推送 `dev` 生成 `next`，在独立消费端验证全局插件、按需入口、可选字体、主题切换、Overlay、布局和 DataTable 新 options 契约。
- 22 项开发工具链审计问题需要单独评估；运行时依赖无漏洞，不应在本轮直接执行破坏性的 `npm audit fix --force`。
- 需要补充生产边界回归：多 app/SSR 请求隔离、Overlay 中间层卸载后的 z-index、ScrollView 无 ResizeObserver、SkinViewer 多实例/后台标签页 CPU、DataTable 大数据性能与重复 key、组件快速 mount/unmount 资源释放。
- 需要评估通用站点能力缺口：Date/Time/Calendar、Image/Avatar、Tree/TreeTable、Carousel、Rating/ColorPicker、Select multiple/clearable/async、Autocomplete async debounce、RouterLink/自定义标签适配。
- 独立消费端确认预览版之前不得推送 `main`；`main` 会触发不可逆正式发布。必须继续使用 GitHub Secret `MCUIACTION`，不得改成 `NPM_TOKEN`。
- 本轮未获得也未执行 commit、push 或 publish 授权。

---

## [历史快照]（2.0 基础设施完成时）

- 已在本地 `gitea-backup` 工作区完整实现 `mcui-oreui@2.0.0` 三阶段增强计划；这是一次允许破坏性清理的本地工作，尚未 commit、push 或 publish。
- 阶段一完成：新增可嵌套的 `McThemeProvider`、`McDefaultsProvider`、`McLocaleProvider`；Defaults 遵循“显式 props > 局部 > 组件 > 全局 > 内置”优先级并只注入组件声明过的 props；Theme 已扩充语义 Token，Locale 提供中英文、英文缺失回退、RTL 与逻辑方向样式，Display 增加 `*AndUp/*AndDown` 范围状态并保持 SSR/hydration 稳定。
- 阶段一完成：TextField、Textarea、Select、Autocomplete、Checkbox、RadioGroup、Switch、Slider、FileInput、NumberInput 已统一 `rules/required/disabled/readonly/errorMessages/validateOn` 与同步/异步校验；`McForm` 支持有效状态 `v-model`、input/blur/submit/lazy、fastFail、validating、dirty、错误聚合和 validate/reset/resetValidation。
- 阶段一完成：受控显隐统一为 `modelValue/update:modelValue`；`McDropdown`、`McModal` 及源码、导出、全局类型、web-types 和独立文档已删除，迁移文档明确改用 `McSelect`、`McDialog`。
- 阶段二完成：Overlay 已拆分并具备栈、connected/static 定位、逻辑 location、offset、flip/shift、视口留白、block/close/reposition/none 滚动策略、trap/restore/none 焦点策略、Teleport、persistent、遮罩、顶层 Escape/外部点击，以及 ResizeObserver、滚动祖先和 resize 重定位。
- 阶段二完成：Menu、Select、Autocomplete、Tooltip 均使用 Connected Overlay；Menu 支持 roving focus、方向键、Home/End、Enter/Space、Tab/Escape；Dialog/Drawer 使用 static 与焦点陷阱，嵌套浮层只由顶层响应 Escape。
- 阶段二完成：新增 Layout 注册服务、`McMain`；Appbar 支持 top/bottom、fixed、order，Drawer 统一 `v-model` 并支持 temporary/persistent/permanent、四向位置与移动断点降级；Main 使用四向 CSS 变量应用稳定布局占位。
- 阶段三完成：新增并发布 `McPagination`、`McTable`、`McDataTable`、`McVirtualScroll`、`McFileInput`、`McNumberInput`、`McBreadcrumbs`、`McExpansionPanels`、`McExpansionPanel`、`McStepper`。DataTable 支持 client/server、搜索、稳定多列排序、分页、选择、状态和字段插槽；VirtualScroll 固定 itemHeight；所有导航/流程组件包含相应键盘与 ARIA 模型。
- 根导出、逐组件入口、GlobalComponents、类型、`web-types.json`、README、VitePress 侧边栏、API 表、迁移指南与实时 Demo 已同步；`web-types.json` 可解析，含 63 个组件标签。旧 API 扫描只在 README/迁移指南的删除说明中命中。
- 最终验证全部通过：`npm run typecheck`；`npm test`（12 files / 26 tests，含 providers、异步表单、connected 定位、布局、DataTable、VirtualScroll、键盘、axe、SSR、hydration）；`npm run build`；`npm run check:size`；`npm run test:consumer`；`npm run docs:build`；`npm run test:e2e`（Chromium/Firefox/WebKit 共 9/9）；`npm audit --omit=dev`（0 vulnerabilities）；`npm pack --dry-run --json`；`git diff --check`（仅 CRLF 提示，无空白错误）。
- 最终 gzip 预算：Button 7,104 B、Icon 1,805 B、Container 322 B、完整插件 51,070 B、components.css 5,538 B。npm 干运行包为 1,300,499 B，解包 2,926,473 B，共 280 个文件；新增必需入口全部存在，已删除组件入口为 0。
- 运行时 `dependencies` 为空，唯一 `peerDependencies` 为 Vue；保持零运行时依赖。

## [历史 API/表结构]（2.0 基础设施完成时）

- 插件：`createMcUI(options?: McUIOptions): Plugin`；配置键为 `theme`、`defaults`、`locale`、`icons`、`sounds`、`display`。
- Providers/Composables：`McThemeProvider/useMcTheme`、`McDefaultsProvider/useMcDefaults`、`McLocaleProvider/useMcLocale`、`useMcDisplay`、`useMcOverlay`、`useMcForm`，以及现有 Icons、Sounds、Pop 能力。
- 表单：`McForm` 使用 `v-model` 表示有效状态，支持 `validateOn`、`fastFail`，暴露 `validating/dirty/errors` 与 `validate/reset/resetValidation`；所有适用输入共享统一字段契约和异步规则。
- Overlay：`McOverlay` 支持 `locationStrategy: static | connected`、逻辑 `location`、`offset`、四种 scrollStrategy、三种 focusStrategy、Teleport、persistent、scrim 与 Escape；导出纯函数 `calculateConnectedPosition`。Menu、Select、Autocomplete、Tooltip 共用 Connected Overlay。
- Layout：`McLayout` 提供注册作用域，Appbar/Drawer 注册 position、size、order、active，`McMain` 消费四向偏移；Drawer `mode` 为 `temporary | persistent | permanent`。
- 数据：`McPagination`、`McTable`、`McDataTable`、`McVirtualScroll`；DataTable server 模式仅通过 `update:options` 输出 page/itemsPerPage/sortBy/search，不发起网络请求；VirtualScroll 只支持固定 itemHeight。
- 输入与流程：`McFileInput`、`McNumberInput`、`McBreadcrumbs`、`McExpansionPanels/McExpansionPanel`、`McStepper`。
- 发布子路径：`styles/{tokens,components,base}.css`、`components/*`、`composables/*`、`icons/{normal,key,x,all}`、`sounds/default`。
- 数据库表结构：无；项目是纯前端 Vue 组件库。

## [历史 TODO]（2.0 基础设施完成时）

- 三阶段代码实现与本地自动化验收无阻塞项；仍需维护者对大范围未提交差异做人工 review 并决定 commit 边界。
- 发布流程尚未执行：人工 review/commit 后推送 `dev` 生成 `next`，在独立消费端验证全局插件、按需入口、主题切换、Overlay、布局和 DataTable。
- 独立消费端确认预览版之前不得推送 `main`；`main` 会触发不可逆正式发布。必须继续使用 GitHub Secret `MCUIACTION`，不得改成 `NPM_TOKEN`。
- 本轮未获得也未执行 commit、push 或 publish 授权。

---

## 历史归档（1.x 与 2.0 前审计）

## [历史当前进度]

- 项目已初始化为 `mcui-oreui` Vue 3 + TypeScript 组件库。
- 依赖已可通过 `npm ci` 按 `package-lock.json` 安装。
- 组件库构建命令 `npm run build` 已验证通过。
- VitePress 文档构建命令 `npm run docs:build` 已验证通过。
- 本地文档开发服务可通过 `npm run docs:dev` 启动，当前 PR 分支预览已在 `http://127.0.0.1:5175/mcui-oreui/` 运行。
- 已整理 AI/本地协作忽略规则，`.codex/`、`AGENTS.md`、`CLAUDE.md`、`SESSION_STATE.md` 均不会进入提交。
- 已提交关键维护变更：`2e32397 chore: ignore local AI files`。
- 已拉取 GitHub PR #1 到本地分支 `codex/pr-1-view` 完成审阅，当前工作区已切回 `main`。
- 本地 `main` 仍保留提交 `2e32397`；AI 约束文件已通过 `.git/info/exclude` 做跨分支本地忽略保护。
- 为预览 PR #1，本地使用 `npm install --no-save --package-lock=false @mdi/js@^7.4.47` 安装缺失依赖，未修改可提交文件。
- PR 预览服务已停止；切回 `main` 前发现的 `docs/contributors.md` 临时改动已保存到 `stash@{0}`，未带回 main。
- 已将 `codex/pr-1-view` 合并到 `main`，生成 merge commit `1b6fa39 merge: integrate PR #1 component updates`。
- 合并时同步了 `package-lock.json`，并补齐 `src/index.ts` 中新增组件的导出与全局注册、README 组件列表。
- 合并后已验证 `npm ci`、`npm run build`、`npm run docs:build` 均通过。
- 已推送 `main` 到 GitHub；`Deploy Docs to GitHub Pages` 与 `Publish to npm` workflow 均成功，线上 `components/list.html` 已返回 200。
- npm dist-tags 仍为 `latest: 1.2.0`、`next: 1.2.0-dev.11`，未产生新的正式版本。
- 当前本地 `main` 文档站已启动，地址为 `http://127.0.0.1:5175/mcui-oreui/`。
- 当前本地文档站已改为局域网监听，服务绑定 `0.0.0.0:5175`，可通过 `http://192.168.1.18:5175/mcui-oreui/` 或 `http://192.168.31.130:5175/mcui-oreui/` 访问。
- 已修复 `McList` 上下多余内边距：`.mc-list` 从 `padding: 8px 0` 调整为 `padding: 0`。
- 已定位并修复 `McList` 选择时高度轻微变化：原因是 `.mc-list__item-indicator` 包裹带 margin 的 inline-flex `McRadio`，dot 显隐会影响 inline line box，导致 indicator 在 32px/30px 间变化；现固定 indicator 为 30px flex 容器并清除内部 radio/checkbox margin。验证 `npm run build`、`npm run docs:build` 通过。
- 已修复 `McList` 自定义左右插槽内交互组件事件冒泡问题：列表项改为 `DIV role="button"` 并保留鼠标/键盘选择能力，左右插槽增加独立事件边界，点击 `McSwitch` 等插槽组件不会额外触发列表项 `change` 或列表点击音效；已同步 `docs/components/list.md` 说明，并验证构建与本地文档页交互。
- 已为 `McListItem` 增加 `interactive?: boolean` 字段，默认保留响应样式；设置为 `false` 时关闭该项鼠标指针、悬浮、按下和焦点响应样式，但不禁用点击/键盘选择/`change`。已同步 `docs/components/list.md` 与 `README.md`，并验证构建与本地文档页。
- 已将 `McList` 收敛为单一声明式 API：只支持在 `<mc-list>` 默认插槽内使用 `<mc-list-item>` 子组件声明列表项；移除 `item` 别名与 `items` prop，动态列表用 Vue `v-for`。新增 `src/components/McListItem.vue` 与共享类型 `src/components/listTypes.ts`，全局注册 `mc-list-item`，按需导出组件为 `McListItem`，类型为 `McListItemProps`。已将 `docs/components/list.md` 与 `docs/components/overview.md` 的列表示例迁移为 `<mc-list-item>` 写法，并验证 `npm run build`、`npm run docs:build` 与本地文档页交互。
- 已修复 List 文档站子组件代码块无高亮问题：`docs/components/list.md` 中纯模板示例代码块从 `vue` 切换为 `html`，规避 Shiki Vue 语法对 `<mc-list-item>`、`<template>`、`<mc-switch>` 等自定义子组件的错误整行文本识别；已验证 `npm run docs:build` 与本地浏览器高亮 DOM。
- 已修复 `McSlider` 拖拽不跟手与移动端拖动断连问题：拖拽事件改由轨道接管并使用 pointer capture，拖拽期间关闭进度填充与手柄过渡，补充 `touch-action: none`、`pointercancel`/`lostpointercapture` 收尾和手柄焦点保留；同步更新库样式与文档站作用域样式，并验证 `npm run build`、`npm run docs:build`、桌面及窄视口文档页拖拽。
- 已修复移动端暗色模式导致组件色板被浏览器强制重绘的问题：库样式与文档站作用域样式从 `color-scheme: light` 升级为 `color-scheme: only light`，文档站补充 `meta[name="color-scheme"]`，并在 `.mc-demo` 及内部元素显式保持 `only light`；已验证 `npm run build`、`npm run docs:build` 与 Panel 文档页计算样式。
- 已移除 `McList` 的列表级 `subtitle` 属性与 `.mc-list__subtitle` 渲染样式；标题/副标题信息只保留在 `McListItem` 的 `label`/`subtitle` 上。已同步 `docs/components/list.md` 与 `README.md`，并验证 `npm run build`、`npm run docs:build` 与本地 List 文档页 DOM。
- 已批量修复文档站纯模板示例代码块无高亮问题：将 34 个不含 `<script>` 的 `vue` fence 改为 `html` fence，覆盖 Button、Panel、Progress、Tooltip、Icon、FormField、Drawer 等页面；保留含 `<script setup>` 的完整 SFC 示例为 `vue`。已验证 `npm run docs:build` 与本地浏览器抽查页面高亮 DOM。
- 已发布正式版 `1.2.1`：提交 `635d180 feat: refine list item API and docs` 已推送到 `origin/main`；GitHub Actions `Publish to npm` 与 `Deploy Docs to GitHub Pages` 均成功；`npm view mcui-oreui dist-tags` 确认 `latest: 1.2.1`、`next: 1.2.0-dev.11`。
- 已新增仿 Vuetify 的 Grid 栅格系统：`McContainer`、`McRow`、`McCol`、`McSpacer`，支持 12 列、`sm/md/lg/xl/xxl` 断点、offset、order、对齐、dense/no-gutters 与 spacer 占位；已同步 `docs/components/grid.md`、组件总览、侧边栏与 `README.md`。已验证 `npm run build`、`npm run docs:build`，并在本地文档页确认桌面三列与窄屏堆叠响应正常。
- 已提交 Grid 本地变更：`c10bcd6 feat: add responsive grid system`。
- 已将远程 PR #2（`HaiGeMaster/mcui-oreui:main`，本地引用 `origin/pr/2`）合并到本地 `main`，生成 merge commit `1d12fad merge: integrate PR #2 updates`；合并时保留 Grid，并纳入 PR 的 `McSpinner`、图标架构重构、组件 `bgcolor` 扩展、声音文档与本地搜索/lastUpdated 文档站改动。`package.json` 移除 `@mdi/js` 后已同步刷新 `package-lock.json`。已验证 `npm run build`、`npm run docs:build` 通过；远端 PR 仍为 open，本地 `main` 未推送。
- 已统一组件内部模板标签写法：`McButton`、`McIcon`、`McModal`、`McRadio`、`McCheckbox`、`McListSlotOutlet`、`McFormattedText` 等 PascalCase 标签已改为 `mc-*` kebab-case；TypeScript 导出名和类型名保持不变。已扫描确认 `src/`、`docs/`、`README.md`、`dist/` 中无残留 PascalCase 组件标签，并验证 `npm run build`、`npm run docs:build` 通过。
- 已新增并修正编辑器组件补全支持：`src/index.ts` 增加 Vue `@vue/runtime-core` 与 `vue` 的 `GlobalComponents` 类型增强，声明 PascalCase 组件键（供 Volar 生成/匹配补全候选）与 `mc-*` kebab-case 标签键（供实际模板标签获得 props/事件类型）；新增 `web-types.json` 并在 `package.json` 声明 `"web-types"` 与发布文件，使 VSCode/Volar 可通过包自身类型声明获取组件/props/事件提示，支持 web-types 的工具获取组件标签清单。使用方只需正常导入/安装 `mcui-oreui`，不需要额外配置 `jsconfig`、`tsconfig` 或 Volar 插件。已同步 `README.md` 与 `docs/guide/getting-started.md`，并验证 `npm install --package-lock-only`、`npm run build`、`npm run docs:build`、`npm pack --dry-run --json`、`Test-Json -Path web-types.json`、`git diff --check` 通过；曾发现 dts rollup 丢弃未导出的中间类型，已改为导出 `McUIVueGlobalComponentNames`、`McUIVueGlobalKebabComponents`、`McUIVueGlobalComponents`，确认 `dist/index.d.ts` 与 Test 链接包中声明完整。
- 已去除 pnpm：删除根目录 `pnpm-lock.yaml`，项目保留 npm / `package-lock.json` 作为唯一 lockfile；已扫描确认可提交文件中无 `pnpm` 引用。为执行 `npm ci` 已停止本地 VitePress dev 服务（原 `0.0.0.0:5175`），随后验证 `npm ci`、`npm run build`、`npm run docs:build` 通过；`npm ci` 仍报告既有 13 个依赖审计问题。
- 已优化本地 Test 验证链路：新增 `scripts/write-dist-package.mjs`，`npm run build` 会在 `dist/` 内写入独立 `package.json` 并复制 `web-types.json`，使 `dist/` 本身成为接近 npm 发布形态的干净本地包；`F:\MCWEB\Test` 的依赖已改为 `mcui-oreui: file:../oreui-vue/dist`，`node_modules/mcui-oreui` 指向 `F:\MCWEB\oreui-vue\dist` 且无嵌套 `node_modules`，避免 VSCode/Volar 因链接源码根目录而解析到库开发依赖里的另一份 Vue。已验证 TypeScript 探针可识别 `vue` 与 `@vue/runtime-core` 的 `GlobalComponents` 中同时包含 `McButton` 和 `mc-button`，并验证 Test `npm run build`、库 `npm run build`、`npm run docs:build`、`npm pack --dry-run --json` 通过。
- 已修复 `McButton` 点击按下态导致周围组件抖动的问题：按钮各尺寸显式设置 `box-sizing: border-box` 与固定 `height/min-height/max-height`，按钮本体保持原 margin、`padding: 0` 且不使用外层 `transform` 位移；新增内部 `.btn__content` 层承载文字/图标，内部层也保持固定高度与固定 `padding-bottom: 4px`，`:active` 仅在按住期间下移 2px，松手立即恢复；各 variant 的 active 阴影保留恒定 4px 底部厚度，避免顶部/底部/内部层高度随点击变化。已同步更新库样式、文档站作用域样式、Button 文档与 README。已验证库 `npm run build`、`npm run docs:build`、`F:\MCWEB\Test` 的 `npm run build` 通过，`dist/` 与 Test 构建产物均确认无 `translateY(4px)` 和 `height: calc(100% - 4px)`，本地浏览器 538×777 视口实测按钮固定 40px 外轮廓、内部层固定 36px。
- 2026-07-28 已完成以 Vuetify 为基线的当前项目全量审计。审计基线：本地 35 个 Vue SFC；Vuetify npm 最新版为 4.1.6、`v3-stable` 为 3.13.0，官网 All Components 页面收录 102 个去重文档入口。当前项目定位应明确为 Ore UI 主题化组件库，而非直接追求 Vuetify 全量应用框架同构。
- 审计验证：`npm run build`、`npm run docs:build`、`npm pack --dry-run --json`、`npm audit --omit=dev --json`、`git diff --check` 均通过；运行时依赖漏洞为 0。完整 `npm audit` 仍有 15 个开发工具链漏洞（8 moderate、7 high）。发布包约 1.66 MB，解包约 3.47 MB；主 CSS 2.34 MB（gzip 1.11 MB），ESM 525 KB（gzip 268 KB）。
- 审计 P0/P1 结论：库样式仍直接污染 `:root/*/html/body/header/main/a/button`，并设置 `body overflow:hidden`、全局 `user-select:none`；Checkbox、Switch、Dropdown、Modal、Slider、Tabs 等缺完整键盘/焦点/ARIA 契约；Modal 实测打开后焦点仍留在触发按钮、Escape 无法关闭且无 `role=dialog/aria-modal`；无测试、lint、Story/E2E；302 个 SVG 通过 `import.meta.glob(..., eager:true)` 全量进入图标入口，字体/样式缺按组件拆分；Token 目前基本未驱动组件色板；缺少 Vuetify 级 theme/defaults/locale/form/overlay 基础设施。
- 审计发布风险：当前 `main` 相对 `origin/main` ahead 4 且工作区有未提交变更，`package.json` 仍为已发布的 1.2.1；若直接推送 main，发布 workflow 会命中“版本已存在”并跳过 npm 发布，可能造成线上文档与 npm 包不一致。
- 2026-07-28 已拉取并合并 GitHub `origin/main` 最新提交 `ec87d29`。合并时保留本地 Grid，并纳入远端 1.2.2、`McAppbarButton`、`McAppbarIcon`、新版 Layout Demo 与相关文档；README、VitePress 配置、组件总览的 3 个冲突已人工合并，生成本地 merge commit `34e42ec`。自动保护的未提交改动已完整恢复。当前 `main` 包含 `origin/main`、相对远端 ahead 3、behind 0，工作区仍保留同步前的既有未提交改动。`npm run build` 与 `npm run docs:build` 均验证通过。
- 2026-07-28 已将所有非忽略的当前项目改动提交为 `0c69774 chore: sync complete project state`；工作区干净，本地 `main` 相对 GitHub `origin/main` ahead 4、behind 0。
- 2026-07-28 已在 Gitea 创建私有仓库 `ShenYuan/mcui-oreui`，网页地址为 `http://192.168.1.170:3000/ShenYuan/mcui-oreui`，本地远端名为 `gitea`，SSH 地址为 `ssh://git@192.168.1.170:222/ShenYuan/mcui-oreui.git`。
- Gitea 已完整同步本地 Git 分支：`main` → `0c69774`、`dev` → `99fb8ff`、`codex/pr-1-view` → `0119bec`；当前无 Git 标签。已通过 `git ls-remote` 与 Gitea 仓库页面双重验证，页面显示 3 个分支、40 个 main 提交，默认分支为 `main`。
- 本地私有/构建文件 `.codex/`、`.venv/`、`AGENTS.md`、`CLAUDE.md`、`SESSION_STATE.md`、`dist/`、`node_modules/` 及 VitePress 缓存/构建目录继续按忽略规则保留在本机，未上传 Gitea；既有 `stash@{0}` 也未上传。
- Gitea 作为本地私有备份存储，新增仅推送到 Gitea 的 `gitea-backup` 分支：该分支在完整项目源码基础上额外追踪 `AGENTS.md`、`CLAUDE.md`、`SESSION_STATE.md` 与项目级 `.codex/`。这些 AI 文件继续受 `main` 的忽略规则保护，禁止推送到公开 GitHub；`.venv/`、`dist/`、`node_modules/` 与既有 stash 不属于 AI 资产，仍不纳入仓库。
- 2026-07-28 已在 `gitea-backup`（`0a7d364`）复核 Vuetify 差异审计：当前源码含 37 个 Vue SFC、302 个 SVG，Vuetify npm 当前 `latest` 为 4.1.6（包内 102 个非 transition 组件目录、63 个平级 composable、9 个 directive）。本项目构建与文档构建通过，运行时依赖漏洞为 0；完整开发工具链仍有 15 项漏洞（8 moderate、7 high）。发布包约 1.66 MB、解包约 3.49 MB，CSS 2.337 MB（gzip 1.105 MB），ESM 531.95 KB（gzip 269.71 KB）。esbuild 消费端探针显示仅导入 `McContainer` 仍约 293 KB / gzip 155 KB，仅导入 `McButton` 约 436 KB / gzip 241 KB，确认根入口/全局注册对象/eager 图标与内联资源显著妨碍细粒度 tree-shaking。当前 `main` 与 `origin/main` 提交计数为 ahead 0 / behind 0；当前检出分支为 `gitea-backup`。

## [项目目标和技术栈]

- 项目目标：提供 Minecraft 基岩版 Ore UI 风格的 Vue 3 组件库，包含组件、样式、图标、音效、格式化文本能力与 VitePress 文档站。
- 技术栈：Vue 3、TypeScript、Vite 5、vite-plugin-dts、VitePress。
- 包名：`mcui-oreui`。
- 当前版本：`1.2.2`。

## [历史 API/表结构]

- 全局插件默认导出：`McUIVue`。
- 组件导出：`McButton`、`McCheckbox`、`McSwitch`、`McDropdown`、`McTextField`、`McSlider`、`McCard`、`McLayout`、`McContainer`、`McRow`、`McCol`、`McSpacer`、`McHeader`、`McAppbar`、`McAppbarButton`、`McAppbarIcon`、`McScrollView`、`McModal`、`McLoadingMask`、`McPopHost`、`McTooltip`、`McProgress`、`McRadio`、`McRadioGroup`、`McTabs`、`McButtonTabs`、`McList`、`McListItem`、`McPanel`、`McFormField`、`McConfirm`、`McDrawer`、`McFormattedText`、`McTcode`、`McIcon`、`McSpinner`、`McSkinViewer`。
- Grid API：`McContainer` 字段 `fluid?`、`tag?`；`McRow` 字段 `tag?`、`dense?`、`noGutters?`、`align?`、`alignSm/Md/Lg/Xl/Xxl?`、`justify?`、`justifySm/Md/Lg/Xl/Xxl?`；`McCol` 字段 `tag?`、`cols?`、`sm/md/lg/xl/xxl?`、`offset?`、`offsetSm/Md/Lg/Xl/Xxl?`、`order?`、`orderSm/Md/Lg/Xl/Xxl?`、`alignSelf?`、`alignSelfSm/Md/Lg/Xl/Xxl?`；`McSpacer` 字段 `tag?`。导出类型：`McGridAlign`、`McGridJustify`、`McGridAlignSelf`、`McGridColumnValue`、`McGridOrderValue`。
- `McList` 字段：`modelValue?`、`mode?`、`showRadio?`；不提供列表级标题/副标题属性。
- `McListItemProps` 字段：`label`、`value`、`disabled?`、`interactive?`、`icon?`、`iconRight?`、`subtitle?`。
- `McSpinner` 字段：`size?`、`color?`（`white | dark`），用于 GIF 加载指示器。
- 工具导出：`parseMcFormatCodes`、`renderMcFormatCodes`、`stripMcFormatCodes`、`getMcIcon`、`hasMcIcon`、`mcIconNames`、`mcNormalIconNames`、`mcKeyIconNames`、`mcXIconNames`。
- 组合式能力：`useSound`、`playSound`、`playSoundType`、`setSoundEnabled`、`usePop`、`showPop`、`popState`。
- 编辑器元数据：通过 `@vue/runtime-core` 与 `vue` 的 `GlobalComponents` 提供 PascalCase + `mc-*` 双键组件补全/类型声明；`web-types.json` 提供同名组件标签清单并随 npm 包发布。
- 本地 dist 包：`npm run build` 后 `dist/` 内生成独立 `package.json` 与 `web-types.json`，可供其他本地项目用 `file:../oreui-vue/dist` 直接链接验证。
- 按钮布局行为：`McButton` 的 `extra_small`、`small`、`middle`、`large` 尺寸在 hover/active 交互中保持固定外轮廓和固定内部层高度；按下视觉反馈不使用外层位移，仅移动内部 `.btn__content` 的文字/图标并切换恒定厚度的压感阴影，不改变父容器布局高度。
- 数据库表结构：无，本项目当前为前端组件库，无数据库。

## [历史 TODO]

- P0：拆分并隔离全局样式。把整页布局/reset 改为显式 opt-in 容器，组件样式使用 `mc-` 命名空间；不得让普通组件导入修改宿主 `body/html/*/header/main/a/button`。
- P0：建立可访问性基线与自动测试。优先修复 Dropdown、Checkbox、Switch、Modal/Drawer、Slider、Tabs、Card 的原生语义、键盘模型、焦点管理、ARIA 关联；加入 Vitest + Vue Test Utils、axe 与浏览器交互回归，CI 必须运行。
- P1：建立 Vuetify 式基础设施层：可实际驱动组件的 Theme/Defaults Provider、统一 Input/Form 校验契约、Overlay/Activator/焦点栈、Locale/RTL/Display 组合式能力，再扩展组件数量。
- P1：优化发布体积与 tree-shaking：拆分组件/样式子路径，图标按需加载或独立包，字体与声音改为可选资产；建立 bundle size budget。当前 302 个 eager SVG、2.34 MB CSS 不适合作为默认最小入口。
- P1：重构包入口与资产交付：提供 `./components/*`、`./composables/*`、分组件 CSS 等子路径；把默认全局注册入口与按需入口分开；图标、字体、图片、声音改为显式可选资产，并为消费端建立 gzip 体积预算。当前 `main` 与 `origin/main` 已同步；未来触发正式发布仍须先 bump `package.json`/`package-lock.json`。
- P2：补齐高价值组件而非机械追平 102 项：Alert/Snackbar/Badge/Chip/Divider/Skeleton、Menu/Overlay、Textarea/Select/Autocomplete、Breadcrumbs/Pagination、DataTable/VirtualScroller 优先；Pickers、Treeview、Charts 后置。
- P2：补充第三方字体、图标、音效的逐项来源与授权清单，避免 README 的“无官方美术资产”表述与实际随包资产缺少可审计来源。
- 处理 `npm ci` 报告的依赖安全审计问题；需要人工评估是否接受 `npm audit fix` 带来的版本变化。
- 若新增功能、组件、API 或行为改动，必须同步更新 `docs/` 与 `README.md`。
- 发布正式版前必须先更新 `package.json` 版本，并同步 `package-lock.json`。
