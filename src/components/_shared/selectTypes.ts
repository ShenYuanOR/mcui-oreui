export type McSelectValue = string | number | boolean | null

export interface McSelectOption {
  title?: string
  label?: string
  value: McSelectValue
  disabled?: boolean
}

export type McSelectOptionInput = McSelectValue | McSelectOption

export function normalizeSelectOption(option: McSelectOptionInput): Required<McSelectOption> {
  if (typeof option === 'object' && option !== null) {
    return {
      title: option.title ?? option.label ?? String(option.value ?? ''),
      label: option.label ?? option.title ?? String(option.value ?? ''),
      value: option.value,
      disabled: option.disabled ?? false,
    }
  }
  return { title: String(option ?? ''), label: String(option ?? ''), value: option, disabled: false }
}
