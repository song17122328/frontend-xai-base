<!--此页面以树形结构展示描述符树-->
<template>
  <div class="TrueTable">
    <el-input placeholder="请输入需要树形展示的树的类型" v-model="type" style="width: 300px;"></el-input>
    <el-button type="primary" @click="GetAll">点击显示</el-button>
    <el-table :data="TreeData" row-key="id" class="table"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
<!--          <el-table-column-->
<!--            prop="id"-->
<!--            label="id"-->
<!--            width="200">-->
<!--          </el-table-column>-->
          <el-table-column
            prop="nodeName"
            label="节点名"
            min-width="300">
          </el-table-column>
          <el-table-column
            prop="zhName"
            label="中文名"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop="levelHierarchy"
            label="水平层级"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop="conceptHierarchy"
            label="概念层级"
          min-width="120">
          </el-table-column>
          <el-table-column
            prop="introduce"
            label="简介"
          width="400">
          </el-table-column>
          <el-table-column
            prop="source"
            label="来源"
          min-width="200">
          </el-table-column>
          <el-table-column
            prop="formula"
            label="公式"
          min-width="300">
          </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "TreeTable",
  data() {
    return {
      url:"/Tree/",
      type:'expert',
      TreeData:[],
    }
  },
  created() {
    this.GetAll()
  },
  methods: {
    GetAll(){
      this.$axios.get(this.url+this.type).then(
        (res)=>{
          // console.log(res.data)
          this.TreeData=[res.data]
          // this.TreeData._id=this.TreeData.id.counter
          // console.log(this.TreeData)
        },
        (error)=>{
          console.log(error)
        })
    }
  },
}

</script>

<style scoped>

.TrueTable{
  /*position: absolute;*/
  /*width: 560px;*/
}
/*控制高度，使其有进度条*/
.table{
  position: relative;
  overflow: auto;
  height: 460px;
}
/*隐藏竖向进度条*/
.table::-webkit-scrollbar {
  display: none;
}

/*修改横向进度条样式*/
/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}


/*令多出的虚线消失*/
.el-table::before {
  height: 0;
}


</style>
