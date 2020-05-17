<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input v-model="listQuery.entity.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetQueryForm">
        重置
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" style="width: 100%">
      <el-table-column label="编号">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="名称">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="价格">
        <template slot-scope="{row}">
          <span>{{ row.price }} 元</span>
        </template>
      </el-table-column>

      <el-table-column label="库存">
        <template slot-scope="{row}">
          <span>{{ row.stocks }} 瓶</span>
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="temp.price" placeholder="请输入价格">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存量" prop="stocks">
          <el-input-number v-model="temp.stocks" controls-position="right" :min="1" :max="999999" /> 瓶
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
import { stapleList, stapleDel, stapleInsert, stapleUpdate } from '@/api/product'

import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'ProductStaple',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 5,
        sort: '-id',
        entity: {
          name: ''
        }
      },
      list: [],
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      sortOptions: [{ label: '根据ID升序', key: '+id' }, { label: '根据ID降序', key: '-id' }],
      textMap: {
        update: '修改',
        create: '添加'
      },
      rules: {
        name: [{ required: true, message: '请输入名称' }],
        price: [{ required: true, message: '请输入价格' },
          {
            validator(rule, value, callback) {
              var pattern = /^\d+.?\d{0,2}$/
              if (!pattern.test(value)) {
                return callback(new Error('请正确的输入价格（双精度数值）！'))
              } else return callback()
            }
          }],
        stocks: [{ required: true, message: '请输入库存量' }, { type: 'number', message: '请输入数字，你家库存量不是数字啊' }]
      },
      temp: {
        id: undefined,
        name: '',
        price: '',
        stocks: ''
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
        price: '',
        stocks: ''
      }
    },
    resetQueryForm() {
      this.listQuery = {
        page: 1,
        limit: 5,
        sort: '-id',
        entity: {
          name: ''
        }
      }
      this.getList()
    },
    getList() {
      this.listLoading = true
      stapleList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
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
          stapleInsert(this.temp).then(() => {
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
          stapleUpdate(this.temp).then(() => {
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
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stapleDel(row.id).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除记录成功',
            type: 'success',
            duration: 2000
          })
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
