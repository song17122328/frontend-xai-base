
<template>
  <div style=" ">
    <el-button style="margin-bottom: 10px" @click="exportToExcel">导出成Excel</el-button>
    <el-table
      :data="Result"
      border
      max-height="550"
      style="">
      <template  v-for="(value,index) in Object.keys(Result[0])" >
        {{value}}
        <el-table-column
          align="center"
          :label="value"
          :prop="value"
          :width="index===0?300:200">
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>




<script>
import * as XLSX from "xlsx";

export default {
  data () {
    return {
      Result:[],
      ScoreData:[],
      MlData: [],

      url:"MlData",
      }
  },
  created () {
    this.getAll()
  },

  methods: {
    exportToExcel(){

      // 创建工作簿对象
      const workbook = XLSX.utils.book_new();

      // 创建工作表对象
      const worksheet = XLSX.utils.json_to_sheet(this.Result );

      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // 导出 Excel 文件
      XLSX.writeFile(workbook, '机器学习样本模板.xlsx');
    },
    CreateData() {
      console.log("this.MlData", this.MlData)
      const newObj = this.ScoreData.reduce((result, obj) => {
        const key = obj.Descriptor;
        result[key] = "待添加";
        return result;
      }, {});
      console.log("newObj", newObj)
      for (let j = 0; j < this.MlData.length; j++) {
        const data = {
          "化学式": this.MlData[j].chemicalFormula,
          "ICSD": this.MlData[j].icsd,
          ...newObj
        }
        this.Result.push(data)
      }
      console.log(this.Result)
    },

    //查询描述符树所有信息
    //分页查询
    getAll() {
      //发送异步请求
      this.$axios.get(this.url)
        .then((resp) => {
          //更新页面数据
          this.MlData = resp.data;
          this.CreateData()
        }, error => {
          console.log("请求失败了", error.message)
        })
    },


  },
  mounted() {
    this.ScoreData=this.$store.state.SelectScore
    console.log(this.ScoreData)
  }
}
</script>


<style>
</style>
