<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { usePop } from '../../../../src'

const pop = usePop()

const checked = ref(true)
const switched = ref(true)
const radio = ref('survival')
const groupedRadio = ref('creative')
const slider = ref(62)
const text = ref('Alex')
const textarea = ref('A quiet seed near a village.')
const selected = ref<string | number | boolean | null>('survival')
const autocomplete = ref<string | number | boolean | null>('creative')
const numberValue = ref(12)
const fileValue = ref<File | File[] | null>(null)
const tab = ref('worlds')
const buttonTab = ref('play')
const listValue = ref<Array<string | number>>(['survival'])
const page = ref(2)
const tableSelection = ref<unknown[]>([1])
const tableOptions = ref({ page: 1, itemsPerPage: 2, sortBy: [], search: '' })
const dataTableState = new URLSearchParams(window.location.search).get('data-table-state')
const dataTableLoadingHeightMode = new URLSearchParams(window.location.search).get('data-table-loading-height')
const dataTableLoadingHeight =
  dataTableLoadingHeightMode === 'px' ? '320px' : dataTableLoadingHeightMode === 'rows' ? '3L' : undefined
const expansion = ref<string | number | null>('graphics')
const step = ref<string | number>('world')
const menu = ref(false)
const snackbar = ref(true)
const drawer = ref(true)

const options = [
  { title: 'Survival', value: 'survival' },
  { title: 'Creative', value: 'creative' },
  { title: 'Adventure', value: 'adventure', disabled: true },
]
const tabs = [
  { label: 'Worlds', value: 'worlds' },
  { label: 'Servers', value: 'servers' },
]
const buttonTabs = [
  { label: 'Play', value: 'play' },
  { label: 'Settings', value: 'settings', color: '#3d75a5' },
  { label: 'Marketplace', value: 'marketplace' },
  { label: 'Experiments', value: 'experiments', disabled: true },
]
const headers = [
  { title: 'Player', key: 'name' },
  { title: 'Score', key: 'score' },
]
const rows = [
  { id: 1, name: 'Alex', score: 8 },
  { id: 2, name: 'Steve', score: 12 },
  { id: 3, name: 'Creeper', score: 4 },
]
const virtualItems = Array.from({ length: 40 }, (_, index) => `Chunk ${index + 1}`)
const breadcrumbs = [{ title: 'Worlds', href: '#worlds' }, { title: 'New world' }]
const steps = [
  { title: 'World', value: 'world', editable: true },
  { title: 'Rules', value: 'rules', editable: true },
  { title: 'Create', value: 'create' },
]
const skinData =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='

onMounted(() => {
  pop.show('Gallery pop', 60_000, 'success')
})
onBeforeUnmount(pop.clear)
</script>

<template>
  <mc-app class="visual-gallery" data-gallery-component="McApp">
    <header class="gallery-hero">
      <p>mcui-oreui · Spectrollay reference 0bf8f466</p>
      <h1>Ore UI visual regression gallery</h1>
      <p>68 public components · optional Minecraft fonts loaded explicitly</p>
    </header>

    <section class="gallery-section">
      <h2>Providers and foundations</h2>
      <div class="gallery-grid">
        <mc-theme-provider
          data-gallery-component="McThemeProvider"
          name="gallery-green"
          :theme="{ colors: { primary: '#3c8527' } }"
        >
          <mc-panel title="ThemeProvider">Scoped primary color</mc-panel>
        </mc-theme-provider>
        <mc-defaults-provider
          data-gallery-component="McDefaultsProvider"
          :defaults="{ components: { McButton: { variant: 'primary' } } }"
        >
          <mc-button>DefaultsProvider</mc-button>
        </mc-defaults-provider>
        <mc-locale-provider data-gallery-component="McLocaleProvider" locale="en" tag="div">
          <mc-panel title="LocaleProvider">English / LTR scope</mc-panel>
        </mc-locale-provider>
      </div>
    </section>

    <section class="gallery-section gallery-states">
      <h2>Controls and feedback states</h2>
      <div class="gallery-row">
        <mc-button data-gallery-component="McButton" variant="primary" data-state="hover-button">Primary</mc-button>
        <mc-button variant="normal" data-state="active-button">Active target</mc-button>
        <mc-button variant="error">Delete</mc-button>
        <mc-button disabled>Disabled</mc-button>
        <mc-button loading>Loading</mc-button>
      </div>
      <div class="gallery-grid gallery-grid--wide">
        <mc-alert data-gallery-component="McAlert" variant="success" closable
          ><template #title>Saved</template>The world is ready.</mc-alert
        >
        <mc-card data-gallery-component="McCard">
          <mc-card-item data-gallery-component="McCardItem">
            <mc-card-title data-gallery-component="McCardTitle">Playable card</mc-card-title>
            <mc-card-subtitle data-gallery-component="McCardSubtitle">Compound structure</mc-card-subtitle>
          </mc-card-item>
          <mc-card-text data-gallery-component="McCardText">Layered Ore UI panel.</mc-card-text>
          <mc-card-actions data-gallery-component="McCardActions">
            <mc-button size="small">Open</mc-button>
          </mc-card-actions>
        </mc-card>
        <div class="gallery-row">
          <mc-badge data-gallery-component="McBadge" content="3"><mc-button size="small">Inbox</mc-button></mc-badge>
          <mc-chip data-gallery-component="McChip" selected closable>Survival</mc-chip>
          <mc-divider data-gallery-component="McDivider" vertical />
          <mc-tooltip data-gallery-component="McTooltip">
            <mc-button size="small" data-state="tooltip-target">Hover hint</mc-button>
            <template #content><strong>Tooltip title</strong><br />Tooltip text</template>
          </mc-tooltip>
        </div>
        <mc-skeleton data-gallery-component="McSkeleton" height="38" aria-label="Loading preview" />
        <mc-progress data-gallery-component="McProgress" :value="68" label="Generating terrain" variant="success" />
        <div class="gallery-row">
          <mc-spinner data-gallery-component="McSpinner" :size="34" /><span>Loading resources</span>
        </div>
        <mc-icon
          data-gallery-component="McIcon"
          path="M4 4h16v16H4zM8 8h8v8H8z"
          color="#ffffff"
          aria-label="Pixel square"
        />
      </div>
    </section>

    <section class="gallery-section">
      <h2>Form system</h2>
      <div class="gallery-grid gallery-grid--forms">
        <mc-form data-gallery-component="McForm"
          ><mc-button type="submit" size="small">Validate form</mc-button></mc-form
        >
        <mc-form-field
          data-gallery-component="McFormField"
          label="FormField"
          description="Low-level field wrapper"
          hint="Hint text"
        >
          <template #default="field"><input :id="field.id" class="mc-input" value="Native control" /></template>
        </mc-form-field>
        <mc-text-field
          data-gallery-component="McTextField"
          v-model="text"
          label="Player name"
          description="Shown to other players"
          hint="Letters and numbers"
          data-state="focus-input"
        />
        <mc-text-field label="Error state" model-value="Invalid" :error-messages="['Name already exists']" />
        <mc-textarea data-gallery-component="McTextarea" v-model="textarea" label="World description" :rows="3" />
        <mc-select data-gallery-component="McSelect" v-model="selected" label="Game mode" :options="options" />
        <mc-autocomplete
          data-gallery-component="McAutocomplete"
          v-model="autocomplete"
          label="Search mode"
          :options="options"
        />
        <mc-file-input data-gallery-component="McFileInput" v-model="fileValue" label="Resource pack" accept=".zip" />
        <mc-number-input
          data-gallery-component="McNumberInput"
          v-model="numberValue"
          label="Render distance"
          :min="2"
          :max="32"
        />
        <mc-checkbox
          data-gallery-component="McCheckbox"
          v-model="checked"
          label="Allow cheats"
          description="Cannot be undone"
        />
        <mc-radio
          data-gallery-component="McRadio"
          v-model="radio"
          value="survival"
          label="Survival"
          description="Standard progression"
        />
        <mc-radio-group
          data-gallery-component="McRadioGroup"
          v-model="groupedRadio"
          label="Default mode"
          description="Choose one"
          :options="options.slice(0, 2)"
        />
        <div class="gallery-control-stack">
          <mc-switch data-gallery-component="McSwitch" v-model="switched" label="Enable sound" />
          <mc-switch :model-value="false" label="Sound off" />
          <mc-switch disabled label="Disabled switch" />
        </div>
        <div class="gallery-control-stack">
          <mc-slider
            data-gallery-component="McSlider"
            v-model="slider"
            label="Volume"
            description="Master output"
            show-value
          />
          <mc-slider :model-value="35" aria-label="Disabled volume" disabled />
        </div>
      </div>
    </section>

    <section class="gallery-section">
      <h2>Layout and navigation</h2>
      <mc-container data-gallery-component="McContainer" fluid>
        <mc-row data-gallery-component="McRow" align="center">
          <mc-col data-gallery-component="McCol" :cols="4"><div class="gallery-cell">Col 4</div></mc-col>
          <mc-spacer data-gallery-component="McSpacer" />
          <mc-col :cols="4"><div class="gallery-cell">Col 4</div></mc-col>
        </mc-row>
      </mc-container>
      <mc-header data-gallery-component="McHeader" title="Header component" />
      <div class="gallery-layout-shell">
        <mc-layout data-gallery-component="McLayout">
          <mc-appbar data-gallery-component="McAppbar" title="Worlds" :fixed="false">
            <template #right>
              <mc-appbar-button data-gallery-component="McAppbarButton" color="#3d75a5">Edit</mc-appbar-button>
              <mc-appbar-icon data-gallery-component="McAppbarIcon" aria-label="Settings" />
            </template>
          </mc-appbar>
          <mc-drawer data-gallery-component="McDrawer" v-model="drawer" mode="permanent" title="Navigation" :size="190"
            >Worlds<br />Servers<br />Settings</mc-drawer
          >
          <mc-main data-gallery-component="McMain"
            ><div class="gallery-layout-content">Main content respects registered layout bars.</div></mc-main
          >
        </mc-layout>
      </div>
      <div class="gallery-grid gallery-grid--wide">
        <mc-tabs data-gallery-component="McTabs" v-model="tab" :items="tabs"
          ><div class="gallery-tab-panel">Selected: {{ tab }}</div></mc-tabs
        >
        <mc-button-tabs data-gallery-component="McButtonTabs" v-model="buttonTab" title="Play" :items="buttonTabs"
          ><div class="gallery-tab-panel">Selected: {{ buttonTab }}</div></mc-button-tabs
        >
        <div class="gallery-list-host">
          <mc-list data-gallery-component="McList" v-model="listValue" mode="multiple">
            <mc-list-item label="Survival world" subtitle="Last played today" value="survival" />
            <mc-list-item label="Creative world" value="creative" />
          </mc-list>
        </div>
        <span hidden data-gallery-component="McListItem" />
        <mc-scroll-view data-gallery-component="McScrollView" class="gallery-scroll"
          ><p v-for="index in 8" :key="index">Scrollable line {{ index }}</p></mc-scroll-view
        >
      </div>
    </section>

    <section class="gallery-section">
      <h2>Data, navigation, and flow</h2>
      <div class="gallery-grid gallery-grid--wide gallery-flow-host">
        <mc-pagination
          data-gallery-component="McPagination"
          v-model="page"
          :length="8"
          show-first-last
          aria-label="Gallery pages"
        />
        <mc-table data-gallery-component="McTable" striped hover>
          <template #header
            ><tr>
              <th>Name</th>
              <th>Score</th>
            </tr></template
          >
          <template #body
            ><tr>
              <td>Alex</td>
              <td>8</td>
            </tr>
            <tr>
              <td>Steve</td>
              <td>12</td>
            </tr></template
          >
        </mc-table>
        <mc-data-table
          data-gallery-component="McDataTable"
          v-model="tableSelection"
          v-model:options="tableOptions"
          :headers="headers"
          :items="dataTableState === 'empty' ? [] : rows"
          :loading="dataTableState === 'loading'"
          :loading-height="dataTableLoadingHeight"
          :items-per-page-options="[2, 3]"
          no-data-text="No players found"
          show-select
        />
        <mc-virtual-scroll
          data-gallery-component="McVirtualScroll"
          :items="virtualItems"
          :item-height="34"
          :height="150"
          ><template #default="{ item }"
            ><div class="gallery-virtual-row">{{ item }}</div></template
          ></mc-virtual-scroll
        >
        <mc-breadcrumbs data-gallery-component="McBreadcrumbs" :items="breadcrumbs" aria-label="Gallery breadcrumb" />
        <mc-expansion-panels data-gallery-component="McExpansionPanels" v-model="expansion">
          <mc-expansion-panel data-gallery-component="McExpansionPanel" value="graphics" title="Graphics"
            >Fancy leaves and clouds.</mc-expansion-panel
          >
          <mc-expansion-panel value="audio" title="Audio">Music and sound.</mc-expansion-panel>
        </mc-expansion-panels>
        <mc-stepper data-gallery-component="McStepper" v-model="step" :items="steps"
          ><div class="gallery-tab-panel">Step: {{ step }}</div></mc-stepper
        >
      </div>
    </section>

    <section class="gallery-section gallery-overlays">
      <h2>Overlay and feedback surfaces</h2>
      <div class="gallery-grid gallery-grid--wide">
        <mc-overlay
          data-gallery-component="McOverlay"
          :model-value="true"
          :teleport="false"
          :scrim="false"
          class="gallery-static-overlay"
          ><mc-panel title="Overlay">Direct static overlay content.</mc-panel></mc-overlay
        >
        <mc-dialog
          data-gallery-component="McDialog"
          :model-value="true"
          :teleport="false"
          title="World settings"
          class="gallery-dialog"
          ><p>Dialog body with focus-safe controls.</p>
          <template #actions><mc-button size="small">Save</mc-button></template></mc-dialog
        >
        <div>
          <span hidden data-gallery-component="McMenu" /><mc-menu v-model="menu" :teleport="false" class="gallery-menu"
            ><template #activator="{ props }"
              ><mc-button v-bind="props" data-state="menu-target">Gallery Menu</mc-button></template
            ><button type="button" role="menuitem">Save world</button
            ><button type="button" role="menuitem">Delete world</button></mc-menu
          >
        </div>
        <mc-snackbar
          data-gallery-component="McSnackbar"
          v-model="snackbar"
          :teleport="false"
          :timeout="0"
          variant="success"
          class="gallery-snackbar"
          >World saved<template #action>Undo</template></mc-snackbar
        >
        <mc-confirm
          data-gallery-component="McConfirm"
          :model-value="true"
          :teleport="false"
          title="Delete world?"
          confirm-text="Delete"
          danger
          class="gallery-confirm"
          >This action cannot be undone.</mc-confirm
        >
        <mc-loading-mask
          data-gallery-component="McLoadingMask"
          :model-value="true"
          :teleport="false"
          text="Loading chunks"
          class="gallery-loading-mask"
        />
        <mc-pop-host data-gallery-component="McPopHost" class="gallery-pop-host" />
        <div class="gallery-panel-host">
          <mc-panel
            data-gallery-component="McPanel"
            class="gallery-panel"
            title="Workspace panel"
            subtitle="Fixed regions with a scrolling body"
          >
            <template #actions><mc-button size="small">Refresh</mc-button></template>
            <div class="gallery-panel__content">
              <div>World settings</div>
              <div>Resource packs</div>
              <div>Behavior packs</div>
              <div>Experiments</div>
              <div>Multiplayer</div>
            </div>
            <template #footer><mc-button size="small" variant="primary">Save</mc-button></template>
          </mc-panel>
        </div>
      </div>
    </section>

    <section class="gallery-section">
      <h2>Minecraft-specific rendering</h2>
      <div class="gallery-grid gallery-grid--wide">
        <mc-formatted-text data-gallery-component="McFormattedText" text="§aGreen §lBold §rPlain" />
        <mc-tcode data-gallery-component="McTcode">§bDiamond §eGold</mc-tcode>
        <mc-skin-viewer
          data-gallery-component="McSkinViewer"
          :skin="skinData"
          :scale="3"
          pose="none"
          :auto-rotate="false"
          :interactive="false"
        />
      </div>
    </section>
  </mc-app>
</template>

<style>
html,
body,
#app {
  margin: 0;
  min-height: 100%;
}
body {
  background: #252627;
}
.visual-gallery {
  background: #48494a;
  box-sizing: border-box;
  color: #fff;
  font-family: var(--mc-font-ui, sans-serif);
  min-height: 100vh;
  padding: 28px;
}
.visual-gallery,
.visual-gallery * {
  box-sizing: border-box;
}
.gallery-hero {
  border-bottom: 3px solid #1e1e1f;
  margin-bottom: 24px;
  padding-bottom: 18px;
}
.gallery-hero h1 {
  font: 700 34px/1.1 var(--mc-font-title, sans-serif);
  margin: 6px 0;
}
.gallery-hero p {
  color: #d0d1d4;
  margin: 4px 0;
}
.gallery-section {
  background: #313233;
  border: 2px solid #1e1e1f;
  box-shadow: 6px 6px #111;
  margin: 0 0 24px;
  padding: 18px;
}
.gallery-section h2 {
  font: 700 22px/1.2 var(--mc-font-title, sans-serif);
  margin: 0 0 16px;
}
.gallery-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.gallery-grid--wide {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.gallery-grid--forms {
  grid-template-columns: repeat(3, minmax(240px, 1fr));
}
.gallery-list-host ul {
  list-style: disc;
  margin: 16px 0;
  padding-left: 20px;
}
.gallery-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.gallery-control-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.gallery-cell,
.gallery-tab-panel,
.gallery-layout-content,
.gallery-virtual-row {
  background: #58585a;
  border: 2px solid #1e1e1f;
  padding: 10px;
}
.gallery-layout-shell {
  height: 270px;
  margin: 16px 0;
  overflow: hidden;
  position: relative;
}
.gallery-layout-shell .mc-layout {
  min-height: 270px;
  position: relative;
}
.gallery-layout-shell .mc-appbar,
.gallery-layout-shell .mc-drawer {
  position: absolute;
}
.gallery-layout-shell .mc-main {
  min-height: 270px;
}
.gallery-scroll {
  height: 150px;
  min-height: 150px;
  position: relative;
}
.gallery-scroll p {
  margin: 0;
  padding: 8px;
}
.gallery-panel-host {
  height: 230px;
  min-width: 0;
  width: 100%;
}
.gallery-panel {
  height: 100%;
}
.gallery-panel__content {
  display: grid;
  gap: 8px;
}
.gallery-panel__content > div {
  background: #58585a;
  padding: 12px;
}
.gallery-flow-host ol {
  list-style: decimal;
  margin: 16px 0;
  padding-left: 20px;
}
.gallery-flow-host li + li {
  margin-top: 8px;
}
.gallery-flow-host h3 {
  font-size: 20px;
  line-height: 28px;
  margin: 32px 0 0;
}
.gallery-virtual-row {
  height: 34px;
  padding: 7px 10px;
}
.visual-gallery .mc-overlay:not(.mc-overlay--connected) {
  background: rgba(0, 0, 0, 0.25) !important;
  inset: auto;
  min-height: 170px;
  padding: 12px;
  position: relative;
  z-index: auto !important;
}
.visual-gallery .mc-overlay:not(.mc-overlay--connected) .mc-overlay__content {
  max-height: none;
  max-width: 100%;
  width: 100%;
}
.visual-gallery .gallery-dialog,
.visual-gallery .gallery-confirm {
  margin: 0 auto;
  width: min(100%, 440px);
}
.visual-gallery .gallery-snackbar,
.visual-gallery .gallery-loading-mask {
  bottom: auto;
  inset: auto;
  left: auto;
  max-width: none;
  min-height: 120px;
  position: relative;
  transform: none;
  width: 100%;
  z-index: auto;
}
.visual-gallery .gallery-loading-mask {
  min-height: 170px;
}
.gallery-pop-host {
  left: auto;
  position: relative;
  top: auto;
  transform: none;
  z-index: auto;
}
.gallery-pop-host .mc-pop-host__item {
  opacity: 1;
  transform: none;
}
.visual-gallery .mc-skin-viewer {
  margin: 0 auto;
}
@media (max-width: 900px) {
  .gallery-grid,
  .gallery-grid--wide,
  .gallery-grid--forms {
    grid-template-columns: 1fr;
  }
}
@media (prefers-reduced-motion: reduce) {
  .visual-gallery *,
  .visual-gallery *::before,
  .visual-gallery *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>
