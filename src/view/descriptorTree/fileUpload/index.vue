<template>
  <div style="margin-top: 10px">
    <el-upload
      action="http://127.0.0.1:5000/TreeStruct"
      :before-upload="handleUpload"
      :headers="{ 'Content-Type': 'multipart/form-data' }"
      :on-success="handleSuccess"
    >
   <el-button type="primary">上传描述符树</el-button>
    </el-upload>
    <pre-view-tree v-if="isUploadTree" :my-tree-data="treeData"></pre-view-tree>

    <span>上传描述符信息文件</span>
    <el-upload
      action="http://127.0.0.1:5000/TreeStruct"
      :before-upload="handleUpload"
      :headers="{ 'Content-Type': 'multipart/form-data' }"
      :on-success="handleSuccess"
    >
      <el-button type="primary">上传文件</el-button>
    </el-upload>
<!--    <pre-view-data :data="previewData"></pre-view-data>-->
  </div>
</template>

<script>
import PreViewTree from './PreViewTree.vue';
// import PreViewData from './PreViewData.vue';

export default {
  components: {
    PreViewTree,
    // PreViewData,
  },
  data() {
    return {
      isUploadTree:false,
      treeData: [],
      }
  },
  methods: {
    handleSuccess(response) {
      console.log(response);
      // 这里处理Flask返回的响应
    },
    handleUpload(file) {
      const formData = new FormData();
      formData.append('file', file);

      this.$axios.post('http://127.0.0.1:5000/TreeStruct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        // console.log(response.data);
        // console.log("this.treeData:",this.treeData)
        Object.keys(response.data).forEach(key => {
          this.treeData.push(response.data[key])
          // 在这里对属性名和属性值进行处理
        });
        this.isUploadTree=true
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
