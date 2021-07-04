<template>
	<div class="Case_PraiseRule content-main">
		<div class="top-bar">
			<div class="left-container">
				<span class="title">{{page}}</span>
			</div>
		</div>
		<div class="table-container reset_scrollbar_v">
			<el-table :class="{hiddenShow:!showTable}" border :height="tableHeight" :data="tableData" fit>
				<template v-for="(head,index) in headData">
          <el-table-column v-if="head.label === '点赞规则'" :align="head.align"  :key="index" :prop="head.prop" :label="head.label" :width="`${head.width * tableWidth}`">
            <template slot-scope="scope">
              <div class="show-text">
                {{scope.row[head.prop]}}
              </div>
            </template>
          </el-table-column>
					<el-table-column v-else-if="head.label === '操作'" :align="head.align"  :key="index" :prop="head.prop" :label="head.label" :width="`${head.width * tableWidth}`">
						<template slot-scope="scope">
              <span @click="showDetail(scope.row)" class="mybtn">编辑</span>
						</template>
					</el-table-column>
					<el-table-column v-else :align="head.align" :key="index" :prop="head.prop" :label="head.label"></el-table-column>
				</template>
			</el-table>
		</div>

		<component v-if="componentShow" :is="componentName" :ref="componentName" :info="componentInfo" @returnBack="returnBack"></component>
	</div>
</template>

<script>
  import Case_PraiseRule_Edit from "./Case_PraiseRule_Edit"
  export default {
    name: "Case_PraiseRule",
    components:{
      Case_PraiseRule_Edit,
    },
    data() {
      return {
        page:"点赞规则",
        tableWidth:1200,
        tableHeight:700,
        searchText:"",
        headData:[
          {prop:'点赞规则',label:'点赞规则',width:"0.9",align:'center'},
          {prop:'操作',label:'操作',width:"0.1",align:'center'},
        ],
        tableData:[],
				showTable:false,
        componentShow:false,
        componentName:"Case_PraiseRule_Edit",
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
      	this.showTable = false;
        // this.getPageData();
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
        let tableData = [
          {id:this.$getGuid()+'_1', "点赞规则":"这里是点赞规则文字显示这里是点赞规则文字显示这里是点赞规则文字显示这里是点赞规则文字显示这里是点赞规则文字显示",},
        ];

        this.tableData = tableData;

        setTimeout(()=>{
          this.getTableHeight();
        },200);
      },
      //新增，编辑公用弹框
      showDetail(item){
        this.componentShow = true;
        this.componentInfo = {
          ...item,
        };
        this.componentName = "Case_PraiseRule_Edit";
        setTimeout(()=>{
          this.$refs[this.componentName].init();
        },200)
      },
      //编辑弹框回调函数
      returnBack(res){
        console.log(JSON.parse(JSON.stringify(res)))
        if(res.page === "点赞规则编辑"){
          this.tableData[0]['点赞规则'] = res.data['点赞规则'];
        }
      },
      //获取表格宽高
      getTableHeight(){
        this.tableHeight = this.$getTableHeight(10,'table-container');
        this.tableWidth = this.$getTableWidth(2,'table-container');
        setTimeout(()=>{
					this.showTable = true;
				},200)
      },
    }
  }
</script>

<style lang="scss">
  .show-text{
    width: 100%;
    height: 100%;
    text-align: left;
  }
</style>