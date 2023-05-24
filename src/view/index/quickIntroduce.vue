<template>
  <div style="padding-left: 40px;padding-top: 20px">

    <el-collapse class="el-font" v-model="activeNames">
      <!--进度条介绍-->
      <el-collapse-item title="描述符树构建 Create" name="1">
<!--        进度条操作介绍-->
<!--        <ul class="Hollow">-->
<!--          <li><span class="Blackbody gray">进入下一步:</span>&#9点击进度条。</li>-->
<!--          <li><span class="Blackbody gray">退回上一步:</span>&#9点击浏览器后退按钮</li>-->
<!--          <li><span class="Blackbody gray">进度条功能介绍如下:</span></li>-->
<!--        </ul>-->

<!--        进度条功能介绍-->
        <ul class="Solid indent ">
          <li><span class="Blackbody">描述符树新建：</span>&#9支持基于EXCEL文件新建描述符树、针对性新建描述符树；并提供可视化预览、信息预览，一键导入数据库服务</li>
          <li><span class="Blackbody">描述符树修改：</span>&#9支持交互完成描述符树CRUD操作，可视化展示描述符树。</li>
          <li><span class="Blackbody">描述符树融合：</span>&#9支持专家经验树、文本挖掘树、特征树的融合。页面展示融合树</li>
          <li><span class="Blackbody">描述符树冗余消除：</span>&#9提供融合树的冗余消除操作。1、冗余检测；2、删除冗余重复节点</li>
          <li><span class="Blackbody">数据库增删改查：</span>&#9提供对当前数据库的CRUD操作；数据库有三张表，分别为信息表、结构表、嵌套表。</li>

        </ul>
      </el-collapse-item>
      <el-collapse-item title="描述符选取 Select" name="2">
        <ul class="Solid indent">
          <li><span class="Blackbody">描述符重要度计算：</span>&#9基于文献库TF-IDF算法计算其重要度，基于描述符树计算其重要度。</li>
          <li><span class="Blackbody">描述符重要度可视化：</span>&#9基于热力图的重要度可视化。</li>
          <li><span class="Blackbody">描述符分类选取：</span>&#9提供手动或自动的描述符分类选取。</li>
          <li><span class="Blackbody">机器学习样本模板下载：</span>&#9通过选取的描述符生成机器学习样本模板以供下载使用。</li>



        </ul>
      </el-collapse-item>
      <el-collapse-item title="系统管理  System" name="3">
        <ul class="Solid indent">
          <li><span class="Blackbody gray">平台管理：</span></li>
          <li><span class="Blackbody gray">用户管理：</span></li>
          <li><span class="Blackbody gray">用户信息：</span></li>
          <li><span class="Blackbody gray">系统日志：</span></li>
          <li><span class="Blackbody gray">菜单管理：</span></li>
          <li><span class="Blackbody gray">操作管理：</span></li>
        </ul>
      </el-collapse-item>


      <el-collapse-item title="关于我们 About" name="4">
        <ul class="Solid indent">
          <li><span class="Blackbody gray">联系方式：</span> 提供课题及相关负责人联系方式</li>
          <li><span class="Blackbody gray">其他项目：</span> 友情项目或相关项目</li>

        </ul>
      </el-collapse-item>
    </el-collapse>
  </div>

</template>

<script>
export default {
  data() {
    return {
      activeNames: [this.$store.state.localActive]
    };
  },
  methods: {},
  mounted() {
    console.log(this.activeNames)
  }
}
</script>

<style scoped>
/*黑体*/
.Blackbody{
  color: black;
  font-weight: bold;
}
.gray{
  color: #3a3a3b;
}
/*一级标题*/
/deep/ .el-collapse-item__header  {
  font-size: 24px;
  font-weight: bold;
  height: 60px;
}
/*文字字体*/
/deep/ .el-collapse-item__content {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  font-size: 14px;
}

ul {
  list-style: none; /* 去除默认的列表样式 */
  padding-left: 0; /* 去除默认的内边距 */
}

ul li {
  position: relative; /* 为了方便设置图标位置 */
  padding-left: 1.5em; /* 设置文字距离左边框的距离 */
  margin-bottom: 0.5em; /* 设置每个列表项之间的距离 */
}
.indent li {
  position: relative; /* 为了方便设置图标位置 */
  padding-left: 3.5em; /* 设置文字距离左边框的距离 */
  margin-bottom: 0.5em; /* 设置每个列表项之间的距离 */
}
.indent ul li {
  position: relative; /* 为了方便设置图标位置 */
  padding-left: 3.5em; /* 设置文字距离左边框的距离 */
  margin-bottom: 0.5em; /* 设置每个列表项之间的距离 */
}



.Hollow li::before {
  content: "";
  position: absolute; /* 相对于父元素进行定位 */
  left: 0; /* 图标距离左边框的距离 */
  top: 0.5em; /* 图标距离上边框的距离 */
  width: 0.5em;
  height: 0.5em;
  border: 1px solid #000;
  border-radius: 50%;
}

.Solid li:before {
  content: ""; /* 设置伪元素 */
  position: absolute; /* 相对于父元素进行定位 */
  left: 2em; /* 图标距离左边框的距离 */
  top: 0.5em; /* 图标距离上边框的距离 */
  width: 0.5em; /* 图标的宽度 */
  height: 0.5em; /* 图标的高度 */
  border-radius: 50%; /* 将图标变成圆形 */
  background-color: #333; /* 设置图标的颜色 */
}

</style>
