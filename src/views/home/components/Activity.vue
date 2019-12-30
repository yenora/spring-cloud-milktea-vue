<template>
  <div class="user-activity">
    <div class="post">
      <div class="user-block">
        <img class="img-circle" :src="'http://localhost:5000/spring-cloud-milktea/default/铁人.jpg'+avatarPrefix">
        <span class="username text-muted">铁人</span>
        <span class="description">公开分享 - 7:30 下午 今天</span>
      </div>
      <p>
        Lorem ipsum代表了设计师长久以来的传统，印刷师之类的。有些人讨厌它并为之争辩它的消亡，但其他人忽略了仇恨，因为他们创造了可怕的帮助培根爱好者为每个人创建填充文本的工具献给查理·辛的粉丝们。
      </p>
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            分享
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            喜欢
          </span>
        </li>
      </ul>
    </div>
    <div class="post">
      <div class="user-block">
        <img class="img-circle" :src="'http://localhost:5000/spring-cloud-milktea/default/美国船长.jpg'+avatarPrefix">
        <span class="username text-muted">美国船长</span>
        <span class="description">给你发了条信息 - 昨天</span>
      </div>
      <p>
        Lorem ipsum代表了设计师长久以来的传统，印刷师之类的。有些人讨厌它并为之争辩它的消亡，但其他人忽略了仇恨，因为他们创造了可怕的帮助培根爱好者为每个人创建填充文本的工具献给查理·辛的粉丝们。
      </p>
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            分享
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            喜欢
          </span>
        </li>
      </ul>
    </div>
    <div class="post">
      <div class="user-block">
        <img class="img-circle" :src="'http://localhost:5000/spring-cloud-milktea/default/蜘蛛侠.jpg'+avatarPrefix">
        <span class="username">蜘蛛侠</span>
        <span class="description">发布了4张照片 - 2天前</span>
      </div>
      <div class="user-images">
        <el-carousel :interval="6000" type="card" height="220px">
          <el-carousel-item v-for="item in carouselImages" :key="item">
            <img :src="item+carouselPrefix" class="image">
          </el-carousel-item>
        </el-carousel>
      </div>
      <ul class="list-inline">
        <li><span class="link-black text-sm"><i class="el-icon-share" /> 分享</span></li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" /> 喜欢</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const avatarPrefix = '?imageView2/1/w/80/h/80'
const carouselPrefix = '?imageView2/2/h/440'

export default {
  data() {
    return {
      carouselImages: [
        'http://localhost:5000/spring-cloud-milktea/default/蜘蛛侠-1.jpg',
        'http://localhost:5000/spring-cloud-milktea/default/蜘蛛侠-2.jpg',
        'http://localhost:5000/spring-cloud-milktea/default/蜘蛛侠-3.jpg',
        'http://localhost:5000/spring-cloud-milktea/default/蜘蛛侠-4.jpg'
      ],
      avatarPrefix,
      carouselPrefix
    }
  }
}
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {

    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username{
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;

    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {

      &:hover,
      &:focus {
        color: #999;
      }
    }
  }

}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>
