<template>
  <div style="padding-left: 40px;padding-top: 20px">

    <el-collapse class="el-font" v-model="activeNames">
      <!--进度条介绍-->
      <el-collapse-item title="上方进度条 Steps" name="1">
<!--        进度条操作介绍-->
        <ul class="Hollow">
          <li><span class="Blackbody gray">进入下一步:</span>&#9点击进度条。</li>
          <li><span class="Blackbody gray">退回上一步:</span>&#9点击浏览器后退按钮</li>
          <li><span class="Blackbody gray">进度条功能介绍如下:</span></li>
        </ul>

<!--        进度条功能介绍-->
        <ul class="Solid indent ">
          <li><span class="Blackbody">快速开始：</span>&#9本平台的开始处、记录了各页面的操作指南</li>
          <li><span class="Blackbody">文件上传：</span>&#9上传描述符树EXCEL文件、描述符信息EXCEL文件、可将EXCEL转成JSON对象，并提供可视化预览、信息预览，
            预览检查无误后可一键导入数据库</li>
          <li><span class="Blackbody">数据库增删改查：</span>&#9可对当前数据库表的增删改查；数据库目前有三张表，分别为信息表、描述符结构表、描述符树层次表。</li>
          <li><span class="Blackbody">可视化增删改查：</span>&#9可视化展示时实现增删改查，提供输入框查询，右键点击交互完成增加、修改、删除操作。</li>
          <li><span class="Blackbody">描述符树融合：</span>&#9提供两棵树的融合操作，点击类型按钮可选择待融合的树，可选取数据库内的描述符树
            或手动上传描述符树EXCEL文件，输出融合树，融合树结点的高亮颜色对应其来源。</li>
          <li><span class="Blackbody">描述符树冗余消除：</span>&#9提供描述符树的冗余消除操作。输入一颗树，对其冗余消除；输入树从EXCEL表格、数据库获取，也可以是步骤五中产生的融合树</li>
          <li><span class="Blackbody">重要度评分：</span>&#9输入描述符树或描述符结点，输出重要度评分表。描述符树提取描述符结点，利用文献库和TF-IDF算法计算其重要度。</li>
        </ul>
      </el-collapse-item>
      <el-collapse-item title="系统管理 System & Management " name="2">
        <ul class="Hollow">
          <li><span class="Blackbody gray">平台管理：</span></li>
          <li><span class="Blackbody gray">用户管理：</span></li>
          <li><span class="Blackbody gray">用户信息：</span></li>
          <li><span class="Blackbody gray">系统日志：</span></li>
          <li><span class="Blackbody gray">菜单管理：</span></li>
          <li><span class="Blackbody gray">操作管理：</span></li>
        </ul>
      </el-collapse-item>
<!--      描述符及描述符树-->
      <el-collapse-item title="描述符及描述符树 Descriptors & DescriptorTree" name="3">
        <ul class="">
          <li><span class="Blackbody gray">此部分介绍同进度条功能介绍，请见进度条功能</span></li>
        </ul>
      </el-collapse-item >
      <el-collapse-item title="机器学习 Machine & Learning" name="4">
        <ul class="Hollow">
          <li><span class="Blackbody gray">机器学习信息：</span></li>
        </ul>
      </el-collapse-item>
      <el-collapse-item title="关于我们 About & Us" name="5">
        <ul class="Hollow">
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
      activeNames: ['1','2','3','4','5']
    };
  },
  methods: {}
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
