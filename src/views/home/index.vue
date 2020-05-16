<template>
  <div class="app-container">
    <div v-if="admin">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <admin-card :admin="admin" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="活动" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="时间线" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="个人信息" name="admininfo">
                <admin-info :admin="admin" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import AdminCard from './components/AdminCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import AdminInfo from './components/AdminInfo'

export default {
  name: 'Home',
  components: { AdminCard, Activity, Timeline, AdminInfo },
  data() {
    return {
      admin: {
        id: undefined,
        name: '',
        password: null,
        email: '',
        avatar: '',
        type: '',
        createTime: ''
      },
      activeTab: 'activity'
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.$store
        .dispatch('admin/getInfo')
        .then(response => {
          this.admin = response
        })
    }
  }
}
</script>
