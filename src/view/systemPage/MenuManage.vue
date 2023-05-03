<template>
  <div>
    菜单管理
    <el-row style="margin-top: 20px">
      <el-col :span="4" :offset="18">
        <el-button type="primary" @click="dialogNewFMenuMeb=true">新增父菜单</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="20" :offset="2">
        <el-table
          :data="menuData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="order"
          border
          :tree-props="{children: 'children'}">
          <el-table-column
            prop="order"
            label="菜单唯一标识号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="菜单名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="path"
            label="菜单路径"
            width="200">
          </el-table-column>
          <el-table-column
            label="操作" align="right" header-align="left">
            <template slot-scope="scope">
              <el-button v-if="scope.row.menuLevel === '1'" @click="newMenuMeb(scope.row)" type="primary" size="small">新增子菜单</el-button>
              <el-button v-if="scope.row.menuActive === activeStatus" @click="changeMenuStatus(scope.row)" type="primary" size="mini">停用</el-button>
              <el-button v-if="scope.row.menuActive === inActiveStatus" @click="changeMenuStatus(scope.row)" size="mini" type="danger">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="新增子菜单" :visible.sync="dialogNewMenuMeb" :modal=false @close="closeNewMenuMeb">
      <el-form :model="formNewMenuMeb" :rules="menuMebRules" ref="formNewMenuMeb">
        <el-form-item label="新增菜单编号" :label-width="formLabelWidth" prop="order">
          <el-input v-model="formNewMenuMeb.order" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="新增菜单名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="formNewMenuMeb.name" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="新增菜单路径" :label-width="formLabelWidth" prop="path">
          <el-input v-model="formNewMenuMeb.path" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNewMenuMeb=false">取 消</el-button>
        <el-button type="primary" @click="addNewMenuMeb()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增父菜单" :visible.sync="dialogNewFMenuMeb" :modal=false @close="closeNewFMenuMeb">
      <el-form :model="formNewFMenuMeb" :rules="FMenuMebRules" ref="formNewFMenuMeb">
        <el-form-item label="新增菜单编号" :label-width="formLabelWidth" prop="order">
          <el-input v-model="formNewFMenuMeb.order" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="新增菜单名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="formNewFMenuMeb.name" style="width: 80%"></el-input>
        </el-form-item>
        <!--<el-form-item label="新增菜单路径" :label-width="formLabelWidth" prop="path">-->
          <!--<el-input v-model="formNewFMenuMeb.path" style="width: 80%"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNewFMenuMeb=false">取 消</el-button>
        <el-button type="primary" @click="addNewFMenuMeb()">确 定</el-button>
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
  name: "MenuManage",
  data() {
    const checkMenuId = (rule, value, callback) => {
      if(value === '') {
        return callback(new Error('菜单编号不能为空!'))
      }else{
        let params={
          menuId:value
        };
        this.$axios.post('/user/valRepeatMenuId',params).then(res => {
          if(res.data.code!==1){
            return callback(new Error(res.data.msg))
          }else{
            callback()
          }
        })
      }
//      return callback()
    };
    const checkMenuPath = (rule, value, callback) => {
      if(value === '') {
        return callback(new Error('菜单路径不能为空!'))
      }else{
        let params={
          menuPath:value
        };
        this.$axios.post('/user/valRepeatMenuPath',params).then(res => {
          if(res.data.code!==1){
            return callback(new Error(res.data.msg))
          }else {
            callback()
          }
        })
      }
//      return callback()
    };

    return {
      menuData: [],
      activeStatus:'1',
      inActiveStatus:'0',
      dialogNewMenuMeb:false,
      dialogNewFMenuMeb:false,
      formLabelWidth: '120px',
      formNewMenuMeb:{
        order:'',
        name:'',
        path:'',
        fatherId:'',
        level:'',
        active:'',
      },
      formNewFMenuMeb:{
        order:'',
        name:'',
//        path:'',
        fatherId:'',
        level:'',
        active:'',
      },
      FMenuMebRules: {
        order: [
          { required: true, validator: checkMenuId, trigger: 'blur' }
        ],
        name: [
          { required: true,message: '请输入菜单名', trigger: 'blur' }
        ],
//        path: [
//          { required: true,validator: checkMenuPath, trigger: 'blur' }
//        ]
      },
      menuMebRules: {
        order: [
          { required: true, validator: checkMenuId, trigger: 'blur' }
        ],
        name: [
          { required: true,message: '请输入菜单名', trigger: 'blur' }
        ],
        path: [
          { required: true,validator: checkMenuPath, trigger: 'blur' }
        ]
      }
    };
  },
  mounted:function () {
    this.getMenuManageData();
  },
  methods: {
    getMenuManageData() {
      let params={};
      this.$axios.post('/user/getMenuManageData',params).then(res => {
        if(res.data.code===1){
          this.menuData=JSON.parse(res.data.data);
        }else{
          this.$notify({
            title: '警告',
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
    },
    newMenuMeb(row) {
      this.formNewMenuMeb.fatherId=row.order;
      this.dialogNewMenuMeb=true;
    },
    closeNewMenuMeb(){
      this.$refs['formNewMenuMeb'].resetFields();
    },
    addNewMenuMeb() {
      this.$refs['formNewMenuMeb'].validate((valid) => {
        if (valid) {
          let params={
        menuId:this.formNewMenuMeb.order,
        name:encodeURIComponent(this.formNewMenuMeb.name),
        path:encodeURIComponent(this.formNewMenuMeb.path),
        fatherId:this.formNewMenuMeb.fatherId,
      };
          this.$axios.post('/user/addNewMenuMeb',params).then(res => {
        if(res.data.code===1){
          this.getMenuManageData();
          this.$notify({
            title: '成功',
            message: res.data.msg,
            type: 'success'
          });
          this.dialogNewMenuMeb=false;
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
    closeNewFMenuMeb(){
      this.$refs['formNewFMenuMeb'].resetFields();
    },
    addNewFMenuMeb() {
      this.$refs['formNewFMenuMeb'].validate((valid) => {
        if (valid) {
          let params={
        menuId:this.formNewFMenuMeb.order,
        name:encodeURIComponent(this.formNewFMenuMeb.name),
//        path:encodeURIComponent(this.formNewFMenuMeb.path),
      };
          this.$axios.post('/user/addNewFMenuMeb',params).then(res => {
        if(res.data.code===1){
          this.getMenuManageData();
          this.$notify({
            title: '成功',
            message: res.data.msg,
            type: 'success'
          });
          this.dialogNewFMenuMeb=false;
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
    changeMenuStatus(row) {
      let params={
        menuId:row.order,
        menuActive:row.menuActive,
      };
      this.$axios.post('/user/changeMenuStatus',params).then(res => {
        if(res.data.code===1){
          row.menuActive=(row.menuActive===this.inActiveStatus?this.activeStatus:this.inActiveStatus);
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
  },
}
</script>

<style scoped>

</style>
