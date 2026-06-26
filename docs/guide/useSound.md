# 音效（useSound）

McUI 组件库内置了 7 种 Minecraft 基岩版风格音效（`.ogg`），交互时自动播放。所有音效函数均为**纯函数**，不依赖 Vue 上下文，在组合式 API、选项式 API、甚至普通 `.ts` 文件中都能直接调用。

## 音效类型

| 类型 | 说明 | 触发场景 |
|---|---|---|
| `click` | 通用点击 | Checkbox / Radio / Switch / Card / Dropdown 等 |
| `button` | 主操作按钮 | Button（`variant="primary"`） |
| `pop` | 提示弹出 | — |
| `hide` | 隐藏/关闭 | — |
| `open` | 抽屉打开 | Drawer 打开 |
| `close` | 抽屉关闭 | Drawer 关闭 |
| `toast` | Toast 消息 | `showPop()` 调用时 |

## 全局开关

关闭后所有 McUI 组件不再播放音效：

```ts
import { setSoundEnabled } from 'mcui-oreui'

setSoundEnabled(false) // 全局静音
setSoundEnabled(true)  // 重新启用
```

## 手动播放

### `playSound(type)` 

播放指定类型的音效：

```ts
import { playSound } from 'mcui-oreui'

playSound('click')   // 播放点击音效
playSound('button')  // 播放按钮音效
playSound('toast')   // 播放提示音效
```

- 如果全局静音（`setSoundEnabled(false)`），调用会被静默忽略。
- 浏览器策略：首次用户交互前可能拒绝播放，已内置静默捕获。

### `playSoundType(variant)`

根据按钮 variant 自动选择音效 — `primary` 播 `button`，其余播 `click`：

```ts
import { playSoundType } from 'mcui-oreui'

playSoundType('primary')  // → button 音效
playSoundType('normal')   // → click 音效
playSoundType('error')    // → click 音效
```

## `useSound()`

组合式函数，返回上述三个函数的引用：

```vue
<script setup lang="ts">
import { useSound } from 'mcui-oreui'
const { playSound, playSoundType, setSoundEnabled } = useSound()

playSound('button')
</script>
```

> `useSound()` 仅仅是把 `playSound` / `playSoundType` / `setSoundEnabled` 包装返回，
> 与直接导入函数行为一致，主要用于代码组织或统一解构。

## 类型定义

```ts
export type McSoundType = 'click' | 'button' | 'pop' | 'hide' | 'open' | 'close' | 'toast'

export function setSoundEnabled(enabled: boolean): void
export function playSound(type: McSoundType): void
export function playSoundType(variant: 'primary' | 'normal' | 'error' | 'plain'): void
export function useSound(): { playSound; playSoundType; setSoundEnabled }
```
