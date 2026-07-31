import type { InjectionKey, Ref } from 'vue'
export type McExpansionValue = string | number
export interface McExpansionContext {
  isSelected: (value: McExpansionValue) => boolean
  toggle: (value: McExpansionValue, disabled: boolean) => void
  register: (value: McExpansionValue, header: Ref<HTMLButtonElement | null>, disabled: () => boolean) => () => void
  navigate: (value: McExpansionValue, event: KeyboardEvent) => void
}
export const mcExpansionKey: InjectionKey<McExpansionContext | null> = Symbol.for('mcui:expansion')
