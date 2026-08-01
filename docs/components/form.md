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

# Form 表单

`McForm` 是表单的父组件：提供原生 `<form>` 语义、字段注册上下文、提交入口和整体状态。输入组件（TextField、Select、Switch 等）是它的直接子组件，会自动注册到当前 Form。

表单展示与校验是两层职责：先用 Form 组织字段和操作区，再按需启用统一校验机制。标准输入组件已经内置 `McFormField` 展示层，不要再把它们包进第二层 `McFormField`；需要包装原生或自定义控件时才直接使用 [FormField](./formfield)。

## 组合与展示

下面只展示父组件、字段和操作区的组合，不引入规则或错误状态。

<div class="mc-demo mc-demo--column mc-form-demo">
  <mc-form>
    <mc-text-field label="世界名称" model-value="New World" />
    <mc-switch label="启用实验功能" :model-value="false" />
    <div class="mc-form-demo-actions">
      <mc-button type="submit" variant="primary">创建世界</mc-button>
      <mc-button type="button">取消</mc-button>
    </div>
  </mc-form>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column mc-form-demo">
    <mc-form>
      <mc-text-field label="世界名称" model-value="New World" />
      <mc-switch label="启用实验功能" :model-value="false" />
      <div class="mc-form-demo-actions">
        <mc-button type="submit" variant="primary">创建世界</mc-button>
        <mc-button type="button">取消</mc-button>
      </div>
    </mc-form>
  </div>
</template>

<style scoped>
.mc-form-demo {
  width: 100%;
  max-width: 380px;
  min-width: 0;
}

.mc-form-demo-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  min-width: 0;
  margin-top: 12px;
}

.mc-form-demo-actions :deep(.mc-button) {
  width: 100%;
  min-width: 0;
}
</style>
```

父组件负责 `form` 和 `fieldset` 语义、`disabled` 级联以及插槽状态参数；字段组件负责自己的标签、控件、提示和错误展示。

## 验证机制

校验通过输入组件的 `required`、`rules`、`errorMessages`、`validateOn` 参与；Form 只负责聚合这些字段并提供整体操作。

<div class="mc-demo mc-demo--column mc-form-demo">
  <mc-form ref="form" v-model="valid" v-model:validating="validating" v-model:dirty="dirty" validate-on="blur" fast-fail>
    <mc-text-field v-model="name" label="世界名称" required :rules="[async v => v.length >= 3 || '至少 3 个字符']" />
    <mc-switch v-model="enabled" label="启用实验功能" required />
    <div class="mc-form-demo-actions">
      <mc-button type="button" variant="primary" @click="validate">校验</mc-button>
      <mc-button type="button" @click="reset">重置</mc-button>
    </div>
    <span class="mc-form-demo-status">valid={{ valid }} · dirty={{ dirty }} · validating={{ validating }} · {{ result }}</span>
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
  <div class="mc-demo mc-demo--column mc-form-demo">
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
      <div class="mc-form-demo-actions">
        <mc-button type="button" variant="primary" @click="validate">校验</mc-button>
        <mc-button type="button" @click="reset">重置</mc-button>
      </div>
      <span class="mc-form-demo-status">
        valid={{ valid }} · dirty={{ dirty }} · validating={{ validating }} · {{ result }}
      </span>
    </mc-form>
  </div>
</template>

<style scoped>
.mc-form-demo {
  width: 100%;
  max-width: 380px;
  min-width: 0;
}

.mc-form-demo-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  min-width: 0;
  margin-top: 12px;
}

.mc-form-demo-actions :deep(.mc-button) {
  width: 100%;
  min-width: 0;
}
</style>
```

### McForm Props

| 名称         | 类型                              | 默认    | 说明                           |
| ------------ | --------------------------------- | ------- | ------------------------------ |
| `modelValue` | `boolean`                         | `true`  | 聚合后的有效状态               |
| `validateOn` | `input \| blur \| submit \| lazy` | `input` | 默认校验时机                   |
| `fastFail`   | `boolean`                         | `false` | 提交校验遇到首个无效字段即停止 |
| `disabled`   | `boolean`                         | `false` | 禁用全部字段                   |

### Events 与方法

| 名称                | 参数                | 说明                     |
| ------------------- | ------------------- | ------------------------ |
| `update:modelValue` | `boolean`           | 有效状态变化             |
| `update:validating` | `boolean`           | 异步校验状态             |
| `update:dirty`      | `boolean`           | 任一字段已交互           |
| `submit`            | `{ valid, errors }` | 原生 submit 后的校验结果 |
| `validate()`        | -                   | 返回 `{ valid, errors }` |
| `reset()`           | -                   | 重置值与校验             |
| `resetValidation()` | -                   | 只清空校验状态           |

所有标准输入组件共享同步/异步 `rules`；异步竞态只采纳最后一次结果。`validateOn` 支持 `input`、`blur`、`submit` 和 `lazy`。

<style scoped>
.mc-form-demo {
  width: 100%;
  max-width: 380px;
  min-width: 0;
}

.mc-form-demo-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  min-width: 0;
  margin-top: 12px;
}

.mc-form-demo-actions :deep(.mc-button) {
  width: 100%;
  min-width: 0;
}
</style>
