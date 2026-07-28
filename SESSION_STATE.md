# SESSION_STATE

## [当前进度]

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

## [项目目标和技术栈]

- 项目目标：提供 Minecraft 基岩版 Ore UI 风格的 Vue 3 组件库，包含组件、样式、图标、音效、格式化文本能力与 VitePress 文档站。
- 技术栈：Vue 3、TypeScript、Vite 5、vite-plugin-dts、VitePress。
- 包名：`mcui-oreui`。
- 当前版本：`1.2.2`。

## [已定义的 API/表结构]

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

## [未完成的任务列表]

- P0：拆分并隔离全局样式。把整页布局/reset 改为显式 opt-in 容器，组件样式使用 `mc-` 命名空间；不得让普通组件导入修改宿主 `body/html/*/header/main/a/button`。
- P0：建立可访问性基线与自动测试。优先修复 Dropdown、Checkbox、Switch、Modal/Drawer、Slider、Tabs、Card 的原生语义、键盘模型、焦点管理、ARIA 关联；加入 Vitest + Vue Test Utils、axe 与浏览器交互回归，CI 必须运行。
- P1：建立 Vuetify 式基础设施层：可实际驱动组件的 Theme/Defaults Provider、统一 Input/Form 校验契约、Overlay/Activator/焦点栈、Locale/RTL/Display 组合式能力，再扩展组件数量。
- P1：优化发布体积与 tree-shaking：拆分组件/样式子路径，图标按需加载或独立包，字体与声音改为可选资产；建立 bundle size budget。当前 302 个 eager SVG、2.34 MB CSS 不适合作为默认最小入口。
- P1：决定是否将当前 `main` 相对 GitHub `origin/main` ahead 4 的提交同步回 GitHub；若触发正式发布，仍需先 bump `package.json`/`package-lock.json`，避免 main workflow 因版本已存在而跳过 npm 发布。
- P2：补齐高价值组件而非机械追平 102 项：Alert/Snackbar/Badge/Chip/Divider/Skeleton、Menu/Overlay、Textarea/Select/Autocomplete、Breadcrumbs/Pagination、DataTable/VirtualScroller 优先；Pickers、Treeview、Charts 后置。
- P2：补充第三方字体、图标、音效的逐项来源与授权清单，避免 README 的“无官方美术资产”表述与实际随包资产缺少可审计来源。
- 处理 `npm ci` 报告的依赖安全审计问题；需要人工评估是否接受 `npm audit fix` 带来的版本变化。
- 若新增功能、组件、API 或行为改动，必须同步更新 `docs/` 与 `README.md`。
- 发布正式版前必须先更新 `package.json` 版本，并同步 `package-lock.json`。
