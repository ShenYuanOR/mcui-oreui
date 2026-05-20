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
import McHeader from './components/McHeader.vue';
import McScrollView from './components/McScrollView.vue';
import McModal from './components/McModal.vue';
import McLoadingMask from './components/McLoadingMask.vue';
import McPopHost from './components/McPopHost.vue';
import McTooltip from './components/McTooltip.vue';
import McProgress from './components/McProgress.vue';
import McRadio from './components/McRadio.vue';
import McRadioGroup from './components/McRadioGroup.vue';
import McTabs from './components/McTabs.vue';
import McPanel from './components/McPanel.vue';
import McFormField from './components/McFormField.vue';
import McConfirm from './components/McConfirm.vue';
import McDrawer from './components/McDrawer.vue';
import McFormattedText from './components/McFormattedText.vue';
import McTcode from './components/McTcode.vue';
import McIcon from './components/McIcon.vue';

export {
  McButton as McButton,
  McCheckbox as McCheckbox,
  McSwitch as McSwitch,
  McDropdown as McDropdown,
  McTextField as McTextField,
  McSlider as McSlider,
  McCard as McCard,
  McLayout as McLayout,
  McHeader as McHeader,
  McScrollView as McScrollView,
  McModal as McModal,
  McLoadingMask as McLoadingMask,
  McPopHost as McPopHost,
  McTooltip as McTooltip,
  McProgress as McProgress,
  McRadio as McRadio,
  McRadioGroup as McRadioGroup,
  McTabs as McTabs,
  McPanel as McPanel,
  McFormField as McFormField,
  McConfirm as McConfirm,
  McDrawer as McDrawer,
  McFormattedText as McFormattedText,
  McTcode,
  McIcon,
};

export type { McRadioValue } from './components/McRadio.vue';
export type { McRadioOption } from './components/McRadioGroup.vue';
export type { McTabItem, McTabValue } from './components/McTabs.vue';
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
  'mc-icon': McIcon,
};

const McUIVue: Plugin = {
  install(app: App) {
    for (const [name, comp] of Object.entries(components)) {
      app.component(name, comp);
    }
  },
};

export default McUIVue;
