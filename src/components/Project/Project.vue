<template>
	<div class="Project content-main">
		<div class="top-bar">
			<div class="left-container">
				<span class="title">{{page}}</span>
			</div>
		</div>
		<div class="table-container reset_scrollbar_v">
			<el-table :class="{hiddenShow:!showTable}" border :height="tableHeight" :data="tableData" fit>
				<template v-for="(head,index) in headData">
					<el-table-column v-if="head.label === '项目管理内容'" :align="head.align" :key="index" :prop="head.prop" :label="head.label" :width="`${head.width * tableWidth}`">
						<template slot-scope="scope">
							<div class="cell-content">
								<span>{{scope.row["项目背景"]}}</span>
								<span>{{scope.row["组织机构"]}}</span>
								<span>{{scope.row["病例分享简介"]}}</span>
								<span>{{scope.row["参与规则"]}}</span>
								<span>（{{scope.row["病例参加指南"]}}，{{scope.row["提交要求"]}}，{{scope.row["评选规则"]}}，{{scope.row["征文投稿"]}}）</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column v-else-if="head.label === '图片展示'" :align="head.align"  :key="index" :prop="head.prop" :label="head.label" :width="`${head.width * tableWidth}`">
						<template slot-scope="scope">
							<div class="img-content" :style="{'height':(tableHeight - 70)+'px'}">
								<template v-if="scope.row[head.prop]">
									<img :src="scope.row[head.prop]" alt="">
								</template>
							</div>
						</template>
					</el-table-column>
					<el-table-column v-else-if="head.label === '操作'" :align="head.align"  :key="index" :prop="head.prop" :label="head.label" :width="`${head.width * tableWidth}`">
						<template slot-scope="scope">
							<span @click="editProject(scope.row)" class="mybtn">编辑</span>
						</template>
					</el-table-column>
					<el-table-column v-else :align="head.align" :key="index" :prop="head.prop" :label="head.label"></el-table-column>
				</template>
			</el-table>
			<!--<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 15, 20]" :page-size="interPage" layout="total, sizes, prev, pager, next, jumper" background :total="dataSize"></el-pagination>-->
		</div>

		<component v-if="componentShow" :is="componentName" :ref="componentName" :info="componentInfo" @returnBack="returnBack"></component>
	</div>
</template>

<script>
	import ProjectEdit from "./ProjectEdit"
	export default {
		name: "Project",
		components:{
			ProjectEdit,
		},
		data() {
			return {
				page:"项目管理",
				tableWidth:1200,
				tableHeight:700,
				headData:[
					{prop:'项目管理内容',label:'项目管理内容',width:"0.25",align:'center'},
					{prop:'图片展示',label:'图片展示',width:"0.5",align:'center'},
					{prop:'操作',label:'操作',width:"0.25",align:'center'},
				],
				tableData:[],
				componentShow:false,
				componentName:"ProjectEdit",
				componentInfo:{},
				showTable:false,//控制表格宽度设置完整后再显示（解决打开界面表格抖动问题）
			}
		},
		beforeDestroy() {
			window.removeEventListener("resize", this.getTableHeight);
		},
		mounted() {
			window.addEventListener("resize", this.getTableHeight);
			this.init();
		},
		methods: {
			//初始化函数
			init() {
				this.showTable = false;
				this.renderTable();
			},
			//获取表格数据
			getPageData(){
				return new Promise((resolve, reject) => {
					let params = {

					};
					this.$http.$fetchGet("/get",params).then(res=>{
						console.log(JSON.parse(JSON.stringify(res)));
					})
				})
			},
			//渲染表格
			renderTable(data){
				" 项目背景 组织机构 病例心分享简介 参与规则（病例参加指南，提交要求，评选规则，征文投稿）"
				let tableData = [
					{
						id:this.$getGuid(),
						"项目背景":"项目背景",
						"组织机构":"组织机构",
						"病例分享简介":"病例分享简介",
						"参与规则":"参与规则",
						"病例参加指南":"病例参加指南",
						"提交要求":"提交要求",
						"评选规则":"评选规则",
						"征文投稿":"征文投稿",
						"图片展示":"http://xiongkun.top/test/img-manage/resources/xiongda/test.jpg",//
					}
				];

				this.tableData = tableData;

				setTimeout(()=>{
					this.getTableHeight();
				},200);
			},
			//编辑
			editProject(item){
				// console.log(JSON.parse(JSON.stringify(item)))
				this.componentShow = true;
				this.componentInfo = {...item};
				this.componentName = "ProjectEdit";
				setTimeout(()=>{
					this.$refs[this.componentName].init();
				},200)
			},
			//编辑弹框回调函数
			returnBack(res){
				console.log(JSON.parse(JSON.stringify(res)))
				if(res.page === "编辑项目"){
					let imgUrl = res.data[0]['url'];
					let currentInfo = res.info;
					let idx = this.tableData.findIndex(val=>{
						return val['id'] === currentInfo['id'];
					});
					if(idx > -1){
						this.tableData[idx]['图片展示'] = imgUrl;
					}
				}
			},
			//获取表格宽高
			getTableHeight(){
				this.tableHeight = this.$getTableHeight(20,'table-container');
				this.tableWidth = this.$getTableWidth(2,'table-container');
				setTimeout(()=>{
					this.showTable = true;
				},100)
			},
		}
	}
</script>

<style lang="scss">

</style>