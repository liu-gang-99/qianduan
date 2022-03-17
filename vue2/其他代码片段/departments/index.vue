<template>
  <div v-loading="loading" class="departments-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <tree-tools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <add-dept
      ref="addDept"
      :tree-node="node"
      :show-dialog.sync="showDialog"
      @addDepts="getDepartments"
    />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  name: 'Departments',
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      loading: false,
      defaultProps: {
        lable: 'name'
      },
      company: {}, // 树型组件根节点数据
      departs: [], // 树型组件数据
      showDialog: false, // 是否显示弹窗
      node: null
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 获取部门
    async getDepartments() {
      this.loading = true
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(res.depts, '')
      this.loading = false
    },
    // 点击新增部门
    addDepts(node) {
      this.showDialog = true
      this.node = node // 记录点击的节点
    },
    // 点击编辑部门
    editDepts(node) {
      this.showDialog = true
      this.node = node
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
