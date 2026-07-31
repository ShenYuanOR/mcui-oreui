<template>
  <mc-app class="utilities-fixture">
    <mc-button data-testid="display-override" class="d-none">Hidden component</mc-button>

    <div data-testid="spacing" class="utility-spacing ma-4 mt-n2 pa-md-6">Spacing</div>

    <div
      data-testid="flex"
      class="utility-flex d-flex flex-column flex-md-row flex-wrap justify-center align-center ga-4"
    >
      <div data-testid="flex-child" class="order-first order-md-last flex-grow-1">Child</div>
      <div>Sibling</div>
    </div>
    <div data-testid="auto-host" class="auto-host d-flex">
      <div data-testid="auto-margin" class="auto-item ms-auto">Auto</div>
    </div>

    <section dir="rtl" class="rtl-host">
      <div data-testid="rtl" class="ms-4 ps-3 float-start border-s-md rounded-s-lg">RTL</div>
    </section>

    <div data-testid="print-display" class="d-block d-print-none">Print display</div>
    <div data-testid="print-float" class="float-left float-print-right">Print float</div>

    <div data-testid="typography" class="text-body-medium text-md-headline-small text-uppercase text-truncate">
      typography sample
    </div>
    <div data-testid="theme" class="text-primary bg-surface border border-primary border-opacity-50">Theme</div>
    <div data-testid="custom-theme" class="text-primary" style="--mc-primary: #123456">Custom theme</div>
    <div class="sizing-host">
      <div
        data-testid="position"
        class="position-relative top-0 w-50 h-25 opacity-50 cursor-pointer elevation-6 overflow-clip"
      >
        Position
      </div>
    </div>
    <a data-testid="sr-only" class="d-sr-only" href="#target">Screen reader link</a>
    <div data-testid="hidden" class="hidden-md">Hidden at md</div>
    <div data-testid="pointer" class="pointer-pass-through"><button type="button">Pointer child</button></div>
    <button data-testid="plain" class="plain-host" type="button">Plain host</button>
  </mc-app>
</template>

<style scoped>
.utilities-fixture {
  min-height: 720px;
  padding: 0;
  width: 800px;
}
.utility-spacing {
  padding: 3px;
}
.utility-flex {
  display: block;
  flex-direction: row;
  gap: 2px;
}
.rtl-host {
  min-height: 60px;
}
.rtl-host > div {
  border-left-width: 0;
  border-right-width: 0;
}
[data-testid='position'] {
  height: 200px;
  width: 600px;
}
.auto-host {
  width: 200px;
}
.auto-item {
  width: 20px;
}
.sizing-host {
  height: 400px;
  width: 400px;
}
.plain-host {
  display: inline-block;
  margin: 7px;
}
</style>
