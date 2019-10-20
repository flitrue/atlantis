<template>
  <div>
    <div
      v-for="(list,index) in itemsJson"
      :key="index"
      class="format-param"
      data-level="index+1">
      <el-input v-model="list.name" style="width: 400px;" class="filter-item" placeholder="名称"/>
      <el-select
        v-model="list.keyType"
        style="width: 130px;"
        class="filter-item"
        filterable
        clearable
        placeholder="请选择">
        <el-option
          v-for="item in typeJsonOptions"
          :key="item.type"
          :label="item.name"
          :value="item.type"/>
      </el-select>
      <el-checkbox v-model="list.checked"/>
      <el-input v-model="list.remark" style="width: 200px;" class="filter-item" placeholder="备注"/>
      <el-button type="success" icon="el-icon-setting" plain/>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" plain/>
      <el-tooltip
        v-if="list.keyType=='OBJECT'&& index==0"
        class="item"
        effect="dark"
        content="添加子节点"
        placement="top">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          plain
          @click="addChildNode"/>
      </el-tooltip>
      <el-tooltip
        v-if="list.keyType=='OBJECT'&& index>0"
        class="item"
        effect="dark"
        content="添加兄弟/子节点"
        placement="top">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <el-button class="filter-item" type="primary" icon="el-icon-plus" plain/>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus" command="brother">兄弟节点</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus" command="child">子节点</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-tooltip>
    </div>
  </div>
</template>
