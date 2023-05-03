import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/view/systemPage/Login.vue'


import Register from '@/view/systemPage/Register.vue'

import Home from '@/view/Home.vue'
import QuickIntroduce from '@/view/index/quickIntroduce.vue'

//导入系统管理路由
import LogInfo from '@/view/system/LogInfo.vue'
import MenuManage from '@/view/system/MenuManage.vue'
import OPManage from '@/view/system/OPManage.vue'
import PlatformManage from '@/view/system/PlatformManage.vue'

import UserManage from '@/view/system/UserManage.vue'
import UserInfo from '@/view/system/UserInfo.vue'


//导入描述符树路由
import DescriptorTreeInfo from '@/view/descriptorTree/baseInfo/index.vue'
import DescriptorTreeVisualization from '@/view/descriptorTree/Visualization.vue'
import DescriptorTreeFileUpload from '@/view/descriptorTree/fileUpload/index.vue'
import DescriptorTreeFusionTree from "@/view/descriptorTree/FusionTree.vue"
import DescriptorTreeRedundancyElimination from "@/view/descriptorTree/RedundancyElimination.vue"
import DescriptorTreeImportanceScore from "@/view/descriptorTree/ImportanceScore.vue"
//导入机器学习路由
import MlData from '@/view/machineLearning/baseInfo.vue'

//导入关于我们 路由
import ContactUs from "@/view/withUs/contact.vue"
import OtherProject from "@/view/withUs/otherProject.vue"

Vue.use(Router)

//创建并暴露一个路由器
export default new Router({
  mode: 'history',    //此行注释掉即hash模式 不用配置base
  // base:'/descriptorTree',      // 配置单页应用的基路径 用history时与后端联合配置，打包history模式时用
  routes: [
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children:[
        {
          path: 'index/quickIntroduce',
          name: '快速开始',
          component: QuickIntroduce,
        },
        //系统管理
        {
          path: 'system/platformManage',
          name: '平台管理',
          component: PlatformManage,
        },
        {
          path: 'system/opManage',
          name: '操作管理',
          component: OPManage,
        },
        {
          path: 'system/menuManage',
          name: '菜单管理',
          component: MenuManage,
        },
        {
          path: 'system/userManage',
          name: '用户管理',
          component: UserManage,
        },
        {
          path: 'system/userInfo',
          name: '用户信息',
          component: UserInfo,
        },
        {
          path: 'system/logInfo',
          name: '系统日志',
          component: LogInfo,
        },
        //描述符树管理
        {
          path:"descriptorTree/fileUpload",
          name:"文件上传、预览、导入",
          component:DescriptorTreeFileUpload,
        },
        {
          path: 'descriptorTree/baseInfo',
          name: '数据库增删改查',
          component: DescriptorTreeInfo,
        },
        {
          path:"descriptorTree/Visualization",
          name:"可视化增删改查",
          component:DescriptorTreeVisualization,
        },
        {
          path:"descriptorTree/FusionTree",
          name:"描述符树融合",
          component:DescriptorTreeFusionTree,
        },
        {
          path:"descriptorTree/RedundancyElimination",
          name:"描述符树冗余消除",
          component:DescriptorTreeRedundancyElimination,
        },

        {
          path:"descriptorTree/ImportanceScore",
          name:"重要度评分",
          component:DescriptorTreeImportanceScore,
        },


        //机器学习管理
        {
          path: 'machineLearning/baseInfo',
          name: '机器学习信息',
          component: MlData,
        },
      //  关于我们
        {
          path:"withUs/contact",
          name:'联系方式',
          component:ContactUs
        },
        {
          path:"withUs/otherProject",
          name:'其他项目',
          component:OtherProject
        }
      ]
    }
  ]
})
