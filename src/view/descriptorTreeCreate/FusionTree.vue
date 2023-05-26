<template>
  <div>
    <div style="top: 10px;left:100px">
      <el-select  style="width: 300px;" v-if="isGetTypes" v-model="Trees" multiple placeholder="请选择">
        <el-option
          v-for="item in TreeTypes"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-button @click="showDiffTree(1,'min')" type="primary" style="margin: 0 10px">显示交集树</el-button>
      <el-button @click="showDiffTree(0.5,'middle')" type="primary" style="margin: 0 10px">显示Middle树</el-button>
      <el-button @click="showDiffTree(0,'max')" type="primary" style="margin: 0 10px">显示并集树</el-button>
      <span v-if="horizontalOrVertical" style="color: #57ab57">水平布局</span>
      <span v-if="!horizontalOrVertical" style="color: #ce820f">垂直布局</span>
      <el-switch
        v-model="horizontalOrVertical"
        active-color="#57ab57"
        inactive-color="#ce820f">
      </el-switch>
      <span v-if="showTotal" style="color: #57ab57">全部展开</span>
      <span v-if="!showTotal" style="color: #47ace5">隐藏所有</span>
      <el-switch
        v-model="showTotal"
        active-color="#57ab57"
        inactive-color="#47ace5">
      </el-switch>
      <el-button @click="CreateFusionTree" type="primary" style="margin: 0 10px">新建融合树</el-button>
    </div>

    <div id="mountNode" style="margin-top: 10px"></div>
  </div>
</template>

<script>
import G6 from "@antv/g6";

export default {
  data(){
    return{
      showTotal:false,
      selectLine:0,
      selectType:"max",
      hasFusionTree:false,
      TreeTypes: [],
      Trees:["textMining","expert",'feature'],
      isGetTypes:false,
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

      treeGraph:'',
      TreeData:''
    }
  },
  computed:{

  },
  watch:{
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
          this.treeGraph.render()
        })
      }
    },
    showTotal:{
      handler(){
        this.Init(this.TreeData)
      }
    }
  },

  methods: {

    showDiffTree(Num,type){
      this.$confirm("请选择显示形式",{
        confirmButtonText:"在融合树中高亮显示",
        cancelButtonText:"显示交集树"
      }).then(
        ()=>{
          this.selectLine=0
          this.selectType=type
          this.Init(this.TreeData)
        }
      ).catch(
        ()=>{
          this.selectLine=Num
          this.selectType=type
          this.Init(this.TreeData)
        }
      )
    },

    //获取数据并执行
    GetAll() {
      // console.log(this.TreeTypes)
      this.TreeTypes.forEach(type=>{
        if (type==='fusion'){
          this.hasFusionTree=true
        }
      })

      if (this.hasFusionTree===true)
      {
        this.$axios.get("/Tree/fusion").then(
          (res) => {
            this.TreeData = res.data
            this.TreeData.score=1
            this.Init(this.TreeData)
          },
          (error) => {
            console.log(error)
          })
      }
      else {
        let types=[]
        for(let i=0;i<this.TreeTypes.length;i++)
        {
          if (this.TreeTypes[i]!=="fusion"){
            types.push(this.TreeTypes[i])
          }
        }
        this.$axios.post(this.url,types).then(
          (res) => {
            this.TreeData = res.data
            this.TreeData.score=1
            //  再把新生成的融合树导入数据库
            this.ImportToDB()
            this.TreeTypes = []
            this.$axios.get('/TreeStruct/types').then(
              (res) => {
                res.data.forEach((data) => {
                  this.TreeTypes.push(data)
                })
              },
              (error) => {
                console.log(error)
              })
          })
      }
    },
    //新建融合树并替换掉数据库里面的融合树
    CreateFusionTree() {
      this.selectLine=0
      console.log("this.TreeData.nodeName",this.TreeData)
      if(!this.TreeData.nodeName)
      {
        this.$message.info("当前无融合树")
        this.CreateTree()
      }
      else{
        this.$axios.delete("/Tree/All",{data:{"nodeName":this.TreeData.nodeName,"id":this.TreeData._id}}).then(
          response=>{
            this.CreateTree()
          }
        )
      }
      console.log()
      //  先删除数据库里面的融合树结点

    },
    CreateTree(){
      //再构建融合树
      let types=[]
      for(let i=0;i<this.TreeTypes.length;i++)
      {
        if (this.TreeTypes[i]!=="fusion"){
          types.push(this.TreeTypes[i])
        }
      }
      this.$axios.post(this.url,types).then(
        (res) => {
          console.log(this.res)
          this.TreeData = res.data
          this.TreeData.score=1
          this.ImportToDB()
          this.$message({
            type: 'success',
            message: "新建成功"
          });
        },
        (error) => {
          console.log(error)
        })
    },
    ImportToDB(){
      this.$axios.post("http://127.0.0.1:5000/NestedToStructureToMongoDB",this.TreeData).then(
        res=>{
          console.log(res.data)
          this.$axios.post("http://127.0.0.1:5000/TreeStructData",res.data).then(
            response=>{
              this.$axios.get("/Tree/fusion").then(
                (res) => {
                  this.TreeData = res.data

                  this.Init(this.TreeData)
                  // console.log("this.FindNodeName.length",this.FindNodeName.length)
                },
                (error) => {
                  console.log(error)
                })
            }
          )
        }
      )
    },
    //从现有的类型中添加树
    GetTreeType() {
      // console.log("GetTreeType")
      this.TreeTypes=[]
      this.$axios.get('/TreeStruct/types').then(
        (res) => {
          res.data.forEach((data)=>{
            this.TreeTypes.push(data)
          });
          //得到种类之后，再执行GetAll
          this.isGetTypes=true
          this.GetAll();

        },
        error => {
          console.log(error)
        })
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
          fitViewPadding: [0,50,50,0],

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
        // 布局fax
        layout:{
          type: 'compactBox', // 布局类型
            direction: this.horizontalOrVertical?"LR":"TB", // 展开的方向
            //节点高度和宽度的由紧凑树布局和自定义节点自行控制
            // 节点高度的回调函数，控制每个节点的高度
            getHeight: (node) => {
            //自定义节点的高度为120 ，此处和自定义节点高度一致
            return 120
          },
            // 节点宽度的回调函数，控制每个节点的宽度
            getWidth: (node) => {
            const nodeName=node.nodeName
            return nodeName.length<30?300:nodeName.length*10
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
    SelectData(node) {
      // console.log("nodeName为："+node.nodeName+"开始遍历孩子");
      node.foldchildren=node.children
      node.isfold=false
      if(!this.HasChild(node)) return
      for (let i=0;i<node.children.length;i++){
        if (node.children[i].score >= this.selectLine) {
          // console.log("向下递归")
          this.SelectData(node.children[i]);
        } else {
          // console.log("删除孩子，index为："+index,"孩子为："+node.children[index].nodeName)
          // 直接修改父节点的children数组，将当前节点从数组中删除
          node.children.splice(i, 1);
          i--;
        }
      }
    },
    //修改原数据为可折叠数据,

    UpDateToFoldData(node) {
      node.foldchildren = node.children;
      node.isfold = true;
      node.children.forEach(child => {
        //遍历孩子数组，如果孩子有孩子，则递归向下
        if (this.HasChild(child)) {
          this.UpDateToFoldData(child)
        }
      })
        //  最后把孩子数组置为空
        node.children = null;
    },
    //判断node是否有孩子数组
    HasChild(node) {
      return node.children !== null;
    },

    render(data) {
      this.treeGraph.data(data) // 加载数据

      this.treeGraph.render() // 渲染
    },
    Init(data){
      //深拷贝一份数据
      this.foldData=null
      this.foldData=JSON.parse(JSON.stringify(data))

      //浅拷贝，引用传递，foldData改变会引起data改变

      //根据得分筛选middle、max、min树
      this.SelectData(this.foldData)
      // console.log("SelectData:",this.foldData)
      //递归把原始数据改成绘图所需要的数据
      if(!this.showTotal){
        this.UpDateToFoldData(this.foldData);
      }

      //渲染对象
      this.render(this.foldData)
    },
    registerFn() {
      G6.registerNode(
        'flow-rect', // 自定义的节点名称，在上面进行引用
        {
          // 这里涉及到模板的生命周期函数，官网上面有详细的讲解
          //因为调用vue的数据，所以函数里面的函数写成promise风格
          draw: (cfg, group) => {

            //参数解析
            const {depth, conceptHierarchy, nodeName, zhName, levelHierarchy,score} = cfg
            // 自定义模板
            let shadow_color="gray";
            if (score>=0.5 && this.selectType==="middle")
            {
              shadow_color="#2a9c49"
            }
            if (score>=1 && this.selectType==="min")
            {
              shadow_color="#e44033"
            }
            const adaptWidth = nodeName.length<30?300:nodeName.length*10
            const height=120
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
                height: 50,
                // radius: [0, 0, rectConfig.radius, rectConfig.radius],//锐角化
                fill: this.colors[depth] // 填充色
              }
            })

            // 概念层级
            group.addShape('text', {
              attrs: {
                ...textConfig,
                x: 8 + nodeOrigin.x,
                y: 40 + nodeOrigin.y,
                height: 16,
                fontSize: 20,
                fill: '#555555',
                opacity: 1,
                text: levelHierarchy > 3 ? '概念层' : conceptHierarchy,
              }
            })

            // 中文名
            group.addShape('text', {
              attrs: {
                ...textConfig,
                x: 10 + nodeOrigin.x,
                y: 80 + nodeOrigin.y,
                height: 18,
                fontSize: 20,
                fontWeight: 800,
                fill: '#333333',
                opacity: 1,
                text: zhName,
              }
            })

            // 节点名
            group.addShape('text', {
              attrs: {
                ...textConfig, // 继承文字的对齐方式
                x: 10 + nodeOrigin.x,
                y: 110 + nodeOrigin.y,
                width: 90,
                height: 10,
                fontSize: 18,
                opacity: 0.8,
                fill: '#333333',
                text: nodeName  // 文字内容区域
              }
            })

            // 背景板右上角图片
            group.addShape('image', {
              attrs: {
                x: adaptWidth-200,
                y: 12 + nodeOrigin.y,
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
          //如果为展开，则修令其折叠
          //第一次isfold=true，foldchildren非空
          if (node.getModel().isfold === true) {
            treeGraph.updateChildren(node.getModel().foldchildren, node.getModel().id)
          }
          else{
            treeGraph.updateChildren(null, node.getModel().id)
          }
          node.getModel().isfold = !node.getModel().isfold
      })
      this.treeGraph = treeGraph
    },
  },

  mounted() {
    this.registerFn()
    this.getTreeGraph();
    this.GetTreeType()
  },
}
</script>

<style scoped>

</style>
