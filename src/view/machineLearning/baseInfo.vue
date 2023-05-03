
<template>
  <div style=" ">

    <!--条件查询-->
    <div style="margin: 10px 0" >
      <el-input placeholder="ICSD,必须填数字" v-model="pagination.ICSD" style="width: 200px;"
                class="filter-item"></el-input>
      <el-input placeholder="化学式" v-model="pagination.chemicalFormula" style="width: 200px;"
                class="filter-item"></el-input>
      <el-input placeholder="最小值" v-model="pagination.lowerLimitEnergy" style="width: 200px;"
                class="filter-item"></el-input>
      <el-input placeholder="最大值" v-model="pagination.upperLimitMaxEnergy" style="width: 200px;"
                class="filter-item"></el-input>
      <el-button @click="getAll()" class="dalfBut">查询</el-button>
      <el-button type="primary" class="butT" @click="handleCreate()">新建</el-button>
      <el-button @click="resetSelect()" type="warning" class="dalfBut">重置</el-button>
    </div>

    <el-table
      :data="MlData"
      border
      max-height="450"
      style="">
      <template  v-for="(value,key,index) in vForData" >
        <el-table-column
          align="center"
          :fixed="fixed(index)"
          :prop="index ===2?'id.counter' :key"
          :label="index ===0?'化学式' :key"
          :width="index in [0,1]?180:100">
        </el-table-column>
      </template>
      <el-table-column
        v-if="MlData.length"
        align="center"
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" >
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
                 label-width="150px">
          <template v-for="(value,key,index) in vForData" >
            <el-row>
              <el-col :span="20">
                <!--                prop令rules生效-->
                <el-form-item :label="index ===1?'化学式' :key"
                              :prop="index ===2?'id.counter' :key">
                  <el-input v-if="dialogFormVisible&&key!=='id'" v-model="formData[key]"/>
                  <span v-if="dialogFormVisible&&key==='id'" >系统自动生成</span>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取消</el-button>
          <el-button lowerLimitEnergy="primary" @click="handleAdd()">确定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 编辑表单   -->
    <div class="add-form" >
      <el-dialog title="编辑检查项" :visible.sync="dialogFormVisible4Edit" :append-to-body="true">
        <el-form :model="formData" :rules="rules" label-position="right"
                 label-width="150px">
          <template v-for="(value,key,index) in vForData" >
            <el-row>
              <el-col :span="20">
<!--                prop令rules生效-->
                <el-form-item :label="index ===1?'化学式' :key"
                              :prop="index ===2?'id.counter' :key">
                  <el-input v-if="dialogFormVisible4Edit&&key!=='id'" v-model="formData[key]"/>
                  <span v-if="dialogFormVisible4Edit&&key==='id'" >{{formData.id.counter}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取消</el-button>
          <el-button lowerLimitEnergy="primary" @click="handleEdit()">确定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>




<script>

export default {
  name: "MlData",
  data () {
    return {
      MlData: [],
      vForData:'',

      pagination: {//分页相关模型数据
        currentPage: 1,//当前页码
        pageSize: 10,//每页显示的记录数
        total: 0,//总记录数

        //查询条件
        chemicalFormula: '',
        ICSD: '',
        lowerLimitEnergy: '',
        upperLimitMaxEnergy: '',
      },

      //表单信息
      url:"MlData/",
      dialogFormVisible: false,//添加表单是否可见
      dialogFormVisible4Edit: false,//编辑表单是否可见
      formData: {},//表单数据
      rules: {//校验规则
        icsd: [
          { required: true, message: '请输入ICSD', trigger: 'blur' },
          {type:'number', required:true,message: '只能为数字', trigger: 'blur',
          transform(value) {return(Number(value))}
          }],
      }


  }

  },
  created () {
    this.getAll()
  },

  methods: {
    //设置固定标签
    fixed(index){
      if (this.MlData.length===0) return false
      return index in [0,1]
    },
    //查询描述符树所有信息
    //分页查询
    getAll() {
      //组织参数，拼接url地址
      let param;
      param = "?query"
      if (this.pagination.chemicalFormula !== "")
        param += "&chemicalFormula=" + this.pagination.chemicalFormula;
      if (this.pagination.upperLimitMaxEnergy !== "")
        param += "&upperLimitMaxEnergy=" + this.pagination.upperLimitMaxEnergy;
      if (this.pagination.lowerLimitEnergy !== "")
        param += "&lowerLimitEnergy=" + this.pagination.lowerLimitEnergy;
      if (this.pagination.ICSD !== "")
        param += "&ICSD=" + this.pagination.ICSD;
      let url=this.url + this.pagination.currentPage + "/" + this.pagination.pageSize + param
      console.log(url);
      //发送异步请求
      this.$axios.get(url)
        .then((resp) => {
          //更新页面数据
          this.MlData = resp.data.content;
          if (this.MlData.length>0){
            //有数据则渲染，v-for使用数据
            //利用解构赋值，不渲染id
            let {id,...vForData}=this.MlData[0]
            this.vForData=vForData
          }
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
      this.pagination.ICSD = '';
      this.pagination.upperLimitMaxEnergy = '';
      this.pagination.chemicalFormula = '';
      this.pagination.lowerLimitEnergy='';
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
        console.log(row.id)
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
          console.log(this.formData)
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


<style>
</style>
