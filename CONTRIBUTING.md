# 参与开发

感谢参与 mcui-oreui。项目以 Vue 3.5+、TypeScript、Vite、Vitest、Playwright 和 VitePress 为开发基线。

完整架构、样式隔离、无障碍、测试和发布约定见 [`docs/guide/development.md`](./docs/guide/development.md)。

## 本地验证

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run check:size
npm run test:consumer
npm run docs:build
npm run test:e2e
npm audit --omit=dev
```

## 变更要求

- 优先使用原生语义元素并补齐键盘、焦点和 ARIA 行为。
- 默认 CSS 必须使用 `mc-` 命名空间，不得污染宿主页面。
- 图标、声音和字体保持显式可选，不得进入普通组件入口。
- 新增或修改 API 时，同步 README、VitePress、GlobalComponents 和 `web-types.json`。
- 修改 `package.json` 后同步 `package-lock.json`。
- 不提交 token、本地状态、AI 配置、构建缓存或测试产物。

正式发布由分支 CI 完成。普通贡献不要通过推送 `main` 测试发布流程。
