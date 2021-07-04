<template>
	<div class="Meeting_Topic content-main">
		<div class="top-bar">
			<div class="left-container">
				<span class="title">{{page}}</span>
			</div>
		</div>
		<div class="table-container reset_scrollbar_v">
			<div class="top-bar" style="border-bottom: 0;min-height: 40px;">
				<div class="left-container">
					<input class="searchInput" type="text" v-model="searchText" placeholder="搜索专题">
					<el-button type="primary">搜索</el-button>
				</div>
				<div class="right-container">
					<el-button @click="showDetail({},'add')" type="primary">新增专题</el-button>
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
  import Meeting_Topic_Detail from "./Meeting_Topic_Detail"
  export default {
    name: "Meeting_Topic",
    components:{
      Meeting_Topic_Detail,
    },
    data() {
      return {
        page:"专题管理",
        tableWidth:1200,
        tableHeight:700,
        searchText:"",
        headData:[
          {prop:'专题名称',label:'专题名称',width:"0.3",align:'center'},
          {prop:'创建时间',label:'创建时间',width:"0.2",align:'center'},
          {prop:'状态',label:'状态',width:"0.2",align:'center'},
          {prop:'批次',label:'批次',width:"0.1",align:'center'},
          {prop:'操作',label:'操作',width:"0.2",align:'center'},
        ],
        tableData:[],
        interPage:10,
        currentPage:1,
        dataSize:0,
				showTable:false,
        componentShow:false,
        componentName:"Meeting_Topic_Detail",
        componentInfo:{},
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
				this.showTable = false
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
          {id:this.$getGuid()+'_1', "专题名称":"专题名称1", "创建时间":"2021-07-01 12:12", "状态":"禁用", "批次":"3",},
          {id:this.$getGuid()+'_2', "专题名称":"专题名称2", "创建时间":"2021-07-02 12:12", "状态":"启用", "批次":"2",},
          {id:this.$getGuid()+'_3', "专题名称":"专题名称3", "创建时间":"2021-07-03 12:12", "状态":"禁用", "批次":"1",}
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
        this.componentName = "Meeting_Topic_Detail";
        setTimeout(()=>{
          this.$refs[this.componentName].init();
        },200)
      },
      //删除专题
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
        // console.log(JSON.parse(JSON.stringify(res)))
        if(res.page === "专题详情"){
          if(res.info.operation === 'add'){
            let obj = {
              id:this.$getGuid(),
              ...res.data,
              "创建时间":this.$getDate(2).slice(0,16),
            };
            this.tableData.push(obj);
          }else {
            let tableData =JSON.parse(JSON.stringify(this.tableData));
            let idx = tableData.findIndex(val=>{
              return val.id === res.info.id;
            });
            // console.log(idx)
            this.tableData.splice(idx,1,Object.assign(res.info,res.data));

            // console.log(this.tableData)
          }
        }
      },
      //获取表格宽高
      getTableHeight(){
        this.tableHeight = this.$getTableHeight(110,'table-container');
        this.tableWidth = this.$getTableWidth(2,'table-container');
        // console.log(this.tableWidth)
				setTimeout(()=>{
					this.showTable = true;
				},100)
      },
    }
  }
</script>

<style lang="scss">

</style>