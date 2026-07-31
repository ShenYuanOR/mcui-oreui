# 样式类名索引 / Class Index

此页用于跨全部样式工具族搜索。响应式变体按 `{breakpoint}` 汇总显示；搜索 `ma-md-4` 等具体类名仍会定位到 `ma-4 / ma-{breakpoint}-4` 这一组。断点含义见[分辨率](./breakpoints)，按用途学习和查看实际效果时请直接进入侧边栏中的对应样式章节。

目录由 `scripts/generate-utilities.mjs` 与 CSS 同源生成；构建会通过 `npm run check:generated` 检查漂移和重复选择器。

<mc-utility-catalog :initial-limit="240" />
