import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import McAvatar from '../../src/components/McAvatar'

describe('McAvatar', () => {
  it('renders text content when no image or icon is provided', () => {
    const wrapper = mount(McAvatar, {
      props: {
        text: 'AB',
      },
    })

    expect(wrapper.find('.mc-avatar__text').exists()).toBe(true)
    expect(wrapper.find('.mc-avatar__text').text()).toBe('AB')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.mc-avatar__icon').exists()).toBe(false)
  })

  it('renders an image when src is provided', () => {
    const wrapper = mount(McAvatar, {
      props: {
        src: 'https://example.com/avatar.png',
        alt: 'User avatar',
        size: 72,
      },
    })

    const image = wrapper.get('img')
    expect(image.attributes('src')).toBe('https://example.com/avatar.png')
    expect(image.attributes('alt')).toBe('User avatar')
    expect(wrapper.attributes('style')).toContain('--mc-avatar-size: 72px')
  })

  it('falls back from an image to text when the image fails to load', async () => {
    const wrapper = mount(McAvatar, {
      props: {
        src: 'https://example.com/broken.png',
        text: 'JD',
      },
    })

    const image = wrapper.get('img')
    await image.trigger('error')

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.mc-avatar__text').exists()).toBe(true)
    expect(wrapper.find('.mc-avatar__text').text()).toBe('JD')
  })

  it('renders the icon variant when icon is provided', () => {
    const wrapper = mount(McAvatar, {
      props: {
        icon: 'user',
        size: 'large',
      },
    })

    expect(wrapper.find('.mc-avatar__icon').exists()).toBe(true)
    expect(wrapper.attributes('style')).toContain('--mc-avatar-size: 64px')
  })
})
