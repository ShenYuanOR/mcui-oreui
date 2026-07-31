# Theme 与设计 Token

2.0 的组件颜色由 CSS 变量实际驱动。`tokens.css` 只在 `.mc-theme`、`.mc-app` 或 `[data-mc-theme]` 内声明默认值，不修改 `:root`。

| Token                                                       | 默认值                        | 用途                                                          |
| ----------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------- |
| `--mc-background`                                           | `#48494a`                     | 应用背景                                                      |
| `--mc-surface`                                              | `#313233`                     | 卡片、输入、面板                                              |
| `--mc-surface-light`                                        | `#58585a`                     | 浮层与高亮表面                                                |
| `--mc-primary`                                              | `#3c8527`                     | 主操作、选中态                                                |
| `--mc-secondary`                                            | `#d0d1d4`                     | 次要操作                                                      |
| `--mc-error`                                                | `#c33636`                     | 错误与危险操作                                                |
| `--mc-warning`                                              | `#f5a623`                     | 警告                                                          |
| `--mc-info`                                                 | `#3d75a5`                     | 信息反馈                                                      |
| `--mc-border`                                               | `#1e1e1f`                     | 深色像素描边                                                  |
| `--mc-text`                                                 | `#ffffff`                     | 主文字                                                        |
| `--mc-text-muted`                                           | `#b1b2b5`                     | 辅助文字                                                      |
| `--mc-focus`                                                | `#ffffff`                     | 键盘焦点与高亮描边                                            |
| `--mc-shadow`                                               | `#000000`                     | 像素投影                                                      |
| `--mc-scrim`                                                | `rgba(0,0,0,.62)`             | 模态遮罩                                                      |
| `--mc-on-primary` / `--mc-on-secondary` / `--mc-on-warning` | 语义前景色                    | 彩色表面的文字                                                |
| `--mc-control-inactive`                                     | `#8c8d90`                     | 未选中控件                                                    |
| `--mc-surface-bright` / `--mc-surface-high`                 | 浅表面色                      | Appbar 与兼容控件                                             |
| `--mc-border-muted` / `--mc-border-strong`                  | 描边层级                      | 斜面与深描边                                                  |
| `--mc-font-title`                                           | `Minecraft Ten, sans-serif`   | 标题                                                          |
| `--mc-font-ui`                                              | `Minecraft Seven, sans-serif` | 控件文字                                                      |
| `--mc-font-body`                                            | `Noto Sans, sans-serif`       | 正文                                                          |
| `--mc-spacer`                                               | `4px`                         | Utilities 的 `ma/pa/ga` 数值单位；不改变既有 `--mc-space-1–5` |

## 配置主题

把主题配置放入消费应用创建 McUI 插件的位置。以下示例采用 `src/plugins/mcui.ts`；该实例还需按[配置选项](./configuration)在 `src/main.ts` 中安装。

```ts
// src/plugins/mcui.ts
import { createMcUI } from 'mcui-oreui'

export const mcui = createMcUI({
  theme: {
    defaultTheme: 'copper',
    themes: {
      copper: {
        dark: true,
        colors: { primary: '#b36a3c', surface: '#352b27' },
        variables: { radius: '0px' },
        fonts: { ui: "'Minecraft Seven', sans-serif" },
      },
    },
  },
})
```

这不是 Vite 构建配置，也不会被自动扫描。通过 `useMcTheme().setTheme(name)` 运行时切换；`<mc-app>` 会应用对应变量和明暗 class。

Utilities 的 `text-*`、`bg-*` 和 `border-*` 类引用同名 `--mc-*` 变量，所以运行时切换主题会立即更新。工具类固定使用项目标准断点；`display.thresholds` 只影响组合式状态，不会重新编译 CSS。
