import Vue from 'vue'
import $ from "jquery";
import _Vue from "../../main";
//el-table滚动加载
Vue.directive('scroll',{
  update: function (el,binding,vnode,oldVnode) {
    let scrollFunc_name = binding.expression;
    let scrollFunc = vnode.context[scrollFunc_name];//触发请求列表方法名称
    let scrollContentElement = vnode.context['scrollContentElement'];//
    let scrollBottom = vnode.context['scrollBottom']||10;
    let scrollContent = $(el).find('.'+scrollContentElement)[0];
    $(scrollContent).on('scroll',async ()=>{
      let top = scrollContent.scrollTop;//已经滚动的距离
      let scrollHeight = scrollContent.scrollHeight;//滚动内容的高度
      let clientHeight = scrollContent.clientHeight;//滚动区域的高度
      let bottom = scrollHeight - clientHeight - top;//距底部的距离
      // console.log(bottom)
      // console.log(scrollBottom)
      if(bottom < scrollBottom){
        await scrollFunc();
      }
    });
  },
});
//el-dialog弹框拖动，要有my_dialog样式class
Vue.directive('drag',function (el,binding,vnode,oldVnode) {
  let mouseEvent = $(el).find('.el-dialog__header');//鼠标拖动元素
  let panel = $(el).find('.el-dialog');//拖动面板
  let stage = el;//拖动区域
  _Vue.$drag(mouseEvent,panel,stage);
});