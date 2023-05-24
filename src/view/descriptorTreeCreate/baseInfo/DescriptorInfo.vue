
<template>
  <div class="DescriptorTreeInfo">
    <!--条件查询-->
    <div class="find">
      <el-input placeholder="节点名" v-model="pagination.nodeName" style="width: 200px;"
                class="filter-item"></el-input>
      <el-input placeholder="简介" v-model="pagination.introduce" style="width: 200px;"
                class="filter-item"></el-input>
      <el-input placeholder="概念层级" v-model="pagination.conceptHierarchy" style="width: 200px;"
                class="filter-item"></el-input>
      <el-input placeholder="来源" v-model="pagination.source" style="width: 200px;"
                class="filter-item"></el-input>
      <el-button @click="getAll()" class="dalfBut">查询</el-button>
      <el-button type="primary" class="butT" @click="handleCreate()">新建</el-button>
      <el-button @click="resetSelect()" type="warning" class="dalfBut">重置</el-button>
    </div>
  <!--    表格显示-->

      <el-table
        :data="DescriptorInfoData"
        class="table">
<!--        <el-table-column label="编号" width="115">-->
<!--          <template slot-scope="scope" style="">{{ scope.row.id.counter }}</template>-->
<!--        </el-table-column>-->
        <el-table-column
          label="节点"
          prop="nodeName"
        min-width="200">
          <template slot-scope="scope">
            <span style="font-size:13px;">{{scope.row.nodeName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="中文名"
          prop="zhName"
        min-width="140">
          <template slot-scope="scope">
            <span style="font-size:13px;">{{scope.row.zhName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="简介"
          prop="introduce"
          min-width="280px"
        >
          <template slot-scope="scope">
            <span style="font-size:13px;">{{scope.row.introduce}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="概念层级"
          prop="conceptHierarchy"
        min-width="120">
          <template slot-scope="scope">
            <span style="font-size:13px;">{{scope.row.conceptHierarchy}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="来源"
          prop="source"
        min-width="120">
          <template slot-scope="scope">
            <span style="font-size:13px;">{{scope.row.source}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>


    <!--分页组件-->
      <el-pagination class="pagination"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>

    <!-- 新增标签弹层 -->
    <div class="add-form">
<!--   append-to-body——Dialog自身是否插入至body元素上，嵌套的Dialog必须指定该属性并赋值为true   -->
      <el-dialog title="新增描述符信息" :visible.sync="dialogFormVisible" :append-to-body="true">
        <el-form :model="formData" :rules="rules" label-position="right"
                 label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="节点名" prop="nodeName">
                <el-input v-model="formData.nodeName"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="中文名" prop="zhName">
                <el-input v-model="formData.zhName"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="概念层级" prop="conceptHierarchy">
                <el-input v-model="formData.conceptHierarchy"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="来源" prop="source">
                <el-input v-model="formData.source"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="简介">
                <el-input v-model="formData.introduce" type="textarea"></el-input>
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

    <!-- 编辑表单   -->
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
            <el-col :span="12">
              <el-form-item label="中文名" prop="zhName">
                <el-input v-model="formData.zhName"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="概念层级" prop="conceptHierarchy">
                <el-input v-model="formData.conceptHierarchy"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="来源" prop="source">
                <el-input v-model="formData.source"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="简介">
                <el-input v-model="formData.introduce" type="textarea"></el-input>
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

<style scoped>
/*// 去掉最下面的那一条线*/
.el-table::before {
  height: 0;
}
.DescriptorTreeInfo{
  height: 540px;
}
.find{
  margin-bottom: 5px;
}
.table{
  height: 460px;
  overflow: auto;
}
/*隐藏进度条*/
.table::-webkit-scrollbar {
  display: none;
}
/*分页组件*/
.pagination{
  /*margin: 0 auto;*/
  /*水平居中给*/
  text-align: center;
}

</style>




<script>
export default {
  name: "DescriptorInfo",
  data () {
    return {
      DescriptorInfoData: [],
      pagination: {//分页相关模型数据
        currentPage: 1,//当前页码
        pageSize: 10,//每页显示的记录数
        total: 0,//总记录数

        //查询条件
        nodeName: "",
        zhName: "",
        introduce: "",
        conceptHierarchy:"",
        source:""
      },


      //表单信息
      url:"DescriptorInfo/",
      dialogFormVisible: false,//添加表单是否可见
      dialogFormVisible4Edit: false,//编辑表单是否可见
      formData: {},//表单数据
      rules: {//校验规则
        nodeName: [{required: true, message: '结点名为必填项', trigger: 'blur'}]}
    }
  },
  computed:{},
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
      if (this.pagination.nodeName !== "")
        param += "&nodeName=" + this.pagination.nodeName;
      if (this.pagination.zhName !== "")
        param += "&zhName=" + this.pagination.zhName;
      if (this.pagination.introduce !== "")
        param += "&introduce=" + this.pagination.introduce;
      if (this.pagination.conceptHierarchy !== "")
        param += "&conceptHierarchy=" + this.pagination.conceptHierarchy;
      if (this.pagination.source !== "")
        param += "&source=" + this.pagination.source;
      let url=this.url + this.pagination.currentPage + "/" + this.pagination.pageSize + param
      // console.log(url);
      //发送异步请求
      this.$axios.get(url)
        .then(
          resp => {
          //更新页面数据
          this.DescriptorInfoData = resp.data.content;
          //更新分页组件总条数
          this.pagination.total=resp.data.totalElements;
          //也必须更新当前页面，不然会出现bug
          this.pagination.currentPage=resp.data.number+1
          this.pagination.pagesize = resp.data.size;
        }, error =>{
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
      this.pagination.zhName = '';
      this.pagination.introduce = '';
      this.pagination.nodeName = '';
      this.pagination.conceptHierarchy='';
      this.pagination.source='';
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
        this.$axios.post(this.url+"/delete",row.id).then((res) => {
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
      this.$axios.post(this.url,row.id).then((res) => {
        console.log(res)
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
        console.log(res)
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



