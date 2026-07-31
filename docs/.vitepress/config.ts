import { defineConfig } from 'vitepress'

const managedDevPort = Number.parseInt(process.env.DEV_PORT ?? '', 10)
const managedDevHost = process.env.DEV_HOST

export default defineConfig({
  title: 'McUI Vue',
  description: 'Minecraft 基岩版风格的 Vue 3 组件库（第三方复刻）',
  lang: 'zh-CN',
  head: [['meta', { name: 'color-scheme', content: 'only light' }]],
  appearance: false,
  scrollOffset: 76,
  // GitHub Pages（project pages）部署在 https://shenyuanol.github.io/mcui-oreui/
  base: '/mcui-oreui/',
  lastUpdated: true,
  markdown: {
    headers: { level: [2, 3] },
    theme: 'github-dark-high-contrast',
  },
  vite: {
    server: {
      ...(managedDevHost ? { host: managedDevHost } : {}),
      port: Number.isInteger(managedDevPort) && managedDevPort > 0 ? managedDevPort : 5175,
      strictPort: true,
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag: string) =>
          tag.startsWith('custom-') ||
          [
            'text-field',
            'link-block',
            'scroll-view',
            'scroll-container',
            'display-body',
            'dispaly-area',
            'modal_area',
            'modal',
            'modal_title_area',
            'modal_title',
            'modal_close_btn',
            'custom-scrollbar',
            'custom-scrollbar-track',
            'custom-scrollbar-thumb',
          ].includes(tag),
      },
    },
  },
  themeConfig: {
    outline: { level: [2, 3], label: '本页目录' },
    search: {
      provider: 'local',
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    },
    // 全站统一侧边栏（数组形式）：指南与组件同处一个导航空间，任意页面均完整可见
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '配置选项', link: '/guide/configuration' },
          { text: '2.0 迁移', link: '/guide/migration-2' },
          { text: '开发与贡献', link: '/guide/development' },
          { text: '设计 Token', link: '/guide/design-tokens' },
          { text: '与 OreUI 的区别', link: '/guide/about' },
        ],
      },
      {
        text: '样式',
        items: [
          { text: '分辨率 / Breakpoints', link: '/styles/breakpoints' },
          { text: '显示与打印 / Display & Print', link: '/styles/display' },
          { text: '弹性布局 / Flex', link: '/styles/flex' },
          { text: '间距与间隙 / Spacing & Gap', link: '/styles/spacing' },
          { text: '溢出 / Overflow', link: '/styles/overflow' },
          { text: '边框与圆角 / Border & Radius', link: '/styles/borders' },
          { text: '文本与排版 / Text & Typography', link: '/styles/typography' },
          { text: '定位与浮动 / Position & Float', link: '/styles/position-float' },
          { text: '尺寸 / Sizing', link: '/styles/sizing' },
          { text: '光标与透明度 / Cursor & Opacity', link: '/styles/cursor-opacity' },
          { text: '辅助工具 / Helpers', link: '/styles/helpers' },
          { text: '阴影层级 / Elevation', link: '/styles/elevation' },
          { text: '主题颜色 / Theme Colors', link: '/styles/theme-colors' },
          { text: '样式类名索引 / Class Index', link: '/styles/utility-index' },
          { text: '图标总览 / Icons', link: '/styles/icons' },
          { text: '格式化代码 / Format Codes', link: '/styles/format-codes' },
          { text: '└ 颜色代码 / Colors', link: '/styles/colors' },
        ],
      },
      {
        text: '组件总览',
        items: [{ text: '组件总览 / Overview', link: '/components/overview' }],
      },
      {
        text: '基础',
        collapsed: true,
        items: [
          { text: '按钮 / Button', link: '/components/button' },
          { text: '图标 / Icon', link: '/components/icon' },
          { text: '卡片 / Card', link: '/components/card' },
          { text: '面板 / Panel', link: '/components/panel' },
          { text: '分隔线 / Divider', link: '/components/divider' },
        ],
      },
      {
        text: '表单',
        collapsed: true,
        items: [
          { text: '表单 / Form', link: '/components/form' },
          { text: '表单字段 / FormField', link: '/components/formfield' },
          { text: '文本框 / TextField', link: '/components/textfield' },
          { text: '多行文本 / Textarea', link: '/components/textarea' },
          { text: '选择器 / Select', link: '/components/select' },
          { text: '自动补全 / Autocomplete', link: '/components/autocomplete' },
          { text: '复选框 / Checkbox', link: '/components/checkbox' },
          { text: '单选项 / Radio', link: '/components/radio' },
          { text: '单选组 / RadioGroup', link: '/components/radio-group' },
          { text: '开关 / Switch', link: '/components/switch' },
          { text: '滑动条 / Slider', link: '/components/slider' },
          { text: '文件输入 / FileInput', link: '/components/file-input' },
          { text: '数字输入 / NumberInput', link: '/components/number-input' },
        ],
      },
      {
        text: '导航',
        collapsed: true,
        items: [
          { text: '标签页 / Tabs', link: '/components/tabs' },
          { text: '按钮标签 / ButtonTabs', link: '/components/button-tabs' },
          { text: '列表 / List', link: '/components/list' },
          { text: '面包屑 / Breadcrumbs', link: '/components/breadcrumbs' },
          { text: '分页 / Pagination', link: '/components/pagination' },
          { text: '扩展面板 / ExpansionPanels', link: '/components/expansion-panels' },
          { text: '步骤条 / Stepper', link: '/components/stepper' },
        ],
      },
      {
        text: '布局',
        collapsed: true,
        items: [
          { text: '布局 / Layout', link: '/components/layout' },
          { text: '栅格 / Grid', link: '/components/grid' },
          { text: '应用栏 / Appbar', link: '/components/appbar' },
          { text: '应用栏按钮 / AppbarButton', link: '/components/appbar-button' },
          { text: '应用栏图标 / AppbarIcon', link: '/components/appbar-icon' },
          { text: '抽屉 / Drawer', link: '/components/drawer' },
          { text: '滚动区 / ScrollView', link: '/components/scrollview' },
          { text: '虚拟滚动 / VirtualScroll', link: '/components/virtual-scroll' },
        ],
      },
      {
        text: '数据展示',
        collapsed: true,
        items: [
          { text: '表格 / Table', link: '/components/table' },
          { text: '数据表格 / DataTable', link: '/components/data-table' },
          { text: '徽标 / Badge', link: '/components/badge' },
          { text: '标签 / Chip', link: '/components/chip' },
          { text: '皮肤预览 / SkinViewer', link: '/components/skinviewer' },
        ],
      },
      {
        text: '浮层',
        collapsed: true,
        items: [
          { text: '浮层 / Overlay', link: '/components/overlay' },
          { text: '对话框 / Dialog', link: '/components/dialog' },
          { text: '菜单 / Menu', link: '/components/menu' },
          { text: '工具提示 / Tooltip', link: '/components/tooltip' },
          { text: '确认框 / Confirm', link: '/components/confirm' },
        ],
      },
      {
        text: '反馈',
        collapsed: true,
        items: [
          { text: '提示条 / Alert', link: '/components/alert' },
          { text: '消息条 / Snackbar', link: '/components/snackbar' },
          { text: '进度条 / Progress', link: '/components/progress' },
          { text: '加载动画 / Spinner', link: '/components/spinner' },
          { text: '骨架屏 / Skeleton', link: '/components/skeleton' },
          { text: '加载遮罩 / LoadingMask', link: '/components/loadingmask' },
          { text: '弹出提示 / Pop', link: '/components/pop' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/ShenYuanOR/mcui-oreui' }],
    footer: {
      message: 'MIT Licensed · 设计语言移植自 Spectrollay-McUI',
      copyright: '© 2020 Spectrollay · Vue 移植版',
    },
  },
})
