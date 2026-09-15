# 从 1.x 迁移到 2.0

2.0 是当前正式版（`2.0.0`）。测试线安装 `npm i mcui-oreui@next`（当前 `2.0.1-dev.23`）。这次收敛不提供旧 Props、事件或组件别名的运行时兼容层。Ore UI 视觉以 MIT 的 [Spectrollay-OreUI/OreUI](https://github.com/Spectrollay-OreUI/OreUI) revision [`0bf8f466`](https://github.com/Spectrollay-OreUI/OreUI/commit/0bf8f46655878da872e4ddfa03db9ac663212438) 为固定参考。

## 基础用法

- 默认插件改为 `createMcUI(options)`，并在 `mount()` 前通过 `app.use()` 安装。
- 根入口命名导入与 `components/*` 按需入口会通过静态 ESM import 自动携带实际组件 CSS；删除常规使用中的手动 `styles/components.css` 导入。安装全量 `createMcUI()` 时会加载全部组件样式。
- `mcui-oreui/styles/components.css` 保留为生成式全量聚合入口，只用于显式预加载或非 JS 集成；它不修改宿主的 `html`、`body`、`:root`、`*`、`header`、`main`、`a` 或 `button`。
- Minecraft Ten / Seven / Five 改为可选入口 `mcui-oreui/styles/fonts.css`，默认组件样式不会加载字体。
- `styles/base.css` 只作用于显式 `.mc-page` 页面环境，不再提供字体或 1.x 兼容视觉。
- 新增 `styles/utilities.css` 独立入口，必须显式导入；组件入口与 `styles/components.css` 都不会自动包含它。类名使用 `d-flex`、`ma-4` 等公开名称，不增加 `mc-` 前缀；Grid、图片适配和宽高比仍由组件承担。
- 图标和声音改为 `icons/*`、`sounds/*` 显式入口。

## 全局 API 约定

`createMcUI()` 现在返回带只读 `services` 的 Vue 插件。每个 App 创建一个实例并在 `mount()` 前安装：

```ts
const mcui = createMcUI()
app.use(mcui)

mcui.services.pop.show('已保存')
mcui.services.sounds.play('click')
```

| 旧 V2 无作用域导出   | 2.0 替代写法                                                   |
| -------------------- | -------------------------------------------------------------- |
| `showPop(...)`       | setup 内 `usePop().show(...)`；组件外 `mcui.services.pop.show` |
| `popState`           | `usePop().state` 或 `mcui.services.pop.state`                  |
| `playSound(...)`     | setup 内 `useSound().play(...)`                                |
| `playSoundType(...)` | `useSound().playVariant(...)`                                  |
| `setSoundEnabled`    | `useSound().setEnabled(...)` 或 `mcui.services.sounds`         |

这些旧导出已从 2.0 删除。Pop、Sounds 及其他服务现在按 App/SSR 请求隔离，并随 App 卸载释放资源；同一插件实例不能安装到第二个 App。

| 1.x / 旧 V2 写法                                      | 2.0 写法                                       | 说明                                                                                |
| ----------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------- |
| `open` / `update:open` / `v-model:open`               | `modelValue` / `update:modelValue` / `v-model` | 所有受控显隐组件统一                                                                |
| 用户确认后只发 `update:modelValue`                    | 同时发 `change`                                | 表单、选择、分页、步骤与 DataTable 选择统一                                         |
| `bgcolor` / `bgColor`                                 | `color`                                        | Button、ButtonTabs item、AppbarButton、Checkbox、Radio、Switch、Slider、Progress 等 |
| Alert `type`                                          | Alert `variant`                                | `info                                                                               | success | warning | error`  |
| Progress `status`                                     | Progress `variant`                             | `normal                                                                             | success | error`  |
| Snackbar 语义 `color`                                 | Snackbar `variant`                             | `default                                                                            | success | error   | warning | info` |
| `ariaLabel`、`label`、`valueText` 等可访问性包装 Prop | 标准 `aria-label`、`aria-valuetext` Attr       | 直接写在组件标签上，组件转发到实际语义元素                                          |
| 组件专用原生 Attr Props                               | 标准 HTML Attr                                 | `autocomplete`、`maxlength`、`inputmode`、`name`、`aria-*` 等按语义路由             |

`class`、`style` 与 `data-*` 会合并到组件外层；标准原生属性、ARIA 和交互监听器进入实际的 `button`、`input`、`textarea`、`nav`、`dialog` 或 Overlay 内容。内部实现 Props 不会透传到 DOM。

## 组件与 Props 迁移

| 组件                                               | 已删除或重命名           | 替代写法                                                                                  |
| -------------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------- |
| `McDropdown`                                       | 组件删除                 | 使用 `McSelect`；`v-model` 直接绑定 option value，不再绑定从 1 开始的下标                 |
| `McModal`                                          | 组件删除                 | 使用 `McDialog`                                                                           |
| Drawer / Confirm / Dialog                          | `open`、`update:open`    | 主 `v-model`                                                                              |
| `McDrawer`                                         | `placement`              | `position="start                                                                          | end | top | bottom"`；模式使用 `mode="temporary | persistent | permanent"` |
| `McButton`                                         | `bgcolor`、`ariaLabel`   | `color`、标准 `aria-label`                                                                |
| `McButtonTabs` item                                | `bgcolor`                | item 的 `color`                                                                           |
| `McAppbarButton`                                   | `bgColor`、`ariaLabel`   | `color`、标准 `aria-label`                                                                |
| `McAppbarIcon`                                     | 可访问性 `label`         | 标准 `aria-label`；可见提示仍使用 `tip`                                                   |
| `McCheckbox` / `McRadio` / `McSwitch` / `McSlider` | `bgcolor`                | `color`                                                                                   |
| `McSlider`                                         | `ariaLabel`、`valueText` | 标准 `aria-label`、`aria-valuetext`                                                       |
| `McProgress`                                       | `status`、`bgcolor`      | `variant`、`color`                                                                        |
| `McAlert`                                          | `type`、`title`、`text`  | `variant`；标题用 `title` 插槽，正文用默认插槽                                            |
| `McCard`                                           | `title`、`description`   | `McCardItem` / `McCardTitle` / `McCardSubtitle` / `McCardText` / `McCardActions` 组合结构 |
| `McPanel`                                          | `bordered`、`elevated`   | 删除视觉变体；Panel 默认使用区域外框、固定头尾和可滚动正文                                |
| `McChip`                                           | `text`                   | 默认插槽                                                                                  |
| `McSnackbar`                                       | `message`、语义 `color`  | 默认插槽、`variant`                                                                       |
| `McIcon`                                           | 可访问性 `label`         | 标准 `aria-label`                                                                         |
| `McBadge` / `McSkeleton`                           | 可访问性 `label`         | 标准 `aria-label`                                                                         |
| `McBreadcrumbs` / `McPagination`                   | `ariaLabel`              | 标准 `aria-label`，转发到 `nav`                                                           |

## TextField 与表单

所有适用输入统一为扁平契约：`label`、`description`、`hint`、`disabled`、`readonly`、`required`、`rules`、`errorMessages`、`validateOn`、`id`。外部错误统一走 `errorMessages`；`McFormField` 仍保留底层 `error` / `success` 展示能力。

| 旧 TextField API     | 2.0 API                                       |
| -------------------- | --------------------------------------------- |
| 字符过滤 `type`      | `filter`                                      |
| 原生类型 `inputType` | 标准 `type`                                   |
| `password`           | `type="password"`                             |
| `maxLength` Prop     | 标准 `maxlength` Attr                         |
| `error` / `success`  | `errorMessages`；成功提示可组合 `McFormField` |

```vue
<mc-text-field
  v-model="password"
  filter="all"
  type="password"
  maxlength="64"
  autocomplete="current-password"
  :error-messages="errors"
/>
```

## DataTable

`McDataTable` 的 `page`、`itemsPerPage`、`sortBy` 与 `search` 顶层 Props，以及 `update:page`、`update:itemsPerPage`、`update:sortBy`、`update:search` 事件均已删除。统一使用：

```vue
<script setup>
import { ref } from 'vue'
const options = ref({ page: 1, itemsPerPage: 25, sortBy: [], search: '' })
const selected = ref([])
</script>

<template>
  <mc-data-table v-model="selected" v-model:options="options" :headers="headers" :items="items" />
</template>
```

主 `v-model` 只管理选择状态，并发出 `change`；表格查询状态只通过 `options` / `update:options` 管理。server 模式不会自行请求网络。

## Overlay 与主题

Select、Autocomplete、Menu 与 Tooltip 使用 Connected Overlay；Dialog、临时 Drawer、Snackbar、LoadingMask 和 PopHost 也可 Teleport。Teleport 内容会携带当前 Theme 类名、CSS 变量与 Locale `dir`，不再依赖 Provider DOM 祖先。应删除依赖旧局部绝对定位或手工复制主题变量的兼容样式。

完整布局示例见 [Layout](/components/layout)，统一校验见 [Form](/components/form)。

## 图标定义

`McIconDefinition` 不再接收原始 SVG 字符串，也不会通过 `v-html` 渲染。注册图标改用结构化的 `svg` / `path` / `image` 节点；事件属性、脚本节点、外部 URL 和 `javascript:` 会被拒绝。`McIcon` 的 `path` Prop 与 Vue Component 图标仍保持支持，详见 [Icon](/components/icon)。

## 下一步

- [快速开始](./getting-started)：2.0 的安装与注册方式。
- [配置选项](./configuration)：插件选项与按需入口。
