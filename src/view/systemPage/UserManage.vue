<template>
  <div>
    用户管理
    <el-row style="margin-top: 20px">
      <el-col :span="4" :offset="14">
        <el-button type="primary" @click="getRegisterUserMenu()">设置新注册用户默认可访问模块</el-button>
      </el-col>
      <el-col :span="4" :offset="1">
        <el-button type="primary" @click="dialogNewUser=true">新增用户</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="20" :offset="2">
        <el-table :data="usersData" stripe border style="width: 100%">
          <el-table-column property="userName" label="用户名" width="200"></el-table-column>
          <el-table-column property="email" label="邮箱" width="150"></el-table-column>
          <el-table-column property="telephone" label="手机号" width="150"></el-table-column>
          <el-table-column property="workOrganization" label="研究机构/工作单位" width="250"></el-table-column>
          <el-table-column property="region" label="地区" width="250"></el-table-column>
          <el-table-column label="状态" width="200">
            <template slot-scope="scope">
              <p v-if="scope.row.userActive===activeStatus">已激活</p>
              <p v-if="scope.row.userActive===inActiveStatus">已停用</p>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button @click="getUserMenu(scope.row)" type="text" size="small">可访问模块</el-button>
              <el-button v-if="scope.row.userActive === activeStatus" @click="changeUserStatus(scope.row)"
                         type="primary" size="mini">停用
              </el-button>
              <el-button v-if="scope.row.userActive === inActiveStatus" @click="changeUserStatus(scope.row)" size="mini"
                         type="danger">激活
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="新增用户" :visible.sync="dialogNewUser" :modal=false @close="closeNewUserDialog">
      <el-form :model="formNewUser" :rules="newUserRules" ref="formNewUser">
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="formNewUser.email" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="telephone">
          <el-input v-model="formNewUser.telephone" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
          <el-input v-model="formNewUser.userName" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="研究机构/工作单位" :label-width="formLabelWidth" prop="workOrganization">
          <el-input v-model="formNewUser.workOrganization" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="国家" :label-width="formLabelWidth" prop="countryNo">
          <el-select v-model="formNewUser.countryNo" filterable placeholder="请选择" style="width: 80%">
            <el-option
              v-for="item in worldCountryData"
              :key="item.code"
              :label="item.cnName+'--'+item.enName"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择省、市" :label-width="formLabelWidth" v-if="formNewUser.countryNo==='156'">
          <el-cascader
            size="large"
            :options="options"
            v-model="provinceAndCityNo"
            style="width: 80%" filterable>
            <!--@change="handleChange"-->
          </el-cascader>
        </el-form-item>
        <el-form-item label="默认密码" :label-width="formLabelWidth">
          <label>123456</label>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNewUser=false">取 消</el-button>
        <el-button type="primary" @click="addNewUser()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="用户可访问模块信息" :visible.sync="dialogUserMenuVisible" :modal=false>
      <div>注：勾选子菜单时必须勾选上一级菜单</div>
      <el-tree
        :data="platformMenu"
        :check-strictly="true"
        ref="treeUser"
        show-checkbox
        node-key="order"
        :default-checked-keys="userMenu"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserMenuVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateUserMenu()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新注册用户可访问模块信息" :visible.sync="dialogRegisterUserMenuVisible" :modal=false>
      <div>注：勾选子菜单时必须勾选上一级菜单</div>
      <el-tree
        :data="platformMenu"
        :check-strictly="true"
        ref="treeRegisterUser"
        show-checkbox
        node-key="order"
        :default-checked-keys="registerUserMenu"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRegisterUserMenuVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateRegisterUserMenu()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { provinceAndCityData,CodeToText } from 'element-china-area-data'

  export default {
    name: "UserManage",
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
            userRoleId:'2',
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
              userRoleId:'2',
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
            userRoleId:'2',
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
      return {
        activeStatus: '1',
        inActiveStatus: '0',
        formLabelWidth: '180px',
        usersData: [],
        dialogNewUser: false,
        dialogUserMenuVisible: false,
        dialogRegisterUserMenuVisible: false,
        formNewUser: {
          email: '',
          telephone: '',
          userName: '',
          workOrganization:'',
          countryNo:'',
        },
        platformMenu: [],
        userMenu: [],
        registerUserMenu:[],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        tmpUpdateUserMenu: '',
        newUserRules: {
          email: [
            {required: true, validator: checkEmail, trigger: 'blur'}
          ],
          telephone: [
            {validator: checkTelephone, trigger: 'blur'}
          ],
          userName: [
            {required: true, validator: checkUserName, trigger: 'blur'}
          ],
          workOrganization: [
            {required: true,message: '请选择工作机构', trigger: 'blur'}
          ],
          countryNo:[
            {required: true, message: '请选择国家',trigger: 'change'}
          ],
        },
        worldCountryData:[],
        options: provinceAndCityData,
        provinceAndCityNo: []
      }
    },
    mounted: function () {
      this.getUserList();
      this.$http.get('static/worldCountry.json').then(res => {
        this.worldCountryData= res.body
      })
    },
    methods: {
      getUserList() {
        let params = {};
        this.$axios.post('/user/getUserList', params).then(res => {
          if (res.data.code === 1) {
            let JsonParams = JSON.parse(res.data.data);
            for(let i=0;i<JsonParams.length;i++){
              JsonParams[i].region='';
              for (let item of this.worldCountryData){
                if (JsonParams[i].countryNo===item.code){
                  JsonParams[i].region=item.cnName+'--'+item.enName;
                  break
                }
              }
              if(JsonParams[i].countryNo==='156'){
                JsonParams[i].region+=','+CodeToText[JsonParams[i].provinceNo];
                JsonParams[i].region+=','+CodeToText[JsonParams[i].cityNo]
              }
            }
            this.usersData = JsonParams;
          } else {
            this.$notify({
              title: '警告',
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
      },
      closeNewUserDialog() {
        this.$refs['formNewUser'].resetFields();

      },
      addNewUser() {
        this.$refs['formNewUser'].validate((valid) => {
          if (valid) {
            if(this.formNewUser.countryNo!=='156'){
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
            let params = {
              email: this.formNewUser.email,
              telephone: this.formNewUser.telephone,
              userName: encodeURIComponent(this.formNewUser.userName),
              workOrganization: encodeURIComponent(this.formNewUser.workOrganization),
              countryNo: this.formNewUser.countryNo,
              provinceAndCityNo:this.provinceAndCityNo,
            };
            this.$axios.post('/user/addNewUser', params).then(res => {
              if (res.data.code === 1) {
                this.getUserList();
                this.$notify({
                  title: '成功',
                  message: res.data.msg,
                  type: 'success'
                });
                this.dialogNewUser = false;
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
      getUserMenu(row) {
        this.dialogUserMenuVisible = true;
        this.tmpUpdateUserMenu = row.userId;
        let params = {
          userId: row.userId
        };
        this.$axios.post('/user/getUserMenu', params).then(res => {
          if (res.data.code === 1) {
            let JsonParams = JSON.parse(res.data.data);
            this.platformMenu = JsonParams.platformMenu;
            this.userMenu = JsonParams.userMenu;
          } else {
            this.$notify({
              title: '警告',
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
      },
      updateUserMenu() {
        let params = {
          userId: this.tmpUpdateUserMenu,
          newMenuList: this.$refs.treeUser.getCheckedKeys()
        };
        this.$axios.post('/user/updateUserMenu', params).then(res => {
          if (res.data.code === 1) {
            this.$notify({
              title: '成功',
              message: res.data.msg,
              type: 'success'
            });
            this.dialogUserMenuVisible = false;
          } else {
            this.$notify({
              title: '警告',
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
      },
      changeUserStatus(row) {
        let params = {
          userId: row.userId,
          activeStatus: row.userActive,
        };
        this.$axios.post('/user/changeUserStatus', params).then(res => {
          if (res.data.code === 1) {
            row.userActive = (row.userActive === this.inActiveStatus ? this.activeStatus : this.inActiveStatus);
            this.$notify({
              title: '成功',
              message: res.data.msg,
              type: 'success'
            });
          } else {
            this.$notify({
              title: '警告',
              message: res.data.msg,
              type: 'warning'
            });
          }
        })

      },

      getRegisterUserMenu(){
        this.dialogRegisterUserMenuVisible = true;
        let params = {};
        this.$axios.post('/user/getRegisterUserMenu', params).then(res => {
          if (res.data.code === 1) {
            let JsonParams = JSON.parse(res.data.data);
            this.platformMenu = JsonParams.platformMenu;
            this.registerUserMenu = JsonParams.registerUserMenu;
          } else {
            this.$notify({
              title: '警告',
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
      },

      updateRegisterUserMenu(){
        let params = {
          newMenuList: this.$refs.treeRegisterUser.getCheckedKeys()
        };
        this.$axios.post('/user/updateRegisterUserMenu', params).then(res => {
          if (res.data.code === 1) {
            this.$notify({
              title: '成功',
              message: res.data.msg,
              type: 'success'
            });
            this.dialogRegisterUserMenuVisible = false;
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
  }
</script>

<style scoped>

</style>
