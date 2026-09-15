# 配置选项

本页集中说明基础安装之外的能力。尚未完成安装和首次使用时，请先阅读[快速开始](./getting-started)。

## 基础用法

配置较多时，建议在消费应用的 `src/plugins/mcui.ts` 中集中创建插件。`createMcUI()` 接受 `theme`、`defaults`、`locale`、`display`、`icons` 和 `sounds` 六类选项；它不是会被自动扫描的配置文件，每个 Vue App 只创建并安装一个实例。

```ts
// src/plugins/mcui.ts
import { createMcUI, type McUIOptions } from 'mcui-oreui'
import { mcNormalIconSet } from 'mcui-oreui/icons/normal'
import { mcDefaultSounds } from 'mcui-oreui/sounds/default'

const options: McUIOptions = {
  theme: {
    defaultTheme: 'ore',
    themes: {
      ore: { dark: true, colors: { primary: '#3c8527' } },
    },
  },
  defaults: {
    components: { McButton: { variant: 'primary' } },
  },
  locale: {
    locale: 'zh-CN',
    fallback: 'en',
    messages: { 'zh-CN': { save: '保存' } },
    rtl: ['ar'],
  },
  display: {
    ssrWidth: 1280,
    mobileBreakpoint: 'md',
  },
  icons: {
    defaultSet: 'mc',
    sets: { mc: mcNormalIconSet },
  },
  sounds: {
    enabled: true,
    sounds: mcDefaultSounds,
  },
}

export const mcui = createMcUI(options)
```

在 `src/main.ts` 中安装同一个实例：

```ts
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { mcui } from './plugins/mcui'

createApp(App).use(mcui).mount('#app')
```

后续各节展示的是同一个 `options` 对象中的独立字段。按需组合这些字段，不要为不同能力重复调用 `app.use(createMcUI(...))`。

| 选项       | 用途                                        |
| ---------- | ------------------------------------------- |
| `theme`    | 主题名称、颜色、变量和字体                  |
| `defaults` | 全局或指定组件的默认 Props                  |
| `locale`   | 当前语言、回退语言、内置文案和 RTL          |
| `display`  | 运行时断点、移动端判定和 SSR 初始宽度       |
| `icons`    | 默认图标集、别名及显式加载的图标集合        |
| `sounds`   | 音效开关、声音 URL 映射与自定义播放 adapter |

## Theme 主题

`theme.defaultTheme` 选择启动主题，`themes` 定义可切换主题。颜色、普通变量和字体最终会转换为 `<mc-app>` 或 Theme Provider 上的 `--mc-*` CSS 变量。

```ts
const options: McUIOptions = {
  theme: {
    defaultTheme: 'copper',
    themes: {
      copper: {
        dark: true,
        colors: {
          primary: '#b36a3c',
          surface: '#352b27',
        },
        variables: { radius: '0px' },
        fonts: { ui: "'Minecraft Seven', sans-serif" },
      },
    },
  },
}
```

组件内可通过 `useMcTheme().setTheme(name)` 切换已注册主题。完整变量清单见 [Theme 与设计 Token](./design-tokens)。

局部主题使用 Provider，不影响外部组件。`name` 变化会同步局部主题键：

```vue
<script setup lang="ts">
const purpleTheme = { colors: { primary: '#7b4ab5' } }
</script>

<template>
  <mc-theme-provider name="purple" :theme="purpleTheme">
    <mc-button>局部紫色主题</mc-button>
  </mc-theme-provider>
</template>
```

## Defaults 默认 Props

`defaults.global` 作用于所有支持对应 Prop 的组件，`defaults.components` 按 PascalCase 组件名设置默认值：

```ts
const options: McUIOptions = {
  defaults: {
    global: { disabled: false },
    components: {
      McButton: { variant: 'primary', size: 'large' },
      McTextField: { validateOn: 'blur' },
    },
  },
}
```

优先级为：显式 Prop → 当前 Provider → 外层组件 Defaults → 外层全局 Defaults → 组件内置值。局部覆盖使用 `McDefaultsProvider`：

```vue
<script setup lang="ts">
const largeButtons = { components: { McButton: { size: 'large' } } }
</script>

<template>
  <mc-defaults-provider :defaults="largeButtons">
    <mc-button>大号默认按钮</mc-button>
    <mc-button size="small">显式 Prop 优先</mc-button>
  </mc-defaults-provider>
</template>
```

## Locale 语言与 RTL

`locale` 设置当前语言，`fallback` 设置缺失文案的回退语言，`messages` 扩展或覆盖文案，`rtl` 声明从右到左的语言：

```ts
const options: McUIOptions = {
  locale: {
    locale: 'zh-CN',
    fallback: 'en',
    messages: {
      'zh-CN': { save: '保存', close: '关闭' },
      en: { save: 'Save', close: 'Close' },
    },
    rtl: ['ar', 'he'],
  },
}
```

`<mc-app>` 会同步当前 Locale 的 `dir`。子树可用 `McLocaleProvider` 覆盖语言、回退文案或 RTL：

```vue
<template>
  <mc-locale-provider locale="ar" :rtl="['ar']">
    <mc-button>واجهة عربية</mc-button>
  </mc-locale-provider>
</template>
```

## Display 运行时断点

`thresholds` 修改组合式 API 的断点像素值，`mobileBreakpoint` 决定 `mobile` 状态，`ssrWidth` 用于保证 SSR 首屏与 hydration 使用相同断点。未传 `ssrWidth` 时默认 `960`（`md`），而不是 `0`。需要桌面首屏时显式传入，例如 `1280`：

```ts
const options: McUIOptions = {
  display: {
    thresholds: { sm: 640, md: 960, lg: 1280, xl: 1600, xxl: 1920 },
    mobileBreakpoint: 'md',
    ssrWidth: 1280,
  },
}
```

```vue
<script setup lang="ts">
import { useMcDisplay } from 'mcui-oreui'

const display = useMcDisplay()
</script>

<template>
  <span>{{ display.mdAndUp.value ? '桌面布局' : '紧凑布局' }}</span>
</template>
```

`useMcDisplay()` 提供 `xs/sm/md/lg/xl/xxl`、`smAndUp`、`mdAndUp`、`lgAndDown` 等状态。这里的运行时阈值不会重新编译 Utilities 的 CSS 媒体查询；工具类固定使用项目标准断点。

## Icons 图标

核心入口不会自动打入全部内置 SVG。根据实际需要显式加载 normal、key、x 或 all 图标集，并注册到同一个插件实例：

```ts
import type { McUIOptions } from 'mcui-oreui'
import { mcNormalIconSet } from 'mcui-oreui/icons/normal'
import { mcKeyIconSet } from 'mcui-oreui/icons/key'

const options: McUIOptions = {
  icons: {
    defaultSet: 'mc',
    aliases: { save: 'mc-save' },
    sets: {
      mc: mcNormalIconSet,
      key: mcKeyIconSet,
    },
  },
}
```

- `mcui-oreui/icons/normal`：普通可着色界面图标。
- `mcui-oreui/icons/key`：键盘与输入提示图标。
- `mcui-oreui/icons/x`：游戏内容类彩色图标。
- `mcui-oreui/icons/all`：明确需要完整集合时使用的聚合入口。

自定义结构化图标与 SVG path 的写法见 [Icon](../components/icon)。

## Sounds 音效

2.0 默认关闭音效，核心入口也不会自动加载音频。启用内置音效时显式导入资源入口：

```ts
import type { McUIOptions } from 'mcui-oreui'
import { mcDefaultSounds } from 'mcui-oreui/sounds/default'

const options: McUIOptions = {
  sounds: {
    enabled: true,
    sounds: mcDefaultSounds,
  },
}
```

也可以提供自己的 URL 映射或播放 adapter：

```ts
const options: McUIOptions = {
  sounds: {
    enabled: true,
    sounds: { click: '/audio/click.ogg' },
    adapter: async (source) => {
      const audio = new Audio(source)
      audio.volume = 0.5
      await audio.play()
    },
  },
}
```

组件 `setup` 内使用当前 App 的注入实例：

```ts
import { useSound } from 'mcui-oreui'

const sound = useSound()
sound.play('click')
sound.setEnabled(false)
```

组件外复用创建并安装过的插件实例：

```ts
mcui.services.sounds.play('click')
mcui.services.sounds.setEnabled(false)
```

声音开关、播放中的 `Audio` 和 adapter 都按 App 隔离，App 卸载时会释放默认 adapter 创建的资源。2.0 不再导出无作用域的 `playSound()`、`playSoundType()` 或 `setSoundEnabled()`。

## 按需组件与可选样式

不安装全量组件时，可直接导入单组件入口。组件及其真实依赖的必要 CSS 会随静态 ESM import 自动加载：

```vue
<script setup lang="ts">
import McButton from 'mcui-oreui/components/McButton'
</script>

<template>
  <mc-button variant="primary">按需按钮</mc-button>
</template>
```

如果组件需要自定义 Theme、Locale、Defaults、Display、Icons 或 Sounds，应用仍应安装一次 McUI 插件。以下样式只在需要对应能力时显式导入：

```ts
import 'mcui-oreui/styles/components.css' // 预加载全部组件样式
import 'mcui-oreui/styles/utilities.css' // d-flex、ma-4 等工具类
import 'mcui-oreui/styles/fonts.css' // Minecraft Ten / Seven / Five
import 'mcui-oreui/styles/base.css' // 仅作用于显式 .mc-page 页面环境
import 'mcui-oreui/styles/tokens.css' // 只需要主题变量时
```

`components.css` 不包含 Utilities、字体或 `base.css`。普通组件入口不会修改宿主 `:root`、`html`、`body`、裸 `button` 等全局元素。Utilities 的完整规则见[分辨率](../styles/breakpoints)与[样式类名索引](../styles/utility-index)。

## Services 与 Composables

`createMcUI()` 返回的 `services` 是当前 App 的只读服务集合，包含 `theme`、`defaults`、`locale`、`display`、`icons`、`sounds`、`overlay`、`form` 和 `pop`。插件会 provide Theme、Defaults、Locale、Icons、Sounds、Display、Overlay 和 Pop；**不会** provide 全局 Form。`services.form` 仍可在组件外使用，但输入字段只向最近的 `McForm` 祖先注册。组件外使用保存的插件实例：

```ts
mcui.services.pop.show('已保存')
mcui.services.theme.setTheme('copper')
```

组件 `setup` 内优先使用 `usePop()`、`useSound()`、`useMcTheme()`、`useMcDefaults()`、`useMcLocale()`、`useMcDisplay()`、`useMcOverlay()` 和 `useMcForm()`。`useMcForm()` 在 `McForm` 外返回 `null`。每个服务都按 App 隔离；App 卸载时会释放 Display 监听、Pop 计时器、Overlay 滚动锁和默认声音资源。Display 的窗口监听由 `useMcDisplay()` 按组件挂载，而不是在 `app.use()` 时立刻 `display.mount()`。

## 下一步

- [快速开始](./getting-started)：安装、注册和第一个界面。
- [设计 Token](./design-tokens)：`--mc-*` 变量与主题切换。
- [分辨率](../styles/breakpoints)：工具类断点与 `display.thresholds` 的边界。
