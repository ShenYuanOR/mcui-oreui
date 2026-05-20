import clickSfx from '../assets/sounds/click.ogg';
import buttonSfx from '../assets/sounds/button.ogg';
import popSfx from '../assets/sounds/pop.ogg';
import hideSfx from '../assets/sounds/hide.ogg';
import openSfx from '../assets/sounds/drawer_open.ogg';
import closeSfx from '../assets/sounds/drawer_close.ogg';
import toastSfx from '../assets/sounds/toast.ogg';

export type McSoundType = 'click' | 'button' | 'pop' | 'hide' | 'open' | 'close' | 'toast';

const soundPaths: Record<McSoundType, string> = {
  click: clickSfx,
  button: buttonSfx,
  pop: popSfx,
  hide: hideSfx,
  open: openSfx,
  close: closeSfx,
  toast: toastSfx,
};

let soundEnabled = true;

/** 全局开关：是否启用 McUI 音效 */
export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

/** 播放指定类型的音效（移植自原 playSound） */
export function playSound(type: McSoundType): void {
  if (!soundEnabled) return;
  const src = soundPaths[type];
  if (!src) return;
  try {
    const audio = new Audio(src);
    void audio.play().catch(() => {
      /* 浏览器策略：首次用户交互前可能拒绝播放，静默忽略 */
    });
  } catch {
    /* 环境不支持 Audio 时静默 */
  }
}

/**
 * 按钮类型音效（移植自原 playSoundType）：
 * 主操作按钮 → button 音；其余可点击控件 → click 音
 */
export function playSoundType(variant: 'primary' | 'normal' | 'error' | 'plain'): void {
  if (variant === 'primary') playSound('button');
  else playSound('click');
}

export function useSound() {
  return { playSound, playSoundType, setSoundEnabled };
}
