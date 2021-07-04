import $ from "jquery";
let rootURL = 'http://192.168.0.195:8091';
let baseURL = `${rootURL}/crm/`;

export function getBaseURL () {
  return baseURL
}

export function getRootURL () {
  return rootURL
}

//dateNum为空，获取日期，type =1;Y-MM-DD;type=2;Y-MM-DD HH:mm:ss;type=3,Y年MM月DD日 星期几;
//dateNum格式为Y-MM-DD或者时间戳，返回格式化的日期。
export function getDate(type,dateNum){
  var date;
  if(dateNum === ''){
    return '';
  }
  if(dateNum!=null){
    date = new Date(dateNum);
  }else{
    date = new Date();
  }
  var Y = date.getFullYear();
  var M = date.getMonth()+1 > 9?date.getMonth()+1:'0'+parseInt(date.getMonth()+1);
  var D = date.getDate()>9?date.getDate():'0'+date.getDate();
  var week = ['日','一','二','三','四','五','六'][date.getDay()];
  var H = date.getHours()>9?date.getHours():'0'+date.getHours();
  var m = date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes();
  var s = date.getSeconds()>9?date.getSeconds():'0'+date.getSeconds();
  var time = '';
  if(type == 1){
    time = Y+'-'+M+'-'+D;
  }else if(type == 2){
    time = Y+'-'+M+'-'+D+' '+H+':'+m+':'+s;
  }else if(type == 3){
    time = Y+'-'+M;
  }else if(type == 4){
    time = Y+'-'+M+'-'+D+' '+H+':'+m;
  }else{
    time = Y+' 年 '+M+' 月 '+D+' 日 &nbsp;&nbsp;&nbsp; 星期'+week;
  }
  return time;
}

//解决两个数相加精度丢失问题
export function floatsum(a,b){
  if(a==undefined){return}
  if(b==undefined){return}
  if(a==0){a='0'}
  if(b==0){b='0'}
  let c = 0,d = 0,
    e = a.toString(),
    f = b.toString();
  // console.log(e)
  // console.log(f)
  try {
    c += e.split(".")[1].length;
  } catch (f) {
    // console.log(f)
  }
  try {
    d += f.split(".")[1].length;
  } catch (f) {
    // console.log(f)
  }

  c = c > d?c:d;
  // console.log(c)
  // console.log(e)
  // console.log(f)
  return parseFloat(((e * Math.pow(10, c)) + (f *Math.pow(10, c)))/Math.pow(10, c));
}

/**解决两个数相乘精度丢失问题*/
export function floatMul(a, b) {
  if(a==undefined){return}
  if(b==undefined){return}
  if(a==0){a='0'}
  if(b==0){b='0'}
  var c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) {
    // console.log(f)
  }
  try {
    c += e.split(".")[1].length;
  } catch (f) {
    // console.log(f)
  }
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

//计算一段文本的长度px.
export function getstrLength (str){
  var a = document.createElement('A');
  if(str!==undefined){
    a.innerText = str;
  }else{
    a.innerText = '';
  }

  $(document.body).append(a);
  var w = a.offsetWidth;
  $(a).remove();
  return w;
}
//生成guid
export function getGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

//数组对象去重
export function getOnlyArr (data,checkCode) {
  if(Array.isArray(data)){
    let arrOnly = [];
    if(data.length > 0){
      for(let i = 0;i < data.length;i++){
        let item = data[i];
        let hasAdd = false;
        for(let j = 0;j < arrOnly.length;j++){
          let itemOnly = arrOnly[j];
          let allSame = true;
          for(let m = 0;m<checkCode.length;m++){
            let v = checkCode[m];
            if(item[v] !== itemOnly[v]){
              allSame = false;
              break;
            }
          }
          if(allSame){
            hasAdd = true;
            break;
          }else{
            hasAdd = false;
          }
        }
        if(!hasAdd){
          arrOnly.push(item)
        }
      }
      return arrOnly;
    }else{
      return data;
    }
  }
};

//清空对象
//otherKey=>[{key:'',value:''}]对象中不需要清空的key可是设置默认值。
export function clearObj (obj,otherKey){
  if(!otherKey){otherKey = []}
  for(let k in obj){
    let item = obj[k];
    let hasInItem = [];
    if(otherKey.length > 0){
      hasInItem = otherKey.filter(val => {
        return val['key'] === k;
      });
    }
    if(hasInItem.length === 0){
      if(Array.isArray(item)){
        obj[k] = [];
      }else{
        if(typeof(item) == 'object'){
          clearObj(item,otherKey);
        }else{
          obj[k] = '';
        }
      }
    }else{
      if(hasInItem[0].hasOwnProperty('value')){
        obj[k] = hasInItem[0]['value'];
      }
    }
  }
  return obj;
};

//提交时校验提交对象是否有空值
//obj:要校验的对象；arr:[code:obj的key,label:提示文字];
//showTip显示弹框提示
export function checkEmpty(obj,arr,showTip,index){
  showTip = showTip||true;
  if(!arr){
    arr = Object.keys(obj).map(val=>{
      return {label:val,code:val};
    });
  }
  if(obj&&arr&&Array.isArray(arr)&&typeof obj === 'object'){
    for(let i = 0;i < arr.length;i++){
      let item = arr[i];
      if(obj.hasOwnProperty(item['code'])){
        if(obj[item['code']] === ''||obj[item['code']] === null||obj[item['code']] === undefined){
          if(showTip){
            let tip = `${item['label']}不能为空！`;
            if(index){
              tip = `第${index}行：${item['label']}不能为空！`;
            }
            this.$message({type:"warning",message:tip});
          }
          return false;
        }
      }
    }
  }else{
    this.$message('校验为空参数格式不对！');
    return false;
  }
  return true;
}
//校验提交数组是否有空值
//arr:要校验的数组；checkCode:[code:数组中的对象key,label:提示文字];
//showTip显示弹框提示
export function checkEmptyArr(arr,checkCode,showTip){
  showTip = showTip===undefined&&true;
  if(arr&&Array.isArray(arr)){
    for(let i = 0;i < arr.length;i++){
      if(!this.$checkEmpty(arr[i],checkCode,showTip,i+1)){
        return false;
      }
    }
  }
  return true;
}
//校验字符串是否为JSON字符串
export function isJSONStr(str) {
  if (typeof str == 'string') {
    try {
      var obj=JSON.parse(str);
      if(typeof obj == 'object' && obj ){
        return true;
      }else{
        return false;
      }
    } catch(e) {
      console.log('error：'+str+'!!!'+e);
      return false;
    }
  }

  return false;
}

//数字转中文
export function numToChinese(num) {
  let numArr = ["零","一","二","三","四","五","六","七","八","九"];
  let numLimit = ["亿","万",""];//设置数字上限
  let numUnit = ["千","百","十",""];
  //num四位数是一个阶段对应 numLimit 每个阶段对应一个 numUnit，每个数字对应numArr。
  num = num.toString();
  num = num.split('');
  while (num.length < numLimit.length*4){
    num.unshift('');
  }
  // console.log(num)
  let numLength = num.length;
  let str = "";
  let limit = Math.ceil(numLength/4);
  // console.log(limit)
  for(let i = 1;i <= limit;i++){
    let start = (i -1) * 4;
    let end = i * 4;
    let limitNum = num.slice(start,end);
    // console.log(limitNum)
    for(let j = 0;j <limitNum.length ;j++){
      if(limitNum[j]!==''){
        let char = numArr[limitNum[j]];
        let unit = numUnit[j];
        if(limitNum[j] == 0){
          unit = '';
        }
        str += char+unit;
      }
    }
    let hasValue = limitNum.filter(val=>{
      return val!=='';
    });
    str = str.replace(/(零{2,})/,'零');//中间超过两个零替换为一个零
    if(str!=='零'){
      str = str.replace(/(零*)$/,'');//结尾去掉零
    }
    if(hasValue.length > 0){
      str+=numLimit[i-1];
    }
  }

  str = str.replace(/^一十/,'十');
  return str;
}
