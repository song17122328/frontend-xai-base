<!--描述符树重要度评分-->
<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    style="height: 640px"
        >重要度评分
    <div>
      <el-button @click="ShowRETreeNodes">获取当前冗余消除树结点</el-button>
      <el-button @click="dialogFormVisible = true">剔除粗粒度结点</el-button>
      <el-button @click="TF_IDF_Score">计算TF-IDF重要度评分</el-button>
      <el-button @click="TF_IDF_Des">重要度评分筛选描述符</el-button>
    </div>
    <ul v-show="isShowRETreeNodes" >
      <li v-for="(value,index) in Nodes" :key="index">{{value}}</li>
    </ul>
    <el-dialog v-if="dialogFormVisible" title="选择粗粒度结点" :visible.sync="dialogFormVisible" append-to-body>
      <div style="text-align: center;
                  align-items: center;
                  justify-content: center;">
        <div>
          <select class="box" multiple>
            <option v-for="(value, index) in coarseNodes" :key="index" >{{value}}</option>
          </select>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="filetercoarseNodes">剔除粗粒度结点</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

export default {
  name: "ImportanceScore",
  data(){

    return {
      loading:false,
      form: {},
      formLabelWidth: '120px',
      isShowRETreeNodes: false,
      TreeData: null,
      Nodes: [],
      dialogFormVisible: false,
      coarseNodes:["FusionTreeRoot","condition","composition",'structure','process'],
    }
  },
  computed:{
    data(){
      return this.generateData()}
  },
  methods:{
    TF_IDF_Score() {
      this.loading = true; // 显示加载状态

      this.$axios.post("http://127.0.0.1:5000/TF_IDF_Score", this.Nodes, { responseType: 'blob' }).then(
        response => {
          FileSaver.saveAs(new Blob([response.data]), "TF_IDF_Score.xlsx");
        },
        error => {
          console.log(error);
        }
      ).finally(() => {
        this.loading = false; // 隐藏加载状态
      });
    },
    TF_IDF_Des(){
      this.$axios.get("http://127.0.0.1:5000/TF_IDF_Des").then(
        response=>{

          // 使用FileSaver.js将Excel文件保存到本地
          const data=response.data.splice(',')

          // 将数据转换为worksheet
          const worksheet = XLSX.utils.sheet_add_json(
            XLSX.utils.book_new().SheetNames[0],
            data.map((item) => ({ A: item })),
            { skipHeader: true }
          );

          // 将worksheet添加到workbook
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

          // 将workbook转换为二进制文件
          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

          // 创建Blob对象
          const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});

          // 创建下载链接并模拟点击
          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.download = 'Descriptors.xlsx';
          downloadLink.click();
        },
        error=>{
          console.log(error)
        }
      )
    },
    filetercoarseNodes(){
      this.Nodes = this.Nodes.filter(item => !this.coarseNodes.includes(item));
      this.dialogFormVisible = false
      this.$message.success("剔除粗粒度结点成功")
    },

    generateData(){
      const data = [];
      for (let i = 1; i <this.Nodes.length; i++) {
        data.push({
          key: i,
          label: this.Nodes[i],
        });
      }
      return data;
    },
    HasChild(node) {
      return node.children !== null && node.children.length!==0;
    },
    GetRETreeNodes(node){
      this.Nodes.push(node.nodeName)
      if (this.HasChild(node)){
        node.children.forEach(child=>{
          this.GetRETreeNodes(child)
        })
      }

    },
    ShowRETreeNodes(){
      if (this.TreeData.children)
      {
        this.GetRETreeNodes(this.TreeData)
        this.isShowRETreeNodes=true
      }
      else {
        this.$message.info("数据为空，请执行冗余消除")
      }

    },
  },
  mounted() {
    this.TreeData=this.$store.state.RedundancyEliminationTree

  },
  beforeDestroy() {
  }
}
</script>

<style scoped>


.box {
  height: 300px;
  width: 200px; /* 修改宽度 */
  border: 1px solid #c0ccda;
  border-radius: 4px;
  background-color: #fff;
  color: #606266;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  outline: none;
  overflow-y: auto;
  scrollbar-width: thin; /* 用于兼容Firefox */
}

.box option {
  background-color: #fff;
  color: #606266;
  font-size: 14px;
}

.box::-webkit-scrollbar {
  width: 5px;
}

.box::-webkit-scrollbar-thumb {
  background-color: #409EFF; /* 修改滚动条颜色 */
  border-radius: 10px;
}

.box::-webkit-scrollbar-track {
  background-color: #fff;
}
</style>
