<script setup>
import { ref, onMounted } from 'vue'

// 手动添加的贡献者（优先显示，不会和 GitHub API 结果去重）
const manual = [
  {
    login: 'Spectrollay',
    html_url: 'https://github.com/Spectrollay',
    avatar_url: 'https://github.com/Spectrollay.png',
    contributions: '原 OreUI 作者',
  },
  {
    login: 'ShenYuanOR',
    html_url: 'https://github.com/ShenYuanOR',
    avatar_url: 'https://github.com/ShenYuanOR.png',
    contributions: '项目作者',
  },
  {
    login: 'claude',
    html_url: 'https://github.com/claude',
    avatar_url: 'https://github.com/claude.png',
    contributions: 'anthropics',
  },
  {
    login: 'HaiGeMaster',
    html_url: 'https://github.com/HaiGeMaster',
    avatar_url: 'https://github.com/HaiGeMaster.png',
    contributions: '新的贡献者',
  },
]

const contributors = ref([...manual])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch('https://api.github.com/repos/ShenYuanOR/mcui-oreui/contributors?per_page=50')
    const apiList = await res.json()
    // 去重：手动添加的不重复显示
    const manualLogins = new Set(manual.map(m => m.login))
    const filtered = apiList.filter((c) => !manualLogins.has(c.login))
    contributors.value = [...manual, ...filtered]
  } catch (e) {
    console.error('获取贡献者失败', e)
  } finally {
    loading.value = false
  }
})

function isManual(login) {
  return manual.some(m => m.login === login)
}
</script>

# 贡献者

感谢以下每一位为本项目做出贡献的开发者 ❤️

<div style="display:flex;flex-wrap:wrap;gap:24px;justify-content:center;padding:24px 0">
  <a
    v-for="c in contributors"
    :key="c.login"
    :href="c.html_url"
    target="_blank"
    rel="noopener"
    :title="`${c.login} — ${typeof c.contributions === 'number' ? c.contributions + ' 次提交' : c.contributions}`"
    style="display:flex;flex-direction:column;align-items:center;gap:8px;text-decoration:none;color:var(--vp-c-text-1);width:100px"
  >
    <img
      :src="c.avatar_url"
      :alt="c.login"
      width="80"
      height="80"
      style="border-radius:50%"
      :style="{ border: isManual(c.login) ? '2px solid #f5a623' : '2px solid #3C8527' }"
    />
    <span style="font-size:13px;text-align:center;line-height:1.3">{{ c.login }}</span>
    <span style="font-size:11px;color:var(--vp-c-text-3)">{{ typeof c.contributions === 'number' ? c.contributions + ' commits' : c.contributions }}</span>
  </a>
</div>

<div v-if="loading" style="text-align:center;padding:20px;color:#b1b2b5">正在同步 GitHub 贡献者...</div>
