# 项目运维须知（本地私有，禁止上传网络）

> 本文件已加入 `.gitignore`，不得提交/推送到 GitHub（含 npm token 名称、过期日期等运维信息）。

## 发布流水线约定

- **CI 文件**：`.github/workflows/publish.yml`
- **`main` 分支推送** → 自动发布正式版（dist-tag `latest`）
- **`dev` 分支推送** → 自动发布测试版 `{version}-dev.{run_number}`（dist-tag `next`），用于发布前验证
- 测试版安装：`npm i mcui-oreui@next`；正式版：`npm i mcui-oreui`

## ⚠️ 必须遵守

1. **npm token 的 GitHub Secret 名是 `MCUIACTION`**（不是 `NPM_TOKEN`）。
   workflow 里引用 `secrets.MCUIACTION`，**不要改回 NPM_TOKEN**，除非同步改 GitHub 仓库 Secret 名。
2. **发正式版前必须先 bump `package.json` 的 `version`**。
   main workflow 有防重复机制：若 npm 上已存在该版本号，会**自动跳过发布**（不会报错但也不会发）。
   发新版流程：改 `package.json` version → commit → push main。
3. **`package.json` 的 `author` 不写邮箱**（隐私），仅保留名称 + GitHub 链接。
4. **push `main` 即触发正式发布，不可逆**：npm 包 24 小时后无法 unpublish 同版本号。推 main 前确认版本与产物无误，建议先 `npm i mcui-oreui@next` 实测。
5. **改 `package.json` 后注意 `package-lock.json` 同步**：CI 用 `npm ci`，lock 与 package.json 不同步会导致 CI 失败。必要时本地 `npm install --package-lock-only` 刷新后一并提交。

6. **新功能完成即同步文档**：用户敲定的新功能 / 新组件 / API 或行为改动一旦实现完成，
   必须在**同一轮工作内**同步更新所有相关文档 —— VitePress `docs/`（组件页 Props/事件表、
   实时 Demo、指南）、`README.md`，必要时本 `AGENTS.md` 的约定；确保文档与代码始终一致、
   保持最新，不得遗留"代码已改、文档未更"的状态。改动完成后主动核对一遍文档覆盖面。

## npm Token 运维

- token 名：`mcuiAction`（Granular，read+write all packages + Bypass 2FA）
- **过期日期：2026-08-16**。到期前需重新生成 token 并更新 GitHub 仓库 Secret `MCUIACTION`，否则发布会因未认证失败。
- 首发新包时 Granular token 必须选 "All packages"（"Only select packages" 列不出未发布的新包）。

## 排障经验

- **核查 GitHub Actions 状态用 REST API**（`https://api.github.com/repos/ShenYuanOR/mcui-oreui/actions/runs`），**不要靠网页抓取**——网页抓取曾误报 success，实际是 failure。
- 判断发布是否真成功的硬标准：`npm view mcui-oreui dist-tags`。
- token "Last used: never" + publish 失败 → 多半是 GitHub Secret 名称/配置问题，不是 token 本身。

## 文档站样式约定（勿破坏）

- 文档站**不要全局引入** `src/styles/index.css`（会污染 VitePress 布局）。
- VitePress 用 `docs/.vitepress/theme/oreui-base.scoped.css`：已把全局/元素/撞名选择器
  （`html` `body` `*` `::selection` `header` `main` `a` `button` `.main` `.flex` `.badge`）
  作用域化到 `.ore-demo`。新增组件若引入新的通用 class，需检查是否撞 VitePress DOM 并按需作用域化。
- 首页 `docs/index.md` 用 `layout: page` + `sidebar: false`，保持独立落地页（勿混入文档侧边栏）。
- 库本身（`dist`）样式保持全局不变，作用域化只针对文档站。

## 自动化记忆与持久化 (SESSION_STATE)
1. **启动自检**：每当新会话开始，必须立即使用 `ls` 或 `read_file` 检查项目根目录下是否存在 `SESSION_STATE.md/.json` **UTF-8 无 BOM** 编码。
   - **不存在**：根据当前对话背景立即初始化创建，包含项目目标和技术栈。
   - **存在**：读取内容并恢复上下文。
2. **上下文同步**：读取后，必须立即向用户总结：
   - 当前开发进度
   - 已定义的变量/常量
   - 数据库表结构
   - 待办事项 (TODO)
3. **实时归档**：每当你完成一个功能模块、修改了核心逻辑或用户要求结束时，你必须主动更新 `SESSION_STATE.md/.json`。
4. **任务记录标准**：状态文件必须包含 `[当前进度]`、`[已定义的 API/表结构]`、`[未完成的任务列表]`。