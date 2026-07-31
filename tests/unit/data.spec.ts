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
