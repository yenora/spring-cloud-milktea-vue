<template>
  <div>
    <el-form ref="form" :model="admin" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="admin.name" name="name" type="text" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="admin.email" name="tel" type="text" />
      </el-form-item>
      <el-form-item label="修改密码（不填可直接修改信息）" prop="password">
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
        <el-input :key="passwordType" ref="password" v-model.trim="admin.password" :type="passwordType" name="password" />
      </el-form-item>
      <el-button :loading="updateLoading" type="primary" @click="updateInfo">修改</el-button>
      <el-button :loading="delLoading" type="danger" @click="delInfo">注销账户</el-button>
    </el-form>
  </div>
</template>

<script>
import { delInfo } from '@/api/admin'

export default {
  props: {
    admin: {
      type: Object,
      default: () => {
        return {
          id: undefined,
          name: '',
          password: null,
          email: '',
          avatar: '',
          type: '',
          createTime: ''
        }
      }
    }
  },
  data: function() {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('管理员账户不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value !== null && value !== '' && value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
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
      updateLoading: false,
      delLoading: false,
      passwordType: 'password',
      confimType: 'password',
      rules: {
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        email: [{ required: true, trigger: 'blur', validator: validEmail }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      }
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    updateInfo() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.updateLoading = true
          const password = this.admin.password
          if (password !== null) {
            this.$confirm('您确定修改密码为' + password + '?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$store
                .dispatch('admin/updateInfo', this.admin)
                .then(() => {
                  this.$router.push({ path: this.redirect || '/' })
                  this.$notify({
                    title: '成功',
                    message: '修改管理员账户信息成功',
                    type: 'success',
                    duration: 2000
                  })
                })
            })
          } else {
            this.$store
              .dispatch('admin/updateInfo', this.admin)
              .then(() => {
                this.$router.push({ path: this.redirect || '/' })
                this.$notify({
                  title: '成功',
                  message: '修改管理员账户信息成功',
                  type: 'success',
                  duration: 2000
                })
              })
          }
          this.updateLoading = false
        }
      })
    },
    delInfo() {
      this.delLoading = true
      this.$confirm('您确定要注销管理员账户吗?注销后您的所有信息将被永久删除，无法恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        delInfo(this.admin.id).then(response => {
          this.$store.dispatch('admin/logout').then(() => {
            this.$router.push({ path: this.redirect || '/login' })
          })
          this.$notify({
            title: '成功',
            message: '删除管理员账户成功',
            type: 'success',
            duration: 2000
          })
        })
      })
      this.delLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
$dark_gray: #889aa4;
.show-pwd {
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
</style>
