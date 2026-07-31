<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
type SnackbarVariant = 'default' | 'success' | 'error' | 'warning' | 'info'
const variant = ref<SnackbarVariant>('success')
const message = ref('世界已保存')

function show(nextVariant: SnackbarVariant, nextMessage: string) {
  variant.value = nextVariant
  message.value = nextMessage
  open.value = true
}
</script>

# Snackbar

用于显示短暂的全局操作结果，并可附带一个操作按钮。

## 操作结果

<div class="mc-demo">
  <mc-button variant="primary" @click="show('success', '世界已保存')">成功</mc-button>
  <mc-button @click="show('info', '正在同步资源包')">信息</mc-button>
  <mc-button @click="show('warning', '存储空间不足')">警告</mc-button>
  <mc-button variant="error" @click="show('error', '保存失败')">错误</mc-button>
  <mc-snackbar v-model="open" :variant="variant" :timeout="4000">
    {{ message }}
    <template #action>撤销</template>
  </mc-snackbar>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
type SnackbarVariant = 'default' | 'success' | 'error' | 'warning' | 'info'
const variant = ref<SnackbarVariant>('success')
const message = ref('世界已保存')

function show(nextVariant: SnackbarVariant, nextMessage: string) {
  variant.value = nextVariant
  message.value = nextMessage
  open.value = true
}
</script>

<template>
  <div class="mc-demo">
    <mc-button variant="primary" @click="show('success', '世界已保存')">成功</mc-button>
    <mc-button @click="show('info', '正在同步资源包')">信息</mc-button>
    <mc-button @click="show('warning', '存储空间不足')">警告</mc-button>
    <mc-button variant="error" @click="show('error', '保存失败')">错误</mc-button>
    <mc-snackbar v-model="open" :variant="variant" :timeout="4000">
      {{ message }}
      <template #action>撤销</template>
    </mc-snackbar>
  </div>
</template>
```

| Prop         | 类型                                             | 默认      |
| ------------ | ------------------------------------------------ | --------- |
| `modelValue` | `boolean`                                        | `false`   |
| `timeout`    | `number`                                         | `4000`    |
| `location`   | `top \| bottom`                                  | `bottom`  |
| `variant`    | `default \| success \| error \| warning \| info` | `default` |
| `teleport`   | `string \| false`                                | `body`    |

消息使用默认插槽，操作使用 `action` 插槽。事件：`update:modelValue`、`close`。2.0 已删除 `message` Prop，语义状态统一使用 `variant`。
