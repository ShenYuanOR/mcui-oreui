import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { McButton, McCard, McCardActions, McCardItem, McCardSubtitle, McCardText, McCardTitle } from '../../src'

describe('McCard compound structure', () => {
  it('renders explicit Vuetify-style child sections in the parent card', () => {
    const wrapper = mount(McCard, {
      slots: {
        default: () => [
          h(McCardItem, null, {
            prepend: () => h('span', { class: 'prepend' }, 'P'),
            default: () => [h(McCardTitle, null, () => 'World'), h(McCardSubtitle, null, () => 'Realm')],
            append: () => h('span', { class: 'append' }, 'A'),
          }),
          h(McCardText, null, () => 'Card body'),
          h(McCardActions, null, () => h(McButton, { size: 'small' }, () => 'Open')),
        ],
      },
    })

    expect(wrapper.element.tagName).toBe('ARTICLE')
    expect(wrapper.get('.mc-card-item__prepend').text()).toBe('P')
    expect(wrapper.get('.mc-card-title').text()).toBe('World')
    expect(wrapper.get('.mc-card-subtitle').text()).toBe('Realm')
    expect(wrapper.get('.mc-card-item__append').text()).toBe('A')
    expect(wrapper.get('.mc-card-text').text()).toBe('Card body')
    expect(wrapper.get('.mc-card-actions').get('button').text()).toBe('Open')
    expect(wrapper.find('.mc-card__title').exists()).toBe(false)
    expect(wrapper.find('.mc-card__body').exists()).toBe(false)
  })

  it('maps named slots to the same child components and preserves card interaction', async () => {
    const shorthand = mount(McCard, {
      slots: {
        prepend: 'P',
        title: 'World',
        subtitle: 'Realm',
        append: 'A',
        text: 'Card body',
        actions: () => h('span', 'Action'),
      },
    })

    expect(shorthand.get('.mc-card-item').exists()).toBe(true)
    expect(shorthand.get('.mc-card-title').text()).toBe('World')
    expect(shorthand.get('.mc-card-subtitle').text()).toBe('Realm')
    expect(shorthand.get('.mc-card-text').text()).toBe('Card body')
    expect(shorthand.get('.mc-card-actions').text()).toBe('Action')

    const interactive = mount(McCard, {
      props: { clickable: true },
      slots: { default: () => h(McCardItem, null, () => h(McCardTitle, null, () => 'Open world')) },
    })
    await interactive.get('button').trigger('click')
    expect(interactive.emitted('click')).toHaveLength(1)
  })
})
