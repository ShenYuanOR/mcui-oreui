import { createApp, h, type GlobalComponents } from 'vue'
import { createMcUI } from 'mcui-oreui'
import McButton from 'mcui-oreui/components/McButton'
import McContainer from 'mcui-oreui/components/McContainer'
import McDataTable from 'mcui-oreui/components/McDataTable'
import McIcon from 'mcui-oreui/components/McIcon'
import McSnackbar from 'mcui-oreui/components/McSnackbar'
import McTextField from 'mcui-oreui/components/McTextField'
import { useMcTheme } from 'mcui-oreui/composables/theme'
import { mcNormalIconSet } from 'mcui-oreui/icons/normal'

type Assert<T extends true> = T
export type PascalAppbarButton = Assert<'McAppbarButton' extends keyof GlobalComponents ? true : false>
export type PascalAppbarIcon = Assert<'McAppbarIcon' extends keyof GlobalComponents ? true : false>
export type KebabAppbarButton = Assert<'mc-appbar-button' extends keyof GlobalComponents ? true : false>
export type KebabAppbarIcon = Assert<'mc-appbar-icon' extends keyof GlobalComponents ? true : false>
export type KebabDataTable = Assert<'mc-data-table' extends keyof GlobalComponents ? true : false>
export type KebabTextField = Assert<'mc-text-field' extends keyof GlobalComponents ? true : false>
export type KebabThemeProvider = Assert<'mc-theme-provider' extends keyof GlobalComponents ? true : false>
export type KebabVirtualScroll = Assert<'mc-virtual-scroll' extends keyof GlobalComponents ? true : false>

type ButtonProps = InstanceType<typeof McButton>['$props']
type TextFieldProps = InstanceType<typeof McTextField>['$props']
type DataTableProps = InstanceType<typeof McDataTable>['$props']
type SnackbarProps = InstanceType<typeof McSnackbar>['$props']

export type ButtonHasColor = Assert<'color' extends keyof ButtonProps ? true : false>
export type ButtonRemovedBgcolor = Assert<'bgcolor' extends keyof ButtonProps ? false : true>
export type ButtonRemovedAriaLabel = Assert<'ariaLabel' extends keyof ButtonProps ? false : true>
export type TextFieldHasFilter = Assert<'filter' extends keyof TextFieldProps ? true : false>
export type TextFieldUsesNativeType = Assert<'type' extends keyof TextFieldProps ? true : false>
export type TextFieldRemovedInputType = Assert<'inputType' extends keyof TextFieldProps ? false : true>
export type TextFieldRemovedPassword = Assert<'password' extends keyof TextFieldProps ? false : true>
export type DataTableHasOptions = Assert<'options' extends keyof DataTableProps ? true : false>
export type DataTableRemovedPage = Assert<'page' extends keyof DataTableProps ? false : true>
export type DataTableRemovedItemsPerPage = Assert<'itemsPerPage' extends keyof DataTableProps ? false : true>
export type SnackbarHasVariant = Assert<'variant' extends keyof SnackbarProps ? true : false>
export type SnackbarRemovedMessage = Assert<'message' extends keyof SnackbarProps ? false : true>

const plugin = createMcUI({ icons: { sets: { mc: mcNormalIconSet } } })
createApp({
  setup() {
    const theme = useMcTheme()
    return () =>
      h(McContainer, null, () => [
        h(McButton, { variant: 'primary', onClick: () => theme.setTheme('ore') }, () => 'Play'),
        h(McIcon, { name: 'mc-save' }),
      ])
  },
}).use(plugin)
