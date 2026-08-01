# 表格 / Table

只负责语义化表格结构与 Ore UI 展示，不接管数据状态。表格默认占满父容器；列数较多或内容过长时，由外层容器提供横向滚动。

## 条纹与悬停行

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-table striped hover>
    <template #header><tr><th>名称</th><th>模式</th><th>状态</th><th>分数</th></tr></template>
    <template #body><tr><td>Alex</td><td>生存</td><td>在线</td><td>1280</td></tr><tr><td>Steve</td><td>创造</td><td>在线</td><td>965</td></tr><tr><td>Sunny</td><td>冒险</td><td>暂离</td><td>842</td></tr><tr><td>Robin</td><td>生存</td><td>离线</td><td>760</td></tr><tr><td>Kai</td><td>旁观</td><td>在线</td><td>694</td></tr><tr><td>Luna</td><td>创造</td><td>在线</td><td>618</td></tr><tr><td>Noah</td><td>生存</td><td>暂离</td><td>557</td></tr><tr><td>Ember</td><td>冒险</td><td>离线</td><td>481</td></tr></template>
  </mc-table>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-table striped hover>
      <template #header>
        <tr>
          <th>名称</th>
          <th>模式</th>
          <th>状态</th>
          <th>分数</th>
        </tr>
      </template>
      <template #body>
        <tr>
          <td>Alex</td>
          <td>生存</td>
          <td>在线</td>
          <td>1280</td>
        </tr>
        <tr>
          <td>Steve</td>
          <td>创造</td>
          <td>在线</td>
          <td>965</td>
        </tr>
        <tr>
          <td>Sunny</td>
          <td>冒险</td>
          <td>暂离</td>
          <td>842</td>
        </tr>
        <tr>
          <td>Robin</td>
          <td>生存</td>
          <td>离线</td>
          <td>760</td>
        </tr>
        <tr>
          <td>Kai</td>
          <td>旁观</td>
          <td>在线</td>
          <td>694</td>
        </tr>
        <tr>
          <td>Luna</td>
          <td>创造</td>
          <td>在线</td>
          <td>618</td>
        </tr>
        <tr>
          <td>Noah</td>
          <td>生存</td>
          <td>暂离</td>
          <td>557</td>
        </tr>
        <tr>
          <td>Ember</td>
          <td>冒险</td>
          <td>离线</td>
          <td>481</td>
        </tr>
      </template>
    </mc-table>
  </div>
</template>
```

## Props

| 名称      | 类型      | 默认    | 说明                                                      |
| --------- | --------- | ------- | --------------------------------------------------------- |
| `caption` | `string`  | -       | 表格的无障碍标题；也可使用 `caption` 插槽提供自定义内容。 |
| `hover`   | `boolean` | `false` | 是否在鼠标悬停或键盘聚焦时突出当前数据行。                |
| `striped` | `boolean` | `false` | 是否为相邻数据行交替使用不同底色。                        |

插槽：`caption`、`header`、`body` / `default`、`footer`。需要排序、分页和选择时使用 [DataTable](./data-table)。
