<script setup>
import { ref } from 'vue'
import { showPop } from '../../src/composables/usePop'

// Checkbox
const chk1 = ref(false)
const chk2 = ref(true)

// Radio
const radio = ref('a')

// Switch
const sw1 = ref(true)
const sw2 = ref(false)

// Dropdown
const dropVal = ref(0)
const dropVal2 = ref(0)
const dropOpts = ['选项一', '选项二', '选项三']

// Progress + Slider
const progressVal = ref(60)
const sliderVal = ref(50)

// Tabs
const tabVal = ref('tab1')
const tabItems = [
  { label: '标签一', value: 'tab1' },
  { label: '标签二', value: 'tab2' },
  { label: '标签三(禁用)', value: 'tab3', disabled: true },
]

// ButtonTabs
const btnTabVal = ref('a')
const btnTabItems = [
  { label: '选项A', value: 'a', bgcolor: '#5b9a3f' },
  { label: '选项B', value: 'b' },
  { label: '选项C(禁用)', value: 'c', disabled: true },
]

// Feedback components
const modalOpen = ref(false)
const confirmOpen = ref(false)
const drawerOpen = ref(false)
const loadingVisible = ref(false)
function showLoading() {
  loadingVisible.value = true
  setTimeout(() => (loadingVisible.value = false), 1800)
}
</script>

# 组件总览

McUI Vue 所有可用组件一览，分类展示、点击标题可跳转到对应文档页面。

## 基础

### [Icon 图标](/components/icon)

<div class="mc-demo">
  <mc-icon name="mc-clear" size="24" />
  <mc-icon name="mc-check-white" size="24" />
  <mc-icon name="mc-chevron-right" size="24" />
  <mc-icon name="mc-chevron-left" size="24" />
  <mc-icon name="mc-magnifying-glass" size="24" />
  <mc-icon name="mc-settings" size="24" />
  <mc-icon name="mc-home" size="24" />
  <mc-icon name="mc-clipboard" size="24" />
</div>

### [Button 按钮](/components/button)

<div class="mc-demo">
  <mc-button variant="primary">主按钮</mc-button>
  <mc-button>默认按钮</mc-button>
  <mc-button variant="error">危险按钮</mc-button>
  <mc-button bgcolor="#ff6b35">自定义</mc-button>
  <mc-button disabled>禁用按钮</mc-button>
</div>

### [Card 链接卡片](/components/card)

<div class="mc-demo">
  <mc-card href="#" text="关于我们" description="了解更多信息" />
  <mc-card href="#" text="帮助中心" description="获取帮助" />
</div>

### [Panel 面板](/components/panel)

<div class="mc-demo">
  <mc-panel title="面板标题">
    面板内容
  </mc-panel>
</div>

### [Tooltip 提示](/components/tooltip)

<div class="mc-demo">
  <mc-tooltip content="这是一个提示">
    <mc-button>悬停查看</mc-button>
  </mc-tooltip>
</div>

### [SkinViewer 皮肤展示](/components/skinviewer)

<div class="mc-demo">
  <mc-skin-viewer skin="https://assets.mojang.com/SkinTemplates/steve.png"  style="width: 120px; height: 240px;" />
</div>

## 表单

### [Checkbox 复选框](/components/checkbox)

<div class="mc-demo">
  <mc-checkbox v-model="chk1">开启音效</mc-checkbox>
  <mc-checkbox v-model="chk2">已选中</mc-checkbox>
  <mc-checkbox :model-value="true" disabled>已禁用</mc-checkbox>
</div>

### [Radio 单选](/components/radio)

<div class="mc-demo">
  <mc-radio v-model="radio" value="a">选项 A</mc-radio>
  <mc-radio v-model="radio" value="b">选项 B</mc-radio>
  <mc-radio :model-value="'b'" value="b" disabled>已禁用</mc-radio>
</div>

### [FormField 表单项](/components/formfield)

<div class="mc-demo mc-demo--column" style="width: 320px">
  <mc-form-field label="用户名" description="请输入您的用户名。">
    <mc-text-field placeholder="Steve" />
  </mc-form-field>
</div>

### [Switch 开关](/components/switch)

<div class="mc-demo">
  <mc-switch v-model="sw1" />
  <mc-switch v-model="sw2" />
  <mc-switch :model-value="true" disabled />
</div>

### [Dropdown 下拉选择](/components/dropdown)

<div class="mc-demo">
  <mc-dropdown :options="dropOpts" v-model="dropVal" unselected-text="请选择" />
  <mc-dropdown :options="dropOpts" v-model="dropVal2" disabled unselected-text="已禁用" />
</div>

### [TextField 文本框](/components/textfield)

<div class="mc-demo">
  <mc-text-field placeholder="请输入内容" />
  <mc-text-field placeholder="已禁用" disabled />
</div>

### [Progress 进度条](/components/progress)

<div class="mc-demo mc-demo--column" style="width: 300px">
  <mc-progress :value="progressVal" label="进度值" />
  <mc-slider v-model="progressVal" />
</div>

### [Slider 滑动条](/components/slider)

<div class="mc-demo mc-demo--column" style="width: 300px">
  <mc-slider v-model="sliderVal" />
  <mc-slider :model-value="50" disabled />
</div>

## 布局

### [Layout / Header](/components/layout)

<div class="mc-demo mc-demo--column" style="width: 100%; padding: 0">
  <mc-layout>
    <template #header>
      <mc-header title="页面标题" />
    </template>
    内容区域
  </mc-layout>
</div>

### [Appbar 顶栏](/components/appbar)

<div class="mc-demo mc-demo--column" style="width: 100%; padding: 0">
  <mc-appbar title="顶栏标题">
    <mc-button variant="primary">操作</mc-button>
  </mc-appbar>
</div>

### [Tabs 标签页](/components/tabs)

<div class="mc-demo mc-demo--column">
  <mc-tabs v-model="tabVal" :items="tabItems">
    <div v-if="tabVal === 'tab1'">标签一的内容区域</div>
    <div v-else-if="tabVal === 'tab2'">标签二的内容区域</div>
  </mc-tabs>
</div>

### [ButtonTabs 按钮式标签](/components/button-tabs)

<div class="mc-demo mc-demo--column">
  <mc-button-tabs v-model="btnTabVal" :items="btnTabItems" />
</div>

### [List 列表](/components/list)

<div class="mc-demo">
  <mc-list>
    <mc-list-item label="列表项一" value="a" subtitle="副标题" />
    <mc-list-item label="列表项二" value="b" icon="mc-plus" />
    <mc-list-item label="列表项三" value="c" />
    <mc-list-item label="列表项四" value="d" disabled />
  </mc-list>
</div>

### [ScrollView 滚动区](/components/scrollview)

<div class="mc-demo">
  <mc-scroll-view style="width: 240px; height: 100px;">
    <mc-list>
      <mc-list-item label="世界一 · 生存模式" value="w1" />
      <mc-list-item label="世界二 · 创造模式" value="w2" />
      <mc-list-item label="世界三 · 冒险模式" value="w3" />
      <mc-list-item label="世界四 · 服务器" value="w4" />
      <mc-list-item label="世界五 · 测试存档" value="w5" />
    </mc-list>
  </mc-scroll-view>
</div>

## 反馈

### [Modal 弹窗](/components/modal)

<div class="mc-demo">
  <mc-button variant="primary" @click="modalOpen = true">打开弹窗</mc-button>
  <mc-modal v-model:open="modalOpen" title="弹窗标题">
    这是弹窗内容。
  </mc-modal>
</div>

### [Confirm 确认弹窗](/components/confirm)

<div class="mc-demo">
  <mc-button variant="error" @click="confirmOpen = true">危险操作</mc-button>
  <mc-confirm
    v-model:open="confirmOpen"
    title="确认删除？"
    @confirm="confirmOpen = false"
  >
    此操作不可撤销。
  </mc-confirm>
</div>

### [Drawer 抽屉](/components/drawer)

<div class="mc-demo">
  <mc-button @click="drawerOpen = true">打开抽屉</mc-button>
  <mc-drawer v-model:open="drawerOpen" title="抽屉标题">
    抽屉内容区域。
  </mc-drawer>
</div>

### [Pop 提示](/components/pop)

<div class="mc-demo">
  <mc-pop-host />
  <mc-button @click="showPop('已保存世界', 2000, 'success')">成功提示</mc-button>
  <mc-button @click="showPop('保存失败', 2000, 'error')">错误提示</mc-button>
</div>

### [LoadingMask 加载遮罩](/components/loadingmask)

<div class="mc-demo">
  <mc-button @click="showLoading">显示加载遮罩（1.8s）</mc-button>
  <mc-loading-mask :visible="loadingVisible" text="生成世界中" />
</div>
