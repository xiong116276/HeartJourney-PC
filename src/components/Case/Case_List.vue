<template>
	<div class="Case_List content-main">
		<div class="top-bar">
			<div class="left-container">
				<span class="title">{{page}}</span>
			</div>
		</div>
		<div class="table-container reset_scrollbar_v">
      <div class="top-bar" style="border-bottom: 0;min-height: 40px;">
        <div class="left-container">
          <input class="searchInput" type="text" v-model="searchText" placeholder="搜索标题">
          <el-button type="primary">搜索</el-button>
        </div>
        <div class="right-container">
          <el-button @click="showDetail({},'add')" type="primary">新增病例</el-button>
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
  import Case_Detail from "./Case_Detail"
  export default {
    name: "Case_List",
    components:{
      Case_Detail,
    },
    data() {
      return {
        page:"病例管理",
        tableWidth:1200,
        tableHeight:700,
        searchText:"",
        headData:[
          {prop:'病例标题',label:'病例标题',width:"0.2",align:'center'},
          {prop:'作者名称',label:'作者名称',width:"0.1",align:'center'},
          {prop:'所属医院',label:'所属医院',width:"0.2",align:'center'},
          {prop:'点赞数',label:'点赞数',width:"0.1",align:'center'},
          {prop:'状态',label:'状态',width:"0.1",align:'center'},
          {prop:'批次',label:'批次',width:"0.1",align:'center'},
          {prop:'操作',label:'操作',width:"0.2",align:'center'},
        ],
        tableData:[],
        interPage:10,
        currentPage:1,
        dataSize:0,
				showTable:false,
        componentShow:false,
        componentName:"Case_Detail",
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
        this.currentPage = 1;
        this.interPage = 10;
        this.dataSize = 0;
        this.showTable = false;
        // this.getCount();
        // this.getPageData();
        // this.getTableHeight();
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
          {id:this.$getGuid()+'_1', "病例标题":"病例标题1", "作者名称":"李医生", "所属医院":"XXXXXXXX医院", "点赞数":"555", "状态":"禁用", "批次":"3",},
          {id:this.$getGuid()+'_2', "病例标题":"病例标题2", "作者名称":"张医生", "所属医院":"XXXXXXXX医院", "点赞数":"666", "状态":"启用", "批次":"3",},
          {id:this.$getGuid()+'_3', "病例标题":"病例标题3", "作者名称":"王医生", "所属医院":"XXXXXXXX医院", "点赞数":"777", "状态":"禁用", "批次":"3",}
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
        this.componentName = "Case_Detail";
        setTimeout(()=>{
          this.$refs[this.componentName].init();
        },200)
      },
      //删除病例
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
        this.tableHeight = this.$getTableHeight(110,'table-container');
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