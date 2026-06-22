<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import McIcon from '../../../src/components/McIcon.vue';
import { mcKeyIconNames, mcNormalIconNames, mcXIconNames } from '../../../src/utils/iconRegistry';
import * as mdi from '@mdi/js';

interface IconGroup {
  title: string;
  description: string;
  names: string[];
}

/** mdiAccountCircle → mdi-account-circle */
function mdiExportToKebab(key: string): string {
  const camel = key.replace(/^mdi/, '');
  const parts = camel.replace(/([A-Z])/g, '-$1').toLowerCase().split('-').filter(Boolean);
  return 'mdi-' + parts.join('-');
}

/** 从 @mdi/js 提取所有图标名并转为 kebab-case */
const mdiAllNames: string[] = Object.keys(mdi)
  .filter((k) => k.startsWith('mdi') && typeof (mdi as Record<string, unknown>)[k] === 'string')
  .map(mdiExportToKebab)
  .sort();

const MDI_PER_PAGE = 100;

const copiedName = ref('');
const keyword = ref('');
const iconSize = 24;
const mdiPage = ref(1);

// 搜索关键词变化时重置到第 1 页
watch(keyword, () => {
  mdiPage.value = 1;
});

/** MDI 图标源（全部 or 搜索过滤后） */
const mdiSource = computed<string[]>(() => {
  const kw = keyword.value.trim().toLowerCase();
  if (kw) return mdiAllNames.filter((n) => n.toLowerCase().includes(kw));
  return mdiAllNames;
});

const mdiTotalPages = computed(() => Math.max(1, Math.ceil(mdiSource.value.length / MDI_PER_PAGE)));

/** 当前页的 MDI 图标 */
const mdiPageNames = computed<string[]>(() => {
  const start = (mdiPage.value - 1) * MDI_PER_PAGE;
  return mdiSource.value.slice(start, start + MDI_PER_PAGE);
});

function prevPage() {
  if (mdiPage.value > 1) mdiPage.value--;
}

function nextPage() {
  if (mdiPage.value < mdiTotalPages.value) mdiPage.value++;
}

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
  {
    title: 'MDI 像素图标',
    description: `命名格式：mdi-xxx，基于 Material Design Icons 24×24 像素化渲染，共 ${mdiAllNames.length} 个。`,
    names: mdiAllNames,
  },
];

const groups = computed<IconGroup[]>(() => {
  const kw = keyword.value.trim().toLowerCase();
  return allGroups
    .map((g, i) => {
      // MDI 组：翻页展示
      if (i === 3) return { ...g, names: mdiPageNames.value };
      const filtered = kw ? g.names.filter((n) => n.toLowerCase().includes(kw)) : g.names;
      return { ...g, names: filtered };
    })
    .filter((g) => g.names.length > 0);
});

const totalCount = computed(() => {
  let count = 0;
  for (const g of groups.value) {
    if (g.title === 'MDI 像素图标') {
      count += mdiSource.value.length;
    } else {
      count += g.names.length;
    }
  }
  return count;
});

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
        <span v-if="group.title === 'MDI 像素图标'">{{ mdiSource.length }} 个</span>
        <span v-else>{{ group.names.length }} 个</span>
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

      <!-- MDI 翻页控件 -->
      <div v-if="group.title === 'MDI 像素图标' && mdiTotalPages > 1" class="mc-icon-gallery__pager">
        <button class="mc-icon-gallery__pager-btn" :disabled="mdiPage <= 1" @click="prevPage">上一页</button>
        <span class="mc-icon-gallery__pager-info">第 {{ mdiPage }} / {{ mdiTotalPages }} 页</span>
        <button class="mc-icon-gallery__pager-btn" :disabled="mdiPage >= mdiTotalPages" @click="nextPage">下一页</button>
      </div>
    </section>
  </div>
</template>
