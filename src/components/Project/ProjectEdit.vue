<template>
	<el-dialog v-if="showDialog" v-drag class="ProjectEdit my_dialog" :title="dialogTitle" :visible.sync="showDialog" :width="dialogWidth" :close-on-click-modal="false">
		<div class="my-dialog-content">
			<div class="myInputGroup upload-content">
				<div class="uploadImg single-img">
					<div v-if="imgList.length > 0" class="img-content">
						<div class="img-show-content" style="">
							<span @click="deleteImg" class="icons el-icon-error"></span>
							<img @dblclick="$showBigImg(imgList[0].url,0,imgList)" class="img" :src="imgList[0].url" alt="">
						</div>
					</div>
					<div v-else class="btn-add-upload">
						<div class="text">
							<span class="el-icon-plus"></span>
							<span>上传图片</span>
						</div>
						<input class="inputFile"
									 @change="selectImg"
									 name="files"
									 type="file"
									 accept="image/jpg, image/png, image/jpeg, image/gif"
						/>
					</div>
				</div>
			</div>
			<div class="myInputGroup type-center">
				<span class="uploadTip">支持格式：JPG/PNG，单个文件不能超过5M</span>
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
		name: "ProjectEdit",
		props:{
			info:{}
		},
		data(){
			return{
				page:"编辑项目",
				showDialog:false,
				dialogWidth:"500px",
				dialogTitle:'编辑',
				imgList:[],
			}
		},
		mounted() {
			// this.init();
		},
		methods:{
			init(){
				// console.log(JSON.parse(JSON.stringify(this.info)))
				if(this.info['图片展示']){
					this.imgList = [{url:this.info['图片展示']}];
				}
				this.showDialog = true;
			},
			//选择图片
			selectImg() {
				let target = event.target;
				let selectedFile = target.files;
				let size = selectedFile[0].size;
				if(selectedFile[0].type!==''){
					let imgItem = selectedFile[0];
					if(size < ( 5*1024*1024)){
						var oFReader = new FileReader();
						oFReader.readAsDataURL(imgItem);
						oFReader.onloadend = (oFRevent)=>{
							this.imgList = [{url:oFRevent.target.result,file:selectedFile[0]}]
						};
					}else{
						this.$message('请选择小于5MB的文件！')
					}
				}else {
					this.$message('请选择图片！')
				}
			},
			//删除图片
			deleteImg() {
				this.imgList = [];
			},
			submit(){
				if(this.imgList.length === 0){
					this.$message({type:"warning",message:"请选择图片！"});
					return;
				}
				// console.log(JSON.parse(JSON.stringify(this.imgList)));
				this.returnBack();
			},
			returnBack(){
				this.showDialog = false;
				this.$emit("returnBack",{data:this.imgList,page:this.page,info:this.info});
			}
		}
	}
</script>

<style lang="scss">
	.ProjectEdit{
		.upload-content{
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;
			width: 130px;
			height: 130px;
			margin: auto;
		}
	}

</style>