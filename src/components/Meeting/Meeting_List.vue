<template>
	<div class="Meeting_List content-main">
		<div class="top-bar">
			<div class="left-container">
				<span class="title">{{page}}</span>
			</div>
		</div>
		<div class="table-container reset_scrollbar_v">
      <div class="tabList">
        <template v-for="(tab,tabIdx) in tabList">
          <div
            @click="tabClick(tab)"
            :key="tabIdx" class="tabItem"
            :class="{active:activeNames===tab.label}">
            <span class="tabLabel">{{tab.label}}</span>
          </div>
        </template>
      </div>
			<div class="top-bar" style="border-bottom: 0;min-height: 40px;">
				<div class="left-container">
					<input class="searchInput" type="text" v-model="searchText" placeholder="搜索标题">
					<el-button type="primary">搜索</el-button>
				</div>
				<div class="right-container">
					<el-button @click="showDetail({},'add')" type="primary">新增会议</el-button>
				</div>
			</div>
			<el-table :class="{hiddenShow:!showTable}" border :height="tableHeight" :data="tableData" fit>
				<template v-for="(head,index) in headData">
					<el-table-column v-if="head.label === '操作'" :align="head.align"  :key="index" :prop="head.prop" :label="head.label" :width="`${head.width * tableWidth}`">
						<template slot-scope="scope">
							<div class="table-operation">
								<el-button @click="showDetail(scope.row,'edit')" type="primary">编辑</el-button>
								<el-popconfirm @onConfirm="changeStatus(scope.row)" :title="`是否确定${scope.row['状态'] === '禁用'?'启用':'禁用'}吗？`">
									<el-button slot="reference" v-if="scope.row['状态'] === '禁用'" type="warning">启用</el-button>
									<el-button slot="reference" v-else type="info">禁用</el-button>
								</el-popconfirm>

								<el-popconfirm
									title="是否确定要删除？"
									@onConfirm="deleteItem(scope.row)"
									icon="el-icon-info"
									icon-color="red"
								>
									<el-button type="danger" slot="reference">删除</el-button>
								</el-popconfirm>
							</div>
						</template>
					</el-table-column>
					<el-table-column v-else :align="head.align" :key="index" :prop="head.prop" :label="head.label" :width="`${head.width * tableWidth}`"></el-table-column>
				</template>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 15, 20]" :page-size="interPage" layout="total, sizes, prev, pager, next, jumper" background :total="dataSize"></el-pagination>
		</div>

		<component v-if="componentShow" :is="componentName" :ref="componentName" :info="componentInfo" @returnBack="returnBack"></component>
	</div>
</template>

<script>
  import Meeting_List_Detail from "./Meeting_List_Detail"
  export default {
    name: "Meeting_List",
    components:{
      Meeting_List_Detail,
    },
    data() {
      return {
        page:"会议管理",
        tableWidth:1200,
        tableHeight:700,
				tabList:[
          {label:"全国国家研讨会",value:"全国国家研讨会"},
          {label:"省级专家研讨会",value:"省级专家研讨会"},
          {label:"全国总结会",value:"全国总结会"},
				],
        searchText:"",
        headData:[
          {prop:'会议名称',label:'会议名称',width:"0.3",align:'center'},
          {prop:'会议开始时间',label:'会议开始时间',width:"0.3",align:'center'},
          {prop:'状态',label:'状态',width:"0.2",align:'center'},
          {prop:'操作',label:'操作',width:"0.2",align:'center'},
        ],
        tableData:[],
        interPage:10,
        currentPage:1,
        dataSize:0,
				showTable:false,
        componentShow:false,
        componentName:"Meeting_List_Detail",
        componentInfo:{},
        activeNames:"全国国家研讨会",
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
        this.tabClick(this.tabList[0]);
      },
      //点击标签页
      tabClick(item){
      	this.showTable = false;
        this.activeNames = item.label;
        this.currentPage = 1;
        this.interPage = 10;
        this.dataSize = 0;
        // this.getCount();
        // this.getPageData();
        this.renderTable();
      },
      //获取页码数
      getCount(){
        return new Promise((resolve, reject) => {
          let params = {

          };
          this.$http.$fetchGet("/get",params).then(res=>{
            console.log(JSON.parse(JSON.stringify(res)));
          })
        })
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
        let tableData = [
          {id:this.$getGuid()+'_1', "会议名称":"会议名称1", "会议开始时间":"2021-07-01 12:12", "状态":"禁用", },
          {id:this.$getGuid()+'_2', "会议名称":"会议名称2", "会议开始时间":"2021-07-01 12:12", "状态":"启用", },
          {id:this.$getGuid()+'_3', "会议名称":"会议名称3", "会议开始时间":"2021-07-01 12:12", "状态":"禁用", }
        ];

        this.tableData = tableData;

        setTimeout(()=>{
          this.getTableHeight();
        },200);
      },
      handleSizeChange(val) {
        this.currentPage = 1;
        this.interPage = val;
        this.getPageData();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getPageData();
      },
      //新增，编辑公用弹框
      showDetail(item,type){
        this.componentShow = true;
        this.componentInfo = {
          ...item,
          operation:type,
        };
        this.componentName = "Meeting_List_Detail";
        setTimeout(()=>{
          this.$refs[this.componentName].init();
        },200)
      },
      //删除会议
      deleteItem(row){
        // console.log(JSON.parse(JSON.stringify(row)))
        let tableData = JSON.parse(JSON.stringify(this.tableData));
        let idx = tableData.findIndex(val => {
          return val.id === row.id;
        });
        if(idx > -1){
          this.tableData.splice(idx,1);
        }
      },
      //改变状态
      changeStatus(row){
        // console.log(JSON.parse(JSON.stringify(row)))
        let tableData = JSON.parse(JSON.stringify(this.tableData));
        let idx = tableData.findIndex(val => {
          return val.id === row.id;
        });
        if(idx > -1){
          this.tableData[idx]['状态'] = row['状态'] === '启用'?'禁用':'启用';
        }
      },
      //编辑弹框回调函数
      returnBack(res){
        console.log(JSON.parse(JSON.stringify(res)))
      },
      //获取表格宽高
      getTableHeight(){
        this.tableHeight = this.$getTableHeight(160,'table-container');
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