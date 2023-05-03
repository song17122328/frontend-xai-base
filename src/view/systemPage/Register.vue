<template>
  <!--<div>-->
  <!--<h1>{{ msg }}</h1>-->
  <!--</div>-->
  <el-scrollbar style="height: 100%">

    <div>
      <div align="center" style="margin-top: 20px">
        注册
      </div>
      <div align="center" style="margin-top: 20px">
        <el-row>
          <el-col :span="10" :offset="6">
            <el-form :label-position="labelPosition" label-width="200px" :model="formRegister" :rules="registerRules"
                     ref="formRegister">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="formRegister.userName"></el-input>
              </el-form-item>
              <el-form-item label="邮箱(登录账号)" prop="email">
                <el-input v-model="formRegister.email"></el-input>
              </el-form-item>
              <el-form-item label="登录密码" prop="password">
                <el-input v-model="formRegister.password" show-password></el-input>
              </el-form-item>
              <el-form-item label="密码确认" prop="confirmPassword">
                <el-input v-model="formRegister.confirmPassword" show-password></el-input>
              </el-form-item>
              <el-form-item label="用户信息(简介)" prop="userInfo">
                <el-input v-model="formRegister.userInfo"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="telephone">
                <el-input v-model="formRegister.telephone"></el-input>
              </el-form-item>
              <el-form-item label="职业" prop="occupation">
                <el-input v-model="formRegister.occupation"></el-input>
              </el-form-item>
              <el-form-item label="研究领域" prop="researchDomain">
                <el-input v-model="formRegister.researchDomain"></el-input>
              </el-form-item>
              <el-form-item label="研究方向" prop="researchDirection">
                <el-input v-model="formRegister.researchDirection"></el-input>
              </el-form-item>
              <el-form-item label="研究机构/工作单位" prop="workOrganization">
                <el-input v-model="formRegister.workOrganization"></el-input>
              </el-form-item>
              <el-form-item label="国家" prop="countryNo">
                <el-select v-model="formRegister.countryNo" filterable placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in worldCountryData"
                    :key="item.code"
                    :label="item.cnName+'--'+item.enName"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <!--json里中国的code是156-->
              <el-form-item label="选择省、市" v-if="formRegister.countryNo==='156'">
                <el-cascader
                  size="large"
                  :options="options"
                  v-model="provinceAndCityNo"
                  style="width: 100%" filterable>
                  <!--@change="handleChange"-->
                </el-cascader>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" disabled @click="userRegister3()">注册</el-button>
                <el-button type="primary" @click="backLogin()">返回</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-scrollbar>

</template>

<script>
  import {provinceAndCityData} from 'element-china-area-data'

  export default {
    name: 'Register',
    data() {
      const checkEmail = (rule, value, callback) => {
        // 正则表达式验证
        const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+(\.([a-zA-Z]{2,4})){1,2}$/;
        if (value === '') {
          return callback(new Error('邮箱不能为空!'))
        } else if (!(regEmail.test(value))) {
          return callback(new Error('请输入合法的邮箱!'))
        } else {
          let params = {
            email: value,
            platformId: this.platformId,
            userRoleId: '3',
          };
          this.$axios.post('/user/valRepeatEmail', params).then(res => {
            if (res.data.code !== 1) {
              return callback(new Error(res.data.msg))
            } else {
              callback()
            }
          })
        }
//      return callback()
      };
      const checkTelephone = (rule, value, callback) => {
        // 正则表达式验证
        const regTelephone = /^1[345678]\d{9}$/;
        if (value !== '') {
          if (!(regTelephone.test(value))) {
            return callback(new Error('请输入合法手机号!'))
          } else {
            let params = {
              telephone: value,
              platformId: this.platformId,
              userRoleId: '3',
            };
            this.$axios.post('/user/valRepeatTelephone', params).then(res => {
              if (res.data.code !== 1) {
                return callback(new Error(res.data.msg))
              } else {
                callback()
              }
            })
          }
        } else {
          callback()
        }
//      return callback()
      };
      const checkUserName = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('用户名不能为空!'))
        } else {
          let params = {
            userName: value,
            platformId: this.platformId,
            userRoleId: '3',
          };
          this.$axios.post('/user/valRepeatUserName', params).then(res => {
            if (res.data.code !== 1) {
              return callback(new Error(res.data.msg))
            } else {
              callback()
            }
          })
        }
//      return callback()
      };
      const checkPass = (rule, value, callback) => {
        // 正则表达式验证
        const regPass = /^[0-9a-zA-Z]{1,20}$/
        if (value === '') {
          return callback(new Error('密码不能为空!'))
        } else if (!(regPass.test(value))) {
          return callback(new Error('密码长度为1到20个字母数字!'))
        } else {
          callback()
        }
//      return callback()
      };
      const checkConPass = (rule, value, callback) => {
        // 正则表达式验证
//        console.log(this.formRegister.password)
        if (value !== this.formRegister.password) {
          return callback(new Error('与上方密码不一致'))
        } else {
          callback()
        }
//      return callback()
      };
      return {
//      msg: 'Welcome to register page'
        labelPosition: 'right',
        platformId: '',
        worldCountryData: [],
        formRegister: {
          userName: '',
          email: '',
          password: '',
          confirmPassword: '',
          telephone: '',
          userInfo: '',
          occupation: '',
          researchDomain: '',
          researchDirection: '',
          workOrganization: '',
          countryNo: ''
        },
        registerRules: {
          userName: [
            {required: true, validator: checkUserName, trigger: 'blur'}
          ],
          email: [
            {required: true, validator: checkEmail, trigger: 'blur'}
          ],
          password: [
            {required: true, validator: checkPass, trigger: 'blur'}
          ],
          confirmPassword: [
            {required: true, validator: checkConPass, trigger: 'blur'}
          ],
          telephone: [
            {validator: checkTelephone, trigger: 'blur'}
          ],
//        userInfo: '',
//        occupation:'',
//        researchDomain:'',
//        researchDirection:'',
          workOrganization: [
            {required: true, message: '请选择工作机构', trigger: 'blur'}
          ],
          countryNo: [
            {required: true, message: '请选择国家', trigger: 'change'}
          ],
        },
        options: provinceAndCityData,
        provinceAndCityNo: []

      }
    },
    mounted: function () {
      this.$http.get('static/worldCountry.json').then(res => {
        this.worldCountryData = res.body
      });

      this.platformId=this.$route.query.platformId
//      console.log(this.platformId)
//      console.log(provinceAndCityData)
//      console.log(provinceAndCityData[0].label,provinceAndCityData[0].value)
//      console.log(provinceAndCityData[0].children[0].label)
    },
    methods: {
      userRegister3() {
        this.$refs['formRegister'].validate((valid) => {
          if (valid) {
            if (this.formRegister.countryNo !== '156') {
              this.provinceAndCityNo = []
            } else {
              if (this.provinceAndCityNo.length === 0) {
                this.$notify({
                  title: '警告',
                  message: '请选择省、市',
                  type: 'warning'
                });
                return false;
              }
            }
            let params = {
              platformId: this.platformId,
              userName: encodeURIComponent(this.formRegister.userName),
              email: encodeURIComponent(this.formRegister.email),
              password: this.$md5(this.formRegister.password),
              telephone: this.formRegister.telephone,
              userInfo: encodeURIComponent(this.formRegister.userInfo),
              occupation: encodeURIComponent(this.formRegister.occupation),
              researchDomain: encodeURIComponent(this.formRegister.researchDomain),
              researchDirection: encodeURIComponent(this.formRegister.researchDirection),
              workOrganization: encodeURIComponent(this.formRegister.workOrganization),
              countryNo: this.formRegister.countryNo,
              provinceAndCityNo: this.provinceAndCityNo,
            };
            this.$axios.post('/user/userRegister3', params).then(res => {
              if (res.data.code === 1) {
                this.$notify({
                  title: '成功',
                  message: '注册成功，请根据邮箱内邮件激活账号并重新登录',
                  type: 'success',
                  duration: 10000   //unit:ms
                });
                this.$router.push({path: "/login"});
              } else {
                this.$notify({
                  title: '警告',
                  message: res.data.msg,
                  type: 'warning',
                  duration: 10000
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
      backLogin() {
//        let params = {
//          platformId: this.platformId,
//        };
        this.$router.push({path: "/login"});
      },
//      handleChange (value) {
//        console.log(value)
//      }
    },
  }
</script>

<style scoped>
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
