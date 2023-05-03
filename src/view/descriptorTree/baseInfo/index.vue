<template>
<!--    <span>-->
<!--      描述符树基本信息-->
<!--    </span>-->
    <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="描述符树信息" name="first">
        <DescriptorTreeInfo></DescriptorTreeInfo>
      </el-tab-pane>
      <el-tab-pane label="描述符树结构" name="second">
        <DescriptorTreeStruct></DescriptorTreeStruct>
      </el-tab-pane>
      <el-tab-pane label="嵌套树" name="third">
        <TreeTable></TreeTable>
      </el-tab-pane>
    </el-tabs>

</template>

<script>
import DescriptorTreeInfo from "./DescriptorInfo";
import DescriptorTreeStruct from "./TreeStruct";
import TreeTable from "./TreeTable";

export default {
  name: "baseInfo",
  components:{DescriptorTreeInfo,DescriptorTreeStruct,TreeTable},
  data() {
    return {
      activeName: 'third'
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>

<style scoped>
.tabs{
  height: 588px;
  width: auto;
}

</style>
