<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, defineComponent, Fragment, ref, useSlots, type PropType, type Slot, type VNode } from 'vue'
import checkWhite from '../../assets/images/check-white.svg'
import { useSound } from '../../composables/useSound'
import McIcon from '../McIcon'
import McListItemComponent from '../McListItem'
import type { McListRenderedItem, McListValue } from '../_shared/listTypes'

const { playSound } = useSound()

export type { McListItemProps, McListValue } from '../_shared/listTypes'

const props = withDefaults(
  defineProps<{
    modelValue?: McListValue | McListValue[]
    /** 选择模式：不设置则为纯展示列表，single（单选）| multiple（多选） */
    mode?: 'single' | 'multiple' | ''
    /** 单选模式下是否显示单选框指示器 */
    showRadio?: boolean
  }>(),
  {
    // The union accepts both a scalar and an array; the scalar default is intentional.
    // eslint-disable-next-line vue/require-valid-default-prop
    modelValue: '',
    mode: '',
    showRadio: true,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: McListValue | McListValue[]): void
  (e: 'change', v: McListValue | McListValue[]): void
}>()

const slots = useSlots()

const McListSlotOutlet = defineComponent({
  name: 'McListSlotOutlet',
  props: {
    content: { type: Function as PropType<Slot>, required: true },
    item: { type: Object as PropType<McListRenderedItem>, required: true },
  },
  setup(slotProps) {
    return () => slotProps.content({ item: slotProps.item })
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
const itemElements = ref<HTMLElement[]>([])

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
  const index = listItems.value.indexOf(item)
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (!event.repeat) handleSelect(item)
    return
  }
  let target = index
  if (event.key === 'ArrowDown') target = Math.min(index + 1, listItems.value.length - 1)
  else if (event.key === 'ArrowUp') target = Math.max(index - 1, 0)
  else if (event.key === 'Home') target = 0
  else if (event.key === 'End') target = listItems.value.length - 1
  else return
  event.preventDefault()
  while (listItems.value[target]?.disabled && target !== index) {
    target += target > index ? 1 : -1
    if (target < 0 || target >= listItems.value.length) return
  }
  itemElements.value[target]?.focus()
}
</script>

<template>
  <ul class="mc-list" :role="mode ? 'listbox' : 'list'" :aria-multiselectable="mode === 'multiple' || undefined">
    <li
      v-for="(listItem, itemIndex) in listItems"
      :key="String(listItem.value)"
      :ref="
        (element) => {
          if (element) itemElements[itemIndex] = element as HTMLElement
        }
      "
      class="mc-list__item"
      :class="{
        'mc-list__item--active': isSelected(listItem),
        'mc-list__item--disabled': listItem.disabled,
        'mc-list__item--interactive': isInteractive(listItem),
      }"
      :role="mode ? 'option' : 'listitem'"
      :aria-selected="mode ? isSelected(listItem) : undefined"
      :aria-disabled="listItem.disabled ? 'true' : 'false'"
      :tabindex="mode && !listItem.disabled ? 0 : undefined"
      @click="handleSelect(listItem)"
      @keydown="handleItemKeydown($event, listItem)"
    >
      <!-- 单选/多选指示器 -->
      <span v-if="mode && (mode === 'single' ? showRadio : true)" class="mc-list__item-indicator" aria-hidden="true">
        <span
          v-if="mode === 'single'"
          class="mc-list__radio"
          :class="{ 'mc-list__radio--checked': isSelected(listItem) }"
        />
        <span v-else class="mc-list__checkbox" :class="{ 'mc-list__checkbox--checked': isSelected(listItem) }">
          <img v-if="isSelected(listItem)" :src="checkWhite" alt="" />
        </span>
      </span>

      <!-- 左侧自定义插槽 / 图标 -->
      <div
        v-if="listItem.itemLeft"
        class="mc-list__item-slot mc-list__item-slot--left"
        @click.stop
        @pointerdown.stop
        @pointerup.stop
        @keydown.stop
      >
        <mc-list-slot-outlet :content="listItem.itemLeft" :item="listItem" />
      </div>
      <mc-icon v-else-if="listItem.icon" :name="listItem.icon" class="mc-list__item-icon mc-list__item-icon--left" />

      <div class="mc-list__item-content">
        <span class="mc-list__item-label">{{ listItem.label }}</span>
        <span v-if="listItem.subtitle" class="mc-list__item-subtitle">{{ listItem.subtitle }}</span>
      </div>

      <!-- 右侧自定义插槽 / 图标 -->
      <div
        v-if="listItem.itemRight"
        class="mc-list__item-slot mc-list__item-slot--right"
        @click.stop
        @pointerdown.stop
        @pointerup.stop
        @keydown.stop
      >
        <mc-list-slot-outlet :content="listItem.itemRight" :item="listItem" />
      </div>
      <mc-icon
        v-else-if="listItem.iconRight"
        :name="listItem.iconRight"
        class="mc-list__item-icon mc-list__item-icon--right"
      />
    </li>
  </ul>
</template>
