<template>
  <div>
    用户信息
    <div align="center" style="margin-top: 20px">
      <el-row>
        <el-col :span="10" :offset="6">
          <el-form :label-position="labelPosition" label-width="100px" :model="formUserInfo" >
            <el-form-item label="用户名">
              <label>{{formUserInfo.userName}}</label>
            </el-form-item>
            <el-form-item label="邮箱">
              <label>{{formUserInfo.email}}</label>
            </el-form-item>
            <el-form-item label="电话">
              <label>{{formUserInfo.telephone}}</label>
            </el-form-item>
            <el-form-item label="用户描述信息">
              <label>{{formUserInfo.userInfo}}</label>
            </el-form-item>
            <el-form-item label="职业">
              <label>{{formUserInfo.occupation}}</label>
            </el-form-item>
            <el-form-item label="研究领域">
              <label>{{formUserInfo.researchDomain}}</label>
            </el-form-item>
            <el-form-item label="研究方向">
              <label>{{formUserInfo.researchDirection}}</label>
            </el-form-item>
            <el-form-item label="工作单位">
              <label>{{formUserInfo.workOrganization}}</label>
            </el-form-item>
            <el-form-item label="地区">
              <label>{{formUserInfo.region}}</label>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="cUserInfo">修改用户信息</el-button>
              <el-button @click="dialogResetPassword=true">重置密码</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <el-dialog title="修改用户信息" :visible.sync="dialogChangeUserInfo" :modal=false @close="closeChangeUserInfoDialog">
      <el-form :model="formChangeUserInfo"  :rules="userInfoRules" ref="formChangeUserInfo">
        <el-form-item label="新的用户描述信息" :label-width="formLabelWidth" prop="userInfo">
          <el-input v-model="formChangeUserInfo.userInfo" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="职业" :label-width="formLabelWidth">
          <el-input v-model="formChangeUserInfo.occupation" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="研究领域" :label-width="formLabelWidth">
          <el-input v-model="formChangeUserInfo.researchDomain" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="研究方向" :label-width="formLabelWidth">
          <el-input v-model="formChangeUserInfo.researchDirection" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="研究机构/工作单位" :label-width="formLabelWidth" prop="workOrganization">
          <el-input v-model="formChangeUserInfo.workOrganization" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="国家" :label-width="formLabelWidth" prop="countryNo">
          <el-select v-model="formChangeUserInfo.countryNo" filterable placeholder="请选择" style="width: 80%">
            <el-option
              v-for="item in worldCountryData"
              :key="item.code"
              :label="item.cnName+'--'+item.enName"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择省、市" :label-width="formLabelWidth" v-if="formChangeUserInfo.countryNo==='156'">
          <el-cascader
            size="large"
            :options="options"
            v-model="provinceAndCityNo"
            style="width: 80%" filterable>
            <!--@change="handleChange"-->
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelChangeUserInfo">取 消</el-button>
        <el-button type="primary" @click="changeUserInfo">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="dialogResetPassword" :modal=false>
      <el-form :model="formResetPassword">
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="formResetPassword.newPassWord" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogResetPassword = false">取 消</el-button>
        <el-button type="primary" @click="resetPassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import ElRow from "element-ui/packages/row/src/row";
import { provinceAndCityData,CodeToText } from 'element-china-area-data'

export default {
  components: {ElRow},
  name: "UserInfo",
  data() {
    return {
      labelPosition: 'left',
      formUserInfo: {
        userName:'',
        email:'',
        telephone:'',
        userInfo: '',
        occupation:'',
        researchDomain:'',
        researchDirection:'',
        workOrganization:'',
        region:''
      },
      formLabelWidth: '200px',
      dialogChangeUserInfo:false,
      dialogResetPassword:false,
      formChangeUserInfo:{
        userInfo:'',
        occupation:'',
        researchDomain:'',
        researchDirection:'',
        workOrganization:'',
        countryNo:'',
      },
      formResetPassword:{
        newPassWord:'',
      },
      userInfoRules: {
        userInfo: [
          { required: true,message: '请输入新的用户描述信息', trigger: 'blur' }
        ],
        countryNo:[
          {required: true, message: '请选择国家',trigger: 'change'}
        ],
        workOrganization: [
          {required: true,message: '请选择工作机构', trigger: 'blur'}
        ],
      },
      worldCountryData:[],
      options: provinceAndCityData,
      provinceAndCityNo: []
    }

  },
  mounted:function () {

    this.getUserInfo();
//    this.formChangeUserInfo.newUserInfo=this.formUserInfo.userInfo
    this.$http.get('static/worldCountry.json').then(res => {
      this.worldCountryData= res.body
    })

  },
  methods:{
    getUserInfo() {
      let params={
//        loginNo: localStorage.getItem("loginNo"),
      };
      this.$axios.post('/user/getUserInfo',params).then(res => {
        if(res.data.code===1){
          let JsonParams=JSON.parse(res.data.data);
          this.formUserInfo.userName=JsonParams.userName;
          this.formUserInfo.email=JsonParams.email;
          this.formUserInfo.telephone=JsonParams.telephone;
          this.formUserInfo.userInfo=JsonParams.userInfo;
          this.formUserInfo.occupation=JsonParams.occupation;
          this.formUserInfo.researchDomain=JsonParams.researchDomain;
          this.formUserInfo.researchDirection=JsonParams.researchDirection;
          this.formUserInfo.workOrganization=JsonParams.workOrganization;
          this.formUserInfo.countryNo=JsonParams.countryNo;
          this.formUserInfo.provinceNo=JsonParams.provinceNo;
          this.formUserInfo.cityNo=JsonParams.cityNo;
          this.formUserInfo.region='';
          for (let item of this.worldCountryData){
            if (JsonParams.countryNo===item.code){
              this.formUserInfo.region=item.cnName+'--'+item.enName;
              break
            }
          }
          if(JsonParams.countryNo==='156'){
            this.formUserInfo.region+=','+CodeToText[JsonParams.provinceNo]
            this.formUserInfo.region+=','+CodeToText[JsonParams.cityNo]
          }
        }else{
          this.$notify({
            title: '警告',
            message: res.data.msg,
            type: 'warning'
          });
        }

      })
    },
    cUserInfo(){
      this.dialogChangeUserInfo=true;
      this.formChangeUserInfo.userInfo=this.formUserInfo.userInfo
      this.formChangeUserInfo.occupation=this.formUserInfo.occupation
      this.formChangeUserInfo.researchDomain=this.formUserInfo.researchDomain
      this.formChangeUserInfo.researchDirection=this.formUserInfo.researchDirection
      this.formChangeUserInfo.workOrganization=this.formUserInfo.workOrganization
    },
    closeChangeUserInfoDialog(){
      this.$refs['formChangeUserInfo'].resetFields();
    },
    changeUserInfo(){
      this.$refs['formChangeUserInfo'].validate((valid) => {
        if (valid) {
//          console.log(this.formChangeUserInfo.region)
          if(this.formChangeUserInfo.countryNo!=='156'){
            this.provinceAndCityNo=[]
          }else {
            if(this.provinceAndCityNo.length===0){
              this.$notify({
                title: '警告',
                message: '请选择省、市',
                type: 'warning'
              });
              return false;
            }
          }
          let params={
            userInfo: encodeURIComponent(this.formChangeUserInfo.userInfo),
            occupation: encodeURIComponent(this.formChangeUserInfo.occupation),
            researchDomain: encodeURIComponent(this.formChangeUserInfo.researchDomain),
            researchDirection: encodeURIComponent(this.formChangeUserInfo.researchDirection),
            workOrganization: encodeURIComponent(this.formChangeUserInfo.workOrganization),
            countryNo: this.formChangeUserInfo.countryNo,
            provinceAndCityNo:this.provinceAndCityNo,
          };
          this.$axios.post('/user/changeUserInfo',params).then(res => {
            if(res.data.code===1){
              this.$notify({
                title: '成功',
                message: res.data.msg,
                type: 'success'
              });
              this.formUserInfo.userInfo=this.formChangeUserInfo.userInfo;
              this.formUserInfo.region='';
              for (let item of this.worldCountryData){
                if (this.formChangeUserInfo.countryNo===item.code){
                  this.formUserInfo.region=item.cnName+'--'+item.enName;
                  break
                }
              }
              if(this.formChangeUserInfo.countryNo==='156'){
                this.formUserInfo.region+=','+CodeToText[this.provinceAndCityNo[0]];
                this.formUserInfo.region+=','+CodeToText[this.provinceAndCityNo[1]]
              }
              this.dialogChangeUserInfo=false;
              this.provinceAndCityNo=[]
            }else{
              this.$notify({
                title: '警告',
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
        } else {
          this.$notify({
            title: '警告',
            message: '输入不符合要求',
            type: 'warning'
          });
          return false;
        }
      });
    },
    cancelChangeUserInfo(){
      this.dialogChangeUserInfo=false;
//      this.formChangeUserInfo.newUserInfo=this.formUserInfo.userInfo
    },
    resetPassword(){
      let reg=/^[0-9a-zA-Z]{1,20}$/;
      if(this.formResetPassword.newPassWord === '') {
        this.$notify({
          title: '提示',
          message: '密码不能为空!',
          type: 'warning'
        });
      }else if(!(reg.test(this.formResetPassword.newPassWord))) {
        this.$notify({
          title: '提示',
          message: '密码长度为1到20个字母数字!',
          type: 'warning'
        });
      }else {
        let params = {
          newPassword: this.$md5(this.formResetPassword.newPassWord),
        };
        this.$axios.post('/user/resetPassword', params).then(res => {
          if (res.data.code === 1) {
            this.$notify({
              title: '成功',
              message: res.data.msg + ',请重新登录',
              type: 'success'
            });
            this.dialogResetPassword = false;
            this.$router.push({path: "/login"});
            //清理session
            this.signOut();
          } else {
            this.$notify({
              title: '警告',
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
      }
    },
    signOut() {
        let params={};
        this.$axios.post('/user/signOut',params).then(res => {
          if(res.data.code===1){
            this.$router.push({ path: "/login" });

          }else{
            this.$notify({
              title: '警告',
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
    },
  }
}
</script>

<style scoped>

</style>
