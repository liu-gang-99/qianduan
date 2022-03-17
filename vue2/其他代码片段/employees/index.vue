<template>
  <div v-loading="loading" class="employees-container">
    <div class="app-container">
      <!-- 自定义组件 -->
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template #after>
          <el-button
            size="samll"
            type="warning"
            @click="$router.push('/import')"
          >导入</el-button>
          <el-button
            size="samll"
            type="danger"
            @click="exportData"
          >导出</el-button>
          <el-button
            icon="el-icon-plus"
            size="samll"
            type="primary"
            @click="showDialog = true"
          >新增员工</el-button>
        </template>
      </page-tools>

      <!-- 表格 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column sortable type="index" label="序号" />
          <el-table-column sortable prop="username" label="姓名" />
          <el-table-column align="center" label="头像">
            <template v-slot="{ row }">
              <img
                slot="reference"
                v-imageerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column sortable prop="workNumber" label="工号" />
          <el-table-column
            sortable
            prop="formOfEmployment"
            label="聘用形式"
            :formatter="formatEmployment"
          />
          <el-table-column sortable prop="departmentName" label="部门" />
          <el-table-column sortable label="入职时间">
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column sortable label="用户状态">
            <template slot-scope="{ row }">
              <el-switch :value="row.enableState === 1" disabled />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="280">
            <template v-slot="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :total="page.total"
            :current-page.sync="page.page"
            @current-change="getEmployeeList()"
          />
        </el-row>
      </el-card>
    </div>

    <!-- 新增员工弹出层 -->
    <add-employee :show-dialog.sync="showDialog" />

    <!-- 二维码弹层 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>

    <!-- 分配角色弹出层组件 -->
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees.js'
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role.vue'

export default {
  name: 'Employees',
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      loading: false, // 是否显示加载
      list: [], // 员工的综合列表数据
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      showDialog: false, // 是否显示新增员工弹出层
      showCodeDialog: false, // 是否显示二维码
      showRoleDialog: false, // 是否显示分配角色弹出层组件
      userId: null
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 获取员工的综合列表数据
    async getEmployeeList() {
      this.loading = true
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      this.page.total = total
      this.loading = false
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async deleteEmployee(id) {
      try {
        await this.$confirm('确定删除该员工吗?')
        await delEmployee(id)
        this.$message.success('删除成功')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    // 导出excel
    async exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      const data = this.formatJson(headers, rows)
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      import('@/vendor/Export2Excel').then((excel) => {
        // excel 是引入文件的导出对象
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工资料表',
          multiHeader,
          merges
        })
      })
    },
    // 格式化
    formatJson(headers, rows) {
      return rows.map((obj) =>
        Object.keys(headers).map((key) => {
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            // 格式化日期
            return formatDate(obj[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 格式化聘用形式
            const o = EmployeeEnum.hireType.find(
              (item) => item.id === obj[headers[key]]
            )
            return o ? o.value : '未知'
          }
          return obj[headers[key]]
        })
      )
    },
    // 显示二维码
    showQrCode(url) {
      if (url) {
        this.showCodeDialog = true
        // 渲染页面是异步的 此时还没有弹出层
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    // 编辑角色
    async editRole(id) {
      this.loading = true
      await this.$refs.assignRole.getUserDetailById(id)
      this.userId = id
      this.loading = false
      this.showRoleDialog = true
    }
  }
}
</script>

<style></style>
