<script setup>
import { ref } from 'vue'
const name = ref(''); const enabled = ref(false); const form = ref(); const valid = ref(true); const validating = ref(false); const dirty = ref(false)
const result = ref('尚未校验')
async function validate() { const value = await form.value.validate(); result.value = value.valid ? '通过' : value.errors.join('、') }
function reset() { form.value.reset(); result.value = '已重置' }
</script>

# Form 表单

## 提交校验状态

<div class="mc-demo mc-demo--column" style="width: 380px">
  <mc-form ref="form" v-model="valid" v-model:validating="validating" v-model:dirty="dirty" validate-on="blur" fast-fail>
    <mc-text-field v-model="name" label="世界名称" required :rules="[async v => v.length >= 3 || '至少 3 个字符']" />
    <mc-switch v-model="enabled" label="启用实验功能" required />
    <mc-button type="button" variant="primary" @click="validate">校验</mc-button>
    <mc-button type="button" @click="reset">重置</mc-button>
    <span>valid={{ valid }} · dirty={{ dirty }} · validating={{ validating }} · {{ result }}</span>
  </mc-form>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const name = ref('')
const enabled = ref(false)
const form = ref()
const valid = ref(true)
const validating = ref(false)
const dirty = ref(false)
const result = ref('尚未校验')
async function validate() {
  const value = await form.value.validate()
  result.value = value.valid ? '通过' : value.errors.join('、')
}
function reset() {
  form.value.reset()
  result.value = '已重置'
}
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width: 380px">
    <mc-form
      ref="form"
      v-model="valid"
      v-model:validating="validating"
      v-model:dirty="dirty"
      validate-on="blur"
      fast-fail
    >
      <mc-text-field
        v-model="name"
        label="世界名称"
        required
        :rules="[async (v) => v.length >= 3 || '至少 3 个字符']"
      />
      <mc-switch v-model="enabled" label="启用实验功能" required />
      <mc-button type="button" variant="primary" @click="validate">校验</mc-button>
      <mc-button type="button" @click="reset">重置</mc-button>
      <span>valid={{ valid }} · dirty={{ dirty }} · validating={{ validating }} · {{ result }}</span>
    </mc-form>
  </div>
</template>
```

TextField、Textarea、Select、Autocomplete、Checkbox、RadioGroup、Switch、Slider、FileInput 与 NumberInput 共享 `rules`、`required`、`disabled`、`readonly`、`errorMessages` 和 `validateOn`。规则可同步或异步；异步竞态只采纳最后一次结果。

## McForm Props

| 名称         | 类型                              | 默认    | 说明                           |
| ------------ | --------------------------------- | ------- | ------------------------------ |
| `modelValue` | `boolean`                         | `true`  | 聚合后的有效状态               |
| `validateOn` | `input \| blur \| submit \| lazy` | `input` | 默认校验时机                   |
| `fastFail`   | `boolean`                         | `false` | 提交校验遇到首个无效字段即停止 |
| `disabled`   | `boolean`                         | `false` | 禁用全部字段                   |

## Events 与方法

| 名称                | 参数                | 说明                     |
| ------------------- | ------------------- | ------------------------ |
| `update:modelValue` | `boolean`           | 有效状态变化             |
| `update:validating` | `boolean`           | 异步校验状态             |
| `update:dirty`      | `boolean`           | 任一字段已交互           |
| `submit`            | `{ valid, errors }` | 原生 submit 后的校验结果 |
| `validate()`        | -                   | 返回 `{ valid, errors }` |
| `reset()`           | -                   | 重置值与校验             |
| `resetValidation()` | -                   | 只清空校验状态           |
