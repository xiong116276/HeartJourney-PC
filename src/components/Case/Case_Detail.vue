<template>
  <el-dialog v-if="showDialog" v-drag class="Case_Detail my_dialog" :title="dialogTitle" :visible.sync="showDialog" :width="dialogWidth" :close-on-click-modal="false">
    <div class="my-dialog-content">
      <div class="myInputGroup">
        <label>病例标题：</label>
        <div class="input full-input">
          <input :disabled="operation !== 'add'" v-model="mydata['病例标题']" type="text" placeholder="请输入">
        </div>
      </div>
      <div class="myInputGroup">
        <label>作者名称：</label>
        <div class="input full-input">
          <input :disabled="operation !== 'add'" v-model="mydata['作者名称']" type="text" placeholder="请输入">
        </div>
      </div>
      <div class="myInputGroup">
        <label>所属医院：</label>
        <div class="input full-input">
          <input :disabled="operation !== 'add'" v-model="mydata['所属医院']" type="text" placeholder="请输入">
        </div>
      </div>
      <div class="myInputGroup">
        <label>病例描述：</label>
        <div class="input full-input">
          <textarea v-model="mydata['病例描述']" rows="4" placeholder="请输入"></textarea>
        </div>
      </div>
      <div class="myInputGroup" style="margin-bottom: 0">
        <label>病例封面：</label>
        <div class="input">
          <div class="upload-content" style="width: 115px;height: 115px">
            <div class="uploadImg single-img">
              <div v-if="mydata['病例封面'].length > 0" class="img-content">
                <div class="img-show-content" style="">
                  <span @click="deleteImg" class="icons el-icon-error"></span>
                  <img @dblclick="$showBigImg(mydata['病例封面'][0].url,0,imgList)" class="img" :src="mydata['病例封面'][0].url" alt="">
                </div>
              </div>
              <div v-else class="btn-add-upload">
                <div class="text">
                  <span class="el-icon-plus"></span>
                  <span>上传图片</span>
                </div>
                <input class="inputFile" @change="selectImg" name="files" type="file" accept="image/jpg, image/png, image/jpeg, image/gif"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="myInputGroup">
        <label></label>
        <div class="input">
          <span class="uploadTip">支持格式：JPG/PNG，单个文件不能超过5M</span>
        </div>
      </div>
      <div class="myInputGroup">
        <label>病例上传：</label>
        <div class="input">
          <template v-if="mydata['病例文件'].length === 0">
            <div class="selectCase">
              <el-button><i class="el-icon-upload"></i>上传文件</el-button>
              <input class="inputFile" @change="selectCase" name="files" multiple type="file" accept="image/jpg, image/png, image/jpeg, image/gif"/>
            </div>
          </template>
          <template v-else>
            <div class="imgList">
              <template v-for="(img,imgIdx) in mydata['病例文件']">
                <div :key="imgIdx" class="img-show-content" style="">
                  <span @click="deleteListImg(img,imgIdx)" class="icons el-icon-error"></span>
                  <img @dblclick="$showBigImg(img.url,imgIdx,mydata['病例文件'])" class="img" :src="img.url" alt="">
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
      <div class="myInputGroup">
        <label>批次：</label>
        <div class="input full-input">
          <el-select v-model="mydata['批次']" placeholder="请选择批次">
            <template v-for="(pc,pcIdx) in pcList">
              <el-option :key="pcIdx" :label="pc" :value="pc"></el-option>
            </template>
          </el-select>
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
    name: "Case_Detail",
    props:{
      info:{}
    },
    data(){
      return{
        page:"病例详情",
        showDialog:false,
        dialogWidth:"550px",
        dialogTitle:'新增病例',
        operation:"add",//新增还是编辑
        currentInfo:{},//编辑时保存当前点击病例信息
        mydata:{
          "病例标题":"",
          "作者名称":"",
          "所属医院":"",
          "病例描述":"",
          "病例封面":[],//封面图片（显示保存img URL）
          "病例文件":[],//病例文件列表（显示保存img URL）
          "批次":"",
          "状态":"",
        },
        addFiles:[],//病例封面文件（上传提交给后台的文件）
        fileList:[],//病例上传文件（上传提交给后台的文件）
        pcList:['1','2','3','4','5','6'],//批次列表
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
            this.dialogTitle = "新增病例";
            break;
          case "edit":
            this.dialogTitle = "编辑病例";
            for(let k in this.mydata){
              if(this.info.hasOwnProperty(k)){
                this.mydata[k] = this.info[k];
              }
            }
            break;
        }

      },
      //选择图片
      selectImg() {
        let target = event.target;
        let selectedFile = target.files;
        let size = selectedFile[0].size;
        if(selectedFile[0].type!==''){
          let imgItem = selectedFile[0];
          if(size < ( 5*1024*1024)){
          	this.addFiles = [imgItem];
            var oFReader = new FileReader();
            oFReader.readAsDataURL(imgItem);
            oFReader.onloadend = (oFRevent)=>{
              this.mydata['病例封面'] = [{url:oFRevent.target.result,file:selectedFile[0]}];
            };
          }else{
            this.$message('请选择小于5MB的文件！')
          }
        }else {
          this.$message('请选择图片！')
        }

        console.log(this.addFiles)
      },
      //删除封面图片
      deleteImg() {
        this.mydata['病例封面'] = [];
      },
      //上传病例
      selectCase(){
				let target = event.target;
				let selectedFile = target.files;
				let fileList = [];
				for(let i = 0;i < selectedFile.length;i++){
					let size = selectedFile[i].size;
					if(selectedFile[i].type!==''){
						let imgItem = selectedFile[i];
						if(size < ( 5*1024*1024)){
							fileList.push(imgItem);
							console.log(selectedFile)
							var oFReader = new FileReader();
							oFReader.readAsDataURL(imgItem);
							oFReader.onloadend = (oFRevent)=>{
								this.mydata['病例文件'].push({url:oFRevent.target.result,file:selectedFile[i]})
							};
						}else{
							this.$message('请选择小于5MB的文件！')
						}
					}else {
						this.$message('请选择图片！')
					}
				}
				this.fileList = fileList;
				console.log(this.fileList)//上传文件列表。
        // this.mydata['病例文件'] = [
        //   {url:"http://xiongkun.top/test/img-manage/resources/xiongda/test.jpg"},
        //   {url:"http://xiongkun.top/test/img-manage/resources/xiongda/test.jpg"},
        //   {url:"http://xiongkun.top/test/img-manage/resources/xiongda/test.jpg"},
        //   {url:"http://xiongkun.top/test/img-manage/resources/xiongda/test.jpg"},
        //   {url:"http://xiongkun.top/test/img-manage/resources/xiongda/test.jpg"},
        //   {url:"http://xiongkun.top/test/img-manage/resources/xiongda/test.jpg"},
        //   {url:"http://xiongkun.top/test/img-manage/resources/xiongda/test.jpg"},
        //   {url:"http://xiongkun.top/test/img-manage/resources/xiongda/test.jpg"},
        // ]
      },
      //删除病例图片
      deleteListImg(item,idx){
        this.mydata['病例文件'].splice(idx,1);
      },
      submit(){
        let mydata = JSON.parse(JSON.stringify(this.mydata));

        let checkList = [
          {label:"病例标题",code:"病例标题"},
          {label:"作者名称",code:"作者名称"},
          {label:"所属医院",code:"所属医院"},
          {label:"病例描述",code:"病例描述"},
          {label:"批次",code:"批次"},
          {label:"状态",code:"状态"},
        ];
        if(!this.$checkEmpty(mydata,checkList)){
          return;
        }
        if(mydata['病例文件'].length === 0){
          this.$message({type:"warning",message:"请上传病例文件！"});
          return;
        }
        if(mydata['病例封面'].length === 0){
          this.$message({type:"warning",message:"请上传病例封面！"});
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
  .Case_Detail{
    .upload-content{
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      width: 130px;
      height: 130px;
      margin: auto;
    }
    .selectCase{
      position: relative;
      cursor: pointer;
      .inputFile{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
      }
    }
    .imgList{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .img-show-content{
        position: relative;
        width: 90px;
        height: 90px;
        margin: 0 10px 10px 0;
        border-radius: 5px;
        overflow: hidden;
        .el-icon-error{
          position: absolute;
          color: red;
          top:0;
          right: 0;
          cursor: pointer;
          background-color: #fff;
          border-radius: 50%;
          overflow: hidden;
        }
      }
    }
  }

</style>