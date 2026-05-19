import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';

// 逐个引入组件（不经 src/index.ts，避免其全局样式副作用污染 VitePress）
import McButton from '../../../src/components/McButton.vue';
import McCheckbox from '../../../src/components/McCheckbox.vue';
import McSwitch from '../../../src/components/McSwitch.vue';
import McDropdown from '../../../src/components/McDropdown.vue';
import McTextField from '../../../src/components/McTextField.vue';
import McSlider from '../../../src/components/McSlider.vue';
import McCard from '../../../src/components/McCard.vue';
import McLayout from '../../../src/components/McLayout.vue';
import McHeader from '../../../src/components/McHeader.vue';
import McScrollView from '../../../src/components/McScrollView.vue';
import McModal from '../../../src/components/McModal.vue';
import McLoadingMask from '../../../src/components/McLoadingMask.vue';
import McPopHost from '../../../src/components/McPopHost.vue';
import McTooltip from '../../../src/components/McTooltip.vue';
import McProgress from '../../../src/components/McProgress.vue';
import McRadio from '../../../src/components/McRadio.vue';
import McRadioGroup from '../../../src/components/McRadioGroup.vue';
import McTabs from '../../../src/components/McTabs.vue';
import McPanel from '../../../src/components/McPanel.vue';
import McFormField from '../../../src/components/McFormField.vue';
import McConfirm from '../../../src/components/McConfirm.vue';
import McDrawer from '../../../src/components/McDrawer.vue';
import McFormattedText from '../../../src/components/McFormattedText.vue';
import McTcode from '../../../src/components/McTcode.vue';

import './mcui-doc.css';
import './custom.css';

const components = {
  'mc-button': McButton,
  'mc-checkbox': McCheckbox,
  'mc-switch': McSwitch,
  'mc-dropdown': McDropdown,
  'mc-text-field': McTextField,
  'mc-slider': McSlider,
  'mc-card': McCard,
  'mc-layout': McLayout,
  'mc-header': McHeader,
  'mc-scroll-view': McScrollView,
  'mc-modal': McModal,
  'mc-loading-mask': McLoadingMask,
  'mc-pop-host': McPopHost,
  'mc-tooltip': McTooltip,
  'mc-progress': McProgress,
  'mc-radio': McRadio,
  'mc-radio-group': McRadioGroup,
  'mc-tabs': McTabs,
  'mc-panel': McPanel,
  'mc-form-field': McFormField,
  'mc-confirm': McConfirm,
  'mc-drawer': McDrawer,
  'mc-formatted-text': McFormattedText,
  'mc-tcode': McTcode,
};

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    for (const [name, comp] of Object.entries(components)) {
      app.component(name, comp);
    }
  },
};

export default theme;
