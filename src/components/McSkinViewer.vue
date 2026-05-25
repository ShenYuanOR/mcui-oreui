<script setup lang="ts">
/**
 * McSkinViewer
 * ----------------------------------------------------------------------------
 * 复刻 Minecraft 皮肤的纸娃娃展示组件。
 * - 接受 64×64（标准 / Slim）、64×32（旧版 1.7-）以及 128×128（HD）皮肤图。
 * - 通过 CSS 3D transform 把皮肤纹理折叠成可旋转的小人。
 * - 不依赖任何第三方库，纯 Vue 3 + CSS。
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue';

type Pose = 'idle' | 'walk' | 'none';

const props = withDefaults(
  defineProps<{
    /** 皮肤图（URL / dataURL / blob URL）。支持 64×32、64×64、128×128 */
    skin: string;
    /** 是否使用 Slim 体型（Alex，3px 手臂） */
    slim?: boolean;
    /** 单位皮肤像素 = 多少 CSS 像素（影响整体大小），默认 6 */
    scale?: number;
    /** 是否显示第二层（帽子 / 夹克 / 袖子 / 裤腿） */
    showSecondLayer?: boolean;
    /** 姿势：idle 微浮动；walk 行走摆臂腿；none 静止 */
    pose?: Pose;
    /** 是否自动绕 Y 轴旋转 */
    autoRotate?: boolean;
    /** 视角俯仰角（度），>0 从上看 */
    pitch?: number;
    /** 初始 Y 旋转角（度） */
    yaw?: number;
    /** 是否允许拖拽旋转 */
    interactive?: boolean;
    /** 背景颜色（容器） */
    background?: string;
  }>(),
  {
    slim: false,
    scale: 6,
    showSecondLayer: true,
    pose: 'idle',
    autoRotate: true,
    pitch: -12,
    yaw: -20,
    interactive: true,
    background: 'transparent',
  },
);

const emit = defineEmits<{
  (e: 'load', meta: { width: number; height: number; legacy: boolean }): void;
  (e: 'error', err: Event | string): void;
}>();

// ---------- 加载皮肤，识别尺寸 -------------------------------------------------
const isLegacy = ref(false); // 64×32 老版皮肤（宽:高 = 2:1）

watch(
  () => props.skin,
  (url) => {
    if (!url) return;
    if (typeof window === 'undefined' || typeof Image === 'undefined') return; // SSR 跳过
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || 64;
      const h = img.naturalHeight || 64;
      isLegacy.value = h * 2 === w;
      emit('load', { width: w, height: h, legacy: isLegacy.value });
    };
    img.onerror = (e) => emit('error', e);
    img.src = url;
  },
  { immediate: true },
);

// ---------- 单元 / 通用计算 ---------------------------------------------------
const u = computed(() => props.scale); // 1 皮肤像素 = u CSS 像素
const armW = computed(() => (props.slim ? 3 : 4));
const px = (v: number) => v * u.value;

// 皮肤所有 UV 都按 64×64 处理；HD 皮肤 background-size 仍设为 64u × 64u，
// 浏览器会自动缩放，背景坐标继续用「皮肤像素 × scale」即可。
const skinBg = computed(() => ({
  backgroundImage: `url("${props.skin}")`,
  backgroundSize: `${64 * u.value}px ${64 * u.value}px`,
  backgroundRepeat: 'no-repeat',
}));

// ---------- 立方体 UV ----------------------------------------------------------
// 给定长方体在皮肤上的左上角(uvX,uvY)与几何尺寸(w,h,d)，返回 6 个面的 UV 矩形。
// MC 皮肤展开（俯视布局）：
//   [ top w×d ][ bottom w×d ]
//   [ right d×h ][ front w×h ][ left d×h ][ back w×h ]
type FaceRect = { x: number; y: number; w: number; h: number; mirror?: boolean };
type CubeFaces = Record<'front' | 'back' | 'right' | 'left' | 'top' | 'bottom', FaceRect>;

function buildFaces(uvX: number, uvY: number, w: number, h: number, d: number, mirror = false): CubeFaces {
  const front  = { x: uvX + d,         y: uvY + d, w, h };
  const right  = { x: uvX,             y: uvY + d, w: d, h };
  const left   = { x: uvX + d + w,     y: uvY + d, w: d, h };
  const back   = { x: uvX + d + w + d, y: uvY + d, w, h };
  const top    = { x: uvX + d,         y: uvY,     w, h: d };
  const bottom = { x: uvX + d + w,     y: uvY,     w, h: d };
  if (mirror) {
    // 旧版皮肤左半身镜像右半身：交换 left/right 并把所有面水平翻转
    return {
      front: { ...front, mirror: true },
      back: { ...back, mirror: true },
      top: { ...top, mirror: true },
      bottom: { ...bottom, mirror: true },
      left: { ...right, mirror: true },
      right: { ...left, mirror: true },
    };
  }
  return { front, back, right, left, top, bottom };
}

// ---------- 部位描述 ----------------------------------------------------------
interface Part {
  key: string;
  w: number; h: number; d: number; // 皮肤像素（几何尺寸）
  /** 关节点（pivot）在角色坐标系的位置（皮肤像素，y 向上为正，脚底 = 0） */
  jx: number; jy: number; jz: number;
  /** cube 中心相对 pivot 的偏移（皮肤像素，y 向上为正）。手脚常用 oy = -h/2，使 cube 顶部对齐 pivot */
  ox?: number; oy?: number; oz?: number;
  faces: CubeFaces;
  /** 摆动相位：a / b 交替 */
  swing?: 'a' | 'b';
  /** 是否第二层（外扩 + 半透明背面） */
  overlay?: boolean;
}

const parts = computed<Part[]>(() => {
  const aw = armW.value;
  const legacy = isLegacy.value;
  const list: Part[] = [];

  // 角色坐标系：脚底中心 = (0,0,0)，y 向上为正，x 向右为正，角色面朝 +Z。
  // 关节点（pivot）：
  //   头：颈 (0, 24, 0)，cube 底部 = pivot ⇒ oy = +4（头在颈以上）
  //   身体：胸口 (0, 24, 0)，cube 顶部 = pivot ⇒ oy = -6
  //   臂：肩 (±(4 + aw/2), 24, 0)，oy = -6
  //   腿：髋 (±2, 12, 0)，oy = -6

  list.push({ key: 'head', w: 8, h: 8, d: 8, jx: 0, jy: 24, jz: 0, oy: 4, faces: buildFaces(0, 0, 8, 8, 8) });
  list.push({ key: 'body', w: 8, h: 12, d: 4, jx: 0, jy: 24, jz: 0, oy: -6, faces: buildFaces(16, 16, 8, 12, 4) });
  list.push({ key: 'arm-right', w: aw, h: 12, d: 4, jx: -(4 + aw / 2), jy: 24, jz: 0, oy: -6, faces: buildFaces(40, 16, aw, 12, 4), swing: 'a' });
  list.push(
    legacy
      ? { key: 'arm-left', w: aw, h: 12, d: 4, jx: 4 + aw / 2, jy: 24, jz: 0, oy: -6, faces: buildFaces(40, 16, aw, 12, 4, true), swing: 'b' }
      : { key: 'arm-left', w: aw, h: 12, d: 4, jx: 4 + aw / 2, jy: 24, jz: 0, oy: -6, faces: buildFaces(32, 48, aw, 12, 4), swing: 'b' },
  );
  list.push({ key: 'leg-right', w: 4, h: 12, d: 4, jx: -2, jy: 12, jz: 0, oy: -6, faces: buildFaces(0, 16, 4, 12, 4), swing: 'b' });
  list.push(
    legacy
      ? { key: 'leg-left', w: 4, h: 12, d: 4, jx: 2, jy: 12, jz: 0, oy: -6, faces: buildFaces(0, 16, 4, 12, 4, true), swing: 'a' }
      : { key: 'leg-left', w: 4, h: 12, d: 4, jx: 2, jy: 12, jz: 0, oy: -6, faces: buildFaces(16, 48, 4, 12, 4), swing: 'a' },
  );

  if (props.showSecondLayer) {
    list.push({ key: 'head-overlay', w: 8, h: 8, d: 8, overlay: true, jx: 0, jy: 24, jz: 0, oy: 4, faces: buildFaces(32, 0, 8, 8, 8) });
    if (!legacy) {
      list.push({ key: 'body-overlay', w: 8, h: 12, d: 4, overlay: true, jx: 0, jy: 24, jz: 0, oy: -6, faces: buildFaces(16, 32, 8, 12, 4) });
      list.push({ key: 'arm-right-overlay', w: aw, h: 12, d: 4, overlay: true, jx: -(4 + aw / 2), jy: 24, jz: 0, oy: -6, faces: buildFaces(40, 32, aw, 12, 4), swing: 'a' });
      list.push({ key: 'arm-left-overlay', w: aw, h: 12, d: 4, overlay: true, jx: 4 + aw / 2, jy: 24, jz: 0, oy: -6, faces: buildFaces(48, 48, aw, 12, 4), swing: 'b' });
      list.push({ key: 'leg-right-overlay', w: 4, h: 12, d: 4, overlay: true, jx: -2, jy: 12, jz: 0, oy: -6, faces: buildFaces(0, 32, 4, 12, 4), swing: 'b' });
      list.push({ key: 'leg-left-overlay', w: 4, h: 12, d: 4, overlay: true, jx: 2, jy: 12, jz: 0, oy: -6, faces: buildFaces(0, 48, 4, 12, 4), swing: 'a' });
    }
  }

  return list;
});

// pivot 平移：从角色原点 → 关节点（皮肤坐标 y 向上 → CSS y 向下取反）
function pivotTransform(p: Part) {
  return `translate3d(${px(p.jx)}px, ${px(-p.jy)}px, ${px(p.jz)}px)`;
}
// cube center 相对 pivot 的偏移
function centerTransform(p: Part) {
  return `translate3d(${px(p.ox ?? 0)}px, ${px(-(p.oy ?? 0))}px, ${px(p.oz ?? 0)}px)`;
}

// 6 个面相对 cube 中心的 transform（CSS 右乘，所以阅读顺序：先把 face 居中，再旋转，最后推到表面）
function faceTransform(face: 'front'|'back'|'right'|'left'|'top'|'bottom', w: number, h: number, d: number, mirror?: boolean) {
  const W = px(w), H = px(h), D = px(d);
  const m = mirror ? ' scaleX(-1)' : '';
  switch (face) {
    case 'front':  return `translateZ(${D / 2}px) translate(${-W / 2}px, ${-H / 2}px)${m}`;
    case 'back':   return `translateZ(${-D / 2}px) rotateY(180deg) translate(${-W / 2}px, ${-H / 2}px)${m}`;
    case 'right':  return `translateX(${-W / 2}px) rotateY(-90deg) translate(${-D / 2}px, ${-H / 2}px)${m}`;
    case 'left':   return `translateX(${W / 2}px) rotateY(90deg) translate(${-D / 2}px, ${-H / 2}px)${m}`;
    case 'top':    return `translateY(${-H / 2}px) rotateX(90deg) translate(${-W / 2}px, ${-D / 2}px)${m}`;
    case 'bottom': return `translateY(${H / 2}px) rotateX(-90deg) translate(${-W / 2}px, ${-D / 2}px)${m}`;
  }
}

function faceSize(face: string, w: number, h: number, d: number) {
  switch (face) {
    case 'front': case 'back': return { w: px(w), h: px(h) };
    case 'right': case 'left': return { w: px(d), h: px(h) };
    case 'top': case 'bottom': return { w: px(w), h: px(d) };
  }
  return { w: 0, h: 0 };
}

function faceBgPos(r: FaceRect) {
  return `${-r.x * u.value}px ${-r.y * u.value}px`;
}

// 第二层略微外扩（避免 z-fighting，并让外层包覆基础层）
const overlayScale = computed(() => 1 + 0.5 / Math.max(props.scale, 1));

// ---------- 交互（鼠标 / 触摸拖拽） ------------------------------------------
const userYaw = ref(0);
const userPitch = ref(0);
const dragging = ref(false);
let lastX = 0, lastY = 0;

function onPointerDown(e: PointerEvent) {
  if (!props.interactive) return;
  dragging.value = true;
  lastX = e.clientX;
  lastY = e.clientY;
  (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
}
function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return;
  userYaw.value += (e.clientX - lastX) * 0.6;
  userPitch.value = Math.max(-60, Math.min(60, userPitch.value + (e.clientY - lastY) * 0.4));
  lastX = e.clientX;
  lastY = e.clientY;
}
function onPointerUp(e: PointerEvent) {
  dragging.value = false;
  (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
}
onBeforeUnmount(() => { dragging.value = false; });

// 自动旋转（用 rAF 累加，避免 CSS 动画与拖拽冲突）
const autoYaw = ref(0);
let rafId = 0;
let lastTs = 0;
function tick(ts: number) {
  if (lastTs) {
    const dt = ts - lastTs;
    if (props.autoRotate && !dragging.value) autoYaw.value += dt * 0.04; // 40 deg/s
  }
  lastTs = ts;
  rafId = requestAnimationFrame(tick);
}
if (typeof window !== 'undefined' && typeof requestAnimationFrame !== 'undefined') {
  rafId = requestAnimationFrame(tick);
}
onBeforeUnmount(() => {
  if (rafId && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(rafId);
});

const characterStyle = computed(() => {
  const yaw = props.yaw + userYaw.value + autoYaw.value;
  const pitch = props.pitch + userPitch.value;
  // 旋转中心：角色模型中心（脚底以上 16 皮肤像素 ≈ 身高一半）
  return {
    transform: `rotateX(${pitch}deg) rotateY(${yaw}deg)`,
    transformOrigin: `0 ${-16 * u.value}px 0`,
  };
});

// 容器尺寸：宽度 ≈ 肩宽 + 双臂 + padding；高度 ≈ 身高 32 + padding
const stageStyle = computed(() => ({
  width: `${(8 + armW.value * 2 + 8) * u.value}px`,
  height: `${40 * u.value}px`,
  background: props.background,
  perspective: `${120 * u.value}px`,
}));
</script>

<template>
  <div
    class="mc-skin-viewer"
    :class="{
      'is-walking': pose === 'walk',
      'is-idle': pose === 'idle',
      'is-interactive': interactive,
    }"
    :style="stageStyle"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div class="mc-skin-stage">
      <div class="mc-skin-character" :style="characterStyle">
        <div class="mc-skin-float">
          <!-- 每个部位：pivot → swing → center → 6 个面 -->
          <div
            v-for="p in parts"
            :key="p.key"
            class="mc-skin-pivot"
            :style="{ transform: pivotTransform(p) }"
          >
            <div
              class="mc-skin-swing"
              :class="p.swing ? `swing-${p.swing}` : ''"
            >
              <div
                class="mc-skin-center"
                :style="{
                  transform: centerTransform(p) + (p.overlay ? ` scale3d(${overlayScale}, ${overlayScale}, ${overlayScale})` : ''),
                }"
              >
                <div
                  v-for="face in (['back','bottom','right','left','top','front'] as const)"
                  :key="face"
                  class="mc-skin-face"
                  :class="{ 'is-overlay': p.overlay }"
                  :style="{
                    ...skinBg,
                    width: `${faceSize(face, p.w, p.h, p.d).w}px`,
                    height: `${faceSize(face, p.w, p.h, p.d).h}px`,
                    backgroundPosition: faceBgPos(p.faces[face]),
                    transform: faceTransform(face, p.w, p.h, p.d, p.faces[face].mirror),
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mc-skin-viewer {
  position: relative;
  display: inline-block;
  user-select: none;
  touch-action: none;
  overflow: visible;
}
.mc-skin-viewer.is-interactive { cursor: grab; }
.mc-skin-viewer.is-interactive:active { cursor: grabbing; }

.mc-skin-stage {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4%;
  box-sizing: border-box;
}

/* character：以角色脚底中心为原点，所有部位 pivot 都从这里出发 */
.mc-skin-character {
  position: relative;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transition: transform 0.05s linear;
}

/* idle 浮动：仅做 Y 平移，套在 character 内部不影响 yaw/pitch */
.mc-skin-float {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
}
.is-idle .mc-skin-float {
  animation: mc-skin-float 3.6s ease-in-out infinite;
}
@keyframes mc-skin-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-2px); }
}

.mc-skin-pivot {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
}

/* swing：绕关节点（即 pivot 原点）旋转 */
.mc-skin-swing {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transform-origin: 0 0 0;
}
.is-walking .swing-a { animation: mc-swing-a 1s ease-in-out infinite; }
.is-walking .swing-b { animation: mc-swing-b 1s ease-in-out infinite; }
@keyframes mc-swing-a {
  0%, 100% { transform: rotateX(30deg); }
  50%      { transform: rotateX(-30deg); }
}
@keyframes mc-swing-b {
  0%, 100% { transform: rotateX(-30deg); }
  50%      { transform: rotateX(30deg); }
}

.mc-skin-center {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
}

.mc-skin-face {
  position: absolute;
  left: 0;
  top: 0;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  backface-visibility: hidden;
  transform-origin: 0 0 0;
}
</style>
