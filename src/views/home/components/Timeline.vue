<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeline: [
        {
          timestamp: '2019/12/1',
          title: '创建项目模板',
          content: 'yaos committed 2019/12/1 20:46'
        },
        {
          timestamp: '2019/12/8',
          title: '修改项目模板',
          content: 'yaos committed 2019/12/8 20:46'
        },
        {
          timestamp: '2019/12/9',
          title: '初步搭建网站框架',
          content: 'yaos committed 2019/12/9 20:46'
        },
        {
          timestamp: '2020/6/30',
          title: '最终版本',
          content: 'yaos committed 2020/6/30 20:46'
        }
      ]
    }
  }
}
</script>
