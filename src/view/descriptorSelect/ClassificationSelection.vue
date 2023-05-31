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
          @select-all="handleSelectionChange"
          @select="handleSelectClick"
          @row-click.capture="handleRowClick">
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
<!--          <el-table-column prop="Belong" min-width="150" sortable label="粗粒度层"></el-table-column>-->
          <el-table-column prop="Score" min-width="150" sortable label="总得分"></el-table-column>
          <el-table-column prop="TF_IDF_Score" min-width="150" sortable label="基于TF_IDF得分"></el-table-column>
          <el-table-column prop="DF_Score" min-width="150" sortable label="基于融合树得分"></el-table-column>
          <el-table-column prop="Formula_Score" min-width="150" sortable label="基于公式得分"></el-table-column>
          <el-table-column prop="Available_Score" min-width="150" sortable label="基于可获得性得分"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="查看选中&导出" name="operate">
        <el-button @click="DeleteSelect">清空选择</el-button>
        <el-button @click="SaveScore">保存数据</el-button>
        <el-button @click="exportToExcel">导出为Excel</el-button>
        <el-table
          ref="result"
          :data="multipleSelection"
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
      showMultipleSelection:[],
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val.length)
      for (let i=0;i< this.multipleSelection.length;i++)
      {
        this.$nextTick(
          ()=>{
            this.multipleSelection[i]['isSelect']=!this.multipleSelection[i]['isSelect']
          }
        )

      }
    },
    SaveScore(){
      this.$confirm("保存供后续使用？",{
        confirmButtonText:"确定",
        cancelButtonText:"取消"
      }).then(
        ()=>{
          this.$store.state.SelectScore=this.multipleSelection
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
      const worksheet = XLSX.utils.json_to_sheet(this.multipleSelection);

      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // 导出 Excel 文件
      XLSX.writeFile(workbook, '筛选描述符.xlsx');
    },
    DeleteSelect(){
      this.multipleSelection=[];
      // console.log( Object.keys(this.tableData))
      Object.keys(this.tableData).forEach(
        key=>{
          this.$refs[key][0].clearSelection()
        }
      )
    },
    handleSelectClick(selection, row){
      console.log(row.isSelect)
      // console.log(this.multipleSelection.indexOf(row))
      if (row['isSelect']) {
        row['isSelect']=false
        // 如果行已经选中，则取消选中
        for(let index=0;index<this.multipleSelection.length;index++){
          if (row===this.multipleSelection[index]){
            this.multipleSelection.splice(index, 1);
            break
          }
        }
      } else {
        row['isSelect']=true
        // 如果行未选中，则添加到选中的行数组中
        this.multipleSelection.push(row);
      }
      // console.log(selection,row)
      this.$refs['result'].toggleRowSelection(row)
      this.$nextTick(
        ()=>{
          // console.log("123",this.$refs['result'])

        }
      )
    console.log(this.multipleSelection)
    },
    handleRowClick(row) {

      this.$refs[row['Belong']][0].toggleRowSelection(row)

      // console.log()
      this.handleSelectClick(null,row)
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  },
  mounted() {
    this.Score=this.$store.state.Score
    for(let i=0;i<this.Score.length;i++){
      this.$set(this.Score[i],'isSelect',false)
    }
    console.log(this.Score)
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
