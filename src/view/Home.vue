<template xmlns:cursor="http://www.w3.org/1999/xhtml">
  <el-container class="container">
<!--    顶部header栏-->
    <el-header class="header" style="height: 64px">
      <div class="header-content">

        <!--      标题logo-->
        <div class="header-logo" >
          <img src="@/assets/logo-课题组v2.png" alt="logo" height="40px">
          <span>NASICON型固态电解质
            <span style="width: 1px;height: 18px;background-color: #ccc;display: inline-block;margin: 0 10px;"></span>
            离子输运性能描述符树管理系统
          </span>
        </div>

        <!-- 用户登录信息-->
        <div class="header-user" @click="signOut">
        <span>
          {{userName}}
        </span>
        </div>
      </div>

    </el-header>

    <el-container class="container_low">
      <!--      左侧导航栏 ,必须设置外层容器高度，让内层容器有滚动条-->
      <el-aside style="width: 280px; height: 648px;" >
        <el-menu style="min-height: 648px" :default-active="defaultActive" unique-opened>
          <el-submenu :index="item.order" v-for="item in menuData" :key="item.order">
            <!--表示可以展开的一组 -->
            <template slot="title">
<!--              图标-->
              <i :class=menuIconClass[item.order-1]></i>
              <!--文字 -->
              <span>{{item.name}}</span>
            </template>
            <!--        :fileUpload="item2.path"，index控制跳转的地址 -->
            <el-menu-item :index="item2.order" v-for="item2 in item.children" :key="item2.order" @click="changePage(item2.name)">
              <span>{{item2.name}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
        <!--主页面高度自适应-->
      <el-main style="padding-top: 0;padding-right: 20px; height: 648px">
          <div ref="isShowSteps" v-on:mouseenter="this.isBind" v-on:mouseleave="this.isBind" style="padding-bottom: 5px">
              <div v-show="showSteps" @click="StepRouterPush">
                  <el-steps :active="active" finish-status="success" align-center ref="steps">
                    <el-step :title="StepFirstName"></el-step>
                    <el-step v-for="(value,index) in StepTitles" :title="value"></el-step>
                  </el-steps>
              </div>
            <div style="height:15px;font-size: 10px; background-color:#add8e640;" v-show="!showSteps">
              查看当前步骤
            </div>
          </div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data(){
    return{
      order:"3",
      StepFirstName:'描述符树构建全流程',
      //记录描述符树创建的路由名
      DescriptorTreeCreateRouterNames:[],
      DescriptorSelectRouterNames:[],
      StepTitles:[],
      defaultActive:'11',
      countActive: sessionStorage.getItem('stepActove')||0,
      isBind:this.doNothing,
      showSteps:true,
      fromSelfClick:false,

      menuData:[],
      userData:{},
      userName:'',
      //设置菜单前面的小图标,目前有6个,对应图标分别为'首页'，'系统管理'，'专利相关'，'描述符树','机器学习','关于我们'
      menuIconClass:[
        'el-icon-s-flag',         //首页
        'el-icon-s-tools',        //系统管理
        'el-icon-s-data',         //描述符树
        'el-icon-s-marketing',    //机器学习
        'el-icon-phone'           //关于我们
      ]
    }
  },
  watch:{

  },
  computed:{
    //利用sessionStorage和计算属性，使得该属性刷新也不改变，可以一直存储
    active:{
      get(){
        // console.log(this.countActive)
        return Number(this.countActive);
      },
      set(value){
        value=value%(this.StepTitles.length+1)
        sessionStorage.setItem('stepActove',value);
        this.countActive = value;
      },
    }
  },

  mounted:function () {

    this.getMenuTree();
    this.getUserInfo();
    this.detectionRouter()

  },

  methods:{
    StepRouterPush(){
      let RouterName;
      this.active++
      if (this.active===0){
        if (this.StepFirstName==="描述符树构建全流程"){
          this.StepTitles=this.DescriptorSelectRouterNames
          this.StepFirstName="描述符选取全流程"
          this.order="3"
          this.$store.state.localActive="2"
        }
        else{
          this.StepTitles=this.DescriptorTreeCreateRouterNames
          this.StepFirstName="描述符树构建全流程"
          this.order="2"
          this.$store.state.localActive="1"
        }
        RouterName="快速开始"
        this.defaultActive="11"
      }
      else{
        RouterName=this.$refs.steps.$children[this.active].title
        this.defaultActive=this.order+this.active
      }

      this.fromSelfClick=true
      this.changePage(RouterName)
      this.detectionRouter()
    },
    isShowSteps(){
      this.showSteps=!this.showSteps
    },
    doNothing(){
      // console.log("执行了doNoting函数")
    },
    changePage(name){
      // console.log("跳转了一次")
      if (this.$route.name !== name) {
        this.$router.push({name: name});
      }
    },
    detectionRouter(){
      // console.log(this.$route)
      if (this.$route.name==="快速开始"){
        this.showSteps=true
        // console.log("我把showStep改成true了")
        //绑定一个空函数，不报错
        this.isBind=this.doNothing;
      }
      else{
        this.isBind=this.isShowSteps;
        if(this.fromSelfClick!==true){
          this.showSteps=false
          // console.log("我把showStep改成false了")
        }
      }
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
      let params={};
      this.$axios.post('/user/getMenuManageData',params).then(res => {
        if(res.data.code===1){
          this.menuData=JSON.parse(res.data.data);
          this.menuData[1].children.forEach(
            child=>{
              if(child.name!=="查看数据库")
              this.DescriptorTreeCreateRouterNames.push(child.name)
            }
          )
          this.menuData[2].children.forEach(
            child=>{
              this.DescriptorSelectRouterNames.push(child.name)
            }
          )
          this.StepTitles=this.DescriptorTreeCreateRouterNames
          console.log(this.menuData)
          // console.log(this.menuData)
        }else{
          this.$notify({
            title: '警告',
            message: res.data.msg,
            type: 'warning'
          });
        }
      })

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
    font-size: 15px;
  }

  .header {
    width: 100%;
    background-color: #fff;
    box-shadow: 0 2px 8px #f0f1f2;
    display: flex;
    justify-content: space-between;
  }
 .header-content{
   margin: auto 40px;
 }
 .header-user{
   display: inline-block;
   margin: auto auto auto 600px;
 }
 .header-logo{
   display: inline-block;
   font-size: 22px;
   color: #273849;
   font-family: "Dosis", "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
   font-weight: 500;
 }
  .header-logo img {
    vertical-align: middle;
    margin-right: 6px;
  }
  .container_low{
    padding: 10px 0 0 0 ;
  }

  /*隐藏进度条*/
  .el-aside::-webkit-scrollbar {
    display: none;
  }
  .el-main::-webkit-scrollbar {
    display: none;
  }

</style>
