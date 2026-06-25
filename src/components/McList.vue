<script setup lang="ts">
import { computed, defineComponent, Fragment, useSlots, type PropType, type Slot, type VNode } from 'vue'
import { playSound } from '../composables/useSound'
import McIcon from './McIcon.vue'
import McRadio from './McRadio.vue'
import McCheckbox from './McCheckbox.vue'
import McListItemComponent from './McListItem.vue'
import type { McListRenderedItem, McListValue } from './listTypes'

export type { McListItemProps, McListValue } from './listTypes'

const props = withDefaults(
  defineProps<{
    modelValue?: McListValue | McListValue[]
    /** 选择模式：不设置则为纯展示列表，single（单选）| multiple（多选） */
    mode?: 'single' | 'multiple' | ''
    /** 单选模式下是否显示单选框指示器 */
    showRadio?: boolean
  }>(),
  { modelValue: '', mode: '', showRadio: true },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: McListValue | McListValue[]): void
  (e: 'change', v: McListValue | McListValue[]): void
}>()

const slots = useSlots()

const McListSlotOutlet = defineComponent({
  name: 'McListSlotOutlet',
  props: {
    slot: { type: Function as PropType<Slot>, required: true },
    item: { type: Object as PropType<McListRenderedItem>, required: true },
  },
  setup(slotProps) {
    return () => slotProps.slot({ item: slotProps.item })
  },
})

function getVNodeProps(vnode: VNode): Record<string, unknown> {
  return (vnode.props || {}) as Record<string, unknown>
}

function readProp(props: Record<string, unknown>, camelName: string, kebabName = camelName): unknown {
  return props[camelName] ?? props[kebabName]
}

function readStringProp(props: Record<string, unknown>, camelName: string, kebabName = camelName): string | undefined {
  const value = readProp(props, camelName, kebabName)
  if (value === undefined || value === null || value === '') return undefined
  return String(value)
}

function readBooleanProp(props: Record<string, unknown>, camelName: string, defaultValue: boolean): boolean {
  const value = readProp(props, camelName)
  if (value === undefined || value === null) return defaultValue
  if (value === '' || value === camelName) return true
  if (value === 'false') return false
  return Boolean(value)
}

function readValueProp(props: Record<string, unknown>): McListValue {
  const value = readProp(props, 'value')
  if (typeof value === 'number' || typeof value === 'string') return value
  return ''
}

function isListItemVNode(vnode: VNode): boolean {
  return vnode.type === McListItemComponent || vnode.type === 'mc-list-item'
}

function readItemSlots(vnode: VNode): { itemLeft?: Slot; itemRight?: Slot } {
  if (!vnode.children || typeof vnode.children !== 'object' || Array.isArray(vnode.children)) return {}
  const childSlots = vnode.children as Record<string, Slot | undefined>
  return {
    itemLeft: childSlots.left,
    itemRight: childSlots.right,
  }
}

function createItemFromVNode(vnode: VNode): McListRenderedItem {
  const vnodeProps = getVNodeProps(vnode)
  return {
    label: readStringProp(vnodeProps, 'label') || '',
    value: readValueProp(vnodeProps),
    disabled: readBooleanProp(vnodeProps, 'disabled', false),
    interactive: readBooleanProp(vnodeProps, 'interactive', true),
    icon: readStringProp(vnodeProps, 'icon'),
    iconRight: readStringProp(vnodeProps, 'iconRight', 'icon-right'),
    subtitle: readStringProp(vnodeProps, 'subtitle'),
    ...readItemSlots(vnode),
  }
}

function collectSlotItems(vnodes: VNode[] | undefined, result: McListRenderedItem[] = []): McListRenderedItem[] {
  if (!vnodes) return result
  for (const vnode of vnodes) {
    if (vnode.type === Fragment && Array.isArray(vnode.children)) {
      collectSlotItems(vnode.children as VNode[], result)
    } else if (isListItemVNode(vnode)) {
      result.push(createItemFromVNode(vnode))
    }
  }
  return result
}

const slotItems = computed(() => collectSlotItems(slots.default?.()))
const listItems = computed<McListRenderedItem[]>(() => slotItems.value)

function isSelected(item: McListRenderedItem): boolean {
  if (!props.mode) return false
  if (props.mode === 'multiple') {
    return Array.isArray(props.modelValue) && props.modelValue.includes(item.value)
  }
  return item.value === props.modelValue
}

function isInteractive(item: McListRenderedItem): boolean {
  return item.interactive !== false
}

function handleSelect(item: McListRenderedItem) {
  if (item.disabled) return
  playSound('click')

  if (props.mode === 'multiple') {
    const arr: McListValue[] = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const idx = arr.indexOf(item.value)
    if (idx >= 0) {
      arr.splice(idx, 1)
    } else {
      arr.push(item.value)
    }
    emit('update:modelValue', arr)
    emit('change', arr)
  } else {
    const val: McListValue = item.value
    emit('update:modelValue', val)
    emit('change', val)
  }
}

function handleItemKeydown(event: KeyboardEvent, item: McListRenderedItem) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  if (event.repeat) return
  handleSelect(item)
}
</script>

<template>
  <div class="mc-list">
    <div
      v-for="item in listItems"
      :key="String(item.value)"
      class="mc-list__item"
      :class="{
        'mc-list__item--active': isSelected(item),
        'mc-list__item--disabled': item.disabled,
        'mc-list__item--interactive': isInteractive(item),
      }"
      role="button"
      :aria-disabled="item.disabled ? 'true' : 'false'"
      :tabindex="item.disabled ? -1 : 0"
      @click="handleSelect(item)"
      @keydown="handleItemKeydown($event, item)"
    >
      <!-- 单选/多选指示器 -->
      <span v-if="mode && (mode === 'single' ? showRadio : true)" class="mc-list__item-indicator">
        <McRadio
          v-if="mode === 'single'"
          :model-value="(modelValue as McListValue)"
          :value="item.value"
          :disabled="item.disabled"
        />
        <McCheckbox
          v-if="mode === 'multiple'"
          :model-value="Array.isArray(modelValue) && modelValue.includes(item.value)"
          :disabled="item.disabled"
        />
      </span>

      <!-- 左侧自定义插槽 / 图标 -->
      <div
        v-if="item.itemLeft"
        class="mc-list__item-slot mc-list__item-slot--left"
        @click.stop
        @pointerdown.stop
        @pointerup.stop
        @keydown.stop
      >
        <McListSlotOutlet :slot="item.itemLeft" :item="item" />
      </div>
      <McIcon v-else-if="item.icon" :name="item.icon" class="mc-list__item-icon mc-list__item-icon--left" />

      <div class="mc-list__item-content">
        <span class="mc-list__item-label">{{ item.label }}</span>
        <span v-if="item.subtitle" class="mc-list__item-subtitle">{{ item.subtitle }}</span>
      </div>

      <!-- 右侧自定义插槽 / 图标 -->
      <div
        v-if="item.itemRight"
        class="mc-list__item-slot mc-list__item-slot--right"
        @click.stop
        @pointerdown.stop
        @pointerup.stop
        @keydown.stop
      >
        <McListSlotOutlet :slot="item.itemRight" :item="item" />
      </div>
      <McIcon v-else-if="item.iconRight" :name="item.iconRight" class="mc-list__item-icon mc-list__item-icon--right" />
    </div>
  </div>
</template>
