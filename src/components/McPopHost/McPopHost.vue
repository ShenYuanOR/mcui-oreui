<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { useAttrs } from 'vue'
import { usePop } from '../../composables/usePop'
import { useMcLocale } from '../../framework/locale'
import { useMcTheme } from '../../framework/theme'
const theme = useMcTheme()
const locale = useMcLocale()
const pop = usePop()
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
</script>

<template>
  <Teleport to="body">
    <div
      v-bind="attrs"
      class="mc-pop-host"
      :class="theme.classes.value"
      :style="theme.styles.value"
      :dir="locale.dir.value"
      aria-live="polite"
      aria-atomic="false"
    >
      <div
        v-for="item in pop.state.value"
        :key="item.id"
        class="mc-pop-host__item"
        :class="[
          item.styleClass ? `mc-pop-host__item--${item.styleClass}` : '',
          { 'mc-pop-host__item--show': item.show },
        ]"
      >
        {{ item.message }}
      </div>
    </div>
  </Teleport>
</template>
