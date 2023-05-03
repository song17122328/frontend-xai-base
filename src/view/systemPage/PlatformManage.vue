<template>
  <div>
    平台管理
    <el-row style="margin-top: 20px">
      <el-col :span="4" :offset="18">
        <el-button type="primary" @click="dialogNewPlatform=true">新增平台</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="20" :offset="2">
        <el-table :data="platformTableData" stripe border style="width: 100%">
          <el-table-column prop="platformName" label="平台名称" width="200"></el-table-column>
          <el-table-column prop="platformDetail" label="平台描述" width="200"></el-table-column>
          <el-table-column prop="platformAbbr" label="平台简称" width="100"></el-table-column>
          <el-table-column prop="platformURL" label="平台URL" width="200"></el-table-column>
          <el-table-column
            label="平台状态"
            width="120">
            <template slot-scope="scope">
              <p  v-if="scope.row.inActive===activeStatus">已激活</p>
              <p  v-if="scope.row.inActive===inActiveStatus">已停用</p>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="400">
            <template slot-scope="scope">
              <el-button @click="platformManagers(scope.row)" type="text" size="small">查看平台管理员</el-button>
              <el-button @click="changePlatformDetail(scope.row)" type="text" size="small">编辑平台信息</el-button>
              <el-button @click="getPlatformMenu(scope.row)" type="primary" size="mini">可访问模块</el-button>
              <el-button v-if="scope.row.inActive === activeStatus" @click="changePlatformStatus(scope.row)" type="primary" size="mini" :disabled="scope.row.platformId==='0'">停用</el-button>
              <el-button v-if="scope.row.inActive === inActiveStatus" @click="changePlatformStatus(scope.row)"  size="mini" type="danger" :disabled="scope.row.platformId==='0'">激活</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>


    <el-dialog title="平台管理员信息" :visible.sync="dialogManagersTableVisible" :modal=false>
      <el-button type="primary" @click="dialogNewManager=true">新增平台管理员</el-button>
      <el-table :data="managersData" height="250" border>
        <el-table-column property="userName" label="用户名" width="200"></el-table-column>
        <el-table-column property="email" label="邮箱" width="150"></el-table-column>
        <el-table-column property="telephone" label="手机号" width="150"></el-table-column>
        <el-table-column property="loginNo" label="统一认证号" width="150"></el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <p  v-if="scope.row.userActive===activeStatus">已激活</p>
            <p  v-if="scope.row.userActive===inActiveStatus">已停用</p>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.userActive === activeStatus" @click="changeUserStatus(scope.row)" type="primary" size="mini">停用</el-button>
            <el-button v-if="scope.row.userActive === inActiveStatus" @click="changeUserStatus(scope.row)"  size="mini" type="danger">激活</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="修改平台信息" :visible.sync="dialogChangePlatformInfo" :modal=false>
      <el-form :model="formChangePlatformInfo">
        <el-form-item label="新的平台信息" :label-width="formLabelWidth">
          <el-input v-model="formChangePlatformInfo.newPlatformInfo" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="平台网址" :label-width="formLabelWidth">
          <el-input v-model="formChangePlatformInfo.platformURL" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cID2">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="平台可访问模块信息" :visible.sync="dialogPlatformMenuVisible" :modal=false>
      <div>注：勾选子菜单时必须勾选上一级菜单</div>
      <el-tree
        :data="menuData"
        :check-strictly="true"
        ref="tree"
        show-checkbox
        node-key="order"
        :default-checked-keys="platformMenu"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPlatformMenuVisible=false">取 消</el-button>
        <el-button type="primary" @click="updatePlatformMenu()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增平台" :visible.sync="dialogNewPlatform" :modal=false @close="closeNewPlatformDialog">
      <el-form :model="formNewPlatform" :rules="platformRules" ref="formNewPlatform">
        <el-form-item label="新增平台名称" :label-width="formLabelWidth2" prop="platformName">
          <el-input v-model="formNewPlatform.platformName" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="新增平台信息" :label-width="formLabelWidth2" prop="platformDetail">
          <el-input v-model="formNewPlatform.platformDetail" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="新增平台英文简称" :label-width="formLabelWidth2" prop="platformAbbr">
          <el-input v-model="formNewPlatform.platformAbbr" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNewPlatform=false">取 消</el-button>
        <el-button type="primary" @click="addNewPlatform()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增平台管理员" :visible.sync="dialogNewManager" :modal=false @close="closeNewManagerDialog">
      <el-form :model="formNewManager" :rules="managerRules" ref="formNewManager">
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="formNewManager.email" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="telephone">
          <el-input v-model="formNewManager.telephone" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="统一认证号" :label-width="formLabelWidth" prop="loginNo">
          <el-input v-model="formNewManager.loginNo" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
          <el-input v-model="formNewManager.userName" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="默认密码" :label-width="formLabelWidth">
          <label>123456</label>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNewManager=false">取 消</el-button>
        <el-button type="primary" @click="addNewManager()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ElRow from "element-ui/packages/row/src/row";
import ElCol from "element-ui/packages/col/src/col";

export default {
  components: {
    ElCol,
    ElRow},
  name: "PlatformManage",
  data() {
    //涉及到后端动态查询要按return这样写
    const checkEmail = (rule, value, callback) => {
      // 正则表达式验证
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+(\.([a-zA-Z]{2,4})){1,2}$/;
      if(value === '') {
        return callback(new Error('邮箱不能为空!'))
      }else if(!(regEmail.test(value))){
        return callback(new Error('请输入合法的邮箱!'))
      }else{
        let params={
          email:value,
          platformId:this.formNewManager.platformId,
          userRoleId:'1',
        };
        this.$axios.post('/user/valRepeatEmail',params).then(res => {
          if(res.data.code!==1){
            return callback(new Error(res.data.msg))
          }else {
            callback();
          }
        })
      }
//      return callback()
    };
    const checkTelephone= (rule, value, callback) => {
      // 正则表达式验证
      const regTelephone = /^1[345678]\d{9}$/;
      if(value !== '') {
        if (!(regTelephone.test(value))) {
          return callback(new Error('请输入合法手机号!'))
        }else {
          let params={
            telephone:value,
            platformId:this.formNewManager.platformId,
            userRoleId:'1',
          };
          this.$axios.post('/user/valRepeatTelephone',params).then(res => {
            if(res.data.code!==1){
              return callback(new Error(res.data.msg))
            }else {
              callback();
            }
          })
        }
      }else {
        callback()
      }
//      return callback()
    };
    const checkLoginNo= (rule, value, callback) => {
      // 正则表达式验证
      const regLoginNo = /^[0-9]{1,10}$/;
      if(value !== '') {
        if (!(regLoginNo.test(value))) {
          return callback(new Error('请输入长度为1到10且数字的统一认证号!'))
        }else {
          let params={
            loginNo:value
          };
          this.$axios.post('/user/valRepeatLoginNo',params).then(res => {
            if(res.data.code!==1){
              return callback(new Error(res.data.msg))
            }else {
              callback();
            }
          })
        }
      }else{
        callback()
      }
//      return callback()
    };
    const checkUserName = (rule, value, callback) => {
      if(value === '') {
        return callback(new Error('用户名不能为空!'))
      }else{
        let params={
          userName:value,
          platformId:this.formNewManager.platformId,
          userRoleId:'1',
        };
        this.$axios.post('/user/valRepeatUserName',params).then(res => {
          if(res.data.code!==1){
            return callback(new Error(res.data.msg))
          }else{
            callback();
          }
        })
      }
//      return callback()
    };
    const checkPlatformAbbr = (rule, value, callback) => {
      // 正则表达式验证
      const regAbbr = /^[a-zA-Z]{1,20}$/;
      if (value === '') {
        return callback(new Error('平台简称不能为空!'))
      } else if (!(regAbbr.test(value))) {
        return callback(new Error('平台简称为1到20个英文大小写字母!'))
      } else {
        let aaa='';
        for(let i=0;i<this.platformTableData.length;i++)
          aaa=this.platformTableData[i].platformAbbr
          if(value===aaa)
            return callback(new Error('平台简称重复'));
          else
            callback()
      }
//      return callback()
    };
    return {
      activeStatus:'1',
      inActiveStatus:'0',
      platformTableData: [],
      dialogManagersTableVisible:false,
      dialogChangePlatformInfo:false,
      dialogNewPlatform:false,
      dialogNewManager:false,
      dialogPlatformMenuVisible:false,
      managersData:[],
      formChangePlatformInfo:{
        newPlatformInfo:'',
        platformId:'',
        platformURL:'',
      },
      formLabelWidth: '120px',
      formLabelWidth2:'200px',
      formNewPlatform:{
        platformName:'',
        platformDetail:'',
        platformAbbr:'',
      },
      formNewManager:{
        platformStatus:'',
        platformId:'',
        loginNo:'',
        email:'',
        telephone:'',
        userName:'',
      },
      menuData:[],
      platformMenu:[],
      defaultProps:{
        children: 'children',
        label: 'name'
      },
      tmpUpdatePlatformMenu:'',
      platformRules: {
        platformName: [
          { required: true, message: '请输入平台名称', trigger: 'blur' }
        ],
        platformDetail: [
          { required: true, message: '请输入平台描述信息', trigger: 'blur' }
        ],
        platformAbbr: [
          { required: true, validator: checkPlatformAbbr, trigger: 'blur' }
        ],
      },
      managerRules: {
        email: [
          { required: true, validator: checkEmail, trigger: 'blur' }
        ],
        telephone: [
          { validator: checkTelephone, trigger: 'blur' }
        ],
        loginNo: [
          { validator: checkLoginNo, trigger: 'blur' }
        ],
        userName: [
          { required: true, validator: checkUserName, trigger: 'blur' }
        ],
      }
    }
  },
  mounted:function () {
    this.getPlatformInfo()
  },

  methods: {
    getPlatformInfo() {
      let params={};
      this.$axios.post('/user/getPlatformInfo',params).then(res => {
        if(res.data.code===1){
          let JsonParams=JSON.parse(res.data.data);
          this.platformTableData=JsonParams;
        }else{
          this.$notify({
            title: '警告',
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
    },
    getPlatformMenu(row) {
      this.dialogPlatformMenuVisible=true;
      this.tmpUpdatePlatformMenu=row.platformId;
      let params={
        platformId:row.platformId
      };
      this.$axios.post('/user/getPlatformMenu',params).then(res => {
        if(res.data.code===1){
          let JsonParams=JSON.parse(res.data.data);
          this.menuData=JsonParams.menuData;
          this.platformMenu=JsonParams.platformMenu;
        }else{
          this.$notify({
            title: '警告',
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
    },
    updatePlatformMenu(){
//      console.log(this.$refs.tree.getCheckedKeys())
      let params={
        platformId:this.tmpUpdatePlatformMenu,
        newMenuList:this.$refs.tree.getCheckedKeys()
      };
      this.$axios.post('/user/updatePlatformMenu',params).then(res => {
        if(res.data.code===1){
          this.$notify({
            title: '成功',
            message: res.data.msg,
            type: 'success'
          });
          this.dialogPlatformMenuVisible=false;
        }else{
          this.$notify({
            title: '警告',
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
    },
    platformManagers(row) {
      this.formNewManager.platformStatus=row.inActive;
      this.formNewManager.platformId=row.platformId;
      this.dialogManagersTableVisible=true;
      let params={platformId:row.platformId};
      this.$axios.post('/user/platformManagers',params).then(res => {
        if(res.data.code===1){
          let JsonParams=JSON.parse(res.data.data);
          this.managersData=JsonParams;
        }else{
          this.$notify({
            title: '警告',
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
    },
    changePlatformDetail(row) {
      this.formChangePlatformInfo.newPlatformInfo=row.platformDetail;
      this.formChangePlatformInfo.platformId=row.platformId;
      this.dialogChangePlatformInfo=true;
    },
    cID2() {
      let params={
        newPlatformDetail: encodeURIComponent(this.formChangePlatformInfo.newPlatformInfo),
        platformId:this.formChangePlatformInfo.platformId,
        platformURL:encodeURIComponent(this.formChangePlatformInfo.platformURL),
      };
      this.$axios.post('/user/changePlatformDetail',params).then(res => {
        if(res.data.code===1){
          this.$notify({
            title: '成功',
            message: res.data.msg,
            type: 'success'
          });
          // 表格数据修改,仅适用于较少数据
          for(let i=0;i<this.platformTableData.length;i++){
            if(this.platformTableData[i].platformId===this.formChangePlatformInfo.platformId){
              this.platformTableData[i].platformDetail=this.formChangePlatformInfo.newPlatformInfo;
              this.platformTableData[i].platformURL=this.formChangePlatformInfo.platformURL;
              break;
            }
          }
          this.dialogChangePlatformInfo=false
        }else{
          this.$notify({
            title: '警告',
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
    },
    changePlatformStatus(row) {
      let params={
        platformId:row.platformId,
        activeStatus:row.inActive,
      };
      this.$axios.post('/user/changePlatformStatus',params).then(res => {
        if(res.data.code===1){
          row.inActive=(row.inActive===this.inActiveStatus?this.activeStatus:this.inActiveStatus);
          this.$notify({
            title: '成功',
            message: res.data.msg,
            type: 'success'
          });
        }else{
          this.$notify({
            title: '警告',
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
    },
    closeNewPlatformDialog(){
      this.$refs['formNewPlatform'].resetFields();
    },

    addNewPlatform(){
      this.$refs['formNewPlatform'].validate((valid) => {
        if (valid) {
          let params={
            platformName: encodeURIComponent(this.formNewPlatform.platformName),
            platformDetail: encodeURIComponent(this.formNewPlatform.platformDetail),
            platformAbbr:this.formNewPlatform.platformAbbr
          };
          this.$axios.post('/user/addNewPlatform',params).then(res => {
            if(res.data.code===1){
              this.getPlatformInfo();
              this.$notify({
                title: '成功',
                message: res.data.msg,
                type: 'success'
              });
              this.dialogNewPlatform=false;
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
    changeUserStatus(row) {
      if(this.formNewManager.platformStatus===this.inActiveStatus){
        this.$notify({
          title: '警告',
          message: '请先激活当前平台',
          type: 'warning'
        });
      }else{
        let params={
          userId:row.userId,
          activeStatus:row.userActive,
        };
        this.$axios.post('/user/changeUserStatus',params).then(res => {
          if(res.data.code===1){
            row.userActive=(row.userActive===this.inActiveStatus?this.activeStatus:this.inActiveStatus);
            this.$notify({
              title: '成功',
              message: res.data.msg,
              type: 'success'
            });
          }else{
            this.$notify({
              title: '警告',
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
      }
    },

    closeNewManagerDialog(){
      this.$refs['formNewManager'].resetFields();

    },
    addNewManager(){
      this.$refs['formNewManager'].validate((valid) => {
        if (valid) {
          let params={
            loginNo: this.formNewManager.loginNo,
            email: this.formNewManager.email,
            telephone: this.formNewManager.telephone,
            userName: encodeURIComponent(this.formNewManager.userName),
            platformId: this.formNewManager.platformId,
            platformStatus: this.formNewManager.platformStatus,
          };
          this.$axios.post('/user/addNewManager',params).then(res => {
            if(res.data.code===1){
              this.$notify({
                title: '成功',
                message: res.data.msg,
                type: 'success'
              });
              this.dialogNewManager=false;
              this.dialogManagersTableVisible=false;
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
  },
}
</script>

<style scoped>

</style>
