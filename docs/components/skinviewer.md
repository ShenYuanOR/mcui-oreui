<script setup>
import { ref, computed } from 'vue'

const STEVE_URL = 'https://assets.mojang.com/SkinTemplates/steve.png'
const ALEX_URL = 'https://assets.mojang.com/SkinTemplates/alex.png'

const customSkin = ref('')
const customName = ref('')
const slim = ref(false)
const showSecondLayer = ref(true)
const autoRotate = ref(true)

const skin = computed(() => customSkin.value || (slim.value ? ALEX_URL : STEVE_URL))
const fileName = computed(() => customName.value || (slim.value ? 'Alex（默认）' : 'Steve（默认）'))

// mc-dropdown 使用 1-based index
const poseOptions = ['idle 站立', 'walk 行走', 'none 静止']
const poseIndex = ref(1)
const poseValue = computed(() => ['idle', 'walk', 'none'][poseIndex.value - 1])

const scale = ref(6)

const fileInput = ref(null)

function pickFile() {
  fileInput.value?.click()
}
function onPick(e) {
  const f = e.target.files?.[0]
  if (!f) return
  customSkin.value = URL.createObjectURL(f)
  customName.value = f.name
}
</script>

# SkinViewer 皮肤展示

把 **64×64 / 64×32（旧版）/ 128×128（HD）** 的 Minecraft 皮肤图折叠成一个可旋转的 3D 小人。
纯 CSS 3D transforms 实现，无第三方依赖，支持自动旋转 / 拖拽 / 行走姿势 / 第二层。

<div class="mc-demo skin-demo">
  <div class="skin-demo__stage">
    <mc-skin-viewer
      :skin="skin"
      :slim="slim"
      :scale="scale"
      :show-second-layer="showSecondLayer"
      :pose="poseValue"
      :auto-rotate="autoRotate"
    />
  </div>

  <mc-panel title="皮肤参数" subtitle="拖拽小人或调节下方参数" class="skin-demo__panel">
    <div class="skin-demo__row">
      <span class="skin-demo__label">皮肤</span>
      <mc-button size="small" icon="mc-folder-open" @click="pickFile">选择 PNG…</mc-button>
      <span class="skin-demo__filename">{{ fileName }}</span>
      <input ref="fileInput" type="file" accept="image/png" @change="onPick" hidden />
    </div>
    <div class="skin-demo__row">
      <mc-checkbox v-model="slim" />
      <span>Slim（Alex 体型，3px 手臂）</span>
    </div>
    <div class="skin-demo__row">
      <mc-checkbox v-model="showSecondLayer" />
      <span>显示第二层（帽子 / 夹克 / 袖子 / 裤腿）</span>
    </div>
    <div class="skin-demo__row">
      <mc-checkbox v-model="autoRotate" />
      <span>自动旋转</span>
    </div>
    <div class="skin-demo__row">
      <span class="skin-demo__label">姿势</span>
      <mc-dropdown :options="poseOptions" v-model="poseIndex" style="flex:1; min-width:140px;" />
    </div>
    <div class="skin-demo__row skin-demo__row--slider">
      <span class="skin-demo__label">缩放</span>
      <mc-slider v-model="scale" :min="3" :max="12" :step="1" :show-segments="false" style="flex:1;" />
    </div>
  </mc-panel>
</div>

<style scoped>
.skin-demo {
  display: flex;
  gap: 20px;
  align-items: stretch;
  flex-wrap: wrap;
  padding: 16px !important;
}

/* —— 展示舱：深色 + 透视网格 —— */
.skin-demo__stage {
  position: relative;
  width: 280px;
  height: 500px;
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 18px;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
  background:
    radial-gradient(ellipse 60% 30% at 50% 92%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%),
    radial-gradient(ellipse 80% 60% at 50% 25%, rgba(120,160,220,0.18) 0%, rgba(0,0,0,0) 70%),
    linear-gradient(180deg, #2c3344 0%, #1a1f2c 55%, #14171f 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.06),
    inset 0 0 0 3px rgba(0,0,0,0.6),
    inset 0 0 28px rgba(0,0,0,0.55),
    0 6px 18px rgba(0,0,0,0.45);
}
.skin-demo__stage::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 220%;
  height: 55%;
  transform: translateX(-50%) perspective(420px) rotateX(58deg);
  transform-origin: 50% 100%;
  background-image:
    linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px);
  background-size: 22px 22px;
  -webkit-mask-image: linear-gradient(to top, #000 0%, rgba(0,0,0,0.5) 45%, transparent 95%);
          mask-image: linear-gradient(to top, #000 0%, rgba(0,0,0,0.5) 45%, transparent 95%);
  pointer-events: none;
}
.skin-demo__stage::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 70% 35% at 50% 0%, rgba(255,255,255,0.08), transparent 70%);
  pointer-events: none;
}
.skin-demo__stage > * { position: relative; z-index: 1; }

/* —— 控件面板（基于 mc-panel） —— */
.skin-demo__panel {
  flex: 1;
  min-width: 280px;
}
.skin-demo__row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}
.skin-demo__row + .skin-demo__row {
  border-top: 1px dashed rgba(255,255,255,0.06);
}
.skin-demo__label {
  width: 44px;
  flex-shrink: 0;
  color: var(--mc-text-secondary, #b9c2d4);
  font-size: 13px;
}
.skin-demo__filename {
  flex: 1;
  font-size: 12px;
  color: var(--mc-text-secondary, #9aa3b5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.skin-demo__value {
  width: 24px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
.skin-demo__row--slider { gap: 14px; }
</style>

```vue
<script setup>
import { ref } from 'vue'
const skin = ref('/path/to/your-skin.png')
</script>

<template>
  <!-- 标准 64×64 -->
  <mc-skin-viewer :skin="skin" />

  <!-- Slim 体型（Alex，3px 手臂） -->
  <mc-skin-viewer :skin="skin" slim />

  <!-- HD 皮肤（128×128）自动识别 -->
  <mc-skin-viewer :skin="skinHd" :scale="8" />

  <!-- 旧版 64×32（自动镜像左半身） -->
  <mc-skin-viewer :skin="skinLegacy" />

  <!-- 行走姿势 + 关闭第二层 -->
  <mc-skin-viewer :skin="skin" pose="walk" :show-second-layer="false" />
</template>
```

## 皮肤来源

- **本地文件**：用 `<input type="file">` + `URL.createObjectURL(file)` 转成 blob URL 直接传给 `skin`。
- **远程 URL**：直接传图片地址；跨域加载只是 `<img>` 标签读取，不需要 CORS（仅作为 `background-image` 使用）。
- **DataURL**：`data:image/png;base64,...` 同样支持。

## 支持的皮肤格式

| 尺寸 | 说明 |
|---|---|
| `64×64` | 标准现代皮肤，包含双臂 / 双腿独立 UV，以及完整第二层 |
| `64×64`（Slim） | Alex 体型，3px 手臂；通过 `slim` prop 切换 |
| `64×32` | 旧版 1.7- 皮肤，自动检测：仅有右半身数据，左半身会镜像；第二层仅帽子可用 |
| `128×128` | HD 皮肤，UV 布局与 64×64 等比放大；组件按 64×64 处理，浏览器自动缩放 |

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `skin` | `string` | — | **必填**，皮肤图地址（URL / blob URL / dataURL） |
| `slim` | `boolean` | `false` | 是否 Slim（Alex）体型，手臂宽 3px |
| `scale` | `number` | `6` | 1 个皮肤像素对应多少 CSS 像素；整体大小由它决定 |
| `showSecondLayer` | `boolean` | `true` | 是否显示帽子 / 夹克 / 袖子 / 裤腿外层 |
| `pose` | `'idle' \| 'walk' \| 'none'` | `'idle'` | 站立微浮动 / 行走摆动 / 完全静止 |
| `autoRotate` | `boolean` | `true` | 自动绕 Y 轴旋转 |
| `pitch` | `number` | `8` | 视角俯仰角（度），>0 从上往下看 |
| `yaw` | `number` | `-20` | 初始 Y 旋转角（度） |
| `interactive` | `boolean` | `true` | 是否允许鼠标 / 触摸拖拽旋转；按住时自动旋转暂停 |
| `background` | `string` | `'transparent'` | 容器背景，可填任意 CSS 颜色 |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `load` | `{ width: number; height: number; legacy: boolean }` | 皮肤图加载完成，`legacy=true` 表示识别为 64×32 旧版 |
| `error` | `Event \| string` | 皮肤图加载失败 |

## 实现说明

- 6 个基础部位（头 / 身 / 双臂 / 双腿）+ 6 个外层，全部用 6 个 `<div>` 当 cube 面，
  通过 `background-position` 在皮肤图上裁出 UV 区域，再用 CSS `transform` 推到立方体表面。
- 关节摆动用 4 层 wrapper：`pivot → swing → center → faces`，
  保证肩 / 髋绕关节点旋转而不是绕几何中心旋转。
- `image-rendering: pixelated` 保持像素质感；HD 皮肤同样按 64×64 UV，浏览器自动做近邻缩放。
- 旧版 64×32 皮肤自动检测（宽:高 = 2:1），左半身镜像右半身。
