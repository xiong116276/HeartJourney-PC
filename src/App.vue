<template>
  <div id="app">
    <template v-if="!($router.currentRoute.name === 'login')">
      <myheader/>
    </template>
    <div class="mycontainer" :class="{mycontainer_Login:$router.currentRoute.name === 'login'}">
			<div v-if="!($router.currentRoute.name === 'login')" class="mycontainer-left">
				<myNav></myNav>
			</div>
			<div class="mycontainer-content">
				<router-view/>
			</div>
		</div>
  </div>
</template>

<script>
import myheader from "./components/myheader";
import myNav from "./components/myNav"
export default {
  name: 'App',
  components: {
    myheader,
		myNav,
  },
  data(){
    return{

    }
  },
  created(){
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store") ) {
      this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))));
      sessionStorage.removeItem('store');
    }
    // console.log(sessionStorage.getItem("store"))
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
      sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    });
  },
  mounted(){

  },
  methods:{

  }
}
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    color: #2c3e50;
    /*margin-top: 60px;*/
		/*min-width: 1000px;*/
		.mycontainer_Login{
			.mycontainer-content{
				background-color: #abe0ff;
			}
		}
  }
</style>
