# FormField 表单字段

`McFormField` 是表单字段的展示父组件，负责标签、说明、控件区域和消息区域的布局与无障碍关联。它适合包装原生 `<input>` 或自定义控件。

标准输入组件（`McTextField`、`McSelect`、`McSwitch` 等）已经内置自己的 `McFormField`，因此不要写成 `McFormField > McTextField`，否则会出现重复标签和嵌套消息。需要整体提交与校验时，把这些输入直接放进 [Form](./form)。

## 基础用法

<div class="mc-demo mc-demo--column" style="width:380px">
  <mc-form-field label="玩家名" description="用于多人游戏和本地存档展示" required>
    <template #default="field">
      <input
        :id="field.id"
        aria-label="玩家名"
        value="Steve"
        style="background:#313233;border:2px solid #1e1e1f;color:#fff;padding:10px;width:100%"
      />
    </template>
  </mc-form-field>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width:380px">
    <mc-form-field label="玩家名" description="用于多人游戏和本地存档展示" required>
      <template #default="field">
        <input
          :id="field.id"
          aria-label="玩家名"
          value="Steve"
          style="background:#313233;border:2px solid #1e1e1f;color:#fff;padding:10px;width:100%"
        />
      </template>
    </mc-form-field>
  </div>
</template>
```

## 消息展示

<div class="mc-demo mc-demo--column" style="width:380px">
  <mc-form-field label="服务器地址" error="服务器地址不能为空" required>
    <template #default="field">
      <input
        :id="field.id"
        aria-label="服务器地址"
        placeholder="play.example.com"
        style="background:#313233;border:2px solid #c33636;color:#fff;padding:10px;width:100%"
      />
    </template>
  </mc-form-field>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width:380px">
    <mc-form-field label="服务器地址" error="服务器地址不能为空" required>
      <template #default="field">
        <input
          :id="field.id"
          aria-label="服务器地址"
          placeholder="play.example.com"
          style="background:#313233;border:2px solid #c33636;color:#fff;padding:10px;width:100%"
        />
      </template>
    </mc-form-field>
  </div>
</template>
```

## API

### Props

| 名称          | 类型                 | 默认     | 说明           |
| ------------- | -------------------- | -------- | -------------- |
| `label`       | `string`             | `''`     | 标签文本       |
| `description` | `string`             | `''`     | 辅助说明       |
| `error`       | `string \| string[]` | `''`     | 错误信息；空字符串和空数组都不显示错误态 |
| `hint`        | `string`             | `''`     | 辅助提示       |
| `success`     | `string`             | `''`     | 成功信息       |
| `id`          | `string`             | 自动生成 | 控件 ID 基础值 |
| `required`    | `boolean`            | `false`  | 是否必填       |
| `disabled`    | `boolean`            | `false`  | 是否禁用展示   |

### Slots

| 名称          | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| `default`     | 自定义表单控件；提供 `id`、`descriptionId`、`messageId` 参数 |
| `label`       | 自定义标签                                                   |
| `description` | 自定义说明                                                   |
| `message`     | 自定义错误、提示或成功信息                                   |
