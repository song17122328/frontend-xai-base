<template>
  <div style="margin-top: 10px">
    <el-button v-if="isUploadTree" type="success" @click="isShowTree=!isShowTree">
      描述符树<span v-show="isShowTree" >隐藏</span><span v-show="!isShowTree">显示</span>
    </el-button>

    <el-upload
      ref="fileUpload"
      style="display: inline-block"
      action="http://127.0.0.1:5000/TreeStruct"
      :before-upload="handleUploadTree"
      :headers="{ 'Content-Type': 'multipart/form-data' }"
      :on-success="handleSuccessTree"
    >
      <el-button v-show="!isUploadTree" type="primary" >基于Excel构建</el-button>
    </el-upload>
    <el-button @click="dialogVisible=true" type="primary">针对性构建</el-button>


    <pre-view-tree v-if="isUploadTree" v-show="isShowTree" :my-tree-data="treeData" :my-struct-data="structData"></pre-view-tree>
    <made-by-hand v-if="isUploadTreeByhand" v-show="isShowTree" :my-tree-data="treeData" ></made-by-hand>

    <el-button v-if="isUploadInfo" type="success" @click="isShowInfo=!isShowInfo">
      描述符信息<span v-show="isShowInfo" >隐藏</span><span v-show="!isShowInfo">显示</span>
    </el-button>
    <el-upload
      style="display: inline-block"
      action="http://127.0.0.1:5000/TreeInfo"
      :before-upload="handleUploadInfo"
      :headers="{ 'Content-Type': 'multipart/form-data' }"
      :on-success="handleSuccessInfo"
    >
      <el-button type="primary" v-show="!isUploadInfo">上传描述符信息文件</el-button>
    </el-upload>
    <pre-view-data v-if="isUploadInfo" v-show="isShowInfo" :my-info-data="InfoData"></pre-view-data>

    <el-dialog
      title="请选择"
      :visible.sync="dialogVisible"
      width="30%"
    append-to-body>
      <div style="text-align: center">
        <el-button @click="createExpertTree" type="success" >专家经验树</el-button>
        <el-button @click="createTextMiningTree" type="success" >文本挖掘树</el-button>
        <el-button @click="createFeatureTree" type="success">特征树</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import PreViewTree from './PreViewTree.vue';
import PreViewData from './PreViewData.vue';
import madeByHand from './madeByHand.vue';

export default {
  components: {
    PreViewTree,
    PreViewData,
    madeByHand
  },
  data() {
    return {
      isUploadTreeByhand:false,
      dialogVisible: false,
      isShowInfo:true,
      isShowTree:true,
      isUploadInfo:false,
      isUploadTree:false,
      treeData: [],
      structData:[],
      InfoData:[],
      }
  },
  methods: {
      async downloadExcel(name) {
        const excelUrl = 'http://localhost:7081/static/'+name+".xlsx"; // 替换为实际的Excel文件地址

        try {
          const response = await this.$http.get(excelUrl, {
            responseType: 'blob'
          });

          const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });

          // 使用file-saver库保存Blob对象为本地文件
          saveAs(blob, name+".xlsx");
        } catch (error) {
          console.error('下载Excel文件时发生错误：', error);
        }
      },
    createExpertTree(){
      this.$confirm("构建专家树",{
        confirmButtonText: '下载样例数据',
        cancelButtonText: '手动构建',
        type: "info"
      }).then(
        ()=>{
          this.downloadExcel("expert")
        }
      ).catch(
        ()=>{
          this.treeData=[{"nodeName":"root","TreeType":"expert","children":[],"id":this.$uuid().toString(),"parentID":""}]
          this.isUploadTreeByhand=true
        }
      )
    },
    createTextMiningTree(){
      this.$confirm("构建文本树",{
        confirmButtonText: '下载样例数据',
        cancelButtonText: '使用文本挖掘接口',
        type: "info"
      }).then(
        ()=>{
          //下载样例数据
          this.downloadExcel("txtMining")
        }
      ).catch(
        ()=>{
          this.$message.info("现无相关接口")
        }
      )
    },
    createFeatureTree(){
      this.$confirm("构建特征树",{
        confirmButtonText: '下载样例数据',
        cancelButtonText: '使用特征树接口',
        type: "info"
      }).then(
        ()=>{
          //下载样例数据
          this.downloadExcel("feature")
        }
      ).catch(
        ()=>{
          this.$message.info("现无相关接口")
        }
      )
    },
    //描述符树上传成功后处理
    handleSuccessTree(response) {
      // console.log(response);
      // 这里处理Flask返回的响应
    },
    //上传描述符树文件
    handleUploadTree(file) {
      const formData = new FormData();
      formData.append('file', file);

      this.$axios.post('http://127.0.0.1:5000/TreeStruct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        // console.log(response.data);
        // console.log("this.treeData:",this.treeData)
        this.treeData=response.data['nested_JSON']
        this.structData=response.data['structured_JSON']
        this.isUploadTree=true
        // 处理响应
      }).catch(error => {
        console.log(error);
        // 处理错误
      });
      return false; // 阻止 el-upload 组件默认的上传行为
    },

    //描述符信息文件上传成功后处理
    handleSuccessInfo(response) {
      // console.log(response);
      // 这里处理Flask返回的响应
    },
    //上传描述符信息文件
    handleUploadInfo(file) {
      const formData = new FormData();
      formData.append('file', file);

      this.$axios.post('http://127.0.0.1:5000/TreeInfo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        // console.log(response.data);
        this.InfoData=response.data
        this.isUploadInfo=true
        // 处理响应
      }).catch(error => {
        console.log(error);
        // 处理错误
      });
      return false; // 阻止 el-upload 组件默认的上传行为
    },
  }
}
</script>

<style scoped>

</style>
