import Vue from 'vue';
import Router from 'vue-router';

//登陆
import login from './components/login';
//项目管理
import Project from './components/Project/Project'

//病例管理
import Case from './components/Case/Case';
//病例列表
import Case_List from './components/Case/Case_List';
//点赞规则
import Case_PraiseRule from './components/Case/Case_PraiseRule';
//批次管理
import Case_Batch from './components/Case/Case_Batch';

//会议管理
import Meeting from './components/Meeting/Meeting'
//会议列表
import Meeting_List from './components/Meeting/Meeting_List'
//专题管理
import Meeting_Topic from './components/Meeting/Meeting_Topic'


Vue.use(Router);
const VueRouterPush = Router.prototype.push;
Router.prototype.push = function (to) {
  return VueRouterPush.call(this,to).catch(err => err)
};
export default new Router({
  // mode: 'history',  //去掉url中的#
  routes: [
    { path: '/', name: 'login',label: '登录', component: login },
    //项目管理
    { path: '/Project', name: 'Project',label: '项目管理',parent:'项目管理', component: Project  },
    //病例管理
    {
      path:'/Case',name:'Case',label:'病例管理',parent:'病例管理',component:Case,
      children:[
        { path: '/Case_List', name: 'Case_List',label: '病例列表',parent:'病例管理', component: Case_List,info:{} },
        { path: '/Case_PraiseRule', name: 'Case_PraiseRule',label: '点赞规则',parent:'病例管理', component: Case_PraiseRule,info:{} },
        { path: '/Case_Batch', name: 'Case_Batch',label: '批次管理',parent:'病例管理', component: Case_Batch,info:{} },
      ]
    },
    //会议管理
    {
      path:'/Meeting',name:'Meeting',label:'会议管理',parent:'会议管理',component:Meeting,
      children:[
        { path: '/Meeting_List', name: 'Meeting_List',label: '会议列表',parent:'会议管理', component: Meeting_List,info:{} },
        { path: '/Meeting_Topic', name: 'Meeting_Topic',label: '专题管理',parent:'会议管理', component: Meeting_Topic,info:{} },
      ]
    },
  ]
})