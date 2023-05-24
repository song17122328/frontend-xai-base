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


//导入描述符树创建路由
import DescriptorTreeInfo from '@/view/descriptorTreeCreate/baseInfo/index.vue'
import DescriptorTreeVisualization from '@/view/descriptorTreeCreate/Visualization.vue'
import DescriptorTreeFileUpload from '@/view/descriptorTreeCreate/fileUpload/index.vue'
import DescriptorTreeFusionTree from "@/view/descriptorTreeCreate/FusionTree.vue"
import DescriptorTreeRedundancyElimination from "@/view/descriptorTreeCreate/RedundancyElimination.vue"

//导入描述符选取路由

import ImportanceCalculation from "@/view/descriptorSelect/ImportanceCalculation.vue"
import ImportanceVisualization from '@/view/descriptorSelect/ImportanceVisualization.vue'
import ClassificationSelection from '@/view/descriptorSelect/ClassificationSelection.vue'
import MlDataTemplate from '@/view/descriptorSelect/MlDataTemplate.vue'
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
          name:"描述符树新建",
          component:DescriptorTreeFileUpload,
        },
        {
          path: 'descriptorTree/baseInfo',
          name: '查看数据库',
          component: DescriptorTreeInfo,
        },
        {
          path:"descriptorTree/Visualization",
          name:"描述符树修改",
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




        //描述符选取

        {
          path:"descriptorSelect/ImportanceCalculation",
          name:"描述符重要度计算",
          component:ImportanceCalculation,
        },
        {
          path: 'descriptorSelect/ImportanceVisualization',
          name: '描述符重要度可视化',
          component: ImportanceVisualization,
        },
        {
          path: 'descriptorSelect/ClassificationSelection',
          name: '描述符分类选取',
          component: ClassificationSelection,
        },
        {
          path: 'descriptorSelect/MlDataTemplate',
          name: '机器学习样本模板下载',
          component: MlDataTemplate,
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
