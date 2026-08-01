import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { McDataTable, McPagination, McVirtualScroll } from '../../src'

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Score', key: 'score' },
]
const items = [
  { id: 1, name: 'Alex', score: 2 },
  { id: 2, name: 'Steve', score: 5 },
  { id: 3, name: 'Creeper', score: 1 },
]

describe('data components', () => {
  it('filters, sorts and paginates client-side data', async () => {
    const wrapper = mount(McDataTable, {
      props: {
        headers,
        items,
        options: { page: 1, itemsPerPage: 2, sortBy: [], search: '' },
      },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    await wrapper.findAll('.mc-data-table__sort')[1].trigger('click')
    expect(wrapper.find('tbody tr').text()).toContain('Creeper')
    await wrapper.get('.mc-pagination__button[aria-label="下一页"]').trigger('click')
    expect(wrapper.emitted('update:options')?.at(-1)?.[0]).toMatchObject({ page: 2, itemsPerPage: 2 })
  })

  it('emits server options without requesting data', async () => {
    const wrapper = mount(McDataTable, {
      props: { headers, items: items.slice(0, 1), mode: 'server', itemsLength: 50 },
    })
    await wrapper.find('.mc-data-table__sort').trigger('click')
    expect(wrapper.emitted('update:options')?.[0]?.[0]).toMatchObject({
      page: 1,
      sortBy: [{ key: 'name', order: 'asc' }],
    })
  })

  it('takes search only from the options object', async () => {
    const wrapper = mount(McDataTable, {
      props: {
        headers,
        items,
        options: { page: 1, itemsPerPage: 10, sortBy: [], search: 'steve' },
      },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.find('tbody tr').text()).toContain('Steve')
  })

  it('uses the page size as the initial loading height and renders an empty state', async () => {
    const wrapper = mount(McDataTable, {
      props: {
        headers,
        items,
        options: { page: 1, itemsPerPage: 10, sortBy: [], search: '' },
      },
    })
    expect(wrapper.get('.mc-data-table').attributes('style')).toContain('--mc-data-table-loading-height: 460px')

    await wrapper.setProps({ loading: true })
    expect(wrapper.get('.mc-data-table').attributes('style')).toContain('--mc-data-table-loading-height: 460px')
    expect(wrapper.get('.mc-data-table__state--loading').attributes('colspan')).toBe('2')
    expect(wrapper.get('.mc-data-table__state-content').attributes('role')).toBe('status')
    expect(wrapper.find('.mc-spinner').exists()).toBe(true)

    await wrapper.setProps({ loading: false, items: [] })
    expect(wrapper.get('.mc-data-table__state--empty').text()).toContain('暂无数据')
    expect(wrapper.find('.mc-data-table__empty-icon').exists()).toBe(true)
  })

  it('accepts loading height in pixels or rows and can disable automatic height', async () => {
    const wrapper = mount(McDataTable, {
      props: {
        headers,
        items,
        loading: true,
        loadingHeight: '4L',
        options: { page: 1, itemsPerPage: 3, sortBy: [], search: '' },
      },
    })
    const root = wrapper.get('.mc-data-table')
    expect(root.attributes('style')).toContain('--mc-data-table-loading-height: 184px')

    await wrapper.setProps({ loadingHeight: '320px' })
    expect(root.attributes('style')).toContain('--mc-data-table-loading-height: 320px')

    await wrapper.setProps({ loadingHeight: 275 })
    expect(root.attributes('style')).toContain('--mc-data-table-loading-height: 275px')

    await wrapper.setProps({ loadingHeight: undefined, loadingAutoHeight: false })
    expect(root.attributes('style')).toContain('--mc-data-table-loading-height: 138px')
  })

  it('renders the page size as a compact dropdown and includes the current value', async () => {
    const wrapper = mount(McDataTable, {
      props: {
        headers,
        items,
        options: { page: 1, itemsPerPage: 2, sortBy: [], search: '' },
        itemsPerPageOptions: [5, 10],
      },
    })
    const select = wrapper.get('.mc-data-table__page-size select')
    expect(select.findAll('option').map((option) => option.text())).toEqual(['2', '5', '10'])
    expect(select.attributes('aria-label')).toBe('每页条数')
    await select.setValue('5')
    expect(wrapper.emitted('update:options')?.at(-1)?.[0]).toMatchObject({ page: 1, itemsPerPage: 5 })
  })

  it('calculates a fixed-height virtual window', async () => {
    const wrapper = mount(McVirtualScroll, {
      props: { items: Array.from({ length: 100 }, (_, index) => index), itemHeight: 20, height: 100, overscan: 1 },
      slots: { default: ({ item }: { item: number }) => String(item) },
    })
    const root = wrapper.get('.mc-virtual-scroll')
    Object.defineProperty(root.element, 'scrollTop', { value: 400, configurable: true })
    await root.trigger('scroll')
    expect((wrapper.vm as unknown as { start: number }).start).toBe(19)
    expect(wrapper.find('.mc-virtual-scroll__window').attributes('style')).toContain('380px')
  })

  it('supports pagination keyboard navigation', async () => {
    const Host = defineComponent({
      components: { McPagination },
      setup() {
        return { page: ref(2) }
      },
      template: `<mc-pagination v-model="page" :length="5"/>`,
    })
    const wrapper = mount(Host)
    await wrapper.get('nav').trigger('keydown', { key: 'End' })
    expect((wrapper.vm as unknown as { page: number }).page).toBe(5)
  })
})
