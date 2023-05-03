<template>
  <div class="login">
    <div align="center" class="loginBox">
      <div class="formLeft">
        <div class="leftbox">
          <!-- <img class="loginLogo" src="@/assets/logo.png" alt /> -->
          <h3 class="loginName">机器学习及其应用课题组</h3>
          <h3 class="loginName">SHU@MLA</h3>
        </div>
      </div>
      <div class="formRight">
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <h2 class="loginTitle">用户登录</h2>
          <!--<div class="loginFormItem">-->
            <!--<el-form-item prop="loginWay">-->
              <!--<el-select v-model="loginForm.loginWay" placeholder="请选择" style="width: 100%">-->
                <!--<el-option-->
                  <!--v-for="item in loginWayOptions"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                <!--</el-option>-->
              <!--</el-select>            -->
            <!--</el-form-item>-->
          <!--</div>-->
          <div class="loginFormItem">
            <el-form-item prop="loginAccount">
              <el-input class="loginIpt" placeholder="登录账号（统一认证号）" v-model="loginForm.loginAccount" ></el-input>
            </el-form-item>
          </div>
          <div class="loginFormItem">
            <el-form-item prop="password">
              <el-input class="loginIpt" placeholder="密码" v-model="loginForm.password" ></el-input>
            </el-form-item>
          </div>
          <el-button class="loginBtn" @click="loginSubmit('loginForm')">登录</el-button>
          <el-button type="text" @click="register()">注册</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
//    const checkLoginWay = (rule, value, callback) => {
//      if(value === '') {
//        callback(new Error('请先选择账号类型!'))
//      }
//      return callback()
//    };
    const checkLoginAccount = (rule, value, callback) => {
      // 登录验证
      const regLoginNo = /^[0-9]{1,10}$/;
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+(\.([a-zA-Z]{2,4})){1,2}$/;
      const regMobile = /^1[345678]\\d{9}$/;
      if(value === '') {
        callback(new Error('账号不能为空!'))
      }else if (this.loginForm.loginWay==='1'){
        if(!(regEmail.test(value))){
          callback(new Error('请输入合法的邮箱!'))
        }
      }else if (this.loginForm.loginWay==='2'){
        if(!(regMobile.test(value))){
          callback(new Error('请输入合法的手机号!'))
        }
      }else if (this.loginForm.loginWay==='3'){
        if(!(regLoginNo.test(value))){
          callback(new Error('统一认证号长度为1到10个数字!'))
        }
      }
      return callback()
    };
    const checkPass = (rule, value, callback) => {
      // 正则表达式验证
      const regPass = /^[0-9a-zA-Z]{1,20}$/
      if (value === '') {
        callback(new Error('密码不能为空!'))
      } else if (!(regPass.test(value))) {
        callback(new Error('密码长度为1到20个字母数字!'))
      }
      return callback()
    };
    return {
      labelPosition: 'left',
      loginForm: {
        loginWay:'3',
        loginAccount: '',
        password: ''
      },
      loginWayOptions: [{
        value: '1',
        label: '邮箱'
      }, {
        value: '2',
        label: '手机号'
      }, {
        value: '3',
        label: '统一认证号'
      }],
      rules: {
//        loginWay: [
//          { validator: checkLoginWay, trigger: 'change' }
//        ],
        loginAccount: [
          { validator: checkLoginAccount, trigger: 'blur' }
        ],
        password: [
          { validator: checkPass, trigger: 'blur' }
        ]
      },
      platformId:''
    };
  },
  mounted:function () {
//    this.platformId=this.$route.query.platformId
//    console.log(this.platformId)
    this.getSinglePlatformInfo()
  },
  methods: {
    loginSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //參數
          let params={
            loginWay:this.loginForm.loginWay,
            loginAccount: this.loginForm.loginAccount,
            password: this.$md5(this.loginForm.password),
            platformId:this.platformId
          };
          this.$axios.post('/user/login', params).then(res => {
            if (res.data.code === 1) {
              this.$notify({
                title: '成功',
                message: '登录成功',
                type: 'success'
              });
              this.$router.push({ path: "/home" });
            } else {
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
    register(){
      let params = {
        platformId: this.platformId,
      };
      this.$router.push({path: "/register",query:params});
    },
    getSinglePlatformInfo() {
      let params = {
        platformAbbr:'manage',   //todo   开发时用manege，上线时每个平台改成自己的即可
      };
      this.$axios.post('/user/getSinglePlatformInfo', params).then(res => {
        if (res.data.code === 1) {
          let JsonParams = JSON.parse(res.data.data);
          this.platformId = JsonParams.platformId;
          console.log(this.platformId)
        } else {
          this.$notify({
            title: '警告',
            message: '平台数据加载异常',
            type: 'warning'
          });
        }
      })
    },
  }
}
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  /*background-image: url('../../assets/bg.jpg');*/
}
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ebf3ff;
}
.loginBox {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 350px;
  border-radius: 8px;
  transform: translate(-50%, -50%);
  box-shadow: 5px 5px 15px #848588;
}
.formLeft,
.formRight {
  float: left;
  height: 100%;
}
.formLeft {
  position: relative;
  width: 50%;
  background: #3289f0;
  color: #fff;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}
.leftbox {
  position: absolute;
  width: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loginLogo {
  width: 70%;
  padding-bottom: 10px;
}
.loginName {
  margin-top: 5px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
}
.formRight {
  position: relative;
  width: 50%;
  background: #fff;
  padding: 30px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}
.loginTitle {
  font-size: 22px;
  color: #3a3a3b;
  margin-top: 20px;
  margin-bottom: 38px;
}
.loginFormItem {
  position: relative;
  height: 30px;
  margin: 35px 0;
}

.loginIpt:focus {
  outline: none;
  border: 2px solid #609fda;
  color: #000;
}

.loginIpt::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: #acacac;
  font-size: 10px;
}
.loginIpt:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #acacac;
  font-size: 10px;
}
.loginIpt::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #acacac;
  font-size: 10px;
}
.loginIpt:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #acacac;
  font-size: 10px;
}
.icon_position {
  z-index: 99;
  position: absolute;
  top: 10px;
  left: 5px;
  font-size: 16px;
  color: #65a5f3;
}
.loginBtn {
  position: absolute;
  bottom: 35px;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  padding: 15px;
  border: none;
  border-radius: 50px;
  background-color: #65a5f3;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
}
.loginBtn:hover {
  background-color: #3289f0;
  color: #fff;
}
</style>
