<template>
  <div>
      <el-button @click="GetHeatmap">显示热力图</el-button>
      <el-button @click="GetPiePic">显示饼图</el-button>
    <div style="position: relative;top: -110px;z-index: -1">
        <div v-if="showHeatmap">
          <img class="responsive-image" src="../../assets/Score_Heatmap.png" alt="Score Heatmap" />
        </div>
        <div v-else>
          <img style="max-width: 100%;" src="../../assets/pie_chart.png" alt="Pie Chart" />
        </div>
    </div>
  </div>
</template>

<script>
import { Loading } from 'element-ui';
export default {
  name: "ImportanceVisualization",

  data() {
    return {
      showHeatmap: true, // 默认显示热力图
      loading: null, // 加载框实例
      loadingText: '加载中...', // 加载框文字内容

    };
  },
  methods: {
    showLoading() {
      this.loading = Loading.service(); // 显示加载框
    },
    hideLoading() {
      this.loading.close(); // 隐藏加载框
    },
    GetHeatmap() {
      this.showLoading(); // 显示加载框
      this.$axios.get("http://127.0.0.1:5000/BingPic").then(
        res => {
          if (res.data) {
            this.showHeatmap = true;
          }
          this.hideLoading(); // 隐藏加载框
        }
      );
    },
    GetPiePic() {
      this.showLoading(); // 显示加载框
      this.$axios.get("http://127.0.0.1:5000/RePic").then(
        res => {
          if (res.data) {
            this.showHeatmap = false;
          }
          this.hideLoading(); // 隐藏加载框
        }
      );
    },
  }
}
</script>

<style scoped>
.responsive-image {
  max-width: 100%;
}
</style>
