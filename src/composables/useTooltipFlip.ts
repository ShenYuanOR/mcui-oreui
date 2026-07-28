import { ref } from 'vue'

export interface TooltipFlipStyle {
  top?: string
  bottom?: string
  left?: string
  right?: string
  transform?: string
}

/** tooltip 预设高度（单行文字 + 边距 + 边框） */
const ESTIMATED_HEIGHT = 36
/** tooltip 最大宽度（与 .mc-tooltip__content max-width 一致） */
const ESTIMATED_MAX_WIDTH = 240
/** tooltip 与容器的间距 */
const GAP = 4

/**
 * 向上查找最近的 dispaly-area 祖先元素
 * （McLayout 渲染的容器，tooltip 必须以它为边界）
 */
function findDisplayArea(el: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = el.parentElement
  while (current) {
    if (current.tagName.toLowerCase() === 'dispaly-area') {
      return current
    }
    current = current.parentElement
  }
  return null
}

/**
 * 鼠标悬浮时自动检测 tooltip 是否会溢出容器/屏幕，
 * 自动翻转方向并约束水平位置使其始终可见。
 *
 * 优先级：
 * 1. 默认在上方显示
 * 2. 上方不足时翻转到下方
 * 3. 水平方向溢出 dispaly-area 时调整 left 对齐
 */
export function useTooltipFlip() {
  const containerRef = ref<HTMLElement | null>(null)
  const tooltipStyle = ref<TooltipFlipStyle>({})

  function updatePosition() {
    const el = containerRef.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const da = findDisplayArea(el)
    const daRect = da?.getBoundingClientRect() ?? null

    // --- 垂直方向判定 ---
    const spaceAbove = daRect
      ? rect.top - daRect.top
      : rect.top

    const spaceBelow = daRect
      ? daRect.bottom - rect.bottom
      : window.innerHeight - rect.bottom

    const fitsAbove = spaceAbove >= ESTIMATED_HEIGHT + GAP
    const fitsBelow = spaceBelow >= ESTIMATED_HEIGHT + GAP

    // 默认上方；上方不足 && 下方够用 → 翻转到下方
    const flipVertical = !fitsAbove && fitsBelow

    const style: TooltipFlipStyle = {
      left: '50%',
      right: 'auto',
      transform: 'translateX(-50%)',
    }

    if (flipVertical) {
      style.top = `calc(100% + ${GAP}px)`
      style.bottom = 'auto'
    } else {
      style.top = 'auto'
      style.bottom = `calc(100% + ${GAP}px)`
    }

    // --- 水平方向判定（基于 dispaly-area 边界） ---
    if (daRect) {
      const centerX = rect.left + rect.width / 2
      const halfWidth = ESTIMATED_MAX_WIDTH / 2
      const overflowLeft = centerX - halfWidth < daRect.left
      const overflowRight = centerX + halfWidth > daRect.right

      if (overflowLeft) {
        // 左溢出：贴左边界
        style.left = `${daRect.left - rect.left}px`
        style.transform = 'none'
      } else if (overflowRight) {
        // 右溢出：贴右边界
        style.left = 'auto'
        style.right = `${rect.right - daRect.right}px`
        style.transform = 'none'
      }
    }

    tooltipStyle.value = style
  }

  return { containerRef, tooltipStyle, updatePosition }
}
