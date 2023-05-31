<!--描述符树重要度评分-->
<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    style="height: 640px">
    <div>
      <el-button @click="ShowRETreeNodes">获取当前冗余消除树结点</el-button>
      <el-button @click="dialogFormVisible = true">剔除粗粒度结点</el-button>
      <el-button @click="TF_IDF_Score">基于TF-IDF的重要度计算</el-button>
      <el-button @click="Formula_Score">基于公式的重要度计算</el-button>
      <el-button @click="Available_Score">基于可获得性的重要度计算</el-button>
      <el-button @click="isShowUpdateWeight=true" type="primary">调整权重</el-button>
      <el-button @click="SaveScore" type="primary">保存数据</el-button>
    </div>
<!--    <ul v-show="isShowRETreeNodes">-->
<!--      <li v-for="(value,index) in Nodes" :key="index">{{value}}</li>-->
<!--    </ul>-->
    <el-table
      :default-sort = "{prop: 'Score', order: 'descending'}"
      :data="Score"
      max-height="550"
      stripe
      style="width: 100%; ">
      <el-table-column
        prop="Descriptor"
        label="描述符"
      >
      </el-table-column>
      <el-table-column
        prop="TF_IDF"
        label="TF_IDF基准分"
        sortable>
      </el-table-column>
      <el-table-column
        prop="TF_IDF_Score"
        sortable
        :label="'基于TF_IDF得分-'+weight[0]">
      </el-table-column>
      <el-table-column
        prop="DF_Score"
        sortable
        :label="'基于描述符树得分-'+weight[1]">
      </el-table-column>
      <el-table-column
        prop="Formula_Score"
        sortable
        :label="'基于公式得分-'+weight[2]">
      </el-table-column>
      <el-table-column
        prop="Available_Score"
        sortable
        :label="'基于可获得性得分-'+weight[3]">
      </el-table-column>
      <el-table-column
        prop="Score"
        sortable
        label="总得分">
      </el-table-column>
    </el-table>
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

    <el-dialog style="width: 1800px;height: auto" v-if="isShowUpdateWeight" title="调整权重" :visible.sync="isShowUpdateWeight" append-to-body>
      <div v-for="(item,index) in weight" style="display: inline-block;margin: 0" class="circleBox" >
        <el-progress type="dashboard" :percentage="percentage[index]" :color="colors" :show-text="false"></el-progress>
        <div class="circleCenter ">
          <div>{{item}}</div>
          <span>{{ Names[index] }}</span>
        </div>
        <div>
          <el-button-group>
            <el-button icon="el-icon-minus" @click="decrease(index)"></el-button>
            <el-button icon="el-icon-plus" @click="increase(index)"></el-button>
          </el-button-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowUpdateWeight = false">取 消</el-button>
        <el-button type="primary" @click="UpdateScore">确定</el-button>
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
      isShowUpdateWeight:false,
      percentage:[100,100,100,100],
      weight:[1,1,1,1],
      Names:["基于TF-IDF","基于描述符树",'基于公式','基于可获得性'],
      colors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ],
      Score:[],
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
  watch: {
    percentage: {
      handler(newValue) {
        for (let i = 0; i < newValue.length; i++) {
          this.$set(this.weight, i, newValue[i] / 100);
        }
      },
      deep: true // 增加 deep 选项以监视数组内部元素的变化
    },
    Score: {
      handler(newValue) {
        console.log("触发了")
        for (let i = 0; i < newValue.length; i++) {
          const data=this.Score[i]
          const all_score=data.TF_IDF_Score*this.weight[0]
            + data.DF_Score*this.weight[1]
            + data.Formula_Score*this.weight[2]
            + data.Available_Score*this.weight[3]
          this.Score[i].Score=all_score?all_score:0
        }
      },
      deep: true // 增加 deep 选项以监视数组内部元素的变化
    }
  },
  computed:{

  },
  methods:{
    SaveScore(){
      this.$confirm("保存后可供后续模块使用",{
        confirmButtonText:"确定",
        cancelButtonText:"取消",
      }).then(
        ()=>{
          this.$store.state.Score=this.Score
          this.$message.success("保存成功")
        }).catch(
        ()=>{
          this.$message.info("取消操作")
        }
      )
    },
    format(percentage, index) {
      return this.weight[index]+"\n"+this.Names[index];
    },
    UpdateScore(){
      this.Score.forEach((obj) =>
      {
        // console.log(obj)
        obj.Score = Number(obj.TF_IDF_Score*this.weight[0]) + Number(obj.DF_Score*this.weight[1]); // 将newValue赋值给"Score"字段属性
      });
      this.isShowUpdateWeight = false
      this.$message.success("修改成功")
    },
    decrease(Num) {
      const newValue = this.percentage[Num] - 10;
      this.$set(this.percentage, Num, Math.max(newValue, 0));
    },
    increase(Num) {
      const newValue = this.percentage[Num] + 10;
      this.$set(this.percentage, Num, Math.min(newValue, 100));
    },
    Formula_Score(){
      this.$axios.get("http://127.0.0.1:5000/Formula_Score").then(
        res=>{
          console.log(res.data)
          for (let i = 0; i < this.Score.length; i++) {
            this.$set(this.Score[i], 'Formula_Score', 0);
            for (let j = 0; j < res.data.length; j++) {
              if (this.Score[i]['Descriptor']=== res.data[j].toLowerCase()) {
                console.log(res.data[j].toLowerCase())
                this.Score[i]['Formula_Score']=1
                break; // 跳出内部的for循环
              }
            }
          }
          // console.log(this.Score)
        }
      )
    },
    Available_Score(){
      this.$axios.get("http://127.0.0.1:5000/Available_Score").then(
        res=>{
          console.log(res.data)
          for (let i = 0; i < this.Score.length; i++) {
            this.$set(this.Score[i], 'Available_Score', 0);
            for (let j = 0; j < res.data.length; j++) {
              if (this.Score[i]['Descriptor']=== res.data[j].toLowerCase()) {
                console.log(res.data[j].toLowerCase())
                this.Score[i]['Available_Score']=1
                break; // 跳出内部的for循环
              }
            }
          }
          console.log(this.Score)
        }
      )
    },
    TF_IDF_Score() {
      this.loading = true; // 显示加载状态

      this.$axios.post("http://127.0.0.1:5000/TF_IDF_Score", this.Nodes, { responseType: 'blob' }).then(
        response => {
          // FileSaver.saveAs(new Blob([response.data]), "TF_IDF_Score.xlsx");
          // 将Blob对象转换为ArrayBuffer
          const reader = new FileReader();
          reader.onload = () => {
            const arrayBuffer = reader.result;
            // 解析Excel数据
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            // 将Excel数据转换为JSON对象
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            // 在控制台打印JSON数据
            //深拷贝
            const data = Array.from(this.Score);
            this.Score = [];

            for (let i = 1; i < jsonData.length; i++) {
              for (let j = 0; j < data.length; j++) {
                if (jsonData[i][1] === data[j].Descriptor) {
                  const SingleScore = {
                    ...data[j],
                    'TF_IDF': jsonData[i][2],
                    'TF_IDF_Score': jsonData[i][3],
                    'Score': Number(jsonData[i][3]*this.weight[0]) + Number(data[j].DF_Score*this.weight[1])
                  };
                  this.Score.push(SingleScore);
                  break; // 跳出内部的for循环
                }
              }
            }
            this.isShowRETreeNodes=false
            // console.log(this.Score)
          };
          reader.readAsArrayBuffer(response.data);
        },
        error => {
          console.log(error);
        }
      ).finally(() => {
        this.loading = false; // 隐藏加载状态
      });
    },

    DescriptorTree_Score(){
      this.$axios.get("").then(
        response=>{
          console.log(response.data)
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
      this.Score = this.Score.filter(item => !this.coarseNodes.includes(item.Descriptor));
      this.dialogFormVisible = false
      this.$message.success("剔除粗粒度结点成功")
    },


    HasChild(node) {
      return node.children !== null && node.children.length!==0;
    },
    GetRETreeNodes(node,belong){
      // console.log(node)
      this.Nodes.push(node.nodeName)
      this.Score.push({"Descriptor":node.nodeName,"DF_Score":node.score,"Belong":belong})
      if (this.HasChild(node)){
        node.children.forEach(child=>{
          this.GetRETreeNodes(child,belong)
        })
      }

    },
    ShowRETreeNodes(){
      this.Score=[]
      this.Nodes=[]
      if (this.TreeData.children)
      {
        this.TreeData.children.forEach(
          (child)=>{
            this.GetRETreeNodes(child,child.nodeName)
          }
        )
        console.log(this.Nodes)
        this.isShowRETreeNodes=true
      }
      else {
        this.$message.info("数据为空，请执行冗余消除")
      }

    },
    GetFusionTree() {
      this.$axios.get("/Tree/fusion").then(
        (res) => {
          this.TreeData = res.data
        },
        (error) => {
          console.log(error)
        })
    }
  },
  mounted() {
    this.GetFusionTree()

  },
}
</script>

<style scoped>
.circleBox {
  position: relative;
  text-align: center;
  width: 200px;
  margin: 40px 0;
}

.circleBox .circleCenter {
  position: absolute;
  top: 37%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.circleBox .circleCenter div {
  font-size: 26px;
  color: #1360FB;
  font-weight: 600;
  margin-bottom: 5px;
}

.circleBox .circleCenter span {
  font-size: 14px;
  color: #999999;
}
/deep/ .el-progress__text {
  white-space: pre;
}

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
