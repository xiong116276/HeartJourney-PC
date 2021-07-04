<template>
	<div class="login-container">
		<div class="hiddenShow">
			<input type="text">
			<input type="password">
		</div>
		<!--<div class="left-img"></div>-->
		<div class="login-panel">
			<div class="login-right">
				<div class="login-right-title">心征程管理后台</div>
				<div class="login-body">
					<div class="form-group">
						<span class="icons el-icon-user"></span>
						<input type="text" class="form-control" v-model="username" placeholder="输入你的账号">
					</div>
					<div class="form-group">
						<span class="icons el-icon-unlock"></span>
						<input type="password" class="form-control" v-model="password" placeholder="请输入密码">
					</div>
					<div class="btn btn-info btn-block btn-login" @click="login">登录</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import md5 from 'js-md5'
	import axios from "axios";

	export default {
		name: 'login',
		data() {
			return {
				username: '',
				password: '',
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				//退出登录情况缓存
				sessionStorage.clear();
				this.$store.commit('clearData');
				if (localStorage.getItem('username')) {
					this.username = localStorage.getItem('username');
				}
			},
			login: function () {
				if (!this.username || !this.password) {
					this.$message({message: '请输入用户名和密码', type: 'warning'});
				} else {
					this.jupm();
					return;
					let formData = new FormData();
					let params = {"grant_type": 'password', "username": this.username, "password": md5(this.password)};//
					for (let k in params) {
						formData.append(k, params[k]);
					}
					axios.post(`/login/pc`, formData).then(response => {
						this.handle_login_result(response)
					}).catch((error) => {
						this.$message({message: error.response.data.detail, type: 'error'});
					});
				}
			},
			handle_login_result: function (jsonObj) {
				//登录成功后清空密码
				let data = jsonObj.data;
				this.password = '';
				if (typeof(data) == 'object') {
					if (data.hasOwnProperty('access_token')) {
						this.jupm(jsonObj);
					}
				}
			},
			jupm(jsonObj) {
				this.password = '';
				localStorage.setItem('username', this.username);
				this.$router.replace({name: 'Project'});
			},
		},
	}
</script>

<style lang="scss">
	.login-container {
		position: fixed;
		width: 100%;
		/*height: 100%;*/
		padding-top: 56.5%;
		top: 0;
		left: 0;
		/*bottom: 0;*/
		min-width: 1000px;
		background: #abe0ff url("../assets/images/login_bg.png") no-repeat center; //2408/1557 = 1.55
		background-size: 100%;
		.left-img {
			position: absolute;
			width: 35%;
			left: 10%;
			top: 50%;
			height: 482px;
			transform: translate(0, -50%);
			background: $defaultColor; // url("../assets/images/img-background-2.png") no-repeat center
			background-size: contain;
		}
		.login-panel {
			position: absolute;
			width: 25%;
			max-width: 480px;
			min-width: 300px;
			height: 50%;
			min-height: 360px;
			background-color: #fff;
			border-radius: 10px;
			top: 20%;
			right: 15%;

		.login-right {
			.login-right-title {
				height: 35px;
				text-align: center;
				vertical-align: text-top !important;
				margin: 10% 0 15%;
				font-size: 36px;
				font-family: PangMenZhengDao;
				font-weight: 400;
				color: #555555;
			}
			.login-body {
				width: 100%;
				margin: 0 auto;
			}
			.form-group {
				position: relative;
				margin: 0 auto 10%;
				width: 80%;
				height: 40px;
				.icons{
					position: absolute;
					top:0;
					left: 0;
					display: flex;
					justify-content: center;
					align-items: center;
					width: 40px;
					height: 40px;
					font-size: 20px;
				}
				.form-control {
					width: 100%;
					height: 100%;
					padding-left: 40px;
					border-radius: 5px;
					border: 1px solid #ddd;
					font-size: 16px;
					&:focus{
						border-color: $defaultColor;
					}
				}
			}
			.btn-login {
				width: 80%;
				height: 40px;
				line-height: 40px;
				text-align: center;
				border-radius: 5px;
				background-color: $defaultColor;
				padding: 0;
				margin: 20% auto 0;
				cursor: pointer;
				color: #fff;
			}
		}
	}
}
</style>
