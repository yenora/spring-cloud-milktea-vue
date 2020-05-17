<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input v-model="listQuery.entity.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-date-picker v-model="listQuery.entity.queryCreateTimeBegin" type="datetime" placeholder="此时间以后创建的用户" align="right" :picker-options="pickerOptions" />
      <el-date-picker v-model="listQuery.entity.queryCreateTimeEnd" type="datetime" placeholder="此时间以前创建的用户" align="right" :picker-options="pickerOptions" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetQueryForm">
        重置
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :disabled="delMoreVisible" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="delData">
        批量删除
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="60" />
      <el-table-column label="编号" width="60">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="客户名称" width="100">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="客户昵称" width="100">
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="性别" width="80">
        <template slot-scope="{row}">
          <span>{{ row.sex == 0 ? '男' : '女' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="年龄" width="80">
        <template slot-scope="{row}">
          <span>{{ row.age }}</span>
        </template>
      </el-table-column>

      <el-table-column label="邮箱" width="200">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="200">
        <template slot-scope="{row}">
          <i class="el-icon-time" />
          <span>{{ row.createTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="最近登录时间" width="200">
        <template slot-scope="{row}">
          <i class="el-icon-time" />
          <span>{{ row.recentLoginTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="delData(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="客户昵称" prop="nickname">
          <el-input v-model="temp.nickname" placeholder="请输入客户昵称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'create'" label="客户密码" prop="password">
          <el-input key="password" v-model="temp.password" type="password" placeholder="请输入客户密码" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="temp.sex" placeholder="请选择性别">
            <el-option v-for="(item, key) in sexArr" :key="key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="temp.age" controls-position="right" :min="1" :max="200" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { pageList, delData, insertData, updateData } from '@/api/member'

import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Member',
  filters: { parseTime },
  components: { Pagination },
  directives: { waves },
  data() {
    const validEmail = (rule, value, callback) => {
      var pattern = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
      if (value === '') {
        callback(new Error('电子邮箱不能为空'))
      } else if (!pattern.test(value)) {
        callback(new Error('电子邮箱格式不正确'))
      } else {
        return callback()
      }
    }
    return {
      listQuery: {
        page: 1,
        limit: 5,
        sort: '-id',
        entity: {
          name: '',
          queryCreateTimeBegin: '',
          queryCreateTimeEnd: ''
        }
      },
      list: [],
      multipleSelection: [],
      total: 0,
      listLoading: true,
      delMoreVisible: true,
      dialogFormVisible: false,
      dialogStatus: '',
      sortOptions: [{ label: '根据ID升序', key: '+id' }, { label: '根据ID降序', key: '-id' }],
      textMap: {
        update: '修改',
        create: '添加'
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入客户名称' }],
        nickname: [{ required: true, trigger: 'blur', message: '请输入客户昵称' }],
        email: [{ required: true, trigger: 'blur', validator: validEmail }]
      },
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '一月前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', date)
          }
        }, {
          text: '一年前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', date)
          }
        }]
      },
      sexArr: [
        {
          label: '男',
          value: true
        },
        {
          label: '女',
          value: false
        }
      ],
      temp: {
        id: undefined,
        name: '',
        nickname: '',
        password: '123456',
        sex: true,
        age: 18,
        email: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        nickname: '',
        password: '123456',
        sex: true,
        age: 18,
        email: ''
      }
    },
    resetQueryForm() {
      this.listQuery = {
        page: 1,
        limit: 5,
        sort: '-id',
        entity: {
          name: '',
          queryCreateTimeBegin: '',
          queryCreateTimeEnd: ''
        }
      }
      this.getList()
    },
    getList() {
      this.listLoading = true
      pageList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length > 0) {
        this.delMoreVisible = false
      } else {
        this.delMoreVisible = true
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          insertData(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加记录成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateData(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改记录成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    delData(row) {
      this.$confirm('此操作将永久删除选中的记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.multipleSelection.length > 0) {
          this.multipleSelection.forEach(selection => {
            delData(selection.id)
          })
        } else {
          delData(row.id)
        }
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除记录成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style scoped>
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.img-class{
  width: 100px;
  height: 100px;
}
</style>
