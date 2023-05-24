
<template>
  <div class="TreeStruct" >

    <!--条件查询-->
    <div class="find" style="">
      <el-input placeholder="节点名" v-model="pagination.nodeName" style="width: 200px;"
                class="filter-item"></el-input>
      <el-input placeholder="类型" v-model="pagination.treeType" style="width: 200px;"
                class="filter-item"></el-input>
      <el-input placeholder="得分" v-model="pagination.score" style="width: 200px;"
                class="filter-item"></el-input>
      <el-input placeholder="孩子数组" v-model="pagination.childrenName" style="width: 200px;"
                class="filter-item"></el-input>
      <el-button @click="getAll()" class="dalfBut">查询</el-button>
      <el-button type="primary" class="butT" @click="handleCreate()">新建</el-button>
      <el-button @click="resetSelect()" type="warning" class="dalfBut">重置</el-button>
    </div>

    <!--表格-->
    <el-table
      class="table"
      :data="TreeStruct"
      >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item  v-for="(item,index) in props.row.childrenName" :key="index" :label="String(index+1)">
              <span style="white-space:pre-wrap;">{{ item }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        label="英文名"
        prop="nodeName"
        min-width="100"
        >
        <template slot-scope="scope">
  <!--    white-space:pre-wrap; 保留空白符序列，但是正常地进行换行。    -->
          <span style="white-space:pre-wrap;">{{scope.row.nodeName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="得分"
        prop="score">
      </el-table-column>
      <el-table-column
        label="类型"
        prop="treeType">
      </el-table-column>

      <el-table-column label="操作" align="center">>
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  分页组件-->
    <div class="pagination" >
    <el-pagination
      class="pagiantion"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
  </div>

    <!-- 新增标签弹层 -->
    <div class="add-form">
    <!--   append-to-body——Dialog自身是否插入至body元素上，嵌套的Dialog必须指定该属性并赋值为true   -->
    <el-dialog title="新增描述符结构信息" :visible.sync="dialogFormVisible" :append-to-body="true">
      <el-form :model="formData" :rules="rules" label-position="right"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="节点名" prop="nodeName">
              <el-input v-model="formData.nodeName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-input v-model="formData.treeType"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="孩子数组">
              <el-input v-model="formData.childrenName" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="handleAdd()">确定</el-button>
      </div>
    </el-dialog>
  </div>

    <!-- 编辑表单弹层   -->
    <div class="add-form">
    <el-dialog title="编辑检查项" :visible.sync="dialogFormVisible4Edit" :append-to-body="true">
      <el-form :model="formData" :rules="rules" label-position="right"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="节点名" prop="nodeName">
              <el-input v-model="formData.nodeName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-input v-model="formData.treeType"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="孩子数组">
              <div v-for="(value,index) in formData.childrenName" :key="index">
                <el-input v-model=formData.childrenName[index] style="width: 265px;margin-right:25px;margin-bottom: 15px">
                </el-input>
                <el-button type="danger" icon="el-icon-delete" circle style="margin-right:15px;margin-bottom: 10px"
                           @click="formData.childrenName.splice(index,1);formData.childrenId.splice(index,1);"
                ></el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="handleEdit()">确定</el-button>
      </div>
    </el-dialog>
  </div>

  </div>
</template>




<script>
export default {
  name: "TreeStruct",
  data () {
    return {
      TreeStruct: [],

      pagination: {//分页相关模型数据
        currentPage: 1,//当前页码
        pageSize: 10,//每页显示的记录数
        total: 0,//总记录数

        //查询条件
        nodeName: '',
        treeType: '',
        childrenName: '',
        score:'',
      },

      //表单信息
      url:"TreeStruct/",
      dialogFormVisible: false,//添加表单是否可见
      dialogFormVisible4Edit: false,//编辑表单是否可见
      formData: {},//表单数据
      rules: {//校验规则
        nodeName: [{required: true, message: '结点名为必填项', trigger: 'blur'}]}

    }

  },
  created() {
    this.getAll()
  },

  methods: {
    //查询描述符树所有信息
    //分页查询
    getAll() {
      //组织参数，拼接url地址
      let param;
      param = "?query"
      if (this.pagination.nodeName !== ""&& this.pagination.nodeName.length!==0)
      {
        param += "&nodeName=" + this.pagination.nodeName;
      }
      if (this.pagination.treeType !== "" && this.pagination.treeType.length!==0)
      {
        param += "&treeType=" + this.pagination.treeType;
      }
      if (this.pagination.score !== "" && this.pagination.score.length!==0)
      {
        param += "&score=" + this.pagination.score;
      }
      if (this.pagination.childrenName !== ""&& this.pagination.childrenName.length!==0)
      {
        param += "&childrenName=" + this.pagination.childrenName;
      }
      let url=this.url + this.pagination.currentPage + "/" + this.pagination.pageSize + param
      // console.log(url);
      //发送异步请求
      this.$axios.get(url)
      // this.$axios.get(this.url)
        .then((resp) => {
          // console.log(resp.data)
          //更新页面数据
          this.TreeStruct = resp.data.content;
          //更新分页组件总条数
          this.pagination.total=resp.data.totalElements;
          //也必须更新当前页面，不然会出现bug
          this.pagination.currentPage=resp.data.number+1
          this.pagination.pagesize = resp.data.size;
        }, error=>{
          console.log("请求失败了",error.message)
        })
    },
    //切换页码
    handleCurrentChange(currentPage) {
      //    修改页码值为当前选中的页码值
      this.pagination.currentPage = currentPage;
      //    执行查询
      this.getAll();
    },
    //  重置查询框
    resetSelect() {
      this.pagination.nodeName = '';
      this.pagination.treeType = '';
      this.pagination.childrenName = '';
      this.pagination.score=''
      this.getAll();
    },
    //  下面为编辑表单函数
    //弹出添加窗口
    handleCreate() {
      this.dialogFormVisible = true;
      this.resetForm();
    },
    //重置表单
    resetForm() {
      this.formData = {}
    },

    //添加
    handleAdd() {
      this.$axios.put(this.url, this.formData).then((res) => {
        //    判断当前操作是否成功
        console.log(res)
        if (res.data!==null) {
          //    1.关闭弹层
          this.dialogFormVisible = false;
          this.$message.success("添加成功");
        } else {
          this.$message.error("添加失败");
        }
      }).finally(() => {
        //    2.重新加载数据
        this.getAll()
      });
    },

    //取消
    cancel() {
      //    1.关闭弹层
      this.dialogFormVisible = false;
      this.dialogFormVisible4Edit = false;
      this.$message.info("当前操作取消");
    },
    // 删除
    handleDelete(row) {
      this.$confirm("将永久删除当前信息，是否继续？", "提示", {type: "info"}).then(() => {

        this.$axios.post(this.url+"/delete",{id: row.id}).then((res) => {
          console.log(res)
          //    判断当前操作是否成功
          if (res.data.deletedCount===1) {
            this.$message.success("删除成功");
          } else {
            this.$message.error("数据同步失败，自动刷新")
          }
        }).finally(() => {
          //    2.重新加载数据
          this.getAll()
        });
      }).catch(() => {
        this.$message.info("取消操作")
      })
    },

    //弹出编辑窗口
    handleUpdate(row) {

      this.$axios.post(this.url,{id: row.id}).then((res) => {
        // console.log("查询的id是",row.id)
        // console.log(res.data)
        if (res.data != null) {
          this.dialogFormVisible4Edit = true;
          this.formData = res.data;
        }
      },(error)=>{
        console.log(error),
          this.$message.error("数据同步失败，自动刷新")
      }).finally(() => {
        this.getAll();
      });
    },

    //修改
    handleEdit() {
      this.$axios.put(this.url, this.formData).then((res) => {
        //    判断当前操作是否成功
        // console.log(res)
        if (res.data !==null) {
          //    1.关闭弹层
          this.dialogFormVisible4Edit = false;
          this.$message.success("修改成功");
        } else {
          this.$message.error("修改失败");
        }
      }).finally(() => {
        //    2.重新加载数据
        this.getAll()
      });
    },
  },
}
</script>



<style  scoped>
 .demo-table-expand {
   font-size: 0;
 }
 .demo-table-expand label {
   width: 90px;
   color: #99a9bf;
 }
 .demo-table-expand .el-form-item {
   margin-right: 0;
   margin-bottom: 0;
   width: 100%;
 }
 .el-table::before {
   height: 0;
 }
 .TreeStruct{
   height: 540px;
 }
 .find{
   margin-bottom: 5px;
 }
 .table{
   height: 460px;
   overflow: auto;
   font-size:14px;
 }
 /*隐藏竖向进度条*/
 .table::-webkit-scrollbar {
   display: none;
 }
 /*分页组件*/
 .pagination{
   /*居中显示*/
   text-align: center;
 }
</style>



