<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input v-model="listQuery.title" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="推荐指数" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        创建时间
      </el-checkbox>
    </div>
    <el-table :data="list" style="width: 100%" @expand-change="expandSelect">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="ID">
              <span>{{ row.id }}</span>
            </el-form-item>
            <el-form-item label="类型">
              <span>{{ type }}</span>
            </el-form-item>
            <el-form-item label="原料">
              <span>{{ staples }}</span>
            </el-form-item>
            <el-form-item label="名称">
              <span>{{ row.name }}</span>
            </el-form-item>
            <el-form-item label="价格">
              <span>{{ row.price }}</span>
            </el-form-item>
            <el-form-item label="介绍">
              <span>{{ row.introduction }}</span>
            </el-form-item>
            <el-form-item label="推荐指数">
              <svg-icon v-for="n in + row.recommend" :key="n" icon-class="star" class="meta-item__icon" />
            </el-form-item>
            <el-form-item label="销售量">
              <span>{{ row.sales }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column label="ID">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="名称">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="图片" align="center">
        <template v-if="row.pic" slot-scope="{row}">
          <el-image style="width: 60px; height: 60px" :src="require('@/upload/' + row.pic)" :preview-src-list="[require('@/upload/' + row.pic)]" />
        </template>
      </el-table-column>

      <el-table-column label="介绍">
        <template slot-scope="{row}">
          <span>{{ row.introduction }}</span>
        </template>
      </el-table-column>

      <el-table-column label="价格">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDel(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <!-- <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item> -->
        <!-- <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item> -->
        <!-- <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button> -->
        <!-- <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button> -->
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { prolist } from '@/api/product'
import { prosearchtype } from '@/api/product_type'
import { prosearchstaple } from '@/api/product_staple'
import { parseTime } from '@/utils'

export default {
  name: 'Product',
  filters: {
    parseTime
  },
  data() {
    return {
      staples: '',
      type: '',
      list: null,
      total: 0,
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: '根据ID升序', key: '+id' }, { label: '根据ID降序', key: '-id' }],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      listQuery: {
        page: 1,
        limit: 5,
        recommend: undefined,
        name: undefined,
        type: undefined,
        sort: '+id'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async expandSelect(row, expandedRows) {
      const typename = await prosearchtype(row.typeId)
      const staplenames = await prosearchstaple(row.staples)
      this.type = typename.name
      this.staples = staplenames
    },
    async getList() {
      const { list } = await prolist(this.listQuery)
      this.list = list
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        recommend: 1,
        name: '',
        type: '',
        staples: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
</style>
