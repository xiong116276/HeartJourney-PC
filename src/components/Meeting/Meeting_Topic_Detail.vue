<template>
  <el-dialog v-if="showDialog" v-drag class="Meeting_Topic_Detail my_dialog" :title="dialogTitle" :visible.sync="showDialog" :width="dialogWidth" :close-on-click-modal="false">
    <div class="my-dialog-content">
      <div class="myInputGroup type-column">
        <label>专题名称：</label>
        <div class="input full-input">
          <input :disabled="operation !== 'add'" v-model="mydata['专题名称']" type="text" placeholder="请输入">
        </div>
      </div>
      <div class="myInputGroup type-column">
        <label>批次：</label>
        <div class="input full-input">
          <el-select v-model="mydata['批次']" placeholder="请选择批次">
            <template v-for="(pc,pcIdx) in pcList">
              <el-option :key="pcIdx" :label="pc" :value="pc"></el-option>
            </template>
          </el-select>
        </div>
      </div>
      <div class="myInputGroup type-column">
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
    name: "Meeting_Topic_Detail",
    props:{
      info:{}
    },
    data(){
      return{
        page:"专题详情",
        showDialog:false,
        dialogWidth:"400px",
        dialogTitle:'新增专题',
        operation:"add",//新增还是编辑
        currentInfo:{},//编辑时保存当前点击专题信息
        mydata:{
          "专题名称":"",
          "批次":"",
          "状态":"",
        },
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
            this.dialogTitle = "新增专题";
            break;
          case "edit":
            this.dialogTitle = "编辑专题";
            for(let k in this.mydata){
              if(this.info.hasOwnProperty(k)){
                this.mydata[k] = this.info[k];
              }
            }
            break;
        }
      },
      submit(){
        let mydata = JSON.parse(JSON.stringify(this.mydata));

        let checkList = [
          {label:"专题名称",code:"专题名称"},
          {label:"批次",code:"批次"},
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
  .Meeting_Topic_Detail{
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