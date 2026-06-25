import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'McUI Vue',
  description: 'Minecraft 基岩版风格的 Vue 3 组件库（第三方复刻）',
  lang: 'zh-CN',
  head: [['meta', { name: 'color-scheme', content: 'only light' }]],
  // GitHub Pages（project pages）部署在 https://shenyuanol.github.io/mcui-oreui/
  base: '/mcui-oreui/',
  lastUpdated: true,
  vite: {
    server: { port: 5175, strictPort: true },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag: string) =>
          tag.startsWith('custom-') ||
          ['text-field', 'link-block', 'scroll-view', 'scroll-container',
            'display-body', 'dispaly-area', 'modal_area', 'modal',
            'modal_title_area', 'modal_title', 'modal_close_btn',
            'custom-scrollbar', 'custom-scrollbar-track',
            'custom-scrollbar-thumb'].includes(tag),
      },
    },
  },
  themeConfig: {
    nav: [
      { text: '文档', link: '/guide/getting-started' },
      { text: '设计 Token', link: '/guide/design-tokens' },
      { text: '贡献者', link: '/contributors' },
    ],
    // 全站统一侧边栏（数组形式）：指南与组件同处一个导航空间，任意页面均完整可见
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '设计 Token', link: '/guide/design-tokens' },
          { text: '与 OreUI 的区别', link: '/guide/about' },
        ],
      },
      {
        text: '样式',
        items: [
          { text: '图标总览', link: '/styles/icons' },
          { text: '格式化代码', link: '/styles/format-codes' },
          { text: '└ 颜色代码', link: '/styles/colors' },
        ],
      },
      {
        text: '组件总览',
        items: [
          { text: '组件总览', link: '/components/overview' },
        ],
      },
      {
        text: '基础',
        items: [
          { text: 'Icon 图标', link: '/components/icon' },
          { text: 'Button 按钮', link: '/components/button' },
          { text: 'Card 链接卡片', link: '/components/card' },
          { text: 'Panel 面板', link: '/components/panel' },
          { text: 'Tooltip 提示', link: '/components/tooltip' },
          { text: 'Progress 进度条', link: '/components/progress' },
          { text: 'SkinViewer 皮肤展示', link: '/components/skinviewer' },
        ],
      },
      {
        text: '表单',
        items: [
          { text: 'Checkbox 复选框', link: '/components/checkbox' },
          { text: 'Radio 单选', link: '/components/radio' },
          { text: 'FormField 表单项', link: '/components/formfield' },
          { text: 'Switch 开关', link: '/components/switch' },
          { text: 'Dropdown 下拉选择', link: '/components/dropdown' },
          { text: 'TextField 文本框', link: '/components/textfield' },
          { text: 'Slider 滑动条', link: '/components/slider' },
        ],
      },
      {
        text: '布局',
        items: [
          { text: 'Layout / Header', link: '/components/layout' },
          { text: 'Appbar 顶栏', link: '/components/appbar' },
          { text: 'Tabs 标签页', link: '/components/tabs' },
          { text: 'ButtonTabs 按钮式标签', link: '/components/button-tabs' },
          { text: 'List 列表', link: '/components/list' },
          { text: 'ScrollView 滚动区', link: '/components/scrollview' },
        ],
      },
      {
        text: '反馈',
        items: [
          { text: 'Modal 弹窗', link: '/components/modal' },
          { text: 'Confirm 确认弹窗', link: '/components/confirm' },
          { text: 'Drawer 抽屉', link: '/components/drawer' },
          { text: 'Pop 提示', link: '/components/pop' },
          { text: 'LoadingMask 加载遮罩', link: '/components/loadingmask' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ShenYuanOR/mcui-oreui' },
    ],
    footer: {
      message: 'MIT Licensed · 设计语言移植自 Spectrollay-McUI',
      copyright: '© 2020 Spectrollay · Vue 移植版',
    },
  },
});
