<!--描述符树冗余消除-->
<template>
  <div>
<!--    {{TreeData}}-->
    <div>
      <el-button @click="RedundancyDetection">冗余检测</el-button>
      <el-button @click="RedundancyElimination">冗余消除</el-button>
    </div>
<!--    {{RENodes}}-->
    <div
      v-for="(item,index) in RepeatNodes"  >
      节点名：{{item.nodeName}}
      <div>出现位置：
        <ul>
        <li v-for="value in item.detail"
            @click="deleteNode(value,item.nodeName)"
            :style="{'background-color': itemHover === value.id ? '#eaf2f8' : 'transparent'}"
            @mouseenter="highlightItem(value.id)"
            @mouseleave="clearHighlight">深度:{{value.deep}}; 孩子数量:{{value.childrenNum}};路径:{{value.path}}
        </li>
      </ul>
      </div>
    </div>
    <div
         v-for="item in RENodes" >
      节点名：{{item.nodeName}}
      <div>出现位置：
        <ul>
          <li v-for="value in item.detail"
              @click="deleteNode(value,item.nodeName,)"
              :style="{'background-color': itemHover === value.id ? '#eaf2f8' : 'transparent'}"
              @mouseenter="highlightItem(value.id)"
              @mouseleave="clearHighlight">深度:{{value.deep}}; 孩子数量:{{value.childrenNum}};路径:{{value.path}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RedundancyElimination",
  data() {
    return {
      itemHover: null,
      TreeData: "",
      msg: "描述符树冗余消除",
      RENodes:[],
      RepeatNodes:[],
    };
  },
  methods: {
    highlightItem(id) {
      this.itemHover = id;
    },
    clearHighlight() {
      this.itemHover = null;
    },
    deleteNode(value,nodeName){
      this.$confirm("删除的结点是："+nodeName+",有"+value.childrenNum+"个孩子，深度为："+value.deep).then(
        ()=>{   this.$axios.delete("/Tree/All",{data:{"nodeName":nodeName,"id":value.id}}).then(
          res=>{
            this.$message({
              type: 'success',
              message: "删除成功"
            });
            this.$axios.get("/Tree/fusion").then(
              (res) => {
                this.TreeData = res.data
                this.$axios.post('http://127.0.0.1:5000/redundancy_elimination', this.TreeData).then(
                  res=>{
                    this.GetRepeatNode(res.data)
                  })
              })
          }
        )}
      )
    },
    async RedundancyElimination() {
      try {
        await this.$confirm("请选择冗余消除方式", {
          confirmButtonText: '自动消除',
          cancelButtonText: '手动消除',
          type: "info"
        });

        await this.$confirm("自动消除将保留孩子节点最多的描述符，若孩子结点树一致，则保留更深的结点", '说明', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: "info"
        });

        for (const node of this.RepeatNodes) {
          const nodeName = node.nodeName;
          const node_id = node.detail[0].childrenNum < node.detail[1].childrenNum
            ? node.detail[0].id
            : node.detail[1].id;

          await this.$axios.delete("/Tree/All", { data: { "nodeName": nodeName, "id": node_id } });
          this.$axios.get("/Tree/fusion").then(
            (res) => {
              this.TreeData = res.data
              this.$axios.post('http://127.0.0.1:5000/redundancy_elimination', this.TreeData).then(
                res=>{
                  this.GetRepeatNode(res.data)
                })
            })
          this.$message({
            type: 'success',
            message: "删除成功"
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isShowRETreeNodes = true;
      }
    },
    GetRETreeNodes(data) {
      this.$set(this, 'RepeatNodes', []);
      this.$set(this, 'RENodes', []);
      Object.keys(data).forEach(key=>
      {
        let node=data[key]
        node['nodeName']=key
        this.RENodes.push(node)
      });
    },
    GetRepeatNode(data){
      this.$set(this, 'RepeatNodes', []);
      this.$set(this, 'RENodes', []);
      Object.keys(data).forEach(key => {

        let node = data[key];
        if (node['isRepeat'] === true)
        {
          node['nodeName'] = key
          this.RepeatNodes.push(node)
        }
      });
    },
    RedundancyDetection() {
      //首先获取最新的数据
      this.GetFusionTree()
      this.$axios.post('http://127.0.0.1:5000/redundancy_elimination', this.TreeData).then(
        res => {
          this.$confirm("冗余检测成功", {
            confirmButtonText: '查看重复节点信息',
            cancelButtonText: '查看所有结点信息',
            type: "success"
          }).then(() => {
            this.GetRepeatNode(res.data)
          }).catch(
            ()=>{
              this.GetRETreeNodes(res.data)
            }).finally(()=>{this.isShowRETreeNodes=true})
        }, error => {
          console.log(error)
        })
    },
    //获取数据并执行
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
  watch:{

  },
  mounted() {
    this.GetFusionTree()
    // console.log(this.TreeData)
  },

};
</script>

<style scoped>

</style>
