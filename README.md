# mcui-oreui 2

面向 Vue 3.5+ 的 Minecraft / OreUI 专用组件库。2.0 保留像素视觉、格式化文本、皮肤查看器、图标和可选音效，同时加入 Theme、Defaults、Locale、Display、Form、Overlay、SSR 与无障碍基础设施。

> 非官方第三方项目，与 Mojang Studios 无从属关系。视觉基准来自 [Spectrollay-OreUI/OreUI](https://github.com/Spectrollay-OreUI/OreUI)（MIT），本轮对照 revision [`0bf8f466`](https://github.com/Spectrollay-OreUI/OreUI/commit/0bf8f46655878da872e4ddfa03db9ac663212438)。

## 安装

```bash
npm install mcui-oreui
```

需要 `vue: ^3.5.0`。

使用文档：[快速开始](./docs/guide/getting-started.md)只介绍安装与基础使用；Theme、Defaults、Locale、Display、Icons、Sounds、按需入口和可选样式统一见[配置选项](./docs/guide/configuration.md)。

## 全局插件

以下代码放在**使用本组件库的 Vue 应用客户端入口文件**，通常是 `src/main.ts`。`createMcUI({...})` 是运行时插件配置；只有传给 `app.use()` 后才会生效，库不会自动读取 `mcui.config.ts`、`vite.config.ts` 或其他配置文件。

```ts
// src/main.ts
import { createApp } from 'vue'
import { createMcUI } from 'mcui-oreui'
import { mcNormalIconSet } from 'mcui-oreui/icons/normal'
import App from './App.vue'

const app = createApp(App)
const mcui = createMcUI({
  icons: { sets: { mc: mcNormalIconSet } },
  sounds: { enabled: false },
})

app.use(mcui)
app.mount('#app')
```

在消费应用的根组件 `src/App.vue` 中，建议用 `<mc-app>` 包裹应用内容，它会应用当前主题 CSS 变量与 Locale 的 `dir`：

```vue
<template>
  <mc-app>
    <mc-button variant="primary">开始游戏</mc-button>
  </mc-app>
</template>
```

`McButton` 按住时会像 Ore UI 原生按钮一样向下压入 4px并收起底部厚度，松开后立即恢复；交互期间外层占位不变，不会带动相邻布局跳动。传入 `loading` 时会显示圆形旋转加载图标并禁用按钮。

`createMcUI()` 会引用全部公共组件，因此安装全量插件时会自动携带完整组件 CSS。2.0 不再提供旧 `McUIVue` 默认导出，也不再默认加载全局 reset、Utilities、字体、图标或声音。

## 按需使用

```vue
<script setup lang="ts">
import McButton from 'mcui-oreui/components/McButton'
import { useMcTheme } from 'mcui-oreui/composables/theme'

const theme = useMcTheme()
</script>

<template>
  <mc-button @click="theme.setTheme('ore')">Ore UI</mc-button>
</template>
```

根入口的命名导入与 `components/*` 按需入口都会通过静态 ESM import 自动携带实际使用组件及其依赖组件的 CSS；不使用运行时 `document` 注入，可由 Vite、Rollup 等消费端继续 tree-shake。通常不再手动导入 `components.css`。

样式同时保留五个手动入口：

- `styles/tokens.css`：主题变量；组件必要样式已通过内部 `component-core.css` 自动依赖它。
- `styles/components.css`：确定性生成的全量组件样式聚合入口，适合非 JS 场景或显式预加载；不包含 Utilities。
- `styles/utilities.css`：Vuetify 4.1.6 对等工具类，始终显式可选，不会被组件入口或 `components.css` 自动加载。
- `styles/fonts.css`：可选的 Minecraft Ten / Seven / Five 字体声明；默认包不会自动加载字体。
- `styles/base.css`：只为显式添加的 `.mc-page` 页面环境提供 opt-in 样式，不承担组件视觉或 1.x 兼容层。

需要完整视觉时，在应用入口额外导入字体：

```ts
import 'mcui-oreui/styles/fonts.css'
```

需要 `d-flex`、`ma-4` 等工具类时再单独导入：

```ts
import 'mcui-oreui/styles/utilities.css'
```

Utilities 使用 `d-flex`、`ma-4`、`justify-center` 等 Vuetify 类名，固定采用 `sm/md/lg/xl/xxl` 断点；间距单位为 `--mc-spacer: 4px`，支持 `auto` margin、`n1–n16` 负 margin、RTL 逻辑方向、打印类、主题 `text-*` / `bg-*` / `border-*` 和 `elevation-0–24`。文档按样式工具族分章，尺寸变体以 `{breakpoint}` 汇总；用法见[分辨率](./docs/styles/breakpoints.md)，跨工具族查询见[样式类名索引](./docs/styles/utility-index.md)。Grid、图片适配和宽高比仍由对应组件负责，不会生成 `d-grid` 或 `object-fit-*` 等额外类。

Slider 与 Switch 保留原生表单语义，但可见部分由独立的 Ore UI 像素轨道、双色状态层和凸起手柄绘制，不依赖浏览器默认 range/checkbox 外观。Slider 使用 20px 手柄与 12px 轨道的近黄金比例，透明交互层仍保持 36px 高；单行输入框以 20px 整数行高和对称内边距保持文字垂直居中。

ButtonTabs 会按容器宽度等分标签；内部按钮不使用普通 Button 的固定宽度，窄布局和长标签不会撑破父容器。

Checkbox（包括 List 多选指示器）使用 crispEdges 像素勾号与 CSS 像素混合态横杠，不依赖系统字体字形；List 根节点会抵抗宿主 `ul` 的 margin、padding 与 list-style，避免文档或文章样式带来额外缩进。

ScrollView 使用固定外框裁剪与内部原生滚动层，内容不会越过容器，Ore UI thumb 会随滚动和内容尺寸同步；Breadcrumbs、ExpansionPanels 与 Stepper 会隔离宿主 `ol/li/h3` 的 margin、padding 和排版偏移。

## 配置选项

配置较多时，可在消费应用中新建 `src/plugins/mcui.ts` 集中创建插件实例：

```ts
// src/plugins/mcui.ts
import { createMcUI } from 'mcui-oreui'

export const mcui = createMcUI({
  theme: {
    defaultTheme: 'ore',
    themes: {
      ore: { dark: true, colors: { primary: '#3c8527' } },
    },
  },
  defaults: {
    global: { disabled: false },
    components: { McButton: { variant: 'primary' } },
  },
  locale: {
    locale: 'zh-CN',
    fallback: 'en',
    messages: { 'zh-CN': { save: '保存' } },
    rtl: ['ar'],
  },
  display: { ssrWidth: 1280, mobileBreakpoint: 'md' },
})
```

这个文件不会自动执行；仍需在客户端入口显式安装：

```ts
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { mcui } from './plugins/mcui'

createApp(App).use(mcui).mount('#app')
```

也可以把同一份 `createMcUI({...})` 配置直接写在 `src/main.ts`。每个 Vue app 只创建并安装一个 McUI 插件实例，同一插件实例不能安装到第二个 App。

`createMcUI()` 返回兼容 Vue `Plugin` 的 `McUIPlugin`，并通过只读的 `services` 暴露当前 App 独立的 Theme、Defaults、Locale、Display、Icons、Sounds、Overlay、Form 和 Pop 实例。组件外触发服务时使用同一插件实例：

```ts
mcui.services.pop.show('已保存')
mcui.services.sounds.play('click')
```

组件 `setup` 内使用 `usePop()`、`useSound()`、`useMcTheme()`、`useMcDefaults()`、`useMcLocale()`、`useMcDisplay()`、`useMcOverlay()` 和 `useMcForm()`。`usePop()` 与 `useSound()` 获取当前 App 注入的实例；2.0 不导出无作用域的 `showPop`、`popState`、`playSound`、`playSoundType` 或 `setSoundEnabled`。

子树可用 `McThemeProvider`、`McDefaultsProvider`、`McLocaleProvider` 做嵌套作用域；局部主题、默认值和 RTL 不会泄漏到外部。Display 提供 `smAndUp`、`mdAndDown` 等范围状态，并支持 `ssrWidth`。

## 图标与声音

核心入口不会加载 302 个 SVG。图标拆为：

```ts
import { mcNormalIconSet } from 'mcui-oreui/icons/normal'
import { mcKeyIconSet } from 'mcui-oreui/icons/key'
import { mcXIconSet } from 'mcui-oreui/icons/x'
// 或显式加载全部：mcui-oreui/icons/all
```

声音也需要显式引入，并合并到上述同一个 `createMcUI()` 配置中：

```ts
// src/plugins/mcui.ts（或直接写在 src/main.ts）
import { createMcUI } from 'mcui-oreui'
import { mcDefaultSounds } from 'mcui-oreui/sounds/default'

export const mcui = createMcUI({
  sounds: { enabled: true, sounds: mcDefaultSounds },
})
```

不要为了启用声音再次调用 `app.use(createMcUI(...))`；应把 `sounds`、`icons`、`theme` 等配置合并到同一个插件实例。

在组件外播放声音使用 `mcui.services.sounds.play('click')`；在组件 `setup` 内使用 `const sound = useSound()` 和 `sound.play('click')`。

## 组件

- 基础：App、Button、Icon、Card（CardItem、CardTitle、CardSubtitle、CardText、CardActions）、Divider。
- 表单：Form（组合与验证）、FormField（字段展示）、单行文本输入框（TextField）、多行文本输入框（Textarea）、Select、Autocomplete、Checkbox、Radio、RadioGroup、Switch、Slider、FileInput、NumberInput。Form 与字段输入组件属于同一组件族；标准输入组件已内置字段展示层，展示与验证在文档中分开说明。
- 导航：Tabs、ButtonTabs、List、Breadcrumbs、Pagination、ExpansionPanels / ExpansionPanel、Stepper。
- 布局：Container、Row、Col、Spacer、Layout、Panel、Appbar、AppbarButton、AppbarIcon、Main、Drawer、ScrollView、VirtualScroll。
- 数据展示：Table、DataTable、Badge、Chip、SkinViewer。
- 浮层：Overlay、Dialog（含 Confirm）、Menu、Tooltip。
- 反馈：Alert、Snackbar、Progress、Spinner、Skeleton、LoadingMask、PopHost。
- Minecraft：FormattedText、Tcode。

`McSkeleton` 的数字与纯数字字符串尺寸按 px 解释，带单位的 CSS 长度保持原样，因此直接书写 `height="34"` 也不会塌陷。

VitePress 文档按上述职责分组，侧边栏统一使用“中文 / English”组件名称；每个独立功能组件均有自己的页面与实时 Demo，Grid、ExpansionPanels、Dialog / Confirm 等紧密协作的组件族保留在同一页面。

Card 表示可重复排列、可点击或跳转的独立信息对象；Panel 表示承载复杂内容的页面区域，使用固定 header/footer 与可伸展滚动 body。简单判断：一条内容用 Card，内容放置位置用 Panel。

文档站保留 VitePress 的 Markdown、SSR、静态构建、本地搜索和代码高亮内核，并用 MCUI 组件覆盖默认外壳：固定 Appbar、可持久化 Drawer、面包屑、响应式 H2/H3 目录、前后页、首页、404 与页脚都使用统一 OreUI 视觉。Vue 示例源码默认收起，并自动拆分为 JS、HTML、CSS 标签，使用 2 空格缩进且保留高亮与复制功能。Appbar 不重复放置“文档 / 设计 Token”入口，右侧固定按“搜索、贡献者、GitHub”排列。`<960px` 使用临时抽屉，`960–1279px` 使用常驻侧栏和正文顶部目录，`>=1280px` 同时显示左侧栏与右侧 sticky 目录；组件 Demo 仍限制在 `.mc-demo` / `.ore-demo` 内，不会把库的页面级基础样式注入 VitePress。

2.0 已删除 `McDropdown` 与 `McModal`：分别迁移到 `McSelect` 和 `McDialog`。所有受控显隐组件统一使用 `v-model`，不再提供 `open` / `update:open`。

## 表单与浮层

`McForm` 提供 `v-model` 有效状态、`validateOn: input | blur | submit | lazy`、`fastFail`、`validating`、`dirty` 与字段错误聚合，并暴露 `validate()`、`reset()`、`resetValidation()`。所有输入控件共享同步/异步 `rules`、`required`、`disabled`、`readonly`、`errorMessages` 和 `validateOn`。

表单控件统一接受 `label`、`description`、`hint`、`disabled`、`readonly`、`required`、`rules`、`errorMessages`、`validateOn` 与 `id`。标准原生属性和 `aria-*` 直接写在组件上：`class`、`style`、`data-*` 保留在组件外层，其余原生属性、ARIA 与交互监听器会路由到实际的 `button`、`input`、`textarea`、`nav` 或浮层语义元素。

`McOverlay` 支持 static / connected 定位、逻辑方向 location、offset、边缘 flip/shift、`block | close | reposition | none` 滚动策略、`trap | restore | none` 焦点策略、Teleport、Escape、遮罩和叠层。Menu、Select、Autocomplete、Tooltip 共用 Connected Overlay；Dialog 与临时 Drawer 使用 static + focus trap。

`McLayout` 内的 Appbar 与 Drawer 会注册占位，`McMain` 通过逻辑方向 CSS 变量避开四向栏位。Drawer 提供 `temporary | persistent | permanent`，persistent 在移动断点自动转为 temporary。

`McDataTable` 用单一 `options` / `update:options` 管理 `page`、`itemsPerPage`、`sortBy` 与 `search`，主 `v-model` 只管理行选择；server 模式同样只输出 `update:options`，不会内置网络请求。加载态默认自动保留刷新前的真实表体高度，也可用 `loadingHeight="320px"` 或 `loadingHeight="6L"` 固定为像素/行数高度；每页条数使用紧凑下拉选择，空数据时显示内置空状态并允许用 `no-data` 插槽替换。`McVirtualScroll` 默认填满父容器宽度、兼容 flex / Grid 宿主，2.0 仅支持固定 `itemHeight`。不包含固定列、列拖拽、树表或动态高度虚拟化。

## 开发与验证

维护者请先阅读[2.0 开发指南](./docs/guide/development.md)和[贡献说明](./CONTRIBUTING.md)，其中包含目录架构、样式隔离、SSR、无障碍、测试矩阵与分支发布约定。

```bash
npm run check
npm run test:e2e
npm run check:release
```

`npm run check` 包含格式、ESLint/Stylelint、生成文件漂移、组件文档 Demo/SFC 对应关系、类型、90/85 覆盖率、构建、消费端、文档和体积检查；`check:release` 还执行三浏览器 E2E（包括文档 Drawer、搜索、目录、首页、404、溢出与 axe 回归）、版本/CHANGELOG/npm pack 审计和运行时依赖审计。

构建产物提供 `components/*`、`composables/*`、`icons/*`、`sounds/*` 与 `styles/*` 子路径。每个组件 JS 入口包含构建期生成的静态 CSS import；单组件入口只携带自身、真实 JS 依赖、Core 与确实使用的中性共享样式，不会包含无关兄弟组件 CSS、全量 SVG、音频、字体 data URI 或 Utilities。

## 许可

[MIT](./LICENSE)
