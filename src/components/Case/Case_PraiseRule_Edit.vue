<template>
  <el-dialog v-if="showDialog" v-drag class="Case_PraiseRule_Edit my_dialog" :title="dialogTitle" :visible.sync="showDialog" :width="dialogWidth" :close-on-click-modal="false">
    <div class="my-dialog-content">

      <div class="myInputGroup">
        <label>点赞规则：</label>
        <div class="input full-input">
          <textarea style="height: unset" v-model="mydata['点赞规则']" rows="10" placeholder="请输入"></textarea>
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
    name: "Case_PraiseRule_Edit",
    props:{
      info:{}
    },
    data(){
      return{
        page:"点赞规则编辑",
        showDialog:false,
        dialogWidth:"450px",
        dialogTitle:'编辑',
        mydata:{
          "点赞规则":"",
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
        this.mydata["点赞规则"] = this.info["点赞规则"]||'';
      },
      submit(){
        if(!this.mydata["点赞规则"]){
          this.$message({type:"warning",message:"请输入点赞规则！"});
          return;
        }
        // console.log(JSON.parse(JSON.stringify(this.imgList)));
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
  .Case_PraiseRule_Edit{

  }

</style>