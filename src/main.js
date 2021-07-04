import Vue from 'vue'
import App from './App.vue'

import store from './store'
import router from './router'
import $ from 'jquery'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);

//自定义指令
import "./assets/js/directive"

//引入本地css
import './assets/css/mycommon.css'

Vue.config.productionTip = false;

//开发环境：development//生产环境：production
let environment = "开发环境";
if(process.env.NODE_ENV === 'production'){
  environment = "生产环境";
}
Vue.prototype.$environment = environment;

//axios 请求
import http from './assets/js/http'
// fetchPost,fetchPut,fetchGet,fetchDelete,fetchAxios,
Vue.prototype.$http = http;

import {
  getBaseURL,getRootURL,getDate,isJSONStr,numToChinese,
  floatsum,floatMul,getstrLength,getGuid,getOnlyArr,clearObj,checkEmpty,checkEmptyArr
} from '../public/js/common.js'

Vue.prototype.$baseURL = getBaseURL();
Vue.prototype.$rootURL = getRootURL();
Vue.prototype.$getDate = getDate;
Vue.prototype.$floatsum = floatsum;
Vue.prototype.$floatMul = floatMul;
Vue.prototype.$getstrLength = getstrLength;
Vue.prototype.$getGuid = getGuid;
Vue.prototype.$clearObj = clearObj;
Vue.prototype.$checkEmpty = checkEmpty;
Vue.prototype.$checkEmptyArr = checkEmptyArr;
Vue.prototype.$getOnlyArr = getOnlyArr;
Vue.prototype.$isJSONStr = isJSONStr;
Vue.prototype.$numToChinese = numToChinese;
// 拖拽元素
Vue.prototype.$drag = function (_element,_panel,_stage) {
  //_element 当前元素，_panel移动的面板,_stage移动区域
  $(_element).on("mouseenter",function () {
    $(this).css({"cursor":"move"});
  });
  $(_element).on("mousedown",function (event) {
    event = event || window.event;
    var panel= _element===_panel?this:$(this).parents(_panel)[0];
    // 计算面板与边缘距离
    var reX=event.clientX-panel.offsetLeft;
    var reY=event.clientY-panel.offsetTop;

    let maxX = $(_stage).width() - $(panel).width();
    let maxY = $(_stage).height() - $(panel).height();
    document.onmousemove=function(event){
      $(panel).css({"right":'auto'});
      event = event || window.event;
      // 计算鼠标移动距离
      var x = event.clientX-reX;
      var y = event.clientY-reY;
      // console.log(x)
      // console.log(y)
      //里面的元素要添加边界
      // 水平边界
      if(x <= 0){
        x = 0
      }else{
        if(x >= maxX){
          x = maxX;
        }
      }
      // 垂直边界
      if(y <= 0){
        y=0
      }else{
        if(y >= maxY){
          y = maxY;
        }
      }
      panel.style.left=x +'px';
      panel.style.top=y +'px';
    };
  });
  $(_element).on("mouseup",function () {
    document.onmousemove=null;
  });
};
//获取table 高
Vue.prototype.$getTableHeight = function (size,elemnt) {
  let h = size?size:75;
  let ele = elemnt?elemnt:'table-container';
  // setTimeout()
  return $('.'+ele)[0].clientHeight - h;
};
//获取table 宽
Vue.prototype.$getTableWidth = function (size,elemnt) {
	let w = size?size:0;
	let ele = elemnt?elemnt:'table-container';
	// setTimeout()
	return $('.'+ele)[0].clientWidth - w;
};
//计算表格内容宽度
Vue.prototype.$getTableCellLength = function (obj) {
  var W = obj.W;//容器宽度
  var otherWidth = obj.hasOwnProperty('W2')?obj.W2:0;//循环之外的列宽。
  var head = obj.head;//表头数据
  var currentData = obj.data;//表体数据

  var lengthArr = [];
  var arrhead = {};
  var arrtotal = {};

  for(var i = 0;i <head.length;i++){
    var text = head[i]['label'];
    let prop = head[i]['prop'];
    arrhead[prop] = this.$getstrLength(text)
  }
  var keys = Object.keys(arrhead);
  // console.log(arrhead)
  lengthArr.push(arrhead);//计算表头长度放入数组
  for(var i = 0;i < currentData.length;i++){
    var obj={};
    for(var k in currentData[i]){
      var text = currentData[i][k];
      if(keys.indexOf(k) > -1){
        obj[k] = this.$getstrLength(text)
      }
    }
    lengthArr.push(obj);//计算表体长度放入数组内
  }
  for(var i = 0;i < keys.length;i++){
    arrtotal[keys[i]] = [];
    for(var j = 0;j < lengthArr.length;j++){
      for(var k in lengthArr[j]){
        if(k === keys[i]){
          arrtotal[keys[i]].push(lengthArr[j][k])
        }
      }
    }
  }

  for(var i in arrtotal){
    arrtotal[i] = Math.max.apply(Math,arrtotal[i]);
  }

  if(W!==undefined){//根据容器宽度补全多余部分。
    function sum(obj) {
      var s = 0;
      for (var i in obj) {
        s += parseInt(obj[i]);
      }
      return s;
    }
    var w = sum(arrtotal);
    var len = head.length;
    var aver = 40;
    if((W - otherWidth - w ) > 0){
      aver = Math.ceil((W - otherWidth - w) / len);
    }
    aver = aver < 40 ? 40 : aver;
    for(var i in arrtotal){
      arrtotal[i] = arrtotal[i] + aver;
    }
  }
  // console.log(W)
  // console.log(eval(Object.values(arrtotal).join('+')))
  return arrtotal;
};
//elment 日期插件限制不能选未来时间
Vue.prototype.$set_PickerOption = function (date) {
  // disabledDate 为true表示不可选,false表示可选
  if(date!==undefined){
    date = new Date(date).getTime()-24*60*60*1000;
  }else{
    date = 0;
  }
  let obj = {};
  obj.disabledDate = function (time) {
    var num = time.getTime();
    if(num > Date.now() - 8.64e6 || num < date){
      return true;
    }
  };
  return obj;
};
//elment 日期插件限制不能选过去时间
Vue.prototype.$set_PickerOption1 = function (date) {
  // disabledDate 为true表示不可选,false表示可选
  let obj = {};
  let date1 = new Date().getTime()-24*60*60*1000;
  if(date!==undefined){
    date = new Date(date).getTime();
  }else{
    date = '9999-12-31'
  }
  // console.log(date)
  obj.disabledDate = function (time) {
    var num = time.getTime();
    if(num < date1 || num > date){
      return true;
    }
  };
  return obj;
};
//elment 日期插件限制只能选择区间内时间
Vue.prototype.$set_PickerOption2 = function (date1,date2) {
  // disabledDate 为true表示不可选,false表示可选
  let obj = {};
  date1 = date1?new Date(date1).getTime()-24*60*60*1000:new Date().getTime()-24*60*60*1000;
  date2 = date2?new Date(date2).getTime():new Date('9999-12-31').getTime();
  // console.log(date)
  obj.disabledDate = function (time) {
    var num = time.getTime();
    if(num < date1 || num > date2 ){
      return true;
    }
  };
  return obj;
};

// drag('.el-dialog__header','.el-dialog');
//双击查看上传图片
Vue.prototype.$showBigImg = function (img, idx,list) {
  var index = idx;
  var html = `<div class="big-img-container">
              <div class="mask"></div>
              <span class="icons icon-close close-big-img">×</span>
              <div class="big-img-content">
                <span class="btn btn-prev">&lt;</span>
                <div id="showImg" class="big-img"><div id="bigImg"><div class="img-mask"></div><img src="${img}" alt=""></div></div>
                <span class="btn btn-next">&gt;</span>
              </div>
            </div>`;
  if($('.big-img-container').length === 0){
    $(document.body).append(html);
  }
  let imgList = list?list:this.imgList;
  //关闭弹框
  $('.close-big-img').on('click',()=>{
    $('.big-img-container').remove();
  });
  // console.log(imgList)
  if(imgList){
    if(imgList.length > 1){
      $('.big-img-content .btn-prev').on('click',()=>{
        if(index > 0){
          var src = imgList[index-1];
          index--;
          if(typeof(src) == 'object'){
            if(src.url.indexOf('viewsource/pc/')>-1){
              $('#showImg img').attr('src',src.url);
            }else{
              $('#showImg img').attr('src',`${this.$baseURL}viewsource/pc/${src.url}`);
            }
          }else{
            $('#showImg img').attr('src',src);
          }

          $('#bigImg').css({'transform':'scale(1)'})
        }else{
          this.$message('这已经是第一张！')
        }
      });
      $('.big-img-content .btn-next').on('click',()=>{
        if(index < imgList.length-1){
          var src = imgList[index+1];
          index++;
          if(typeof(src) == 'object'){
            if(src.url.indexOf('viewsource/pc/')>-1){
              $('#showImg img').attr('src',src.url);
            }else{
              $('#showImg img').attr('src',`${this.$baseURL}viewsource/pc/${src.url}`);
            }
          }else{
            $('#showImg img').attr('src',src);
          }
          $('#bigImg').css({'transform':'scale(1)'})
        }else{
          this.$message('这已经是最后一张！')
        }
      });
    }
  }

  _Vue.$drag('#bigImg','#bigImg',"#showImg");
  _Vue.$showBigImgMousewheel('bigImg');
};
//图片随鼠标滚轮事件
Vue.prototype.$showBigImgMousewheel = function(id){
  var myimage =document.getElementById(id);
  var num = 1;
  if (myimage.addEventListener) {
    // IE9, Chrome, Safari, Opera
    myimage.addEventListener("mousewheel", MouseWheelHandler, false);
    // Firefox
    myimage.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
  }
  function MouseWheelHandler() {
    var e = window.event||e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    if(delta > 0){
      num = num*2;
    }else{
      num = num/2;
    }
    $(myimage).css({
      'transform':'scale('+num+')',
      'transform-origin':'0 0'
    });
    var w = $(myimage).width() *num;
    var h = $(myimage).height() *num;
    if(w >= $('#showImg').width()){
      $(myimage).css({'left':0});
    }
    if(h >= $('#showImg').height()){
      $(myimage).css({'top':0});
    }
  }
};

//输入数字校验
//type=>int校验整数类型，默认float类型。
//otherValue=>特定值校验
Vue.prototype.$checkInput = function(input,type,otherValue){
  let reg,tips;
  type = type||'float';
  otherValue = otherValue||[];
  if(type === "int"){
    reg = /^\d+$/;
    tips = "请输入整数！"
  }else{
    reg = /^(-)?\d+(\.\d+)?$/;
    tips = "请输入数字！"
  }
  let hasIn = false;
  for(let i = 0;i < otherValue.length;i++){
    if(otherValue[i] == input){
      hasIn = true;
      if(input == 0){
        tips = "请输入正整数！"
      }
      break;
    }
  }
  if(!reg.test(input)||hasIn){
    this.$message(tips);
    return false;
  }
  return true;
};

//保留小数位数。
Vue.prototype.$toFixed = function(str,num){
  let text = 0;
  num = num||2;
  if(str&&num){
    str = Number(str);
    text = Math.round(str*Math.pow(10,num))/Math.pow(10,num);
  }
  return text;
};
//显示加载loading
Vue.prototype.$myloading = {
  show:(text)=>{
    if ($('.loading').length === 0) {
      $(document.body).append(`<div class="myloading"> <span class="loading-text">${text}</span></div>`);
    }
  },
  remove:()=>{
    $('.myloading').remove();
  }
};

//获取表格总条数
Vue.prototype.$getCount = function (obj) {
  let qrytype = obj.qrytype;
  let argc = obj.argc||{};
  let qryfunc = obj.qryfunc||'get_count';
  if(!qrytype)return ;
  return new Promise((resolve, reject) => {
    let params =  {'qrytype': qrytype, 'qryfunc': qryfunc, 'argc': JSON.stringify(argc)};
    this.$http.$fetchGet('/get',params).then(result => {
      // console.log(result);
      if(result.data.code == 0){
        if(argc.hasOwnProperty('fileds')){
          if(Array.isArray(argc.fileds)&&argc.fileds.length > 0){
            if(argc.fileds[0] ){
              resolve(result.data.data);
              return
            }
          }
        }
        resolve(result.data.data);
      }else{
        this.$message({message:result.data.msg, type: 'error'});
      }
    }).catch(error => {
      this.$message({message: error.response.data.detail, type: 'error'});
    })
  })
};

//上传图片函数
Vue.prototype.$uploadPicture = function(files){
  return new Promise((resolve, reject) => {
    if(Array.isArray(files)&&files.length > 0){
      let formData = new FormData();
      for(let i = 0;i < files.length;i++){
        formData.append('files',files[i]);
      }
      this.$http.$fetchPost('add_images',formData).then(result => {
        resolve(result.data);
      }).catch(err=>{
        this.forbidden = false;
      })
    }else{
      resolve([]);
    }
  });
};


let _Vue = new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app');

export default _Vue