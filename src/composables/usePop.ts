import { ref } from 'vue'
import { playSound } from './useSound'

export interface PopItem {
  id: number
  message: string
  styleClass?: string
  show: boolean
}

const pops = ref<PopItem[]>([])
let seq = 0
const MAX_VISIBLE = 5

/** 共享的 pop 列表（供 McPopHost 渲染） */
export const popState = pops

/**
 * 弹出一条短暂提示（移植自原 showPop）
 * @param message 文本
 * @param duration 毫秒（默认 3000）
 * @param styleClass 额外样式类：success / process / error / vip / debug_text
 */
export function showPop(message: string, duration = 3000, styleClass?: string): void {
  const d = Number(duration)
  const ttl = Number.isFinite(d) && d > 0 ? d : 3000
  const id = ++seq

  pops.value.unshift({ id, message, styleClass, show: false })
  if (pops.value.length > MAX_VISIBLE) pops.value.splice(MAX_VISIBLE)

  playSound('toast')

  requestAnimationFrame(() => {
    const p = pops.value.find((x) => x.id === id)
    if (p) p.show = true
  })

  setTimeout(() => {
    const p = pops.value.find((x) => x.id === id)
    if (p) p.show = false
    setTimeout(() => {
      pops.value = pops.value.filter((x) => x.id !== id)
    }, 300)
  }, ttl)
}

export function usePop() {
  return { showPop }
}
