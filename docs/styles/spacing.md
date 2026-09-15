# 间距与间隙 / Spacing & Gap

数值间距使用 `--mc-spacer`（默认 4px）乘以 `0–16`。margin 额外支持 `auto` 和 `n1–n16` 负值；所有类都有响应式变体，尺寸中缀统一见[分辨率](./breakpoints)。

## 基础用法

<div class="mc-demo mc-demo--column">
  <div class="mc-utility-demo__surface">
    <div class="bg-primary pa-4 mb-3">pa-4 · 16px 内边距</div>
    <div class="bg-surface-light px-6 py-2 ms-8">px-6 / py-2 / ms-8</div>
  </div>
</div>

## Auto 与负 Margin

<div class="mc-demo mc-demo--column">
  <div class="mc-utility-demo__surface d-flex"><div class="mc-utility-demo__box ms-auto">ms-auto</div></div>
  <div class="mc-utility-demo__surface"><div class="mc-utility-demo__box mt-n4 ms-4">mt-n4 向上重叠</div></div>
</div>

## Gap

<div class="mc-demo mc-demo--column">
  <div class="d-flex flex-wrap ga-4"><div class="mc-utility-demo__box">A</div><div class="mc-utility-demo__box">B</div><div class="mc-utility-demo__box">C</div></div>
  <div class="d-flex flex-column gr-2"><div class="mc-utility-demo__box">row 1</div><div class="mc-utility-demo__box">row 2</div></div>
</div>

`ms/me` 与 `ps/pe` 是逻辑方向类，RTL 下会自动交换物理侧边。

## 本章类名

<mc-utility-catalog section="spacing" />
