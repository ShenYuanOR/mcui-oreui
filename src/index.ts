import type { App, Plugin } from 'vue';
import './styles/index.css';

import McButton from './components/McButton.vue';
import McCheckbox from './components/McCheckbox.vue';
import McSwitch from './components/McSwitch.vue';
import McDropdown from './components/McDropdown.vue';
import McTextField from './components/McTextField.vue';
import McSlider from './components/McSlider.vue';
import McCard from './components/McCard.vue';
import McLayout from './components/McLayout.vue';
import McContainer from './components/McContainer.vue';
import McRow from './components/McRow.vue';
import McCol from './components/McCol.vue';
import McSpacer from './components/McSpacer.vue';
import McHeader from './components/McHeader.vue';
import McAppbar from './components/McAppbar.vue';
import McAppbarButton from './components/McAppbarButton.vue';
import McAppbarIcon from './components/McAppbarIcon.vue';
import McScrollView from './components/McScrollView.vue';
import McModal from './components/McModal.vue';
import McLoadingMask from './components/McLoadingMask.vue';
import McPopHost from './components/McPopHost.vue';
import McTooltip from './components/McTooltip.vue';
import McProgress from './components/McProgress.vue';
import McRadio from './components/McRadio.vue';
import McRadioGroup from './components/McRadioGroup.vue';
import McTabs from './components/McTabs.vue';
import McButtonTabs from './components/McButtonTabs.vue';
import McList from './components/McList.vue';
import McListItem from './components/McListItem.vue';
import McPanel from './components/McPanel.vue';
import McFormField from './components/McFormField.vue';
import McConfirm from './components/McConfirm.vue';
import McDrawer from './components/McDrawer.vue';
import McFormattedText from './components/McFormattedText.vue';
import McTcode from './components/McTcode.vue';
import McIcon from './components/McIcon.vue';
import McSpinner from './components/McSpinner.vue';
import McSkinViewer from './components/McSkinViewer.vue';

export {
  McButton as McButton,
  McCheckbox as McCheckbox,
  McSwitch as McSwitch,
  McDropdown as McDropdown,
  McTextField as McTextField,
  McSlider as McSlider,
  McCard as McCard,
  McLayout as McLayout,
  McContainer,
  McRow,
  McCol,
  McSpacer,
  McHeader as McHeader,
  McAppbar,
  McAppbarButton,
  McAppbarIcon,
  McScrollView as McScrollView,
  McModal as McModal,
  McLoadingMask as McLoadingMask,
  McPopHost as McPopHost,
  McTooltip as McTooltip,
  McProgress as McProgress,
  McRadio as McRadio,
  McRadioGroup as McRadioGroup,
  McTabs as McTabs,
  McButtonTabs,
  McList,
  McListItem,
  McPanel as McPanel,
  McFormField as McFormField,
  McConfirm as McConfirm,
  McDrawer as McDrawer,
  McFormattedText as McFormattedText,
  McTcode,
  McIcon,
  McSpinner,
  McSkinViewer,
};

export type { McRadioValue } from './components/McRadio.vue';
export type { McRadioOption } from './components/McRadioGroup.vue';
export type { McTabItem, McTabValue } from './components/McTabs.vue';
export type { McButtonTabItem } from './components/McButtonTabs.vue';
export type { McListItemProps, McListValue } from './components/McList.vue';
export type { McGridAlign, McGridJustify } from './components/McRow.vue';
export type { McGridAlignSelf, McGridColumnValue, McGridOrderValue } from './components/McCol.vue';
export {
  MC_FORMAT_CODE_COLORS,
  MC_FORMAT_CODE_STYLES,
  createMcFormattingState,
  parseMcFormatCodes,
  renderMcFormatCodes,
  stripMcFormatCodes,
} from './utils/formatCodes';
export type {
  McFormatCodeColor,
  McFormatCodeStyle,
  McFormattedTextSegment,
  McFormattingState,
  McFormatCodeToken,
  McFormatCodeTokenType,
} from './utils/formatCodes';

export {
  getMcIcon,
  hasMcIcon,
  mcIconNames,
  mcNormalIconNames,
  mcKeyIconNames,
  mcXIconNames,
} from './utils/iconRegistry';
export type { McIconDefinition, McIconName, McIconType } from './utils/iconRegistry';

export { useSound, playSound, playSoundType, setSoundEnabled } from './composables/useSound';
export type { McSoundType } from './composables/useSound';
export { usePop, showPop, popState } from './composables/usePop';
export type { PopItem } from './composables/usePop';

const components = {
  'mc-button': McButton,
  'mc-checkbox': McCheckbox,
  'mc-switch': McSwitch,
  'mc-dropdown': McDropdown,
  'mc-text-field': McTextField,
  'mc-slider': McSlider,
  'mc-card': McCard,
  'mc-layout': McLayout,
  'mc-container': McContainer,
  'mc-row': McRow,
  'mc-col': McCol,
  'mc-spacer': McSpacer,
  'mc-header': McHeader,
  'mc-appbar': McAppbar,
  'mc-appbar-button': McAppbarButton,
  'mc-appbar-icon': McAppbarIcon,
  'mc-scroll-view': McScrollView,
  'mc-modal': McModal,
  'mc-loading-mask': McLoadingMask,
  'mc-pop-host': McPopHost,
  'mc-tooltip': McTooltip,
  'mc-progress': McProgress,
  'mc-radio': McRadio,
  'mc-radio-group': McRadioGroup,
  'mc-tabs': McTabs,
  'mc-button-tabs': McButtonTabs,
  'mc-list': McList,
  'mc-list-item': McListItem,
  'mc-panel': McPanel,
  'mc-form-field': McFormField,
  'mc-confirm': McConfirm,
  'mc-drawer': McDrawer,
  'mc-formatted-text': McFormattedText,
  'mc-tcode': McTcode,
  'mc-icon': McIcon,
  'mc-spinner': McSpinner,
  'mc-skin-viewer': McSkinViewer,
};

export interface McUIVueGlobalComponentNames {
  McButton: typeof McButton;
  McCheckbox: typeof McCheckbox;
  McSwitch: typeof McSwitch;
  McDropdown: typeof McDropdown;
  McTextField: typeof McTextField;
  McSlider: typeof McSlider;
  McCard: typeof McCard;
  McLayout: typeof McLayout;
  McContainer: typeof McContainer;
  McRow: typeof McRow;
  McCol: typeof McCol;
  McSpacer: typeof McSpacer;
  McHeader: typeof McHeader;
  McAppbar: typeof McAppbar;
  McScrollView: typeof McScrollView;
  McModal: typeof McModal;
  McLoadingMask: typeof McLoadingMask;
  McPopHost: typeof McPopHost;
  McTooltip: typeof McTooltip;
  McProgress: typeof McProgress;
  McRadio: typeof McRadio;
  McRadioGroup: typeof McRadioGroup;
  McTabs: typeof McTabs;
  McButtonTabs: typeof McButtonTabs;
  McList: typeof McList;
  McListItem: typeof McListItem;
  McPanel: typeof McPanel;
  McFormField: typeof McFormField;
  McConfirm: typeof McConfirm;
  McDrawer: typeof McDrawer;
  McFormattedText: typeof McFormattedText;
  McTcode: typeof McTcode;
  McIcon: typeof McIcon;
  McSpinner: typeof McSpinner;
  McSkinViewer: typeof McSkinViewer;
}

export interface McUIVueGlobalKebabComponents {
  /** Minecraft Ore UI 风格按钮。 */
  'mc-button': typeof McButton;
  /** 勾选框。 */
  'mc-checkbox': typeof McCheckbox;
  /** 开关切换。 */
  'mc-switch': typeof McSwitch;
  /** 下拉选择器。 */
  'mc-dropdown': typeof McDropdown;
  /** 文本输入框。 */
  'mc-text-field': typeof McTextField;
  /** 滑块选择器。 */
  'mc-slider': typeof McSlider;
  /** 信息卡片。 */
  'mc-card': typeof McCard;
  /** 页面布局容器。 */
  'mc-layout': typeof McLayout;
  /** 响应式栅格容器。 */
  'mc-container': typeof McContainer;
  /** 响应式栅格行。 */
  'mc-row': typeof McRow;
  /** 响应式栅格列。 */
  'mc-col': typeof McCol;
  /** 栅格弹性占位。 */
  'mc-spacer': typeof McSpacer;
  /** 标题栏。 */
  'mc-header': typeof McHeader;
  /** 应用栏。 */
  'mc-appbar': typeof McAppbar;
  /** 滚动视图。 */
  'mc-scroll-view': typeof McScrollView;
  /** 模态弹窗。 */
  'mc-modal': typeof McModal;
  /** 加载遮罩。 */
  'mc-loading-mask': typeof McLoadingMask;
  /** 全局 Pop 提示宿主。 */
  'mc-pop-host': typeof McPopHost;
  /** Tooltip 提示。 */
  'mc-tooltip': typeof McTooltip;
  /** 进度条。 */
  'mc-progress': typeof McProgress;
  /** 单选框。 */
  'mc-radio': typeof McRadio;
  /** 单选框组。 */
  'mc-radio-group': typeof McRadioGroup;
  /** 标签页。 */
  'mc-tabs': typeof McTabs;
  /** 按钮式标签页。 */
  'mc-button-tabs': typeof McButtonTabs;
  /** 列表容器。 */
  'mc-list': typeof McList;
  /** 列表项。 */
  'mc-list-item': typeof McListItem;
  /** 面板容器。 */
  'mc-panel': typeof McPanel;
  /** 表单字段容器。 */
  'mc-form-field': typeof McFormField;
  /** 确认弹窗。 */
  'mc-confirm': typeof McConfirm;
  /** 抽屉面板。 */
  'mc-drawer': typeof McDrawer;
  /** Minecraft 格式化文本渲染。 */
  'mc-formatted-text': typeof McFormattedText;
  /** Minecraft § 代码文本渲染。 */
  'mc-tcode': typeof McTcode;
  /** 内置图标。 */
  'mc-icon': typeof McIcon;
  /** 旋转加载图标。 */
  'mc-spinner': typeof McSpinner;
  /** Minecraft 皮肤查看器。 */
  'mc-skin-viewer': typeof McSkinViewer;
}

export type McUIVueGlobalComponents = McUIVueGlobalComponentNames & McUIVueGlobalKebabComponents;

declare module '@vue/runtime-core' {
  export interface GlobalComponents extends McUIVueGlobalComponents {}
}

declare module 'vue' {
  export interface GlobalComponents extends McUIVueGlobalComponents {}
}

const McUIVue: Plugin = {
  install(app: App) {
    for (const [name, comp] of Object.entries(components)) {
      app.component(name, comp);
    }
  },
};

export default McUIVue;
