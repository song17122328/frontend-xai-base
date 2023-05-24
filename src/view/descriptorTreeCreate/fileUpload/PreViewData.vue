<template>
  <div>
    <el-button @click="commit" type="primary" style="display:inline-block;position: relative;top: -40px;left:941px">提交到数据库</el-button>
    <el-table
      :data="myInfoData"
      class="table">
      <el-table-column
        label="节点"
        prop="nodeName"
        width="200"
        >
        <template slot-scope="scope">
          <span style="font-size:13px;">{{scope.row.NodeName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="中文名"
        prop="zhName"
        width="150"
        >
        <template slot-scope="scope">
          <span style="font-size:13px;">{{scope.row.ZhName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="简介"
        prop="introduce"
        width="250"
      >
        <template slot-scope="scope">
          <span style="font-size:13px;">{{scope.row.Introduce}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="概念层级"
        prop="conceptHierarchy"
        width="150"
      >
        <template slot-scope="scope">
          <span style="font-size:13px;">{{scope.row.ConceptHierarchy}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="来源"
        prop="source"
        width="220"
      >
        <template slot-scope="scope">
          <span style="font-size:13px;">{{scope.row.Source}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="公式"
        prop="formula"
        width="220"
      >
        <template slot-scope="scope">
          <span style="font-size:13px;">{{scope.row.Formula}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    myInfoData: {
      required: true
    },
  },
  methods:{
    commit(){
      this.$confirm("确认提交到数据库吗？",'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }) .then(() => {
        // 需要把二维列表拉直成一维列表插入数据库
        // console.log(this.myStructData.flat())
        this.$axios.post("http://127.0.0.1:5000/TreeInfoData",this.myInfoData).then(
          res=>{
            this.$message({
              type: 'success',
              message: res.data
            });
          },
          error=>{
            this.$message({
              type: 'error',
              message: error.data
            });
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  },
  mounted() {
    // console.log(this.myInfoData)
    // console.log(typeof this.myInfoData)

  }
}
</script>

<style scoped>

</style>
