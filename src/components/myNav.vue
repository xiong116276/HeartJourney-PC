<template>
	<div class="myNav">
		<el-menu :default-active="activeNav.label" class="my-el-menu-vertical">
			<template v-for="(nav,navIdx) in navList">
				<template v-if="nav.hasOwnProperty('children')">
					<el-submenu :key="navIdx" :index="nav.label">
						<template slot="title">
							<span>{{nav.label}}</span>
						</template>
						<el-menu-item-group>
							<template v-for="(level2,level2Idx) in nav.children">
								<el-menu-item @click="navSelect(level2)" :key="level2Idx" :index="level2.label">{{level2.label}}</el-menu-item>
							</template>
						</el-menu-item-group>
					</el-submenu>
				</template>
				<template v-else>
					<el-menu-item :key="navIdx" @click="navSelect(nav)" :index="nav.label">{{nav.label}}</el-menu-item>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script>
	export default {
		name: "myNav",
		data() {
			return {
				navList:[
					{label:"项目管理",path:"Project"},
					{
						label:"病例管理",
						path:"Case",
						children:[
							{label:"病例列表",path:"Case_List"},
							{label:"点赞规则",path:"Case_PraiseRule"},
							{label:"批次管理",path:"Case_Batch"},
						]
					},
					{
						label:"会议管理",path:"Meeting",
						children:[
							{label:"会议列表",path:"Meeting_List"},
							{label:"专题管理",path:"Meeting_Topic"},
						]
					},
				],
				activeNav:"",
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				// console.log(JSON.parse(JSON.stringify(this.$store.state)))
				if(this.$store.state.activeNav&&Object.keys(this.$store.state.activeNav).length > 0){
					this.activeNav = this.$store.state.activeNav;
				}else{
					this.activeNav = this.navList[0];
				}
				console.log(this.navList)
				this.navSelect(this.activeNav);
			},
			navSelect(res){
				// console.log(res)
				let path = res['path'];
				this.$store.commit('setData',{activeNav:res});
				if(path){
					this.$router.push({name:path});
				}
			},
		}
	}
</script>

<style lang="scss">
	.myNav{
		.my-el-menu-vertical{
			background-color: $bgGray;
			.el-menu-item-group{
				background-color: $bgGray;
			}
			.el-submenu{
				&.is-active,&:hover{
					.el-submenu__title{
						background-color: $activeColor;
						color: #fff;
						.el-submenu__icon-arrow{
							color: inherit;
						}
					}
					.el-menu-item{
						&.is-active,&:hover{
							color: $activeColor;
							background-color: $bgGray;
							position: relative;
							&:before{
								content:"";
								position: absolute;
								width: 2px;
								height: 15px;
								background-color: $activeColor;
								top: 0;
								left: 50px;
								bottom: 0;
								margin: auto;
							}
						}
					}
				}
				.el-submenu__title{
					padding: 0 0 0 50px !important;
				}
				.el-menu-item{
					padding-left: 60px!important;
				}
			}
			.el-menu-item{
				padding: 0 0 0 50px !important;
				&.is-active,&:hover{
					background-color: $activeColor;
					color: #fff;
				}
			}
		}
	}
</style>