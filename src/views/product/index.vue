<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input v-model="listQuery.entity.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.entity.recommend" placeholder="推荐指数" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in recommendOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.entity.typeId" placeholder="类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-download" @click="dialogExportVisible = true">
        导出
      </el-button>
      <el-checkbox v-model="showTime" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        创建时间
      </el-checkbox>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="原料">
              <span>{{ row.staple }}</span>
            </el-form-item>
            <el-form-item label="销量">
              <span>{{ row.sales }}</span>
            </el-form-item>
            <el-form-item label="介绍">
              <span>{{ row.description }}</span>
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
        <template slot-scope="{row}">
          <el-image
            style="width: 60px; height: 60px"
            :src="row.pic === null || row.pic === '' ? defaultJPG : row.pic"
            :preview-src-list="[row.pic === null || row.pic === '' ? defaultJPG : row.pic]"
          />
        </template>
      </el-table-column>

      <el-table-column label="类型">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column label="价格">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column label="推荐指数">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.recommend" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>

      <el-table-column v-if="showTime" label="创建时间" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-waves type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-waves size="mini" type="danger" @click="deleteData(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加/修改单 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="类型" prop="typeId">
          <el-select v-model="temp.typeId" class="filter-item" placeholder="请选择类型">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="原料" prop="stapleId">
          <!--value-key="id"-->
          <el-select v-model="temp.stapleId" class="filter-item" placeholder="请选择原料" multiple>
            <el-option v-for="item in stapleList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="temp.price" />
        </el-form-item>
        <el-form-item label="图片" prop="pic">
          <el-input v-if="false" v-model="temp.pic" type="hidden" />
          <el-upload
            ref="upload"
            class="upload-poster"
            :action="imgUploadApi[dialogStatus]"
            :data="imgUploadData[dialogStatus]"
            :file-list="fileList"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="imgPreview"
            :on-success="uploadOnSuccess"
            :on-error="uploadOnError"
          >
            <img v-if="browserUrl" :src="browserUrl" class="img-class">
            <img v-else-if="temp.pic" :src="temp.pic" class="img-class">
            <div v-else class="el-upload el-upload--picture-card">
              <i class="el-icon-plus" />
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="推荐指数">
          <el-rate v-model="temp.recommend" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="temp.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="介绍一下你的产品，更容易吸引顾客购买哦~" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-waves type="primary" @click="handleImgUpload()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 导出单 -->
    <el-dialog title="请选择导出类型" :visible.sync="dialogExportVisible">
      <el-radio-group v-model="exportOptional" @change="handleChangeExportType">
        <el-radio :label="1">全部导出</el-radio>
        <el-radio :label="2">当前页导出</el-radio>
        <el-radio :label="3">自定义数量导出</el-radio>
      </el-radio-group>
      <el-input-number v-show="customVisible" v-model="customNum" :min="1" :max="total" label="描述文字" @change="handleChangeExportNumber" />
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="dialogExportVisible = false">取 消</el-button>
        <el-button v-waves :loading="downloadLoading" type="primary" @click="handleExportDownload(exportOptional)">确 定</el-button>
      </span>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { prolist, proinsert, proupdate, prodel, proListBySize } from '@/api/product'
import { protypelist } from '@/api/product_type'
import { prostaplelist } from '@/api/product_staple'
import { deleteFile } from '@/api/fileUpload'
import { parseTime } from '@/utils'

import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

import defaultJPG from '@/assets/default.jpg'

export default {
  name: 'Product',
  filters: { parseTime },
  components: { Pagination },
  directives: { waves },
  data() {
    const vaildPrice = (rule, value, callback) => {
      var pattern = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
      if (!value) {
        return callback(new Error('价格不能为空！'))
      } else if (!pattern.test(value)) {
        return callback(new Error('请输入合法的金额数字，最多两位小数'))
      } else return callback()
    }
    return {
      listQuery: {
        page: 1,
        limit: 5,
        sort: '-id',
        entity: {
          name: undefined,
          recommend: undefined,
          typeId: undefined
        }
      },
      tableKey: 0,
      total: 0,
      customNum: 0,
      customVisible: false,
      showTime: false,
      listLoading: true,
      downloadLoading: false,
      dialogExportVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      browserUrl: '',
      list: [],
      totalList: [],
      stapleList: [],
      typeList: [],
      fileList: [],
      defaultJPG: defaultJPG,
      // 定死
      recommendOptions: [1, 2, 3],
      exportOptional: 1,
      sortOptions: [
        { label: '根据ID升序', key: '+id' },
        { label: '根据ID降序', key: '-id' }
      ],
      textMap: {
        update: '修改',
        create: '添加',
        delete: '删除',
        download: '下载'
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        typeId: [{ required: true, message: '请选择类型', trigger: 'change' }],
        stapleId: [{ required: true, message: '请选择原料', trigger: 'change' }],
        price: [{ required: true, validator: vaildPrice, trigger: 'blur' }]
      },
      imgUploadApi: {
        create: '/iccp-milktea-rest/v1/file/uploadFile',
        update: '/iccp-milktea-rest/v1/file/updateFile',
        delete: '',
        download: ''
      },
      imgUploadData: {
        create: {
          username: '',
          fileType: ''
        },
        update: {
          username: '',
          fileType: '',
          fileName: ''
        },
        delete: {
          username: '',
          fileType: '',
          fileName: ''
        },
        download: {
          username: '',
          fileType: '',
          fileName: '',
          localPath: ''
        }
      },
      temp: {
        id: '',
        typeId: '',
        stapleIds: '',
        name: '',
        price: 0,
        pic: '',
        sales: 0,
        description: '',
        recommend: 1,
        createTime: '',
        type: '',
        staple: '',
        stapleId: []
      }
    }
  },
  created() {
    this.getList()
    this.getTypeList()
    this.getStapleList()
  },
  methods: {
    resetTemp() {
      this.temp = {
        id: '',
        typeId: '',
        stapleIds: '',
        name: '',
        price: 0,
        pic: '',
        sales: 0,
        description: '',
        recommend: 1,
        createTime: '',
        type: '',
        staple: '',
        stapleId: []
      }
    },
    getList() {
      this.listLoading = true
      prolist(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
      })
      this.listLoading = false
    },
    getTypeList() {
      protypelist({}).then(response => {
        this.typeList = response.data
      })
    },
    getStapleList() {
      prostaplelist({}).then(response => {
        this.stapleList = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleChangeExportNumber(value) {
      this.customNum = value
    },
    handleChangeExportType(value) {
      if (value === 3) {
        this.customVisible = true
      } else {
        this.customVisible = false
      }
    },
    async handleExportDownload(exportOptional) {
      try {
        this.downloadLoading = true
        const { export_json_to_excel } = require('@/vendor/Export2Excel')
        const tHeader = ['ID', '种类', '原料', '名称', '价格', '描述', '推荐指数', '销售量', '创建时间']
        const filterVal = [
          'id',
          'type',
          'staple',
          'name',
          'price',
          'description',
          'recommend',
          'sales',
          'createTime'
        ]
        var data = ''
        if (exportOptional === 1) {
          data = this.formatJson(filterVal, await this.getProList(this.total))
        } else if (exportOptional === 2) {
          const tempData = JSON.parse(JSON.stringify(this.list))
          data = this.formatJson(filterVal, tempData)
        } else if (exportOptional === 3) {
          data = this.formatJson(filterVal, await this.getProList(this.customNum))
        } else {
          this.$notify({
            title: '失败',
            message: '没有此选项，操作异常',
            type: 'error',
            duration: 2000
          })
        }
        export_json_to_excel({
          header: tHeader,
          data,
          filename: '恋上奶茶店-产品列表数据'
        })
        this.downloadLoading = false
        this.dialogExportVisible = false
      } catch (error) {
        console.log(error)
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.browserUrl = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.browserUrl = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      const tempData = Object.assign({}, this.temp)
      proinsert(tempData).then(() => {
        this.dialogFormVisible = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '添加记录成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    updateData() {
      const tempData = Object.assign({}, this.temp)
      proupdate(tempData).then(() => {
        this.dialogFormVisible = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '修改记录成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    deleteData(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogStatus = 'delete'
        this.imgUploadData[this.dialogStatus].username = 'super'
        this.imgUploadData[this.dialogStatus].fileType = 'image'
        if (row.pic !== '') {
          this.imgUploadData[this.dialogStatus].fileName = row.pic
          deleteFile(this.imgUploadData[this.dialogStatus]).then(response => {
            console.log(response.message)
          })
        }
        prodel(row.id).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除记录成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    getProList(size) {
      proListBySize(size).then(response => {
        this.totalList = response.data
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(this.totalList)
        }, 5000)
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'createTime') {
            v[j] = parseTime(v[j])
          }
          if (j === 'type') {
            v[j] = v.type
          }
          if (j === 'staple') {
            v[j] = v.staple
          }
          return v[j]
        })
      )
    },
    imgPreview(file, fileList) {
      const fileName = file.name
      const regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/
      if (regex.test(fileName.toLowerCase())) {
        if (fileList.length > 0) {
          // 保证fileList中只有一个文件，并且是最新上传的
          this.fileList = [fileList[fileList.length - 1]]
        }
        this.browserUrl = URL.createObjectURL(file.raw)
        this.imgUploadData[this.dialogStatus].username = 'super'
        this.imgUploadData[this.dialogStatus].fileType = 'image'
        if (this.dialogStatus === 'update') {
          this.imgUploadData[this.dialogStatus].fileName = this.temp.pic
        }
      } else {
        // 移除最后一个文件
        this.fileList.pop()
        this.$message.error('请选择图片文件')
      }
    },
    handleImgUpload() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.browserUrl !== '') {
            this.$refs.upload.submit()
          } else if (this.browserUrl === '' && this.dialogStatus === 'create') {
            this.createData()
          } else if (this.browserUrl === '' && this.dialogStatus === 'update') {
            this.updateData()
          }
        }
      })
    },
    uploadOnError(response, file) {
      this.$message.warning('图片上传出错！')
    },
    uploadOnSuccess(response, file) {
      if (response.data !== '') {
        this.temp.pic = response.data
      }
      if (this.dialogStatus === 'create') {
        this.createData()
      } else if (this.dialogStatus === 'update') {
        this.updateData()
      }
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
  width: 100%;
}
.img-class{
  width: 100px;
  height: 100px;
}
</style>
