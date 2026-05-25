# 格式化代码

Minecraft 旧式文本格式化机制使用分节符 `§` 加一个字符来切换颜色或文字样式，例如 `§e黄色`、`§l粗体`、`§r重置`。
本库通过特殊标签 `<mc-tcode></mc-tcode>` 让格式化代码生效；未包裹在 `<mc-tcode>` 中的普通文本不会被解析。

::: warning 兼容说明
格式化代码属于较早的 Minecraft 文本机制。Java 版中该机制已逐步被新的文本组件取代；基岩版仍常见于世界名称、服务器描述等场景。`§m` / `§n` 在基岩版材料色与 Java 版删除线 / 下划线之间存在含义差异，本库默认按 Java 样式解析，确保删除线与下划线生效；如需基岩版材料色，可设置 `edition="bedrock"`。
:::

<script setup>
import { computed, ref } from 'vue'
import { MC_FORMAT_CODE_STYLES, parseMcFormatCodes, renderMcFormatCodes, stripMcFormatCodes } from '../../src/utils/formatCodes'

const text = ref('§l§6McUI §r§aVue §b格式化§r 文本\n§c红色 §e黄色 §gMinecoin §s钻石 §u紫水晶')
const tokens = computed(() => parseMcFormatCodes(text.value))
const segments = computed(() => renderMcFormatCodes(text.value))
const stripped = computed(() => stripMcFormatCodes(text.value))
const styles = Object.values(MC_FORMAT_CODE_STYLES)
</script>

## 基础用法

<div class="mc-demo mc-demo--column">
  <mc-text-field v-model="text" hint="输入包含 § 的文本" :single-line="false" />
  <mc-panel title="渲染结果" subtitle="支持颜色、粗体、斜体、下划线、删除线、混淆和重置">
    <mc-tcode :text="text" as="p" />
  </mc-panel>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const text = ref('§l§6McUI §r§aVue §b格式化§r 文本')
</script>

<template>
  <mc-tcode>{{ text }}</mc-tcode>

  <!-- 动态文本也可以使用 text prop -->
  <mc-tcode :text="text" />
</template>
```

::: tip 生效范围
格式化代码只会在 `<mc-tcode></mc-tcode>` 内被解析。需要显示原始 `§` 字符串时，直接写普通文本即可。
:::

## 解析工具

除了直接用 `<mc-tcode>` 渲染，组件库也导出了三个工具函数，适合在保存、预览、搜索或二次处理文本时使用：

- `parseMcFormatCodes`：把源文本拆成 token，便于调试每个 `§` 代码被识别成了什么。
- `renderMcFormatCodes`：把源文本转换成可渲染片段，适合自定义渲染器或高级组件使用。
- `stripMcFormatCodes`：移除所有格式代码，只保留最终可读文本。

<div class="mc-demo mc-demo--column">
  <mc-panel title="Token 解析结果" subtitle="用于调试：每个 § 代码都会被拆成一条 token">
    <pre class="mc-format-code-pre">{{ JSON.stringify(tokens, null, 2) }}</pre>
  </mc-panel>
  <mc-panel title="移除格式代码后的纯文本" subtitle="用于搜索、存储纯文本或无样式降级显示">
    <span style="color:#fff">{{ stripped }}</span>
  </mc-panel>
</div>

```ts
import {
  parseMcFormatCodes,
  renderMcFormatCodes,
  stripMcFormatCodes,
} from 'mcui-oreui'

// 1. 解析为 token：适合调试、分析源字符串
parseMcFormatCodes('§aHello §lWorld')

// 2. 解析为可渲染片段：适合自定义渲染逻辑
renderMcFormatCodes('§aHello §lWorld')

// 3. 指定版本差异：Java 中 §n/§m 是下划线/删除线
renderMcFormatCodes('§nUnderlined §mDeleted', 'java')

// 4. 指定版本差异：Bedrock 中 §n/§m 可作为材料色解析
renderMcFormatCodes('§nCopper §mRedstone', 'bedrock')

// 5. 移除所有格式代码，只返回可读文本
stripMcFormatCodes('§aHello §lWorld') // Hello World
```

## 颜色代码

颜色代码（`§0` ~ `§f` 以及基岩版扩展的 `§g` ~ `§w`）单独整理在 [颜色代码](/styles/colors) 页中：包含真实色号预览、点击复制以及版本可用性表格。

<div class="mc-demo mc-demo--column">
  <a href="/mcui-oreui/styles/colors" class="mc-format-code-link">
    <span class="mc-format-code-link__title">前往「颜色代码」页 →</span>
    <span class="mc-format-code-link__desc">16 个 Java/通用颜色 + 基岩版材料色，点击色块可复制色号</span>
  </a>
</div>

```ts
import { MC_FORMAT_CODE_COLORS } from 'mcui-oreui'

console.log(MC_FORMAT_CODE_COLORS.a.foreground) // #55FF55
```

## 样式代码

<div class="mc-demo mc-demo--column">
  <div class="mc-format-code-style-list">
    <mc-panel v-for="style in styles" :key="style.code" :title="`${style.code} ${style.label}`">
      <mc-tcode :text="`${style.code}${style.label} 示例文本§r`" />
      <template #footer>
        <span style="color:#d0d1d4">基岩版：{{ style.bedrock ? '可用' : '不可用' }} · Java版：{{ style.java ? '可用' : '不可用' }}</span>
      </template>
    </mc-panel>
  </div>
</div>

```vue
<mc-tcode>§l粗体 §o斜体 §n下划线 §m删除线 §r重置</mc-tcode>
```

## API

### mc-tcode Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `text` | `string` | — | 带 `§` 格式化代码的源文本；未传时读取默认插槽文本 |
| `edition` | `'java' \| 'bedrock'` | `'java'` | 解析模式；`java` 下 `§m` / `§n` 为删除线 / 下划线，`bedrock` 下为材料色 |
| `as` | `string` | `'span'` | 渲染为指定 HTML 标签或组件 |

### 导出项

| 名称 | 说明 |
|---|---|
| `<mc-tcode>` | 特殊包裹标签，用于让内部 `§` 格式化代码生效 |
| `<mc-formatted-text>` | 底层渲染组件，适合需要显式传入 `text` 的高级场景 |
| `MC_FORMAT_CODE_COLORS` | 颜色代码表，包含前景色、背景色、中文标签与基岩版标记 |
| `MC_FORMAT_CODE_STYLES` | 样式代码表，包含粗体、斜体、混淆、删除线、下划线、重置 |
| `parseMcFormatCodes(text, edition?)` | 将源文本解析为 token 列表，默认 `edition` 为 `'java'` |
| `renderMcFormatCodes(text, edition?)` | 将源文本解析为可渲染文本片段，默认 `edition` 为 `'java'` |
| `stripMcFormatCodes(text)` | 移除所有 `§x` 格式代码，返回纯文本 |

<style scoped>
.mc-format-code-pre {
  color: #fff;
  font-family: 'Minecraft Seven', monospace;
  margin: 0;
  max-height: 260px;
  overflow: auto;
  white-space: pre-wrap;
}

.mc-format-code-grid {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  width: 100%;
}

.mc-format-code-link {
  display: grid;
  gap: 4px;
  padding: 14px 18px;
  border: 2px solid #1e1e1f;
  background: linear-gradient(180deg, #2c3344 0%, #1a1f2c 100%);
  color: #fff !important;
  text-decoration: none !important;
  font-family: 'Minecraft Seven', sans-serif;
  box-shadow: inset 2px 2px rgba(255,255,255,.18), inset -2px -2px rgba(0,0,0,.45);
  transition: filter .12s ease, transform .12s ease;
}
.mc-format-code-link:hover { filter: brightness(1.12); }
.mc-format-code-link:active { transform: translateY(1px); }
.mc-format-code-link__title { font-size: 16px; font-weight: 600; }
.mc-format-code-link__desc { font-size: 12px; opacity: .8; }

.mc-format-code-style-list {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  width: 100%;
}
</style>
