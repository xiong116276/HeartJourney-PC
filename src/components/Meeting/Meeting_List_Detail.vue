<template>
  <el-dialog v-if="showDialog" v-drag class="Meeting_List_Detail my_dialog" :title="dialogTitle" :visible.sync="showDialog" :width="dialogWidth" :close-on-click-modal="false">
    <div class="my-dialog-content">
      <div class="myInputGroup">
        <label>会议名称：</label>
        <div class="input full-input">
          <input :disabled="operation !== 'add'" v-model="mydata['会议名称']" type="text" placeholder="请输入">
        </div>
      </div>
      <div class="myInputGroup">
        <label>会议时间：</label>
        <div class="input full-input type-column time-range-select">
          <el-date-picker v-model="mydata['会议开始时间']" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择开始时间"></el-date-picker>
          <el-date-picker v-model="mydata['会议结束时间']" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择结束时间"></el-date-picker>
        </div>
      </div>
      <div class="myInputGroup">
        <label>会议介绍：</label>
        <div class="input full-input">
          <textarea v-model="mydata['会议介绍']" rows="4" placeholder="请输入"></textarea>
        </div>
      </div>
      <div class="myInputGroup">
        <label>直播链接：</label>
        <div class="input full-input">
          <input v-model="mydata['直播链接']" type="text" placeholder="请输入">
        </div>
      </div>
      <div class="myInputGroup" style="margin-bottom: 0">
        <label>会议封面：</label>
        <div class="input">
          <div class="upload-content" style="width: 115px;height: 115px">
            <div class="uploadImg single-img">
              <div v-if="mydata['会议封面'].length > 0" class="img-content">
                <div class="img-show-content" style="">
                  <span @click="deleteImg" class="icons el-icon-error"></span>
                  <img @dblclick="$showBigImg(mydata['会议封面'][0].url,0,imgList)" class="img" :src="mydata['会议封面'][0].url" alt="">
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
    name: "Meeting_List_Detail",
    props:{
      info:{}
    },
    data(){
      return{
        page:"会议详情",
        showDialog:false,
        dialogWidth:"550px",
        dialogTitle:'新增会议',
        operation:"add",//新增还是编辑
        currentInfo:{},//编辑时保存当前点击会议信息
        mydata:{
          "会议名称":"",
          "会议开始时间":"",
          "会议结束时间":"",
          "会议介绍":"",
          "直播链接":"",
          "会议封面":[],
          "状态":"",
        },
        fileList:[],//会议上传文件
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
            this.dialogTitle = "新增会议";
            break;
          case "edit":
            this.dialogTitle = "编辑会议";
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
            var oFReader = new FileReader();
            oFReader.readAsDataURL(imgItem);
            oFReader.onloadend = (oFRevent)=>{
              this.mydata['会议封面'] = [{url:oFRevent.target.result,file:selectedFile[0]}]
            };
          }else{
            this.$message('请选择小于5MB的文件！')
          }
        }else {
          this.$message('请选择图片！')
        }
      },
      //删除封面图片
      deleteImg() {
        this.mydata['会议封面'] = [];
      },
      submit(){
        let mydata = JSON.parse(JSON.stringify(this.mydata));

        let checkList = [
          {label:"会议名称",code:"会议名称"},
          {label:"会议开始时间",code:"会议开始时间"},
          {label:"会议结束时间",code:"会议结束时间"},
          {label:"会议介绍",code:"会议介绍"},
          {label:"直播链接",code:"直播链接"},
          {label:"批次",code:"批次"},
          {label:"状态",code:"状态"},
        ];
        if(!this.$checkEmpty(mydata,checkList)){
          return;
        }
        if(mydata['会议封面'].length === 0){
          this.$message({type:"warning",message:"请上传会议封面！"});
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
  .Meeting_List_Detail{
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