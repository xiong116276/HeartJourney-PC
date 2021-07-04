<template>
  <nav class="my-header">
    <div class="logo">心征程后台管理</div>
    <div class="right-container">
      <div class="userinfo">
				<span class="text">{{username}} <i class="el-icon-caret-bottom"></i></span>
				<el-select class="selectBtn" @change="headerOperation" v-model="selectOperation">
					<template v-for="(operation,operationIdx) in operationList">
						<el-option :key="operationIdx" :label="operation.label" :value="operation.value"></el-option>
					</template>
				</el-select>
			</div>
    </div>
    <component v-if="componentShow" :ref="componentName" :is="componentName" :info="componentInfo" @returnBack="returnBack"></component>
  </nav>
</template>

<script>
  import passwordSet from "./Common/passwordSet";
  export default {
    name: "myheader",
    components:{
      passwordSet,
    },
    data(){
      return{
        zoom: 100,
        username:localStorage.getItem('username'),
        usernick:'',
				operationList:[
					{label:"退出登录",value:"退出登录"},
				],
				selectOperation:"",
        componentShow:false,
        componentName:"",
        componentInfo:{},
      }
    },
    mounted() {
      this.init();
    },
    methods:{
      init(){
				this.selectOperation = "";
        //获取路由信息
        // this.routes = this.$router.options.routes;
        // console.log(JSON.parse(JSON.stringify(this.routes)));
      },
			//选择操作
			headerOperation(){
      	let selectOperation = this.selectOperation;
      	console.log(selectOperation);
				switch (selectOperation) {
					case "退出登录":
						this.logOut();
						this.selectOperation = "";
						break;
				}
			},
      returnBack(res){
        let page = res.page;
        if(page === "修改密码"){
          this.logOut();
        }
      },
      logOut(){
        this.$confirm('确定退出登录吗！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          callback: action => {
            if(action === 'confirm'){
              let params = {
                "username": localStorage.getItem('username'),
              };
							this.$router.replace('/');
							this.$store.commit('clearData');
							return
              this.$http.$fetchPost('/loginout',params,'object').then(result => {
                // console.log(result)
                if(result.data.hasOwnProperty('access_token')){
                  localStorage.setItem('token_type', result.data.token_type);
                  localStorage.setItem(`access_token_${this.username}`, result.data.access_token);
                  this.$router.replace('/');
                  this.$store.commit('clearData');
                }else{
                  this.$message({message: result.data.msg, type: 'error'});
                }
              }).catch(error => {
                this.$router.replace('/');
                this.$store.commit('clearData');
                this.$message({message: error.response.data.detail, type: 'error'});
              });
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-header {
    display: flex;
    height: 50px;
    background-color:$defaultColor;
    box-shadow: 0 0 1px 0 $defaultColor;
    color: #fff;
    padding-right: 50px;
		justify-content: space-between;
		align-items: center;
    .logo {
      display: flex;
      text-align: center;
      background-color: $defaultColor;
      align-items: center;
      margin-left: 20px;
      font-size: 20px;
    }

		.userinfo{
			position: relative;
			cursor: pointer;
			min-width: 100px;
			height: 100%;
			.selectBtn{
				position: absolute;
				top:0;
				left: 0;
				right: 0;
				bottom: 0;
				opacity: 0;
				text-align: center;
			}
		}
  }
</style>