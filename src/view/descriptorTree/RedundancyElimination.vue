<!--描述符树冗余消除-->
<template>
  <div>{{msg}}
    <p></p>
    {{TreeData}}</div>
</template>

<script>
export default {
  name: "RedundancyElimination",
  data() {
    return {
      TreeData: "",
      msg: "描述符树冗余消除"
    };
  },
  methods: {

  },
  watch:{

  },
  mounted() {
    this.TreeData=this.$store.state.FusionTree
    // console.log(this.TreeData)
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "重要度评分") {
      this.$store.commit("updateRedundancyEliminationTree",this.TreeData)
    }
    next();
  },

};
</script>

<style scoped>

</style>
