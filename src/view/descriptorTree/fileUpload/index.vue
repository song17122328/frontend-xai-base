<template>
  <div style="margin-top: 10px">
    <el-button v-if="isUploadTree" type="success" @click="isShowTree=!isShowTree">
      描述符树<span v-show="isShowTree" >隐藏</span><span v-show="!isShowTree">显示</span>
    </el-button>

    <el-upload
      style="display: inline-block"
      action="http://127.0.0.1:5000/TreeStruct"
      :before-upload="handleUploadTree"
      :headers="{ 'Content-Type': 'multipart/form-data' }"
      :on-success="handleSuccessTree"
    >
      <el-button v-show="!isUploadTree" type="primary">上传描述符树</el-button>

    </el-upload>
    <pre-view-tree v-if="isUploadTree" v-show="isShowTree" :my-tree-data="treeData" :my-struct-data="structData"></pre-view-tree>


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
  </div>
</template>

<script>
import PreViewTree from './PreViewTree.vue';
import PreViewData from './PreViewData.vue';

export default {
  components: {
    PreViewTree,
    PreViewData,
  },
  data() {
    return {
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
    //描述符树上传成功后处理
    handleSuccessTree(response) {
      console.log(response);
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
        console.log(response.data);
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
      console.log(response);
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
