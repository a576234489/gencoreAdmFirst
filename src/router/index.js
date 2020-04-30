import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const Login = ()=>import('views/login')

import Layout from 'views/layout/Layout'

const HomePage = ()=>import('views/homePage/HomePage')

const PlateformAccount = ()=>import('views/plateformAccount/PlateformAccount');
const Role = ()=>import('views/role/Role')
const ResourceCategory = ()=>import('views/resourceCategory/ResourceCategory')
const Resource = ()=>import('views/resource/Resource')
const Menu = ()=>import('views/menu/Menu')

const UserLoginLog = ()=>import('views/userLoginLog/UserLoginLog')
const UserOperationLog = ()=>import('views/userOperationLog/UserOperationLog')

const News = ()=>import('views/news/News')
const NewsType = ()=>import('views/newsType/NewsType')
const EnglishNews = ()=>import('views/news/EnglishNews')
const EnglishNewsType = ()=>import('views/newsType/EnglishNewsType')

const Activity = ()=>import('views/activity/Activity')
const ActivityType = ()=>import('views/activityType/ActivityType')
const EnglishActivity = ()=>import('views/activity/EnglishActivity')
const EnglishActivityType = ()=>import('views/activityType/EnglishActivityType')

const AboutUs = ()=>import('views/aboutUs/AboutUs')
const EnglishAboutUs = ()=>import('views/aboutUs/EnglishAboutUs')
const NetWorkBanner = ()=>import('views/netWorkBanner/NetWorkBanner')
const SmallProgramBanner = ()=>import('views/smallProgramBanner/SmallProgramBanner')

const EnterpriseApplyFor = ()=>import('views/enterpriseApplyFor/EnterpriseApplyFor')

const customUser = ()=>import('views/customUser/CustomUser')
const ExpertUser = ()=>import('views/expertUser/ExpertUser')

const FindProject = ()=>import('views/findProject/FindProject')
const EnglishFindProject = ()=>import('views/findProject/EnglishFindProject')

const Ask = ()=>import('views/ask/Ask')

const FindSpace = ()=>import('views/findSpace/FindSpace')

const routes = [
  {
    path:'/login',
    component:Login,
    hidden:true
  },
  {
    path:'',
    component:Layout,
    redirect:'/homePage',
    children:[
      {
        path:'homePage',
        name:'/',
        component:HomePage,
        meta:{title:'首页',icon:'dashboard',affix:true},
      }
    ]
  },
]

export const constantRouterMap = [
  {
    path:'/login',
    component:Login,
    hidden:true
  },
  {
    path:'',
    component:Layout,
    redirect:'/homePage',
    children:[
      {
        path:'homePage',
        name:'/',
        component:HomePage,
        meta:{title:'首页',icon:'dashboard',affix:true},
      }
    ]
  },
]

export const asyncRouterMap = [
  {
    path:'/systemBasic',
    component:Layout,
    meta:{title:'系统基础管理',icon:'home'},
    name:'systemBasic',
    children:[
      {
        path:'plateformAccount',
        component:PlateformAccount,
        name:'plateformAccount',
        meta:{title:'平台账号管理',icon:'gen'},
      },
      {
        path:'role',
        component:Role,
        name:'role',
        meta:{title:'角色管理',icon:'gen'},
      },
      {
        path:'resourceCategory',
        component:ResourceCategory,
        name:'resourceCategory',
        meta:{title:'资源分类管理',icon:'gen'},
      },
      {
        path:'resource',
        component:Resource,
        name:'resource',
        meta:{title:'资源管理',icon:'gen'},
      },
      {
        path: 'menu',
        name: 'menu',
        component:Menu,
        meta: {title: '菜单列表', icon: 'gen'}
      },
    ]
  },
  {
    path: '/news',
    component: Layout,
    redirect: '/news/newsManage',
    name: 'news',
    meta:{title:'新闻管理',icon:'new'},
    children:[
      {
        path: 'newsManage',
        component:News,
        name: 'newsManage',
        meta:{title:'中文新闻管理',icon:'gen'}
      },
      {
        path: 'newsTypeManage',
        component:NewsType,
        name: 'newsTypeManage',
        meta:{title:'中文新闻分类管理',icon:'gen'}
      },
      {
        path: 'englishNewsManage',
        component:EnglishNews,
        name: 'englishNewsManage',
        meta:{title:'英文新闻管理',icon:'gen'}
      },
      {
        path: 'englishNewsTypeManage',
        component:EnglishNewsType,
        name: 'englishNewsTypeManage',
        meta:{title:'英文新闻分类管理',icon:'gen'}
      },
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/activityManage',
    name: 'activity',
    meta:{title:'活动管理',icon:'activity'},
    children:[
      {
        path: 'activityManage',
        component:Activity,
        name: 'activityManage',
        meta:{title:'中文活动管理',icon:'gen'}
      },
      {
        path: 'activityTypeManage',
        component:ActivityType,
        name: 'activityTypeManage',
        meta:{title:'中文活动分类管理',icon:'gen'}
      },
      {
        path: 'englishActivityManage',
        component:EnglishActivity,
        name: 'englishActivityManage',
        meta:{title:'英文活动管理',icon:'gen'}
      },
      {
        path: 'englishActivityTypeManage',
        component:EnglishActivityType,
        name: 'englishActivityTypeManage',
        meta:{title:'英文活动分类管理',icon:'gen'}
      },
    ]
  },
  {
    path: '/aboutCx',
    component: Layout,
    redirect: '/activity/aboutUs',
    name: 'aboutCx',
    meta:{title:'关于创芯',icon:'about'},
    children:[
      {
        path: 'aboutUs',
        component:AboutUs,
        name: 'aboutUs',
        meta:{title:'中文关于我们',icon:'gen'}
      },
      {
        path: 'englishAboutUs',
        component:EnglishAboutUs,
        name: 'englishAboutUs',
        meta:{title:'英文关于我们',icon:'gen'}
      },
      {
        path: 'netWorkBanner',
        component:NetWorkBanner,
        name: 'netWorkBanner',
        meta:{title:'网站banner图管理',icon:'gen'}
      },
      {
        path: 'smallProgramBanner',
        component:SmallProgramBanner,
        name: 'smallProgramBanner',
        meta:{title:'小程序banner图管理',icon:'gen'}
      }
    ]
  },
  {
    path: '/enterpriseApplyFor',
    component: Layout,
    redirect: '/enterpriseApplyFor/enterpriseApplyForManager',
    name: 'enterpriseApplyFor',
    meta:{title:'入驻',icon:'ruzhu'},
    children:[
      {
        path: 'enterpriseApplyForManager',
        component:EnterpriseApplyFor,
        name: 'enterpriseApplyForManager',
        meta:{title:'入驻管理',icon:'ruzhu'}
      },
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/customUser',
    name: 'user',
    meta:{title:'用户管理',icon:'user2'},
    children:[
      {
        path: 'customUser',
        component:customUser,
        name: 'customUser',
        meta:{title:'客户列表',icon:'gen'}
      },
      {
        path: 'expertUser',
        component:ExpertUser,
        name: 'expertUser',
        meta:{title:'专家列表',icon:'gen'}
      },
    ]
  },
  {
    path: '/findProject',
    component: Layout,
    redirect: '/findProject/findProjectManage',
    name: 'findProject',
    meta:{title:'找项目管理',icon:'project'},
    children:[
      {
        path: 'findProjectManage',
        component:FindProject,
        name: 'findProjectManage',
        meta:{title:'中文找项目管理',icon:'gen'}
      },
      {
        path: 'englishFindProjectManage',
        component:EnglishFindProject,
        name: 'englishFindProjectManage',
        meta:{title:'英文找项目管理',icon:'gen'}
      },
    ]
  },
  {
    path: '/ask',
    component: Layout,
    redirect: '/ask/askManage',
    name: 'ask',
    meta:{title:'专家问答',icon:'expert'},
    children:[
      {
        path: 'askManage',
        component:Ask,
        name: 'askManage',
        meta:{title:'专家问答管理',icon:'expert'}
      }
    ]
  },
  {
    path: '/findSpace',
    component: Layout,
    redirect: '/findSpace/findSpaceManage',
    name: 'findSpace',
    meta:{title:'寻空间',icon:'findspace'},
    children:[
      {
        path: 'findSpaceManage',
        component:FindSpace,
        name: 'findSpaceManage',
        meta:{title:'寻空间管理',icon:'findspace'}
      }
    ]
  }
]

const router = new Router({
  routes,
  mode:'history'
})

export default router
