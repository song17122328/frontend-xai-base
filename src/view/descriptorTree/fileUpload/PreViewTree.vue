<template>
  <div>
    <div style="display:inline-block;position: relative;top:-40px; left: 180px">
      <el-button @click="TreeCurrentNumber=TreeCurrentNumber-1" icon="el-icon-minus"
                 size="small" circle></el-button>
      <span style="color: #57ab57">共有{{this.TreeNumber}}课树，当前为第{{this.TreeCurrentNumber}}棵</span>
<!--      <el-input v>111</el-input>-->
      <el-button @click="TreeCurrentNumber=TreeCurrentNumber+1" icon="el-icon-plus" size="small"circle></el-button>
      <span style="margin-left:50px;" >该树类型为: </span>

      <el-input  v-if="dataLoaded"
                 v-model="myTreeData[TreeCurrentNumber-1].TreeType"
                 style="width: 100px">
      </el-input>
    </div>

    <div style="display:inline-block;position: relative;top: -40px;left:300px">

      <span v-if="horizontalOrVertical" style="color: #57ab57">水平布局</span>
      <span v-if="!horizontalOrVertical" style="color: #ce820f">垂直布局</span>
      <el-switch
        v-model="horizontalOrVertical"
        active-color="#57ab57"
        inactive-color="#ce820f">
      </el-switch>
      <el-button @click="commit" type="primary" style="margin-left: 50px">提交到数据库</el-button>
    </div>
      <div id="mountNode"></div>

  </div>
</template>

<script>
import G6 from "@antv/g6";

export default {
  props: {
    myTreeData: {
      required: true
    },
    myStructData: {
      required: true
    }
  },
  data(){
    return{
      dataLoaded: false,
      // 将数据保存到其他数据属性中
      foldData:null,
      //渲染对象
      TreeCurrentNumber:'',
      TreeNumber:'',
      horizontalOrVertical:false,
      //横向锚点
      horizontalAnchor:[
        [0, 0.5], // 左侧中间
        [1, 0.5], // 右侧中间

      ],
      //竖向锚点
      verticalAnchor:[

        [0.5, 0], // 上侧中间
        [0.5, 1] // 下侧中间
      ],
      colors: [
        '#D6F3DA',
        '#FDEBD3',
        '#70BFE36D',
        '#D7D7D7',
        '#D7D7D7',
        '#D7D7D7',
        '#D7D7D7',
        '#D7D7D7'
      ],
      url:"FusionTree",
      treeA:"expert",
      treeB:"fusion",

      treeGraph:'',
    }
  },
  watch:{
    TreeCurrentNumber:{
      handler(newvalue,oldvalue){
        if (newvalue<1 ||newvalue>this.TreeNumber){
          this.$alert("已经到达第一颗树,或最后一颗树",{confirmButtonText: '确定'})
          this.TreeCurrentNumber=oldvalue
        }
        else {
          this.render(this.foldData[this.TreeCurrentNumber-1])
        }
      }
    },
    horizontalOrVertical:{
      handler(newvalue,oldvalue){
        this.$nextTick(()=>{
          // console.log("执行改变按钮")
          // console.log(this.treeGraph)
          if (newvalue)
          {
            this.treeGraph.cfg.layout.direction="LR"
          }
          else {
            this.treeGraph.cfg.layout.direction="TB"
          }
          // this.render(this.foldData)
          this.treeGraph.render()
        })
      }
    }
  },
  methods:{
    commit(){
    //  修改类型
      for (let i=0;i<this.myTreeData.length;i++)
      {
        this.myStructData[i].forEach((node)=>{
          node["TreeType"]=this.myTreeData[i].TreeType
        })
        alert("第"+Number(i+1)+"课树的类型为"+this.myTreeData[i].TreeType)
      }

      this.$confirm("确认提交到数据库吗？",'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }) .then(() => {
        // 需要把二维列表拉直成一维列表插入数据库
        // console.log(this.myStructData.flat())
        this.$axios.post("http://127.0.0.1:5000/TreeStructData",this.myStructData.flat()).then(
          res=>{
            this.$message({
              type: 'success',
              message: res.data
            });
          },
          error=>{
            this.$message({
              type: 'error',
              message: error.data
            });
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
});
    },

    DefaultConfig(){
      return {
        backgroundColor: 'gray',
        width: 1200,
        height: 600,
        modes: {
          // 支持的 behavior，默认模式为default
          // 'zoom-canvas'缩放画布，'drag-canvas'拖拽画布
          default: ['zoom-canvas', 'drag-canvas'],
          //  审阅模式,开启高亮和修订
          revision:[]
        },

        fitView: true, // 开启画布自适应。开启后图自动适配画布大小
        animate: true,
        // 图与画布的留白
        fitViewPadding: [0,150,200,0],

        // 节点样式
        defaultNode: {
          type: 'flow-rect', // flow-rect我们自定义的样式名称，告诉画板要引用哪个模块
          style: {
            fill: '#0095FF' // 默认的模板填充色
          },
          // 默认的模板的文字的填充色
          labelCfg: {
            style: {
              fill: '#fff',
              fontSize: 20,
              fontWeight: 800
            }
          }
        },
        // 线的样式
        defaultEdge: {
          type: 'flow-edge',
          style: {
            stroke: '#CED4D9'
          }
        },
        // 布局
        layout:{
          type: 'compactBox', // 布局类型
          direction: this.horizontalOrVertical?"LR":"TB", // 展开的方向
          //节点高度和宽度的由紧凑树布局和自定义节点自行控制
          // 节点高度的回调函数，控制每个节点的高度
          getHeight: (node) => {
            //自定义节点的高度为120 ，此处和自定义节点高度一致
            return 90
          },
          // 节点宽度的回调函数，控制每个节点的宽度
          getWidth: (node) => {
            const nodeName=node.nodeName
            // console.log("node:",node)
            // console.log("nodeName:",nodeName)
            return nodeName.length<30?360:nodeName.length*12
          },
          //节点纵向间距的回调函数
          getVGap: () => {
            return this.horizontalOrVertical?10:30
          },
          // 节点横向间距的回调函数
          getHGap: () => {
            return this.horizontalOrVertical?60:10
          },
        },
        maxZoom: 1,// 展开时的放缩比例
        minZoom: 0.1
      }
    },
    //修改原数据为可折叠数据,

    UpDateToFoldData(node) {
      //当前节点取消高亮
      node.highLight=false;
      node.foldchildren = node.children;
      node.isfold = true;
      if (!this.HasChild(node)){ node.children=null;return}
      node.children.forEach(child => {
        //孩子结点取消高亮
        child.highLight=false;
        //遍历孩子数组，如果孩子有孩子，则递归向下
        if (this.HasChild(child)) {
          this.UpDateToFoldData(child)
        }
        else {
          child=null
        }
      })
        //  最后把孩子数组置为空
        node.children = null;
    },
    //判断node是否有孩子数组
    HasChild(node) {
      return (node.children !== null && node.children.length!==0);
    },

    render(data) {
      this.treeGraph.data(data) // 加载数据
      this.treeGraph.render() // 渲染
    },
    Init(data){
      //深拷贝一份数据
      this.foldData=JSON.parse(JSON.stringify(data))
      //浅拷贝，引用传递，foldData改变会引起data改变
      // this.foldData=data
      //递归把原始数据改成绘图所需要的数据
      this.TreeNumber=this.foldData.length
      this.TreeCurrentNumber=1
      for(let i=0;i<this.foldData.length;i++){
        this.UpDateToFoldData(this.foldData[i])
      }
      // console.log("this.foldData:",this.foldData)
    },

    registerFn() {
      G6.registerNode(
        'flow-rect', // 自定义的节点名称，在上面进行引用
        {
          // 这里涉及到模板的生命周期函数，官网上面有详细的讲解
          //因为调用vue的数据，所以函数里面的函数写成promise风格
          draw: (cfg, group) => {

            //参数解析
            const {depth, nodeName} = cfg
            // 自定义模板
            let shadow_color="gray";

            const adaptWidth = nodeName.length<30?360:nodeName.length*12
            const height=90
            const rectConfig = {
              width: adaptWidth,
              height: height,
              fill: '#fff',
              shadowOffsetX: 0, // 模板阴影的X轴偏移量
              shadowOffsetY: 0, // 模板阴影的Y轴偏移量
              shadowColor: shadow_color,
              shadowBlur: 10
            }
            // 规定边界，便于定位
            const nodeOrigin = {
              x: -150,
              y: -60
            }
            // 规定文字位置，对齐方式
            const textConfig = {
              textAlign: 'left',
              textBaseline: 'bottom'
            }
            // 初始化模板
            const rect = group.addShape('rect', {
              attrs: {
                x: nodeOrigin.x,
                y: nodeOrigin.y,
                ...rectConfig

              }
            })

            // 背景板
            group.addShape('rect', {
              attrs: {
                x: nodeOrigin.x, // x轴位置
                y: nodeOrigin.y, // y轴位置
                width: adaptWidth,
                height: 35,
                // radius: [0, 0, rectConfig.radius, rectConfig.radius],//锐角化
                fill: this.colors[depth] // 填充色
              }
            })

            // 概念层级
            group.addShape('text', {
              attrs: {
                ...textConfig,
                x: 8 + nodeOrigin.x,
                y: 32 + nodeOrigin.y,
                height: 16,
                fontSize: 18,
                fill: '#555555',
                opacity: 1,
                text: "深度:"+Number(depth+1),
              }
            })

            // 英文名
            group.addShape('text', {
              attrs: {
                ...textConfig,
                x: 10 + nodeOrigin.x,
                y: 75 + nodeOrigin.y,
                height: 22,
                fontSize: 20,
                fontWeight: 800,
                fill: '#333333',
                opacity: 1,
                text: nodeName,
              }
            })


            // 背景板右上角图片
            group.addShape('image', {
              attrs: {
                x: adaptWidth-200,
                y: 6 + nodeOrigin.y,
                img: require('@/assets/logo.png'),
                width: 26,
                height: 26,
                cursor: 'pointer'
              },
              name: 'deleteItem'
            })
            // 继任准备度图片
            return rect
          },
          // 定义锚点，G6会自动连接两个节点的最近的锚点
          getAnchorPoints:()=> {
            return this.horizontalOrVertical?this.horizontalAnchor:this.verticalAnchor
          }
        }
      );
      //  自定义边
      G6.registerEdge('flow-edge',
        {
          draw: (cfg, group) => {

            const {highLight} = cfg
            const startPoint = cfg.startPoint;
            const endPoint = cfg.endPoint;
            const horizontalPath = [
              ['M', startPoint.x, startPoint.y],
              ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 三分之一处
              ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 三分之二处
              ['L', endPoint.x, endPoint.y],
            ];
            const verticalPath = [
              ['M', startPoint.x, startPoint.y],
              ['L', startPoint.x, (startPoint.y*2 + endPoint.y) / 3],
              ['L', endPoint.x, (startPoint.y*2 + endPoint.y) /3],
              ['L', endPoint.x, endPoint.y],
            ];
            const shape = group.addShape('path', {
              attrs: {

                shadowOffsetX: 0, // 模板阴影的X轴偏移量
                shadowOffsetY: 0, // 模板阴影的Y轴偏移量
                shadowColor: highLight ? "red" : "#999",
                shadowBlur: highLight ? 10 : 0,
                //设置用于笔触的颜色(RGB 或 16 进制)、渐变或模式，对应 Canvas 属性 strokeStyle。
                // 取值示例：rgb(18, 150, 231)，#c193af，l(0) 0:#ffffff 0.5:#7ec2f3 1:#1890ff， r(0.5, 0.5, 0.1) 0:#ffffff 1:#1890ff。
                stroke: '#8d8d8d',
                //线的路径
                path:this.horizontalOrVertical?horizontalPath:verticalPath,
                //线的宽度
                lineWidth: 4,
                // 边的击中范围。提升边的击中范围，扩展响应范围，数值越大，响应范围越广。点击线时,多5宽度.便于选中
                lineAppendWidth: 0,
                // 设置两条线相交时，所创建的拐角形状。可选：- 'bevel': 斜角 - 'round': 圆角 - 'miter': 尖角 (默认)。
                lineJoin: "round",
                name:'flow-edge',
              },
            });

            return shape;
          },
        })
    },
    //画图
    getTreeGraph() {

      const treeGraph = new G6.TreeGraph({
        container: 'mountNode', // 制定画布的容器
        ...this.DefaultConfig()

      })
      treeGraph.on('node:click', (ev) =>  {
        const node = ev.item; // 被点击的节点元素
          //获取需要更新的元素
          let { foldchildren} = node.getModel()
          //如果为展开，则修令其折叠
          if (node.getModel().isfold !== true) {
            foldchildren = null;
          }
          node.getModel().isfold = !node.getModel().isfold
          treeGraph.updateChildren(foldchildren, node.getModel().id)


      })
      this.treeGraph = treeGraph
    },
    drawGraph(data){
      //初始化结点类型
      this.registerFn()
      this.getTreeGraph();
      this.Init(data)
      //渲染对象
      this.render(this.foldData[this.TreeCurrentNumber-1])
    }
  },

  mounted() {
   // console.log("preview中的：",this.myTreeData)

    // console.log("this.myTreeData:",this.myTreeData)
    this.dataLoaded = true;
    // 将数据保存到其他数据属性中
    this.drawGraph(this.myTreeData)
  }
}
</script>

<style scoped>

</style>
