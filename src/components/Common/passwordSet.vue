<template>
  <el-dialog append-to-body v-drag v-if="showDialog" class="addPost my_dialog" :title="dialogTitle" :visible.sync="showDialog" width="400px" :close-on-click-modal="false">
    <div class="my_dialog_content">
      <div class="hiddenInput">
        <input type="text" autocomplete="off">
        <input type="password" autocomplete="off">
      </div>
      <div class="myInputGroup">
        <label>用户名：</label>
        <div class="input full-input">
          <input disabled v-model="mydata['用户名']" type="text" autocomplete="off">
        </div>
      </div>
      <div class="myInputGroup">
        <label>新密码：</label>
        <div class="input full-input">
          <input v-model="mydata['新密码']" type="password" autocomplete="off">
        </div>
      </div>
      <div class="myInputGroup">
        <label>确认密码：</label>
        <div class="input full-input">
          <input v-model="mydata['确认密码']" type="password" autocomplete="off">
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button class="mybtn" @click="showDialog = false">取 消</el-button>
      <el-button class="mybtn" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: "passwordSet",
    data(){
      return{
        page:"修改密码",
        showDialog:false,
        dialogTitle:'修改密码',
        mydata:{
          "用户名":"",
          "新密码":"",
          "确认密码":"",
        },
        username:sessionStorage.getItem('username'),
      }
    },
    methods:{
      async init(){
        this.mydata = this.$clearObj(this.mydata);
        this.mydata['用户名'] = this.username;
        this.Id = this.$getNameInfo({account:this.username});
        this.showDialog = true;
      },
      submit(){
        let data = this.mydata;
        if(data['新密码'] === ''){
          this.$message({message:'新密码不能为空！', type: 'error'});
          return;
        }
        if(data['确认密码'] === ''){
          this.$message({message:'确认密码不能为空！', type: 'error'});
          return;
        }
        if(data['确认密码'] !== data['新密码']){
          this.$message({message:'确认密码和新密码不同！', type: 'error'});
          return;
        }
        let argc =  {
          'ACU_Pwd': data['确认密码'],
        };
        let params = {'qrytype': 'AccountUser','qryfunc':'update_pwd', 'argc': JSON.stringify(argc)};
        // console.log(params)
        // return;
        let func = `/update_others/${this.Id}`;
        let method = 'put';

        this.$http.$fetchAxios(method,func,params).then(result => {
          if(result.data.code == 0){
            this.$message({message:"修改成功", type: 'success'});
            this.returnBack();
          }else{
            this.$message({message: result.data.msg, type: 'error'});
          }
        }).catch((error) => {
          this.$message({message: error.response.data.detail, type: 'error'});
        });
      },
      returnBack(){
        this.showDialog = false;
        this.$emit('returnBack',{data:this.mydata,page:this.page});
        this.$parent.componentShow = false;
      },
    }
  }
</script>

<style lang="scss">

</style>