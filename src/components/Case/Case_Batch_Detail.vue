<template>
	<el-dialog v-if="showDialog" v-drag class="Case_Batch_Detail my_dialog" :title="dialogTitle" :visible.sync="showDialog" :width="dialogWidth" :close-on-click-modal="false">
		<div class="my-dialog-content">
			<div class="myInputGroup">
				<label>批次：</label>
				<div class="input full-input">
					<input @input="inputCheck('批次','int')" :disabled="operation !== 'add'" v-model="mydata['批次']" type="text" placeholder="请输入">
				</div>
			</div>
			<div class="myInputGroup">
				<label>批次名称：</label>
				<div class="input full-input">
					<input :disabled="operation !== 'add'" v-model="mydata['批次名称']" type="text" placeholder="请输入">
				</div>
			</div>
			<div class="myInputGroup">
				<label>开始时间：</label>
				<div class="input full-input time-range-select">
					<el-date-picker v-model="mydata['开始时间']" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择开始时间"></el-date-picker>
				</div>
			</div>
			<div class="myInputGroup">
				<label>结束时间：</label>
				<div class="input full-input time-range-select">
					<el-date-picker v-model="mydata['结束时间']" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择开始时间"></el-date-picker>
				</div>
			</div>
			<div class="myInputGroup">
				<label>状态：</label>
				<div class="input full-input">
					<el-radio-group v-model="mydata['状态']">
						<el-radio label="启用"> 启用</el-radio>
						<el-radio label="禁用"> 禁用</el-radio>
					</el-radio-group>
				</div>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
	</el-dialog>
</template>

<script>
	export default {
		name: "Case_Batch_Detail",
		props:{
			info:{}
		},
		data(){
			return{
				page:"批次详情",
				showDialog:false,
				dialogWidth:"550px",
				dialogTitle:'新增批次',
				operation:"add",//新增还是编辑
				currentInfo:{},//编辑时保存当前点击批次信息
				mydata:{
					"批次":"",
					"批次名称":"",
					"开始时间":"",
					"结束时间":"",
					"状态":"",
				},
			}
		},
		mounted() {
			// this.init();
		},
		methods:{
			init(){
				console.log(JSON.parse(JSON.stringify(this.info)));
				this.mydata = this.$clearObj(this.mydata);
				this.showDialog = true;
				this.operation = this.info.operation;
				switch (this.operation) {
					case "add":
						this.dialogTitle = "新增批次";
						break;
					case "edit":
						this.dialogTitle = "编辑批次";
						for(let k in this.mydata){
							if(this.info.hasOwnProperty(k)){
								this.mydata[k] = this.info[k];
							}
						}
						break;
				}

			},
			//输入批次校验数字
			inputCheck(code,type){
				let input = this.mydata[code];
				let reg = /^[1-9]\d*$/;
				if(!reg.test(input)){
					this.$message({type:"error",message:"请输入正整数！"});
					this.$set(this.mydata,code,'');
					return;
				}
			},
			submit(){
				let mydata = JSON.parse(JSON.stringify(this.mydata));
				let checkList = [
					{label:"批次",code:"批次"},
					{label:"批次名称",code:"批次名称"},
					{label:"开始时间",code:"开始时间"},
					{label:"结束时间",code:"结束时间"},
					{label:"状态",code:"状态"},
				];
				if(!this.$checkEmpty(mydata,checkList)){
					return;
				}
				console.log(mydata);
				this.returnBack();
			},
			returnBack(){
				this.showDialog = false;
				this.$emit("returnBack",{data:this.mydata,page:this.page,info:this.info});
			}
		}
	}
</script>

<style lang="scss">
	.Case_Batch_Detail{
		//时间范围选择
		.time-range-select{
			display: flex;
			.el-date-editor{
				width: 100%;
				margin-bottom: 10px;
				.el-input__inner{
					height: 30px;
					line-height: 30px;
				}
			}
		}
	}

</style>