# 颜色代码

Minecraft 旧式文本系统通过 `§0` ~ `§9` / `§a` ~ `§f` 提供 16 个标准颜色；基岩版又扩展了一组材料色（`§g` ~ `§w`）。本页给出全部颜色的真实色号、版本可用性以及一键复制。

::: tip 与格式化代码的关系
颜色代码是 [格式化代码](/styles/format-codes) 的一种。完整的解析机制、`<mc-tcode>` 组件用法以及样式代码（粗体 / 斜体 / 删除线 / 下划线 / 混淆 / 重置）请见格式化代码页面。
:::

<script setup>
import { ref } from 'vue'
import { MC_FORMAT_CODE_COLORS } from '../../src/utils/formatCodes'

const colors = Object.values(MC_FORMAT_CODE_COLORS)
const javaColors = colors.filter(c => !c.bedrockOnly)
const bedrockColors = colors.filter(c => c.bedrockOnly)
const copied = ref('')

async function copyColor(c) {
  copied.value = c.code
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(c.foreground)
  }
  window.setTimeout(() => {
    if (copied.value === c.code) copied.value = ''
  }, 1400)
}

// 根据背景亮度判断文字颜色，保证可读
function pickFg(hex) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0,2), 16)
  const g = parseInt(h.slice(2,4), 16)
  const b = parseInt(h.slice(4,6), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 150 ? '#1a1a1a' : '#ffffff'
}
</script>

## Java / 通用颜色（§0 – §f）

<div class="mc-demo mc-demo--column">
  <div class="mc-color-grid">
    <button
      v-for="c in javaColors"
      :key="c.code"
      type="button"
      class="mc-color-swatch"
      :style="{ background: c.foreground, color: pickFg(c.foreground) }"
      :aria-label="`复制 ${c.label} 色号 ${c.foreground}`"
      @click="copyColor(c)"
    >
      <span class="mc-color-swatch__code">{{ c.code }}</span>
      <span class="mc-color-swatch__name">{{ c.label }}</span>
      <span class="mc-color-swatch__hex">{{ c.foreground }}</span>
      <span class="mc-color-swatch__copy">{{ copied === c.code ? '已复制' : '点击复制' }}</span>
    </button>
  </div>
</div>

## 基岩版扩展颜色（§g – §w）

::: warning 兼容性
这些颜色仅在 Minecraft 基岩版中生效，Java 版会忽略它们；其中 `§m` / `§n` 在 Java 版被解释为删除线 / 下划线，使用时请通过 `edition` 区分。
:::

<div class="mc-demo mc-demo--column">
  <div class="mc-color-grid">
    <button
      v-for="c in bedrockColors"
      :key="c.code"
      type="button"
      class="mc-color-swatch"
      :style="{ background: c.foreground, color: pickFg(c.foreground) }"
      :aria-label="`复制 ${c.label} 色号 ${c.foreground}`"
      @click="copyColor(c)"
    >
      <span class="mc-color-swatch__code">{{ c.code }}</span>
      <span class="mc-color-swatch__name">{{ c.label }}</span>
      <span class="mc-color-swatch__hex">{{ c.foreground }}</span>
      <span class="mc-color-swatch__copy">
        {{ copied === c.code
          ? '已复制'
          : (c.upcomingBedrock ? '即将推出' : (c.formatConflict ? 'Java 格式冲突' : '点击复制')) }}
      </span>
    </button>
  </div>
</div>

## 颜色表

完整列出每个代码的内部名称、Mojang 官方前景色 / 背景色，以及版本可用性。

<table class="mc-color-table">
  <thead>
    <tr>
      <th>代码</th>
      <th>name</th>
      <th>标签</th>
      <th>前景</th>
      <th>背景</th>
      <th>仅基岩</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="c in colors" :key="c.code">
      <td><code>{{ c.code }}</code></td>
      <td><code>{{ c.name }}</code></td>
      <td>{{ c.label }}</td>
      <td>
        <span class="mc-color-dot" :style="{ background: c.foreground }"></span>
        <code>{{ c.foreground }}</code>
      </td>
      <td>
        <span class="mc-color-dot" :style="{ background: c.background }"></span>
        <code>{{ c.background }}</code>
      </td>
      <td>{{ c.bedrockOnly ? '是' : '否' }}</td>
    </tr>
  </tbody>
</table>

## 在代码中使用

```ts
import { MC_FORMAT_CODE_COLORS } from 'mcui-oreui'

// 取得绿色（§a）的真实前景色
MC_FORMAT_CODE_COLORS.a.foreground // '#55FF55'

// 遍历全部颜色
Object.values(MC_FORMAT_CODE_COLORS).forEach((c) => {
  console.log(c.code, c.label, c.foreground)
})
```

<style scoped>
.mc-color-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  width: 100%;
}

.mc-color-swatch {
  appearance: none;
  border: 2px solid #1e1e1f;
  box-shadow: inset 2px 2px rgba(255,255,255,.22), inset -2px -2px rgba(0,0,0,.45);
  cursor: pointer;
  display: grid;
  gap: 4px;
  text-align: left;
  padding: 12px;
  font-family: 'Minecraft Seven', sans-serif;
  transition: filter .12s ease, transform .12s ease;
  min-height: 92px;
}

.mc-color-swatch:hover,
.mc-color-swatch:focus-visible {
  filter: brightness(1.08);
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.mc-color-swatch:active { transform: translateY(1px); }

.mc-color-swatch__code { font-size: 12px; opacity: .85; }
.mc-color-swatch__name { font-size: 15px; font-weight: 600; }
.mc-color-swatch__hex  { font-size: 12px; opacity: .9; letter-spacing: .5px; }
.mc-color-swatch__copy { font-size: 11px; opacity: .7; margin-top: 2px; }

.mc-color-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Minecraft Seven', sans-serif;
}
.mc-color-table th,
.mc-color-table td {
  border: 1px solid var(--vp-c-divider);
  padding: 6px 10px;
  text-align: left;
  vertical-align: middle;
}
.mc-color-dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 6px;
  vertical-align: middle;
  border: 1px solid rgba(0,0,0,.45);
  box-shadow: inset 1px 1px rgba(255,255,255,.25), inset -1px -1px rgba(0,0,0,.4);
}
</style>
