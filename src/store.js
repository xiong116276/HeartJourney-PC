import vue from 'vue'
import vuex from 'vuex'

vue.use(vuex);

//新增公共变量

//获取：this.$store.state.hasERP;
//修改: this.$store.commit('setData',{userInfo:1})

export default new vuex.Store({
  state: {
		activeNav: '',//导航位置
  },
  mutations: {
    setData(state, obj) {
      for (let k in state) {
        if (obj.hasOwnProperty(k)) {
          state[k] = obj[k];
        }
      }
      // console.log(state)
    },
    clearData(state) {
      for (let k in state) {
        if(Array.isArray(state[k])){
          state[k] = [];
        }else{
          if(typeof(state[k]) == 'object'){
            state[k] = {};
          }else if(typeof(state[k]) == 'boolean'){
            state[k] = false;
          }else{
            state[k] = '';
          }
        }
      }
    },
  }
});