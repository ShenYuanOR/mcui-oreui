import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OreUI Vue',
  description: 'Minecraft 基岩版 Ore UI 设计语言的 Vue 3 组件库（第三方复刻）',
  lang: 'zh-CN',
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
    ],
    // 全站统一侧边栏（数组形式）：指南与组件同处一个导航空间，任意页面均完整可见
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '设计 Token', link: '/guide/design-tokens' },
          { text: '与官方 ore-ui 的区别', link: '/guide/about' },
        ],
      },
      {
        text: '基础',
        items: [
          { text: 'Button 按钮', link: '/components/button' },
          { text: 'Card 链接卡片', link: '/components/card' },
        ],
      },
      {
        text: '表单',
        items: [
          { text: 'Checkbox 复选框', link: '/components/checkbox' },
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
          { text: 'ScrollView 滚动区', link: '/components/scrollview' },
        ],
      },
      {
        text: '反馈',
        items: [
          { text: 'Modal 弹窗', link: '/components/modal' },
          { text: 'Pop 提示', link: '/components/pop' },
          { text: 'LoadingMask 加载遮罩', link: '/components/loadingmask' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ShenYuanOR/mcui-oreui' },
    ],
    footer: {
      message: 'MIT Licensed · 设计语言移植自 Spectrollay-OreUI',
      copyright: '© 2020 Spectrollay · Vue 移植版',
    },
  },
})
