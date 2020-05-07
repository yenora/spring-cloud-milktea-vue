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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
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
            <el-form-item label="ID">
              <span>{{ row.id }}</span>
            </el-form-item>
            <el-form-item label="类型">
              <span>{{ row.productTypeDTO.name }}</span>
            </el-form-item>
            <el-form-item label="原料">
              <span>{{ row.productStapleDTO.names }}</span>
            </el-form-item>
            <el-form-item label="名称">
              <span>{{ row.name }}</span>
            </el-form-item>
            <el-form-item label="价格">
              <span>{{ row.price }}</span>
            </el-form-item>
            <el-form-item label="介绍">
              <span>{{ row.description }}</span>
            </el-form-item>
            <el-form-item label="推荐指数">
              <svg-icon v-for="n in + row.recommend" :key="n" icon-class="star" class="meta-item__icon" />
            </el-form-item>
            <el-form-item label="销售量">
              <span>{{ row.sales }}</span>
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
            :src="row.pic === null ? defaultJPG : row.pic"
            :preview-src-list="[row.pic === null ? defaultJPG : row.pic]"
          />
        </template>
      </el-table-column>

      <el-table-column label="介绍">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column label="价格">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showTime" label="创建时间" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="类型" prop="productTypeDTO">
          <el-select v-model="temp.productTypeDTO.id" class="filter-item" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="原料" prop="productStapleDTO">
          <!--value-key="id"-->
          <el-select v-model="temp.productStapleDTO.ids" class="filter-item" placeholder="请选择" multiple>
            <el-option v-for="item in stapleList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker v-model="temp.createTime" type="datetime" placeholder="请选择时间" />
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
          <el-input v-model="temp.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleImgUpload()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { prolist, proinsert, proupdate, prodel } from '@/api/product'
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
    const isPriceVlidator = (rule, value, callback) => {
      var pattern = /^\d+.?\d{0,2}$/
      if (!value) {
        return callback(new Error('价格不能为空！'))
      } else if (value > 214748) {
        return callback(new Error('价格定这么高？你有点飘啊'))
      } else if (value <= 214748 && !pattern.test(value)) {
        return callback(new Error('小数点后最多只能输入两位！'))
      } else return callback()
    }
    const validType = (rule, value, callback) => {
      if (!value.id) {
        return callback(new Error('种类不能为空！'))
      } else return callback()
    }
    const validStaple = (rule, value, callback) => {
      if (value.ids.length === 0) {
        return callback(new Error('原料不能为空！'))
      } else return callback()
    }
    return {
      listLoading: true,
      downloadLoading: false,
      tableKey: 0,
      total: 0,
      showTime: false,
      stapleList: null,
      typeList: null,
      list: null,
      // 先定死
      recommendOptions: [1, 2, 3],
      sortOptions: [{ label: '根据ID升序', key: '+id' }, { label: '根据ID降序', key: '-id' }],
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
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加',
        delete: '删除',
        download: '下载'
      },
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        productTypeDTO: [
          { required: true, message: '类型不能为空', trigger: 'change', validator: validType }
        ],
        productStapleDTO: [
          { required: true, message: '原料不能为空', trigger: 'change', validator: validStaple }
        ],
        price: [{ required: true, validator: isPriceVlidator, trigger: 'blur' }]
      },
      temp: {
        id: undefined,
        typeId: undefined,
        staples: '',
        recommend: 1,
        description: '',
        createTime: new Date(),
        name: '',
        productTypeDTO: {
          id: undefined,
          name: ''
        },
        productStapleDTO: {
          ids: [],
          name: []
        },
        price: 0.0,
        sales: 0,
        pic: ''
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
      browserUrl: '',
      fileList: [],
      defaultJPG: defaultJPG
    }
  },
  created() {
    this.listLoading = true
    this.getList()
    this.getTypeList()
    this.getStapleList()
    this.listLoading = false
  },
  methods: {
    getList() {
      prolist(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
      })
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '种类', '原料', '名称', '价格', '介绍', '销售量', '创建时间']
        const filterVal = [
          'id',
          'productTypeDTO',
          'productStapleDTO',
          'name',
          'price',
          'description',
          'sales',
          'createTime'
        ]

        // 实现对象的深拷贝，这里不知道为什么会成功，this.list好像不是个json吧
        const tempData = JSON.parse(JSON.stringify(this.list))
        const data = this.formatJson(filterVal, tempData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '恋上奶茶店-产品列表数据'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'createTime') {
            v[j] = parseTime(v[j])
          }
          if (j === 'productTypeDTO') {
            v[j] = v.productTypeDTO.name
          }
          if (j === 'productStapleDTO') {
            v[j] = v.productStapleDTO.names
          }
          return v[j]
        })
      )
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        recommend: 1,
        description: '',
        createTime: new Date(),
        name: '',
        productTypeDTO: {
          id: undefined,
          name: ''
        },
        productStapleDTO: {
          ids: [],
          name: []
        },
        price: 0.0,
        sales: 0,
        pic: ''
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
    createData() {
      const tempData = Object.assign({}, this.temp)
      tempData.typeId = tempData.productTypeDTO.id
      tempData.staples = tempData.productStapleDTO.ids.join(',')
      tempData.createTime = parseTime(tempData.createTime)
      proinsert(tempData).then(() => {
        this.getList()
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '添加记录成功',
          type: 'success',
          duration: 2000
        })
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
    updateData() {
      const tempData = Object.assign({}, this.temp)
      tempData.typeId = tempData.productTypeDTO.id
      tempData.staples = tempData.productStapleDTO.ids.join(',')
      tempData.createTime = parseTime(tempData.createTime)
      proupdate(tempData).then(() => {
        this.getList()
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '修改记录成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDel(row) {
      this.dialogStatus = 'delete'
      this.imgUploadData[this.dialogStatus].username = 'super'
      this.imgUploadData[this.dialogStatus].fileType = 'image'
      if (row.pic !== '') {
        this.imgUploadData[this.dialogStatus].fileName = row.pic
        deleteFile(this.imgUploadData[this.dialogStatus]).then(response => {
          if (!response.data) {
            console.log('文件服务器不存在此文件')
          }
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
