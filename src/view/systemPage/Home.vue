<template xmlns:cursor="http://www.w3.org/1999/xhtml">
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="8" :offset="8" >
          <div>
            <h2>header:logo+background image+platform name</h2>
          </div>
        </el-col>
        <el-col :span="4" :offset="2" class="rightsection">
          <div >
            <span >欢迎您，{{userName}}</span>
          </div>
        </el-col>
        <el-col :span="2" class="rightsection">
          <div >
            <span class="clickstyle" @click="signOut">退出</span>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-menu :unique-opened="true" :router="true" class="el-menu-demo" mode="horizontal" >
      <el-submenu :index="item.order" v-for="item in menuData" :key="item.order">
        <!--表示可以展开的一组 -->
        <template slot="title">
          <i v-if="item.order==='1'" class="el-icon-s-tools"></i>
          <i v-if="item.order==='2'" class="el-icon-coin"></i>
          <i v-if="item.order==='3'" class="el-icon-s-flag"></i>
          <!--文字 -->
          <span>{{item.name}}</span>
        </template>
        <el-menu-item v-for="item2 in item.children" :index="item2.path" :key="item2.order">
          <span>{{item2.name}}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>

    <!--主页面高度自适应-->
    <el-main style="height:0;flex-grow:1;">
      <!--<el-page-header @back="goBack">-->
      <!--</el-page-header>-->
      <div class="page">
        <router-view></router-view>
      </div>
    </el-main>
    <el-footer class="footer" style="height: 40px">
      <h3 style="text-align: center;margin-top: 10px">footer:background image+other information</h3>
      <!--<div style="text-align: right;margin-top: 10px">yuziyishu@163.com</div>-->
    </el-footer>

  </el-container>
</template>

<script>
export default {
  name: "Home",
  data(){
    return{
      menuData:[],
//      menuData: [
//        {
//          name: "系统管理",
//          order: "1",
//          path:'',
//          children: [
//            {
//              name: "平台管理",
//              order: "11",
//              path:'/platformManage',
//            },
//            {
//              name: "用户管理",
//              order: "12",
//              path:'/userManage',
//            },
//            {
//              name: "用户信息",
//              order: "13",
//              path:'/userInfo',
//            },
//            {
//              name: "系统日志",
//              order: "14",
//              path:'/logInfo',
//            },
//          ],
//        },
//        {
//          name: "业务管理",
//          order: "2",
//          path:'',
//          children: [
//            {
//              name: "样例1",
//              order: "21",
//              path:'/demo1',
//            },
//          ],
//        },
//      ],
      userData:{},
      userName:'',
    }
  },
  mounted:function () {

    this.getMenuTree();
    this.getUserInfo();
    this.$router.push({ path: "/homePage" });

  },
  methods:{
    toHomePage(){
      this.$router.push({ path: "/homePage" });
    },
    signOut() {
      this.$confirm("退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let params={};
        this.$axios.post('/user/signOut',params).then(res => {
          if(res.data.code===1){
            this.$router.push({ path: "/login" });
          }else{
            this.$notify({
              title: '警告',
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
      });
    },
    getMenuTree() {
//      this.menuData=[{order: "3",name: "研究生入学测试",children: [{name: "回归",order: "31",path: "/regression"},{name: "聚类",order: "32",path: "/clustering"}]}]
      let params={};
      this.$axios.post('/user/getMenuData',params).then(res => {
        if(res.data.code===1){
          this.menuData=JSON.parse(res.data.data);
        }else{
          this.$notify({
            title: '警告',
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
//        .catch(error => {
//        this.$notify.error({
//          title: '错误',
//          message: '系统异常，请重试或联系管理员'
//        });
//        // error是http状态4xx、5xx的响应结果，错误响应对象是error.response，错误响应数据是error.response.data，响应的数据就是一个页面，但是页面不一定要渲染出来
//      })
    },
    getUserInfo() {
      let params={};
      this.$axios.post('/user/getUserInfo',params).then(res => {
        if(res.data.code===1){
          this.userData=JSON.parse(res.data.data);
          this.userName=this.userData.userName;
        }else{
          this.$notify({
            title: '警告',
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
    },
    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      }
    },
  }
}
</script>

<style scoped>
  .container {
    height: 100%;
    font-size: 15px;
    background-color: #eee;

  }
  .header {
    background-image: url('../../assets/head1.jpg');
    background-size: cover;
    color:#000;
    text-align: center;
  }
  .rightsection {
    line-height: 60px;
    text-align: right;
  }
  .clickstyle{
    cursor: pointer;
  }
  .aside {
    background: #545c64;
    color: #fff;
    width: 250px !important;
    /* height: 100%; */
  }
  .footer{
    background-image: url('../../assets/foot1.jpg');
    background-size: cover;
    color:#000;
  }
  .page {
    margin:10px 70px;
    padding: 20px 20px;
    border-radius: 5px;
    background-color: #fff;

  }
</style>
