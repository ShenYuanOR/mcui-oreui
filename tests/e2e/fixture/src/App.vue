<script setup lang="ts">
import { ref } from 'vue'
const dialog = ref(false)
const menu = ref(false)
const drawer = ref(true)
const selected = ref<string | null>(null)
const edgeSelected = ref<string | null>(null)
const tab = ref('one')
const options = ['Survival', 'Creative']
const tabs = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
]
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Score', key: 'score' },
]
const rows = [
  { id: 1, name: 'Alex', score: 2 },
  { id: 2, name: 'Steve', score: 1 },
]
</script>

<template>
  <mc-app
    ><mc-layout>
      <mc-appbar title="Test app" :height="44" />
      <mc-drawer v-model="drawer" mode="persistent" title="Navigation" :size="220"><p>Drawer content</p></mc-drawer>
      <mc-main>
        <mc-dialog v-model="dialog" title="World settings">
          <template #activator="{ props }"><mc-button v-bind="props">Open dialog</mc-button></template>
          <mc-menu v-model="menu"
            ><template #activator="{ props }"><mc-button v-bind="props">Open menu</mc-button></template>
            <button type="button" role="menuitem">Save world</button
            ><button type="button" role="menuitem">Delete world</button>
          </mc-menu>
          <mc-button id="dialog-action">Save</mc-button>
        </mc-dialog>
        <mc-select v-model="selected" label="Mode" :options="options" />
        <mc-tabs v-model="tab" :items="tabs"
          ><p>Panel {{ tab }}</p></mc-tabs
        >
        <mc-data-table :headers="headers" :items="rows" />
        <div class="edge-popup"><mc-select v-model="edgeSelected" label="Edge mode" :options="options" /></div>
      </mc-main> </mc-layout
  ></mc-app>
</template>

<style scoped>
.edge-popup {
  bottom: 4px;
  position: fixed;
  right: 4px;
  width: 180px;
}
</style>
