<script setup lang="ts">
import { computed, ref } from 'vue';
import McIcon from '../../../src/components/McIcon.vue';
import { mcKeyIconNames, mcNormalIconNames, mcXIconNames } from '../../../src/utils/iconRegistry';

interface IconGroup {
  title: string;
  description: string;
  names: string[];
}

const copiedName = ref('');
const keyword = ref('');
const iconSize = 24;

const allGroups: IconGroup[] = [
  {
    title: '普通图标',
    description: '命名格式：mc-xxx，支持继承文字颜色或通过 color 改色。',
    names: mcNormalIconNames,
  },
  {
    title: '按键映射图标',
    description: '命名格式：mc-key-xxx，保持原色，不支持改色。',
    names: mcKeyIconNames,
  },
  {
    title: '彩色图标',
    description: '命名格式：mc-x-xxx，保持原色，不支持改色。',
    names: mcXIconNames,
  },
];

const groups = computed<IconGroup[]>(() => {
  const kw = keyword.value.trim().toLowerCase();
  if (!kw) return allGroups;
  return allGroups
    .map((g) => ({
      ...g,
      names: g.names.filter((n) => n.toLowerCase().includes(kw)),
    }))
    .filter((g) => g.names.length > 0);
});

const totalCount = computed(() =>
  groups.value.reduce((sum, g) => sum + g.names.length, 0),
);

async function copyIconName(name: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(name);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = name;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  copiedName.value = name;
  window.setTimeout(() => {
    if (copiedName.value === name) copiedName.value = '';
  }, 1400);
}
</script>

<template>
  <div class="mc-icon-gallery">
    <div class="mc-icon-gallery__toolbar">
      <input
        v-model="keyword"
        type="search"
        class="mc-icon-gallery__search"
        placeholder="搜索图标名（如 chevron、arrow）…"
        aria-label="搜索图标"
      />
      <span class="mc-icon-gallery__total">共 {{ totalCount }} 个</span>
    </div>

    <p v-if="groups.length === 0" class="mc-icon-gallery__empty">没有匹配「{{ keyword }}」的图标。</p>

    <section v-for="group in groups" :key="group.title" class="mc-icon-gallery__section">
      <div class="mc-icon-gallery__heading">
        <div>
          <h2>{{ group.title }}</h2>
          <p>{{ group.description }}</p>
        </div>
        <span>{{ group.names.length }} 个</span>
      </div>

      <div class="mc-icon-gallery__grid">
        <button
          v-for="name in group.names"
          :key="name"
          class="mc-icon-gallery__item"
          type="button"
          :title="`点击复制 ${name}`"
          @click="copyIconName(name)"
        >
          <McIcon :name="name" :size="iconSize" />
          <span class="mc-icon-gallery__name">{{ name }}</span>
          <span class="mc-icon-gallery__copied" :class="{ 'is-active': copiedName === name }">已复制</span>
        </button>
      </div>
    </section>
  </div>
</template>
