
<style scoped>
/*设置右键菜单menu样式*/
  #mountNode{
    width: 1200px;
    height: 540px;
  }

  /*卡片样式*/
  .text {
    font-size: 16px;
  }

  .item {
    margin-bottom: 12px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    position: absolute;
    right: 0;
    top: 0;
    width: 300px;
  }
  .v-enter-active{
    animation: card-fade-in 0.5s linear;
  }
  .v-leave-active{
    animation: card-fade-in reverse 0.5s linear;
  }
  /*动画效果*/
  @keyframes card-fade-in {
    from{
      transform: translateX(100%)
    }
    to{
      transform: translateX(0px)
    }
  }

  /**/
</style>

<template>

          <div style="position: relative;">
<!--            选择描述符树种类-->
    <div class="rightInfo">
      <el-select v-model="TreeType" filterable placeholder="请选择可视化树">
        <el-option
          v-for="item in TreeTypes"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>

      <el-button type="primary" @click="GetAll">点击显示</el-button>


<!--      <el-switch-->
<!--        v-model="zoomFree"-->
<!--        active-color="#13ce66"-->
<!--        inactive-color="lightgray"-->
<!--        active-text="自由缩放"-->
<!--        inactive-text="限制缩放">-->
<!--      </el-switch>-->
      <el-input v-model="FindNodeName" placeholder="请输入描述符英文名称" style="width: 300px;"></el-input>
      <el-button @click="FindNode()" type="primary">点击查询</el-button>
      <el-button @click="ResetFind">重置</el-button>
    </div>

            <el-switch
              v-model="revision"
              active-color="#13ce66"
              inactive-color="lightgray"
              active-text="固定展示"
              inactive-text="自由">
            </el-switch>
<!--            节点详细信息卡片-->
    <transition>
      <el-card v-show='cardShow' class="box-card">
        <div slot="header" class="clearfix">
          <span>详细信息</span>
        </div>
        <div v-for="(value,key,index) in localZhNode" :key="index" class="text item">
          {{key}}&nbsp;:&nbsp;{{value}}
        </div>
      </el-card>
    </transition>
<!--            控制卡片开关-->
    <div style="position: absolute;top: 18px;right: 20px">
      <span v-if="cardShow" style="color: green">显示:</span>
      <span v-if="!cardShow" style="color: #848588">隐藏:</span>

      <el-switch
        v-model="cardShow"
        active-color="#13ce66"
        inactive-color="lightgray">
      </el-switch>
    </div>

    <!--      G6画布,会在div id="mountNode"里面生成canvas-->
    <div  id="mountNode"></div>

    <!--  新增编辑栏目-->
    <el-dialog title="新增孩子结点" :visible.sync="AddDialogFormVisible" :append-to-body="true">
      <el-form :model="AddForm" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12" >
            <el-form-item label="层级"  prop="conceptHierarchy">
              <span v-show="!isUpdateAddConceptHierarchy" @dblclick="CanUpdateAddConceptHierarchy">
                {{AddForm.conceptHierarchy}}
              </span>
              <el-input ref="AddConceptHierarchy" v-show="isUpdateAddConceptHierarchy" v-model="AddForm.conceptHierarchy" @blur="NoUpdateAddConceptHierarchy"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="节点名"  prop="nodeName">
              <el-input v-model="AddForm.nodeName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中文名" prop="zhName">
              <el-input v-model="AddForm.zhName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="来源" prop="source">
          <el-input v-model="AddForm.source" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="introduce">
          <el-input v-model="AddForm.introduce" autocomplete="off" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label="公式" prop="formula">
          <el-input v-model="AddForm.formula" autocomplete="off" type="textarea" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AddChildCancel">取 消</el-button>
        <el-button type="primary" @click="AddChildToDataBase">确 定</el-button>
      </div>
    </el-dialog>


        <!--  修改的编辑栏目-->
        <el-dialog title="编辑孩子结点" :visible.sync="EditDialogFormVisible" :append-to-body="true">
          <el-form :model="EditForm" :rules="rules"  label-width="100px">
            <el-row>
              <el-col :span="12" >
                <el-form-item label="层级"  prop="conceptHierarchy">
              <span v-show="!isUpdateEditConceptHierarchy" @dblclick="CanUpdateEditConceptHierarchy">
                {{EditForm.conceptHierarchy}}
              </span>
                  <el-input ref="EditConceptHierarchy" v-show="isUpdateEditConceptHierarchy" v-model="EditForm.conceptHierarchy" @blur="NoUpdateEditConceptHierarchy"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="节点名"  prop="nodeName">
                  <el-input v-model="EditForm.nodeName" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="中文名" prop="zhName">
                  <el-input v-model="EditForm.zhName" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="来源" prop="source">
              <el-input v-model="EditForm.source" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="introduce">
              <el-input v-model="EditForm.introduce" autocomplete="off" type="textarea"></el-input>
            </el-form-item>

            <el-form-item label="公式" prop="formula">
              <el-input v-model="EditForm.formula" autocomplete="off" type="textarea" ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="EditNodeCancel">取 消</el-button>
            <el-button type="primary" @click="EditNodeToDataBase">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import G6 from '@antv/g6'
export default{
  name: "TreeVisualization",

  data() {
    return {
      //是否能修改新增对话框中的概念层级
      isUpdateAddConceptHierarchy:false,
      //是否能修改编辑对话框中的概念层级
      isUpdateEditConceptHierarchy:false,
      rules: {//校验规则
        nodeName: [{required: true, message: '结点名为必填项', trigger: 'blur'}]},
      //新增时对话框表单是否开启
      AddDialogFormVisible:false,
      //编辑时对话框表单是否开启
      EditDialogFormVisible:false,
      //新增操作时的表单
      AddForm:{},
      //编辑操作时候的表单
      EditForm:{},
      FindNodeName:'',
      //是否启动修订默认,默认为false.
      revision:false,
      //默认模式

      //可视化树的种类
      url: "/Tree",
      TreeTypes: [],
      TreeType: '',
      TreeData: {},
      foldData: {},
      foldChildren: [],

      //是否自由缩放
      zoomFree: false,
      //控制卡片是否显示
      cardShow: true,
      //根据当前选中结点展示信息
      localZhNode: {},

      //下面为G6绘图参数
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
      // 默认配置
      defaultConfig: {
        backgroundColor: 'gray',
        width: 1200,
        height: 540,
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
        fitViewPadding: [0,0,100,0],

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
        layout: {
          type: 'compactBox', // 布局类型
          direction: 'TB', // 展开的方向
          // 节点高度的回调函数，控制每个节点的高度
          getHeight: (node) => {
            return 120
          },
          // 节点宽度的回调函数，控制每个节点的宽度
          getWidth: (node) => {
            const nodeName=node.nodeName
            return nodeName.length<30?300:nodeName.length*10
            // return 300
          },
          //节点纵向间距的回调函数
          getVGap: () => {
            return 30
          },
          //节点横向间距的回调函数
          getHGap: () => {
            return 10
          },
        },
        maxZoom: 1,// 展开时的放缩比例
        minZoom: 0.1
      }
    }
  },
  watch: {
    revision:{
      handler(newValue){
        newValue?this.treeGraph.setMode("revision"):this.treeGraph.setMode("default")
      }
    }
  },
  methods: {
    //修改新增对话框中的概念层级
    CanUpdateAddConceptHierarchy(){
      this.isUpdateAddConceptHierarchy=!this.isUpdateAddConceptHierarchy
      this.$nextTick(()=>{
        this.$refs.AddConceptHierarchy.focus()
      })
    },
    NoUpdateAddConceptHierarchy(){
      this.isUpdateAddConceptHierarchy=!this.isUpdateAddConceptHierarchy
    },
    //修改编辑对话框中的概念层级
    CanUpdateEditConceptHierarchy(){
      this.isUpdateEditConceptHierarchy=!this.isUpdateEditConceptHierarchy
      this.$nextTick(()=>{
        this.$refs.EditConceptHierarchy.focus()
      })
    },
    NoUpdateEditConceptHierarchy(){
      this.isUpdateEditConceptHierarchy=!this.isUpdateEditConceptHierarchy
    },
    // 自定义节点和边
    registerFn() {
      /**
       * 自定义节点
       */
      G6.registerNode(
        'flow-rect', // 自定义的节点名称，在上面进行引用
        {
          // 这里涉及到模板的生命周期函数，官网上面有详细的讲解
          //因为调用vue的数据，所以函数里面的函数写成promise风格
          draw: (cfg, group) => {

            //参数解析
            const {depth, conceptHierarchy, nodeName, zhName, levelHierarchy,highLight} = cfg
            // 自定义模板

            //设置自定义宽度，规则为：
            // 若字符小于18个，则每个宽15，共宽度为270；超过18个字符的，多超过一个加10宽度，共(x-18)*10+270=x*10+90

            const adaptWidth = nodeName.length<30?300:nodeName.length*10
            // console.log()
            const rectConfig = {
              width: adaptWidth,
              height: 120,
              fill: '#fff',
              shadowOffsetX: 0, // 模板阴影的X轴偏移量
              shadowOffsetY: 0, // 模板阴影的Y轴偏移量
              shadowColor: highLight?"red":"#999",
              shadowBlur: 10
            }
            // 规定边界，便于定位
            const nodeOrigin = {
              x: -150,
              y: -60
            }
            // 规定边界，便于定位
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
          getAnchorPoints() {
            return [
              // [0, 0.5], // 左侧中间
              // [1, 0.5], // 右侧中间
              [0.5, 0], // 上侧中间
              [0.5, 1] // 下侧中间
            ]
          }
        }
      );
      //  自定义边
      G6.registerEdge('flow-edge',
        {
        draw: (cfg ,group)=>{

          const {highLight} = cfg
          const startPoint = cfg.startPoint;
          const endPoint = cfg.endPoint;
          const path = [
            ['M', startPoint.x, startPoint.y],
            ['L', startPoint.x, (startPoint.y*2 + endPoint.y) / 3],
            ['L', endPoint.x, (startPoint.y*2 + endPoint.y) /3],
            ['L', endPoint.x, endPoint.y],
          ];



          const shape = group.addShape('path', {
            attrs: {
              shadowOffsetX: 0, // 模板阴影的X轴偏移量
              shadowOffsetY: 0, // 模板阴影的Y轴偏移量
              shadowColor: highLight?"red":"#999",
              shadowBlur: highLight?10:0,
              //设置用于笔触的颜色(RGB 或 16 进制)、渐变或模式，对应 Canvas 属性 strokeStyle。
              // 取值示例：rgb(18, 150, 231)，#c193af，l(0) 0:#ffffff 0.5:#7ec2f3 1:#1890ff， r(0.5, 0.5, 0.1) 0:#ffffff 1:#1890ff。
              stroke:'green',
              //线的路径
              path,
              //线的宽度
              lineWidth:4,
              // 边的击中范围。提升边的击中范围，扩展响应范围，数值越大，响应范围越广。点击线时,多5宽度.便于选中
              lineAppendWidth: 0,
              // 设置两条线相交时，所创建的拐角形状。可选：- 'bevel': 斜角 - 'round': 圆角 - 'miter': 尖角 (默认)。
              lineJoin:"round"
            },
          });
          return shape;
        },
      })
    },
    //画图
    getTreeGraph() {
      // //ToolBar 集成了以下常见的操作：重做; 撤销; 放大; 缩小; 适应屏幕; 实际大小。
      // const toolbar = new G6.ToolBar();
      //
      //Menu 用于配置节点上的右键菜单。
      const menu = new G6.Menu({
        //menu 容器的 class 类名，此处不能联系到<style>样式，但可以取消自带样式
        className:'Menu_class',
        getContent(e, graph) {
          const outDiv = document.createElement('div');

          outDiv.style.padding="4px 0"
          // 修改背景色、
          outDiv.style.backgroundColor="white"
          outDiv.style.opacity="0.99"
          //边框阴影效果
          outDiv.style.boxShadow="1px 1px 0px 0px #8e8e8e"

          //边框样式
          outDiv.style.borderStyle="solid"
          outDiv.style.borderColor='#dadce0'
          outDiv.style.borderWidth='1px'
          outDiv.style.borderRadius='2px'
          //修改宽度
          outDiv.style.width="160px"
          //修改字体大小
          outDiv.style.fontSize="13px"
          // outDiv.style.color="darklier"
          outDiv.innerHTML =
            `
    <div Name="AddChild" style="padding:3px 0  3px 20px" onMouseEnter="this.style.backgroundColor='#e2f0ff'" onMouseLeave="this.style.backgroundColor='white'">
        新增孩子
    </div>
    <div Name="EditNode" style="padding:3px 0  3px 20px" onMouseEnter="this.style.backgroundColor='#e2f0ff'" onMouseLeave="this.style.backgroundColor='white'">
        修改
    </div>
    <hr color="#dadce0" style="margin: 5px 2px;">
    <div Name="DeleteNode" style="padding:3px 0  3px 20px" onMouseEnter="this.style.backgroundColor='#e2f0ff'" onMouseLeave="this.style.backgroundColor='white'">
        删除结点
    </div>

    <div Name="DeleteChildTree" style="padding:3px 0  3px 20px" onMouseEnter="this.style.backgroundColor='#ecf5ff'" onMouseLeave="this.style.backgroundColor='white'">
        删除子树
    </div>
`
          return outDiv
        },
        //为了使this指向Vue，使用promise风格函数
        handleMenuClick:(target, item)=>{
          //得到需要执行函数名
          let functionName=target.getAttribute('Name')
          // 需要执行的函数名为null，则无函数需要执行
          if(functionName===null)
            return
          //非空则执行下面
          //得到Vue组件,下面会调用eval函数，要使用that
          let that=this;
          //得到需要执行完整的函数语句，String类型。前面拼接this. 后面拼接参数
          let program="that."+functionName+"(item)"

          //eval中this指向会改变，所以不能在eval中调用this，使用that替代this(Vue组件)
          eval(program);
        },
      });
      // 画布主体
      const treeGraph = new G6.TreeGraph({
        plugins: [menu], // 配置 Menu ;配置 ToolBar 插件
        container: 'mountNode', // 制定画布的容器
        ...this.defaultConfig

      })



      //修订模式结点点击事件:可以高亮和显示详细信息
      treeGraph.on('node:click', (ev) =>  {
        const node = ev.item; // 被点击的节点元素
        //如果开启修订模式,则修订
        if (this.revision===true)
        {
          let {nodeName, zhName, introduce, conceptHierarchy, source, formula,children} = node.getModel()
          node.getModel().highLight = !node.getModel().highLight
          treeGraph.updateChildren(children, node.getModel().id)

          //获取需要更新的元素
          this.localZhNode = {
            "节点名": nodeName,
            "中文名": zhName,
            "简介": introduce,
            "概念层级": conceptHierarchy,
            "来源": source,
            "公式": formula
          }
          treeGraph.updateChildren(children, node.getModel().id)

        }
        else{
        //  如果开启审阅模式
          //获取需要更新的元素
          let { foldchildren} = node.getModel()
          //如果为展开，则修令其折叠
          if (node.getModel().isfold !== true) {
            foldchildren = null;
          }
          node.getModel().isfold = !node.getModel().isfold
          treeGraph.updateChildren(foldchildren, node.getModel().id)
        }

      })


      //点击边触发事件
      treeGraph.on('edge:click', (ev) => {
        if (this.revision===false)
          return
        const edge = ev.item; // 被点击的边元素
        const shape = ev.target; // 被点击的图形，可根据该信息作出不同响应，以达到局部响应效果
        // edge.isSelected(
        edge.getModel().highLight=!edge.getModel().highLight
        treeGraph.refreshItem(edge)
        // console.log(edge)
      });
      // 应该能控制渲染效果
      treeGraph.get('canvas').set('localRefresh', false)


      this.treeGraph = treeGraph
    },
    render(data) {
      this.treeGraph.data(data) // 加载数据
      this.treeGraph.render() // 渲染
    },

    //下属函数为数组折叠和展开服务
    //实现嵌套数组折叠展开，还是老老实实递归，非递归就用栈模拟递归，其他的太折磨人了。

    // 递归的逻辑为在原数组中增加foldchlidren字段，值为children，把children置为空；同时新增isfold=true以区别是否折叠
    // 初始为折叠状态，需要展开，只需在graph.on上，把foldchildren字段的值赋值给children
    //修改原数据为可折叠数据,
    UpDateToFoldData(node) {
      //当前节点取消高亮
      node.highLight=false;
      node.foldchildren = node.children;
      node.isfold = true;
      node.children.forEach(child => {
        //孩子结点取消高亮
        child.highLight=false;
        //遍历孩子数组，如果孩子有孩子，则递归向下
        if (this.HasChild(child)) {
          this.UpDateToFoldData(child)
        }
      }),
        //  最后把孩子数组置为空
        node.children = null;
    },
    //判断node是否有孩子数组
    HasChild(node) {
      return node.children !== null;
    },

    //
    FindNode(){
      let root=this.foldData;
      if(this.FindNodeHighLight(root,this.FindNodeName)){
        //弹出消息提示框
        this.$message({
          message: '查询成功',
          type: 'success'
        });
        //重新渲染
        this.treeGraph.render();
      }
      else {
        //弹出消息提示框
        this.$message({
          message: '查询失败',
          type: 'info '
        });
      }
    },

    //查询某一结点是否存在并高亮
    FindNodeHighLight(node,nodeName) {
      // console.log(node.nodeName,nodeName)
      if (nodeName===node.nodeName)
      {
        // alert("找到该节点")
        this.isFind=true;
        node.highLight=true;
        return true;
      }
    //  递归寻找
      if (node.foldchildren){
        node.foldchildren.forEach(child => {
          if(this.isFind!==true) {
            //遍历孩子数组，如果孩子有孩子，则递归向下
            this.FindNodeHighLight(child,nodeName)
          }
          if (this.isFind===true)
          {
            node.highLight=true;
            node.children=node.foldchildren;
            return
          }})
        }
      return this.isFind
    },

    //重置查询
    ResetFind(){
      //清空查询框
      this.FindNodeName=''
      //修改查询标记
      this.isFind=false;
      //初始化数据并重新渲染树
      this.GetAll();
    },


    //从现有的类型中添加树
    GetTreeType() {
      this.TreeTypes=[]
      this.$axios.get('/TreeStruct/types').then(
        (res) => {
          res.data.forEach((data)=>{
            this.TreeTypes.push(data)
          });
          this.TreeType=this.TreeTypes[0]
          if (this.TreeType){
            this.GetAll()
          }
          else {
            this.$message("暂无数据，请添加数据")
          }
          // console.log("GetTreeType:",this.TreeTypes)
          //得到种类之后，再执行GetAll

        },
        error => {
          console.log(error)
        })
    },

    //深拷贝数据，修改数据便于绘图，创建并渲染对象
    //函数传参默认为浅拷贝，即：引用传递。所以里面需要深拷贝
    Init(data){
      //深拷贝一份数据
      this.foldData=JSON.parse(JSON.stringify(data))
      //浅拷贝，引用传递，foldData改变会引起data改变
      // this.foldData=data
      //递归把原始数据改成绘图所需要的数据
      this.UpDateToFoldData(this.foldData);
      // console.log("this.TreeData",this.TreeData)
      //首次需要先得到treeGraph对象
      if (!this.treeGraph)
        this.getTreeGraph()
      //渲染对象
      this.render(this.foldData)
    },

    //获取数据并执行
    GetAll() {
      this.$axios.get(this.url + "/"+this.TreeType).then(
        (res) => {
          this.TreeData = res.data
          this.TreeData.conceptHierarchy = this.TreeType
          console.log(this.TreeData)
          this.Init(this.TreeData)
          // console.log("this.FindNodeName.length",this.FindNodeName.length)
          if(this.FindNodeName.length !== 0){
            this.FindNode(this.FindNode)
          }
        },
        (error) => {
          console.log(error)
        })
    },

    //弹出新增对话框
    AddChild(Node){
      // console.log(this.AddForm)
      //重置新增表单
      this.AddForm={};
      //父节点ID为点击结点，当前结点ID使用uuid4生成
      this.AddForm.id=this.$uuid()
      this.AddForm.parentId=Node.getModel().id
      //增加树的类型
      this.AddForm.treeType=this.TreeType

      //增加概念层级：根据规则自动生成
      let FatherConceptHierarchy=Node.conceptHierarchy
      if (FatherConceptHierarchy===this.TreeType)  //根节点
      {
        // console.log("判断是否是根节点")
        this.$set(this.AddForm,'conceptHierarchy',"粗粒度层")
      }
      else if(FatherConceptHierarchy==="粗粒度层")
      {
        // console.log("判断是否是粗粒度")
        this.$set(this.AddForm,'conceptHierarchy',"细粒度层")
      }
      else
      {
        // console.log("判断是否是细粒度")
        this.$set(this.AddForm,'conceptHierarchy',"概念层")
      }

      this.AddDialogFormVisible=true;
    },
    //提交新增对话框
    AddChildToDataBase(){
      //提交信息到后台
      // console.log(this.AddForm)
      this.$axios.put(this.url,this.AddForm).then(
        res=>{
          this.$message.success(res.data)
          //修改查询标记
          this.isFind=false;
          //添加查询结点名字
          this.FindNodeName=this.AddForm.nodeName
          //重新获取并查询
          this.GetAll()
          //重新获取数据
          // this.GetAll()
          //关闭弹窗
          this.AddDialogFormVisible=false;
        },error=>{
          this.$message.error(error)
      })

    },
    //取消新增对话框
    AddChildCancel(){
      this.AddDialogFormVisible = false;
      this.$message.info('取消')
    },
    //弹出修改对话框
    EditNode(node){
      this.EditForm=node.getModel();
      //增加旧的节点名，根据结点名去修改信息结点
      this.EditForm.oldName=node.getModel().nodeName
      //增加树的类型
      this.EditForm.treeType=this.TreeType
      this.EditDialogFormVisible=true;
      // console.log(this.EditForm)
      if (this.EditForm.conceptHierarchy===null){
        this.EditForm.conceptHierarchy="概念层级"
      }
    },
    //取消修改对话框
    EditNodeCancel(){
      this.EditDialogFormVisible=false;
      this.$message.info("取消编辑")
    },
    //提交修改对话框
    EditNodeToDataBase(){
      this.$axios.post(this.url,this.EditForm).then(
        res=>{
          this.$message.success(res.data)
          //修改查询标记
          this.isFind=false;
          //添加查询结点名字
          this.FindNodeName=this.EditForm.nodeName
          //重新获取并查询
          this.GetAll()
          //关闭弹窗
          this.EditDialogFormVisible=false;
        },
        error=>{
          this.$message.error(error)
        }
      )
    },
    //删除当前结点
    DeleteNode(node){
      this.$confirm('删除当前结点,但保留孩子结点，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(this.url,{data:node.getModel()}).then(
          res=>{
            this.$message({
              type: 'success',
              message: "删除成功"
            });
            this.isFind=false;
            this.FindNodeName=res.data
            if (res.data==="删除成功"){
              this.FindNodeName=''
            }
            this.GetTreeType();
          },
          error=>{
            this.$message({
              type: 'warning',
              message: error
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
    //删除子树
    DeleteChildTree(node){
      this.$confirm('删除当前结点,及所有孩子结点，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(this.url+"/All",{data:node.getModel()}).then(
          res=>{
            this.$message({
              type: 'success',
              message: "删除成功"
            });
            this.isFind=false;
            this.FindNodeName=res.data
            if (res.data==="删除成功"){
              this.FindNodeName=''
            }
            this.GetTreeType();
          },
          error=>{
            this.$message({
              type: 'warning',
              message: error
            });
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
    },
  mounted() {
    //初始化结点类型
    this.registerFn()
    this.GetTreeType()
  }
}
</script>

