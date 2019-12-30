<template>
  <el-form ref="updateForm" :model="admin" :rules="updateRules">
    <el-form-item label="名称" prop="name">
      <el-input v-model.trim="admin.name" name="name" type="text" />
    </el-form-item>
    <el-form-item label="电话" prop="tel">
      <el-input v-model.trim="admin.tel" name="tel" type="text" />
    </el-form-item>
    <el-form-item label="新的密码" prop="password">
      <span class="show-pwd" @click="showPwd">
        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
      </span>
      <el-input :key="passwordType" ref="password" v-model.trim="admin.password" :type="passwordType" name="password" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confim">
      <span class="show-pwd" @click="showConfim">
        <svg-icon :icon-class="confimType === 'password' ? 'eye' : 'eye-open'" />
      </span>
      <el-input :key="confimType" ref="confim" v-model.trim="admin.confim" :type="confimType" name="confim" />
    </el-form-item>
    <el-button :loading="updateLoading" type="primary" @click="update">修改</el-button>
    <el-button :loading="delLoading" type="danger" @click="del">注销账户</el-button>
  </el-form>
</template>

<script>
import { setToken } from '@/utils/auth'
import { update, del } from '@/api/admin'

export default {
  props: {
    admin: {
      type: Object,
      default: () => {
        return {
          id: undefined,
          name: '',
          tel: '',
          password: '',
          confim: '',
          role: '',
          createTime: '',
          avatar: ''
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
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    const validateConfim = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.admin.password) {
        callback(new Error('两次输入密码不一致！'))
      } else {
        callback()
      }
    }
    const validTel = (rule, value, callback) => {
      var pattern = /^1[3456789]\d{9}$/
      if (value === '') {
        callback(new Error('电话号码不能为空'))
      } else if (!pattern.test(value)) {
        callback(new Error('电话号码格式不正确'))
      } else {
        return callback()
      }
    }
    return {
      updateLoading: false,
      delLoading: false,
      passwordType: 'password',
      confimType: 'password',
      updateRules: {
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confim: [{ required: true, trigger: 'blur', validator: validateConfim }],
        tel: [{ required: true, trigger: 'blur', validator: validTel }]
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
    showConfim() {
      if (this.confimType === 'password') {
        this.confimType = ''
      } else {
        this.confimType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.confim.focus()
      })
    },
    update() {
      this.updateLoading = true
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          update(this.admin).then(response => {
            this.updateLoading = false
            if (response.data) {
              setToken(response.data.token)
              this.$notify({
                title: '成功',
                message: '修改管理员账户成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '修改管理员账户失败',
                type: 'danger',
                duration: -1
              })
            }
          })
        }
      })
    },
    del() {
      this.delLoading = true
      del(this.admin.id).then(response => {
        const { data } = response
        if (data) {
          this.$store.dispatch('admin/logout').then(() => {
            this.$router.push({ path: this.redirect || '/login' })
            this.delLoading = false
          })
          this.$notify({
            title: '成功',
            message: '删除管理员账户成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '删除管理员账户失败',
            type: 'danger',
            duration: -1
          })
        }
      })
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
