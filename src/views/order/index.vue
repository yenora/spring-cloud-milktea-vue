<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input
        v-model="listQuery.entity.name"
        placeholder="名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-date-picker v-model="listQuery.entity.queryCreateTimeBegin" type="datetime" placeholder="此时间以后创建的订单" align="right" :picker-options="pickerOptions" />
      <el-date-picker v-model="listQuery.entity.queryCreateTimeEnd" type="datetime" placeholder="此时间以前创建的订单" align="right" :picker-options="pickerOptions" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetQueryForm">
        重置
      </el-button>
      <el-button v-waves :disabled="delMoreVisible" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="delData">
        批量删除
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="60" />
      <el-table-column label="订单编号" width="200">
        <template slot-scope="{row}">
          <span>{{ row.orderId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="客户昵称">
        <template slot-scope="{row}">
          <span>{{ row.member.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="总金额" width="150">
        <template slot-scope="{row}">
          <span>{{ row.amount }} 元</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" width="300">
        <template slot-scope="{row}">
          <span>{{ row.notes }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="200">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleView(row.id)">
            详情
          </el-button>
          <el-button size="mini" type="danger" @click="delData(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="订单详情" :visible.sync="dialogFormVisible">
      <el-table v-loading="detailListLoading" :data="detailList" style="width: 100%">
        <el-table-column label="产品编号" prop="product.id" />
        <el-table-column label="产品名称" prop="product.name" />
        <el-table-column label="产品价格" prop="product.price" />
        <el-table-column label="数量" prop="quantity" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { pageList, delData, queryDetailList } from '@/api/order'

import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Order',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 5,
        sort: '-id',
        entity: {
          memberId: '',
          amount: '',
          queryCreateTimeBegin: '',
          queryCreateTimeEnd: ''
        }
      },
      list: [],
      detailList: [],
      multipleSelection: [],
      total: 0,
      listLoading: true,
      delMoreVisible: true,
      detailListLoading: true,
      dialogFormVisible: false,
      sortOptions: [{ label: '根据ID升序', key: '+id' }, { label: '根据ID降序', key: '-id' }],
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
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    resetQueryForm() {
      this.listQuery = {
        page: 1,
        limit: 5,
        sort: '-id',
        entity: {
          memberId: '',
          amount: '',
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length > 0) {
        this.delMoreVisible = false
      } else {
        this.delMoreVisible = true
      }
    },
    handleView(id) {
      queryDetailList({ orderId: id }).then(response => {
        this.dialogFormVisible = true
        this.detailList = response.data
        this.detailListLoading = false
      })
    },
    delData(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
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
.img-class {
	width: 100px;
	height: 100px;
}
</style>
