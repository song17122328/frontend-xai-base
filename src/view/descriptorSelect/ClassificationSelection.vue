<template>
  <div>
    <el-tabs value="structure" stretch>
      <el-tab-pane v-for="(item, key, index1) in tableData" :label="key" :name="key">
        <el-table
          :data="tableData[key]"
          :ref="key"
          :default-sort="{ prop: 'Score', order: 'descending' }"
          max-height="550"
          stripe
          style="width: 100%;"
          @row-click="handleRowClick">
          <el-table-column
            type="selection"
            width="150"
            align="center">
          </el-table-column>
          <el-table-column min-width="300px" label="描述符">
            <template slot-scope="scope">
              {{ scope.row.Descriptor }}
            </template>
          </el-table-column>
          <el-table-column prop="Score" min-width="150" sortable label="总得分"></el-table-column>
          <el-table-column prop="TF_IDF_Score" min-width="150" sortable label="TF_IDF得分"></el-table-column>
          <el-table-column prop="DF_Score" min-width="150" sortable label="描述符树得分"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="查看选中&导出" name="operate">
        <el-button @click="DeleteSelect">清空选择</el-button>
        <el-button @click="SaveScore">保存数据</el-button>
        <el-button @click="exportToExcel">导出为Excel</el-button>
        <el-table
          :data="selectedRows"
          :default-sort="{ prop: 'Score', order: 'descending' }"
          max-height="550"
          stripe
          style="width: 100%;">
          <el-table-column min-width="300px" label="描述符">
            <template slot-scope="scope">
              {{ scope.row.Descriptor }}
            </template>
          </el-table-column>
          <el-table-column prop="Score" min-width="150" sortable label="总得分"></el-table-column>
          <el-table-column prop="TF_IDF_Score" min-width="150" sortable label="TF_IDF得分"></el-table-column>
          <el-table-column prop="DF_Score" min-width="150" sortable label="描述符树得分"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      refNames:["structure", "process", "condition", "composition"],
      selectedRows: [], // 用于存储选中的行
      multipleSelection: [],
      activeName: 'process',
      Score:[],
      composition:[],
      structure:[],
      process:[],
      condition:[]
    };
  },
  computed:{
    tableData(){
      return {
        "structure":this.structure,
        "process":this.process,
        "condition":this.condition,
        "composition":this.composition
      }
    }
  },
  methods: {
    SaveScore(){
      this.$confirm("保存供后续使用？",{
        confirmButtonText:"确定",
        cancelButtonText:"取消"
      }).then(
        ()=>{
          this.$store.state.SelectScore=this.selectedRows
          this.$message.success("保存成功")
        }).catch(
        ()=>{
          this.$message.success("保存成功")
        }
      )
    },
    exportToExcel() {

      // 创建工作簿对象
      const workbook = XLSX.utils.book_new();

      // 创建工作表对象
      const worksheet = XLSX.utils.json_to_sheet(this.selectedRows);

      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // 导出 Excel 文件
      XLSX.writeFile(workbook, '筛选描述符.xlsx');
    },
    DeleteSelect(){
      this.selectedRows=[];
      // console.log( Object.keys(this.tableData))
      Object.keys(this.tableData).forEach(
        key=>{
          this.$refs[key][0].clearSelection()
        }
      )
    },
    handleRowClick(row) {
      // console.log(row,column,event)
      const index = this.selectedRows.indexOf(row);
      // this.$refs[row['Belong']].toggleRowSelection(row);
      this.$refs[row['Belong']][0].toggleRowSelection(row)
      // console.log()
      // console.log(index)
      if (index > -1) {
        // 如果行已经选中，则取消选中
        this.selectedRows.splice(index, 1);
      } else {
        // 如果行未选中，则添加到选中的行数组中
        this.selectedRows.push(row);
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  },
  mounted() {
    this.Score=this.$store.state.Score
    this.Score.forEach(
      node=>{
        if (node['Belong']==="composition"){
          const { TF_IDF, ...otherProperties } = node;
          this.composition.push(otherProperties)
        }
        if (node['Belong']==="structure"){
          const { TF_IDF, ...otherProperties } = node;
          this.structure.push(otherProperties)
        }
        if (node['Belong']==="process"){
          const { TF_IDF, ...otherProperties } = node;
          this.process.push(otherProperties)
        }
        if (node['Belong']==="condition"){
          const { TF_IDF, ...otherProperties } = node;
          this.condition.push(otherProperties)
        }
      }
    )
    // console.log(this.Score)
    // console.log(this.composition)
    // console.log(this.tableData)
  }
}
</script>

<style scoped>

</style>
