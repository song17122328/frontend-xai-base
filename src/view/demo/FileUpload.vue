<template>
  <div>
    <el-row>
      <el-col :span="20" :offset="2">
        <h1 class="info_title">文件上传</h1>
      </el-col>
      <el-col :span="20" :offset="2">
        <el-row>
          <el-col :span="2">
            <label>文件上传：</label>
          </el-col>
          <el-col :span="4">
            <el-input
              placeholder="请选择文件"
              v-model="uploadForm.inputFile"
              :disabled="true">
            </el-input>
          </el-col>
          <el-col :span="10">
            <el-upload
                class="upload-demo"
                ref="upload"
                action=""
                :file-list="uploadForm.fileList"
                :on-change="handleSelectFile"
                :http-request="overSubmit"
                :show-file-list="false"
                accept=".jpg,.png"
                :before-upload="beforeUpload"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg、png文件，上传文件大小不能超过 2MB</div>
              </el-upload>
          </el-col>
        </el-row>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import ElRow from "element-ui/packages/row/src/row";
import ElCol from "element-ui/packages/col/src/col";

export default {
  components: {
    ElCol,
    ElRow
  },
  name: "FileUpload",
  data () {
    return {
      uploadForm:{
        inputFile: '',
        fileList: [],
      },
      fd:null,
      fileStatus:false,
    }
  },
  mounted: function () {

  },

  methods: {
    handleSelectFile(file, fileList) {
      if (fileList.length > 1) {
        fileList.shift();
      }
      this.uploadForm.inputFile=file.name;

      this.fileStatus= true;
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = ["jpg", "png"];
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.error('上传文件只能是 jpg,png格式');
        this.fileStatus= false;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB');
        this.fileStatus= false;
      }

    },
    overSubmit(param){
      this.fd = new FormData();
      let otherParams={
        aa:'aaa',
        bb:'bbb',
      };
      this.fd.append('otherParams',JSON.stringify(otherParams));
      this.fd.append('file',param.file);

    },
    submitUpload(){
      if(this.fileStatus) {
        this.$refs.upload.submit();
        this.$axios.post('/demo/selectFileUpload', this.fd).then(res => {
          if (res.data.code === 1) {
            this.$notify({
              title: '成功',
              message: res.data.msg,
              type: 'success'
            });
            this.fileStatus= false;
            this.uploadForm.inputFile='';
          } else {
            this.$notify({
              title: '警告',
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
      }else {
        this.$message.error('请先上传合适的文件');

      }

    },
    beforeUpload(file) {

    }





  },
}
</script>

<style scoped>
  .info_title {
    font-size: 20px;
    padding: 5px 0;
  }
</style>
