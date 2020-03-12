<template>
    <div id="map">
        <div class="headerBox">
            <img src="../../src/assets/images/logo.png" alt="">
            <p class="title">中国(南京)智谷产业生态分布图</p>
        </div>
        <div class="switchBox">
            <span class="switchTitle">卫星影像</span><el-switch v-model="switchMap" active-color="#13ce66" inactive-color="#ff4949" @change="setMapTheme"></el-switch>
        </div>
        <div class="bottomBox">
            <div v-for="item in navBarList" :key="item.id" :class="[isClick === item.id ? 'activeitemsNav' : 'itemsNav']" @click="getItemData(item.id)">
                <i :class="item.icon"></i>
                <p class="name">{{item.name}}</p>
            </div>
        </div>
        <div class="leftBox">
            <div class="leftItemsBox">
                <div class="leftheaderBox">
                    <p class="headerTitle">行业从业人数</p>
                </div>
                <div class="etitle">从业人数:28766人</div>
                <div id="enterprise"></div>
            </div>
            <div class="leftItemsBox">
                <div class="leftheaderBox">
                    <p class="headerTitle">企业数量及产业规模</p>
                </div>
                <div class="etitle">总数:248家，总产值：{{totalValue}}亿元</div>
                <div id="outputValue"></div>
                <div id="modelll"></div>
            </div>
        </div>
        <div class="rightBox">
            <el-input v-model="search" placeholder="请输入企业名称或企业类型" @input="getSearchResult">
                <el-button slot="append" icon="el-icon-search" @click="getSearchResult"></el-button>
            </el-input>
            <div style="height:20px"></div>
            <div class="leftheaderBox">
                <p class="headerTitle">中国(南京)智谷AI应用场景</p>
            </div>
            <div class="content">
                <div class="btnGroups">
                    <md-tabs @md-changed="getScenList" md-alignment="fixed">
                        <md-tab class="movies" id="0" md-label="疫情防控">
                            <div class="cardBox" v-for="(item,index) in virusList" :key="index" @click="clusterMapDis">
                                <div>
                                    <div class="cardContent">
                                        <p class="cardTitle">{{item.scene}}</p>
                                        <p class="cardDetail">{{item.scenarioDefined}}</p>
                                        <el-button type="text" style="color:'#ffffff'" @click="showDetail(item.sceneId)">查看更多>></el-button>
                                    </div>
                                </div>
                            </div>
                        </md-tab>
                        <md-tab class="movies" id="1" md-label="智慧政务">
                            <div class="cardBox" v-for="(item,index) in sceanList" :key="index" @click="clusterMapDis">
                                <div v-if="item.sceneClassification == '1'">
                                    <div class="cardContent">
                                        <p class="cardTitle">{{item.scene}}</p>
                                        <p class="cardDetail">{{item.scenarioDefined}}</p>
                                        <el-button type="text" style="color:'#ffffff'" @click="showDetail(item.sceneId)">查看更多>></el-button>
                                    </div>
                                </div>
                            </div>
                        </md-tab>

                        <md-tab id="2" class="movies" md-label="智慧民生">
                            <div class="cardBox" v-for="(item,index) in sceanList" :key="index" @click="clusterMapDis">
                                <div v-if="item.sceneClassification == '2'">
                                    <div class="cardContent">
                                        <p class="cardTitle">{{item.scene}}</p>
                                        <p class="cardDetail">{{item.scenarioDefined}}</p>
                                        <el-button type="text" style="color:'#ffffff'" @click="showDetail(item.sceneId)">查看更多>></el-button>
                                    </div>
                                </div>
                            </div>
                        </md-tab>

                        <md-tab id="3" class="movies" md-label="智慧产业">
                            <div class="cardBox" v-for="(item,index) in sceanList" :key="index" @click="clusterMapDis">
                                <div v-if="item.sceneClassification == '3'">
                                    <div class="cardContent">
                                        <p class="cardTitle">{{item.scene}}</p>
                                        <p class="cardDetail">{{item.scenarioDefined}}</p>
                                        <el-button type="text" style="color:'#ffffff'" @click="showDetail(item.sceneId)">查看更多>></el-button>
                                    </div>
                                </div>
                            </div>
                        </md-tab>
                    </md-tabs>
                </div>
            </div>
        </div>
        <div class="sceanDetailDialog" v-if="sceanFlag">
            <div class="sceanDialogHeader">
                <p class="dialogTitle">{{sceanData.scene}}</p>
                <i class="el-icon-close" @click="closeDialog"></i>
            </div>
            <div class="divider"></div>
            <div class="sceanBox">
                <p class="stepsTitle">① 场景描述:</p>
                <div class="stepsContent">
                    <p class="stepsDetail">{{sceanData.scenarioDefined}}</p>
                </div>
                <p class="stepsTitle">② 图片和视频介绍:</p>
                <div class="stepsContent">
                    <!-- <img class="shortcut" v-for="(item,index) in companySceneImgDTOList" :key="index" :src="item.scenarioImg" alt=""> -->
                    <el-image 
                        style="width: 200px; height: 120px"
                        :src="url" 
                        :preview-src-list="srcList">
                    </el-image>
                    <!-- <el-carousel :interval="4000">
                        <el-carousel-item v-for="(item,index) in companySceneImgDTOList" :key="index">
                            <el-popover placement="top" trigger="click">
                                <img class="realImg" :src="item.scenarioImg" alt="">
                                <img class="shortcut" slot="reference" :src="item.scenarioImg" alt="">
                            </el-popover>
                        </el-carousel-item>
                    </el-carousel> -->
                    <video class="myVideo" :src="videoUrl" controls></video>
                </div>
                <!-- <p class="stepsTitle">③ 视频介绍:</p>
                <div class="stepsContent">
                    <video class="myVideo" :src="videoUrl" controls></video>
                </div> -->
                <p class="stepsTitle">③ 关联企业:</p>
                <div class="stepsContent">
                    <div class="sceanEnterBox">
                        <div class="sceanEnterItems" v-for="item in officeList" :key="item.enterpriseId" @click="showInMapbox(item.enterpriseId)">
                            <p class="enterName">{{item.enterpriseName}}</p>
                            <p class="enterP">法人:{{item.legalPerson}}</p>
                            <p class="enterP">注册资金:{{item.registeredCapital}}万元</p>
                            <p class="enterP">地址:{{item.area}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="sceanDetailDialog" v-if="enterpriseFlag">
            <div class="sceanDialogHeader">
                <p class="dialogTitle">{{parkName}}</p>
                <i class="el-icon-close" @click="closeEnterpriseDialog"></i>
            </div>
            <div class="divider"></div>
            <div class="enterpriseBox">
                <el-tabs v-model="activeIndex" :tab-position="tabPosition" style="height: 200px;" :stretch="false" @tab-click="handleTabClick">
                    <el-tab-pane  v-for="(item,index) in enterpriseList" :key="index" :label="item.enterpriseName">
                        <div class="enterpriseDetail">
                            <singleEcharts :id="item.enterpriseName"></singleEcharts>
                            <div class="detailBox">
                                <p>法人：{{legalPerson}}</p>
                                <p>注册资金：{{item.registeredCapital}}万元</p>
                                <p>AI方向：{{item.AIbusiness}}</p>
                                <p>主营业务：{{item.content}}</p>
                                <p>所属区：{{item.Itsarea}}</p>
                                <p>地址：{{item.area}}</p>
                            </div>
                        </div>
                       <div class="tagBox">
                            <p class="qichachaTitle">公司基本信息（以下数据来源于企查查）</p>
                            <div class="taglist">
                                <p class="tagTitle">主要职员：</p>
                                <div v-for="(item,index) in Employees" :key="index" class="tagCintent">
                                    <p>
                                        <span>{{item.Name}}</span>
                                        <span class="secondSpan">{{item.Job}}</span>
                                    </p>
                                </div>
                                <p class="tagTitle">产品信息：</p>
                                <div v-for="(item,index) in CompanyProducts" :key="index" class="tagCintent">
                                    <p>所属领域:<span class="secondSpan">{{item.Domain}}</span></p> 
                                    <p>商标图片:<a :href="item.ImageUrl" target="_blank" style="color:#fff;margin-left:10px">{{item.ImageUrl}}</a></p>
                                    <p>商标名称:<span class="secondSpan">{{item.Name}}</span></p>
                                    <p>官网地址:<a :href="item.Link" target="_blank" style="color:#fff;margin-left:10px">{{item.Link}}</a></p>
                                    <p>产品标签:<span class="secondSpan">{{item.Tags}}</span></p>
                                </div>
                                <p class="tagTitle">知识产权：</p>
                                <div class="tagCintent">
                                    <p>专利数量：{{knowledge}}</p>
                                </div>
                                <p class="tagTitle">产业信息：</p>
                                <div class="tagCintent">
                                    <p>产业范围：{{Industry.Industry}}</p>
                                </div>
                                <p class="tagTitle">股东信息：</p>
                                <div v-for="item in Partners" :key="item.KeyNo" class="tagCintent">
                                    <span>{{item.StockName}}</span>
                                    <span class="secondSpan">{{item.StockPercent}}</span>
                                </div>
                                <p class="tagTitle">主营业务：</p>
                                <div class="tagCintent">
                                    <p>{{ScopeIn}}</p>
                                </div>
                                <p class="tagTitle">联系方式：</p>
                                <div class="tagCintent">
                                    <p>邮箱：<span class="secondSpan">{{ContactInfo.Email}}</span></p>
                                    <p>电话：<span class="secondSpan">{{ContactInfo.PhoneNumber}}</span></p>
                                </div>
                            </div>
                       </div>
                    </el-tab-pane>
                </el-tabs>
                
            </div>
        </div>
        <div class="sceanDetailDialog" v-if="searchFlag">
            <div class="sceanDialogHeader">
                <p class="dialogTitle">{{searchEnterprise}}</p>
                <i class="el-icon-close" @click="closeEnterpriseDialog"></i>
            </div>
            <div class="divider"></div>
            <div class="enterpriseBox">
                <el-tabs :tab-position="tabPosition" :stretch="false">
                    <el-tab-pane  :label="enterpriseName">
                        <div class="enterpriseDetail">
                            <singleEcharts :id="enterpriseName"></singleEcharts>
                            <div class="detailBox">
                                <p>法人：{{enterprise.legalPerson}}</p>
                                <p>注册资金：{{enterprise.registeredCapital}}万元</p>
                                <p>AI方向：{{enterprise.AIbusiness}}</p>
                                <p>主营业务：{{enterprise.content}}</p>
                                <p>所属区：{{enterprise.Itsarea}}</p>
                                <p>地址：{{enterprise.area}}</p>
                            </div>
                        </div>
                       <div class="tagBox">
                            <el-tag effect="dark" type="warning" closable v-for="(item,index) in elementsList" :key="index">{{item}}</el-tag>
                       </div>
                    </el-tab-pane>
                </el-tabs>
                
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <div>
                为优化体验效果，请点击下载<a target="_blank" href="https://www.google.cn/chrome/">chrome浏览器</a>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="查看图片"
            :visible.sync="imgDialogVisible"
            width="50%"
            center>
            <el-image 
                style="width: 100px; height: 100px"
                :src="url" 
                :preview-src-list="srcList">
            </el-image>
            <el-carousel :interval="4000">
                <el-carousel-item v-for="(item,index) in companySceneImgDTOList" :key="index">
                    <img class="realImg" :src="item.scenarioImg" alt="">
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
    </div>
</template>

<script>
// 万里
import mapboxgl from 'mapbox-gl'
import parkList from '../jsonFile/汇总.json'
import algorithm from '../assets/distributeFile/算法.json'
import idCard from '../assets/distributeFile/芯片.json'
import model from '../assets/distributeFile/模块.json'
import system from '../assets/distributeFile/系统.json'
import network from '../assets/distributeFile/网络.json'
import platform from '../assets/distributeFile/平台.json'
import terminal from '../assets/distributeFile/终端.json'
import smartGov from '../assets/distributeFile/智慧政务.json'
import echarts from 'echarts'
import singleEcharts from '../components/singleEcharts'
import axios from 'axios'
import pos1 from '../svg/icon-01.png'
import pos2 from '../svg/icon-02.png'
import pos3 from '../svg/icon-03.png'
import pos4 from '../svg/icon-04.png'
import pos5 from '../svg/icon-05.png'
import pos6 from '../svg/icon-06.png'
export default {
    data(){
        return{
            centerDialogVisible:false,
            map:'',//地图实例
            switchMap:false,
            navBarList:[
                {
                    id:1,
                    name:'算法',
                    icon:'iconfont icon-wangluo'
                },
                {
                    id:2,
                    name:'芯片',
                    icon:'iconfont icon-xinpian'
                },
                {
                    id:3,
                    name:'模块',
                    icon:'iconfont icon-modular'
                },
                {
                    id:4,
                    name:'终端',
                    icon:'iconfont icon-zhongduan'
                },
                {
                    id:5,
                    name:'系统',
                    icon:'iconfont icon-xitong'
                },
                {
                    id:6,
                    name:'网络',
                    icon:'iconfont icon-network'
                },
                {
                    id:7,
                    name:'平台',
                    icon:'iconfont icon-pingtai'
                },
                {
                    id:8,
                    name:'全部',
                    icon:'iconfont icon-quanbu'
                },

            ],// 底部导航栏菜单
            isClick:8,// 默认选择全部
            search:'',//搜索框输入内容
            scean:1,//场景,
            sceanList:[

            ],
            sceanFlag:false,
            sceanData:{},
            circle:{
                alogthom:30,
                IDcard:30,
                model:30,
                last:30,
                system:30,
                network:30,
                box:30,
            },
            enterpriseFlag:false,
            tabPosition:"left",
            markers:{},
            markersOnScreen:{},
            colors:['#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c'],
            imgList:[pos1, pos2, pos3,pos4,pos5,pos6],
            marker:'',
            enterpriseList:[],
            parkName:'',
            activeIndex:0,
            radar:'',
            radarFlag:false,
            elementsList:['算法','芯片', '终端', '系统', '平台'],
            searchReault:{
                type: "FeatureCollection",
                crs: {
                    type: "name",
                    properties: {
                        name: "urn:ogc:def:crs:OGC:1.3:CRS84"
                    }
                },
                features: [{
                    type: "Feature",
                    properties: {
                        id: "地理信息园",
                        mag: 1,
                        time: 1507425650893,
                        felt: null,
                        tsunami: 0,
                        test:[]
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [118.9196460753, 32.0805948414]
                    }
                }]
            },
            searchFlag:false,
            searchEnterprise:'',
            enterprise:{},
            officeList:[],
            totalValue:581.95,
            activeName:'first',
            CompanyProducts:[],
            Employees:[],
            detail:{},
            Industry:{},
            Partners:[],
            ScopeIn:'',
            knowledge:0,
            legalPerson:'',
            ContactInfo:{},
            companySceneImgDTOList:[],
            videoUrl:'',
            imgTitle:'',
            imgDialogVisible:false,
            url:'',
            srcList:[],
            virusList:[
                {
                    companyId: 1,
                    companySceneImgDTOList: [],
                    scenarioDefined: "在公路、社区、综合体各卡口位置与当地运营商联合部署基站电子围栏，流动人口进入围栏区域就会收到短信，通过短信链接地址进入联防联控信息录入界面，用户自行填报姓名、身份证、始发地、目的地、具体地址、来访事由、联系电话、车牌号、身体状况和体温信息进行记录；填写完后，用户会收到验证码短信，通过验证码提交电子登记表后，手机会收到包含填写内容的短信，并生成临时健康卡，检查点工作人员核对后即可放行，临时健康卡可用于其他检查点的查验。",
                    scenarioKeyword: "",
                    scene: "疫情联防信息电子登记系统",
                    sceneClassification: "0",
                    sceneId: 41,
                    video: "q3vbt7rr5.bkt.clouddn.com/images/tId=15826143001020c00a90493352be9660a0b577b9ccdd5.mp4"
                },{
                    companyId: 1,
                    companySceneImgDTOList: [],
                    scenarioDefined: "以社区、乡镇为核心，依托网格化管理平台，向政府、企业、公众提供智能化的技术服务。对政府提供疫情感知、远程指挥、人工智能监控、自动监管、疫情趋势分析等功能，方便政府机构随时掌握疫情总体态势和重点地区疫情和事件信息全貌，并提供针对重点问题和疫情的快速指挥和应急处理。对企业提供企业复工申报、企业员工健康自查等功能，有序推动企业复工复产，为企业疫情防控提供有力支撑。对公众提供便民信息发布、人员自动登记、健康自查上报、疫情线索上报等功能，帮助百姓足不出户掌握疫情动态、官方通报、健康知识等信息，强化百姓的自我防护意识，落实综合防控措施，控制疾病传播。",
                    scenarioKeyword: "疫情",
                    scene: "疫情地理智能政务综合服务平台",
                    sceneClassification: "1",
                    sceneId: 40,
                    video: ""
                },
                {
                    companyId: 1,
                    companySceneImgDTOList: [],
                    scenarioDefined: "“健康打卡”：为企业内部员工提供每日打卡上报功能，需要员工每天填写：健康状态、是否就诊住院、是否接触病患、是否已经返回所在城市、出差计划等信息。“闭关打卡”：为企业内部需要隔离的员工提供，闭关任务创建，闭关全过程实时上报，并提供通过积分勋章奖励机制鼓励人员按时执行。“社区助手”：为社区居民和管理人员提供，疫情上报下达，走访、申报等能力。",
                    scenarioKeyword: "",
                    scene: "鲸智守卫——关注企业员工健康",
                    sceneClassification: "2",
                    sceneId: 45,
                    video: "q3vbt7rr5.bkt.clouddn.com/images/tId=15826180570202020xgfyfk2.mp4"
                }
            ],
            numTest:1
        }
    },
    components:{
        singleEcharts
    },
    mounted(){
        this.checkBrowserVersion()
        this.initMap()
        this.getRadarEnterprise()
        this.getOutputValue()
        this.getEnterpriseMode()
        this.getScenList(1)
    },
    methods:{
        checkBrowserVersion(){
            var browser=navigator.appName
            var b_version=navigator.appVersion
            var version=parseFloat(b_version)
            if(browser === 'Netscape' && version < 5){
                // alert("请下载最新版浏览器")
                window.location.href="https://www.google.cn/chrome/"
                return false
            }
            // var Sys = {};
            // var ua = navigator.userAgent.toLowerCase();
            // var s;
            // (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            // (s = ua.match(/firefox/([\d.]+)/)) ? Sys.firefox = s[1] :
            // (s = ua.match(/chrome/([\d.]+)/)) ? Sys.chrome = s[1] :
            // (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
            // (s = ua.match(/version/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
            // /以下进行测试/
            // if (Sys.ie) {
            //     this.centerDialogVisible = true
            // };
            // if (Sys.firefox) {
            //     this.centerDialogVisible = false
            // };
            // if (Sys.chrome) {
            //     this.centerDialogVisible = false
            // };
            // if (Sys.opera) {
            //     this.centerDialogVisible = false
            // };
            // if (Sys.safari) {
            //     this.centerDialogVisible = false
            // };
            // if (Sys.ie == 9.0 || Sys.ie == 8.0 || Sys.ie == 7.0 || Sys.ie == 7.0){
            //     window.location.href="https://www.google.cn/chrome/"
            // }
        // var Sys = {};  
        // var ua = navigator.userAgent.toLowerCase();  
        // var s;  
        // (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :  
        // (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :  
        // (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :  
        // (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :  
        // (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;  
        // /*以下进行测试*/  
        // if (Sys.ie) this.centerDialogVisible = true;  
        // if (Sys.firefox) this.centerDialogVisible = false;  
        // if (Sys.chrome) this.centerDialogVisible = false;  
        // if (Sys.opera) this.centerDialogVisible = false;  
        // if (Sys.safari) this.centerDialogVisible = false;  
     
        // if (Sys.ie == 9.0 || Sys.ie == 8.0 || Sys.ie == 7.0 || Sys.ie == 6.0){
        //     window.location.href="https://www.google.cn/chrome/"
        // }
        },
        initMap(){
            mapboxgl.accessToken = 'pk.eyJ1Ijoibnl5anl5YW5mYXBlbmciLCJhIjoiY2p3ajU4eXI2MGdxcDQ4cGI4cHI2bHhjcSJ9.m4FzyOH_5Yo3YVnroLxk-w';
            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'http://106.15.47.224:8688/styles/newblue/style.json',
                center: [118.908456,32.131199],
                zoom: 12.0,
                pitch:60,
                bearing:-0.03
            })
            this.map.on("styledata", ()=>{
                this.getAllDistribute();
                this.getQixiaDistribute();
            })
        },
        getItemData(params){
            this.isClick = params
            console.log(params)
            let total = [102.3,20.8,38.6,85.6,65.1,21.5,98.5,581.95]
            this.totalValue = total[params-1]
            let arr = [algorithm,idCard,model,terminal,system,network,platform,parkList]
            this.map.getSource('earthquakes').setData(arr[params-1])
        },
        // 获取雷达图
        getRadarEnterprise(){
            let myChart=echarts.init(document.getElementById('enterprise'))
            let option = {
                // title: {
                //     text: '基础雷达图'
                // },
                tooltip: {},
                // legend: {
                //     data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
                // },
                radar: {
                    // shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#fff',
                            // backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: [
                        { name: '算法', max: 6500},
                        { name: '芯片', max: 16000},
                        { name: '模块', max: 30000},
                        { name: '终端', max: 38000},
                        { name: '系统', max: 52000},
                        { name: '网络', max: 25000},
                        { name: '平台', max: 25000}
                    ],
                    splitArea: {
                        areaStyle: {
                            color: ['#101B26'],
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                            shadowBlur: 10,
                            
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(114, 131, 150, 1)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(114, 131, 150, 1)'
                        }
                    }
                },
                series: [{
                    name: '从业人数',
                    type: 'radar',
                    areaStyle: {normal: {
                        color: "#1087F6", // 图表中各个图区域的颜色
                        areaStyle: {
                            type: 'default',
                            opacity: 0.8, // 图表中各个图区域的透明度
                            color: "#ff0000" // 图表中各个图区域的颜色
                        }
                    }},
                    data : [
                        {
                            value : [4300, 10000, 28000, 35000, 50000, 19000, 5200],
                            name : '从业人数',
                            itemStyle:{
                                normal:{
                                    color: "#1087F6", // 图表中各个图区域的颜色
                                }
                                
                            }
                        }
                    ]
                }]
            };
            myChart.setOption(option);
            window.addEventListener("resize", () => { myChart.resize();});
        },
        // 获取柱状图
        getEnterpriseMode(){
            let myChart=echarts.init(document.getElementById('modelll'))
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    top: '15%',
                    right: '3%',
                    left: '10%',
                    bottom: '20%'
                },
                xAxis: [{
                    type: 'category',
                    data:['算法','芯片','模块','终端','系统','网络','平台'],
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.12)'
                        }
                    },
                    axisLabel: {
                        margin: 10,
                        color: '#e2e9ff',
                        textStyle: {
                            fontSize: 14
                        },
                    },
                }],
                yAxis: [{
                    type:'value',
                    name:'数量',
                    nameTextStyle:{
                        color:'#fff',
                    },
                    splitNumber:5,
                    axisLabel: {
                        formatter:'{value}',
                        color: '#e2e9ff',
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.12)'
                        }
                    },
                }
                ],
                series: [{
                    type: 'bar',
                    barWidth: '10px',
                    data: [{
                        name:'算法',
                        value:500,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(242,241,110,1)' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(242,241,110,0.2)' // 100% 处的颜色
                                }], false),
                                barBorderRadius: [30, 30, 30, 30],
                                shadowColor: 'rgba(242,241,110,1)',
                                shadowBlur: 4,
                            }
                        }
                    },
                    {
                        name:'芯片',
                        value:100,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(242,183,101,1)' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(242,183,101,0.2)' // 100% 处的颜色
                                }], false),
                                barBorderRadius: [30, 30, 30, 30],
                                shadowColor: 'rgba(242,183,101,1)',
                                shadowBlur: 4,
                            }
                        }
                    },
                    {
                        name:'模块',
                        value:160,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(0,219,177,1)' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(0,219,177,0.2)' // 100% 处的颜色
                                }], false),
                                barBorderRadius: [30, 30, 30, 30],
                                shadowColor: 'rgba(0,219,177,1)',
                                shadowBlur: 4,
                            }
                        }
                    },
                    {
                        name:'终端',
                        value:200,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(204,73,109,1)' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(204,73,109,0.2)' // 100% 处的颜色
                                }], false),
                                barBorderRadius: [30, 30, 30, 30],
                                shadowColor: 'rgba(204,73,109,1)',
                                shadowBlur: 4,
                            }
                        }
                    },
                    {
                        name:'系统',
                        value:400,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(188,128,139,1)' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(188,128,139,0.2)' // 100% 处的颜色
                                }], false),
                                barBorderRadius: [30, 30, 30, 30],
                                shadowColor: 'rgba(188,128,139,1)',
                                shadowBlur: 4,
                            }
                        }
                    },
                    {
                        name:'网络',
                        value:300,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(22,121,212,1)' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(22,121,212,0.2)' // 100% 处的颜色
                                }], false),
                                barBorderRadius: [30, 30, 30, 30],
                                shadowColor: 'rgba(22,121,212,1)',
                                shadowBlur: 4,
                            }
                        }
                    },
                    {
                        name:'平台',
                        value:450,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(134,224,126,1)' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(134,224,126,0.2)' // 100% 处的颜色
                                }], false),
                                barBorderRadius: [30, 30, 30, 30],
                                shadowColor: 'rgba(134,224,126,1)',
                                shadowBlur: 4,
                            }
                        }
                    }],
                    
                    
                }]
            };
            myChart.setOption(option);
            window.addEventListener("resize", () => { myChart.resize();});
        },
        // 获取产值饼图
        getOutputValue(){
            let myChart=echarts.init(document.getElementById('outputValue'))

            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    // x: 'right',
                    right:30,
                    top:10,
                    data:['算法','芯片','模块','终端','系统','网络','平台'],
                    textStyle:{
                        color:'#ffffff'
                    },

                },
                series: [
                    {
                        name:'产值',
                        type:'pie',
                        center:['40%','50%'],
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '20',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:1548, name:'算法',itemStyle:{
                                color:'#F2F16E'
                            }},
                            {value:310, name:'芯片',itemStyle:{
                                color:'#F2B765'
                            }},
                            {value:234, name:'模块',itemStyle:{
                                color:'#00DBB1'
                            }},
                            {value:135, name:'终端',itemStyle:{
                                color:'#CC496D'
                            }},
                            {value:1548, name:'系统',itemStyle:{
                                color:'#BC808B'
                            }},
                            {value:1048, name:'网络',itemStyle:{
                                color:'#1679D4'
                            }},
                            {value:1288, name:'平台',itemStyle:{
                                color:'#86E07E'
                            }},
                        ]
                    }
                ]
            }
            myChart.setOption(option);
            window.addEventListener("resize", () => { myChart.resize();});
        },
        getSearchResult(){
            if(!this.search){
                this.map.getSource('earthquakes').setData(parkList)
            }
            // this.enterpriseFlag = true
            parkList.features.forEach(el=>{
                el.properties.test.forEach(l=>{
                    if(l.enterpriseName.indexOf(this.search)){
                        this.searchReault.features[0].properties.test.push(l)
                        this.searchReault.features[0].geometry.coordinates = el.geometry.coordinates
                    }
                })
            })
            this.map.getSource('earthquakes').setData(this.searchReault)
            // this.searchEnterprise = this.searchReault.features[0].properties.test[0].enterpriseName
            // console.log(this.searchReault.features[0].properties)
        },
        // 点击场景设置图层数据
        clusterMapDis(){
            
            this.map.getSource('earthquakes').setData(smartGov)
            
            // this.handleAnimateCircle()
        },
        closeDialog(){
            this.sceanFlag = false
            this.sceanData = {}
        },
        closeEnterpriseDialog(){
            this.enterpriseFlag = false
        },
        getSomeOneRadarEnterprise(){
            let myChart=echarts.init(document.getElementById(this.radar))
            let option = {
                // title: {
                //     text: '南邮研究院',
                //     textStyle:{
                //         color:'#ffffff'
                //     }
                // },
                tooltip: {},
                // legend: {
                //     data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
                // },
                radar: {
                    // shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#fff',
                            // backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: [
                        { name: '算法', max: 6500},
                        { name: '芯片', max: 16000},
                        { name: '模块', max: 30000},
                        { name: '终端', max: 38000},
                        { name: '系统', max: 52000},
                        { name: '网络', max: 25000},
                        { name: '平台', max: 25000}
                    ],
                    splitArea: {
                        areaStyle: {
                            color: ['#114474'],
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                            shadowBlur: 10,
                            
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(114, 131, 150, 1)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(114, 131, 150, 1)'
                        }
                    }
                },
                series: [{
                    name: '预算 vs 开销（Budget vs spending）',
                    type: 'radar',
                    areaStyle: {normal: {
                        color: "#1087F6", // 图表中各个图区域的颜色
                        areaStyle: {
                            type: 'default',
                            opacity: 0.8, // 图表中各个图区域的透明度
                            color: "#ff0000" // 图表中各个图区域的颜色
                        }
                    }},
                    data : [
                        {
                            value : [4300, 10000, 28000, 35000, 50000, 19000, 5200],
                            name : '预算分配（Allocated Budget）',
                            itemStyle:{
                                normal:{
                                    color: "#1087F6", // 图表中各个图区域的颜色
                                }
                                
                            }
                        }
                    ]
                }]
            };
            myChart.setOption(option);
            window.addEventListener("resize", () => { myChart.resize();});
        },
        getAllDistribute(){

            this.numTest += 1
            console.log(this.numTest)
            
            var mag1 = ["<", ["get", "mag"], 5];
            var mag2 = ["all", [">=", ["get", "mag"], 10], ["<", ["get", "mag"], 20]];
            var mag3 = ["all", [">=", ["get", "mag"], 20], ["<", ["get", "mag"], 30]];
            var mag4 = ["all", [">=", ["get", "mag"], 30], ["<", ["get", "mag"], 40]];
            var mag5 = [">=", ["get", "mag"], 40];

            if (!this.map.getSource('earthquakes')){
                this.map.addSource('earthquakes', {
                    "type": "geojson",
                    "data": parkList,
                    "cluster": false,
                    "clusterRadius": 0,
                    "clusterProperties": { // keep separate counts for each magnitude category in a cluster
                        "mag1": ["+", ["case", mag1, 1, 0]],
                        "mag2": ["+", ["case", mag2, 1, 0]],
                        "mag3": ["+", ["case", mag3, 1, 0]],
                        "mag4": ["+", ["case", mag4, 1, 0]],
                        "mag5": ["+", ["case", mag5, 1, 0]]
                    }
                });
            }

            // if (!this.map.getLayer('earthquake_circle')){
            //     this.map.addLayer({
            //         "id": "earthquake_circle",
            //         "type": "circle",
            //         "source": "earthquakes",
            //         "filter": ["!=", "cluster", true],
            //         "paint": {
            //             "circle-color": ["case",
            //             mag1, this.colors[0],
            //             mag2, this.colors[1],
            //             mag3, this.colors[2],
            //             mag4, this.colors[3], this.colors[4]],
            //             "circle-opacity": 0.6,
            //             "circle-radius": 20
            //         }
            //     });
            // }
             if (!this.map.getLayer('earthquake_circle')){
                this.map.addLayer({
                    "id": "earthquake_circle",
                    "type": "circle",
                    "source": "earthquakes",
                    "filter": ["!=", "cluster", true],
                    // "paint": {
                    //     "circle-color": ["case",
                    //     mag1, this.colors[0],
                    //     mag2, this.colors[1],
                    //     mag3, this.colors[2],
                    //     mag4, this.colors[3], this.colors[4]],
                    //     "circle-opacity": 0.6,
                    //     "circle-radius": 0
                    // }
                });
            }
            // var width = 64; // The image will be 64 pixels square
            // var bytesPerPixel = 4; // Each pixel is represented by 4 bytes: red, green, blue, and alpha.
            // var data = new Uint8Array(width * width * bytesPerPixel);
            
            // for (var x = 0; x < width; x++) {
            // for (var y = 0; y < width; y++) {
            //     var offset = (y * width + x) * bytesPerPixel;
            //     data[offset + 0] = (y / width) * 255; // red
            //     data[offset + 1] = (x / width) * 255; // green
            //     data[offset + 2] = 128; // blue
            //     data[offset + 3] = 255; // alpha
            // }}
            // this.map.addImage('gradient', { width: 400, height: 400, data:pos1});
            this.map.loadImage(pos1, (error, image)=> {
                if (error) throw error;
                if (!this.map.hasImage('pos1')) this.map.addImage('pos1', image);
            });
            this.map.loadImage(pos2, (error, image)=> {
                if (error) throw error;
                if (!this.map.hasImage('pos2')) this.map.addImage('pos2', image);
            });
            this.map.loadImage(pos3, (error, image)=> {
                if (error) throw error;
                if (!this.map.hasImage('pos3')) this.map.addImage('pos3', image);
            });
            this.map.loadImage(pos4, (error, image)=> {
                if (error) throw error;
                if (!this.map.hasImage('pos4')) this.map.addImage('pos4', image);
            });
            this.map.loadImage(pos5, (error, image)=> {
                if (error) throw error;
                if (!this.map.hasImage('pos5')) this.map.addImage('pos5', image);
            });
            this.map.loadImage(pos6, (error, image)=> {
                if (error) throw error;
                if (!this.map.hasImage('pos6')) this.map.addImage('pos6', image);
            });
            if (!this.map.getLayer('earthquake_label')){
                this.map.addLayer({
                    "id": "earthquake_label",
                    "type": "symbol",
                    "source": "earthquakes",
                    "cluster": false,
                    // "filter": ["!=", "cluster", true],
                    
                    "layout": {
                        "text-field": ["number-format", ["get", "mag"], {"min-fraction-digits": 0, "max-fraction-digits": 1}],
                        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                        "text-size": 18,
                        // "text-allow-overlap":true,
                        
                        // "icon-image": "cat"
                        "icon-image": ["case", 
                            mag1, "pos1",
                            mag2, "pos2",
                            mag3, "pos3",
                            mag4, "pos4",
                            mag5, "pos5",
                            "pos6"
                        ],
                        "icon-allow-overlap":true
                    },
                    "paint": {
                        // "text-color": ["case", ["<", ["get", "mag"], 3], "black", "white"]
                        "text-color": '#13212E'
                        //  "text-color": ["case", 
                        //     mag1, "#333333",
                        //     mag2, "#333333",
                        //     mag3, "#dddddd",
                        //     mag4, "#dddddd",
                        //     mag5, "#000000",
                        //     "#000000",
                        // ]
                    }
                });
            }
            
            this.map.on('styledata', (e)=> {
                // if (e.sourceId !== 'earthquakes' || !e.isSourceLoaded) {
                //     return;
                // }
                // this.map.on('move', this.updateMarkers);
                // this.map.on('moveend',this.updateMarkers);
                this.map.on('click','earthquake_label',this.handleMarkerClick);
                // this.updateMarkers();
            });
        },
        updateMarkers() {
            var newMarkers = {};
            var features = this.map.querySourceFeatures('earthquakes');
            
            // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
            // and add it to the map if it's not there already
            for (var i = 0; i < features.length; i++) {
                var coords = features[i].geometry.coordinates;
                var props = features[i].properties;
                if (!props.cluster){
                    continue;
                } 
                var id = props.cluster_id;
                
                this.marker = this.markers[id];
                if (!this.marker) {
                    var el = this.createDonutChart(props);
                    this.marker = this.markers[id] = new mapboxgl.Marker({element: el}).setLngLat(coords);
                }
                newMarkers[id] = marker;
                
                if (!this.markersOnScreen[id]){
                    this.marker.addTo(this.map);
                }
                
            }
            // for every marker we've added previously, remove those that are no longer visible
            for (id in this.markersOnScreen) {
                if (!newMarkers[id]){
                    this.markersOnScreen[id].remove();
                }
            }
            this.markersOnScreen = newMarkers;
        },
        createDonutChart(props) {
            var offsets = [];
            var counts = [props.mag1, props.mag2, props.mag3, props.mag4, props.mag5];
            var total = 0;
            for (var i = 0; i < counts.length; i++) {
                offsets.push(total);
                total += counts[i];
            }
            var fontSize = total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
            var r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
            var r0 = Math.round(r * 0.6);
            var w = r * 2;
            
            var html = '<svg width="' + w + '" height="' + w + '" viewbox="0 0 ' + w + ' ' + w +
            '" text-anchor="middle" style="font: ' + fontSize + 'px sans-serif">';
            
            for (i = 0; i < counts.length; i++) {
            html += this.donutSegment(offsets[i] / total, (offsets[i] + counts[i]) / total, r, r0, this.colors[i]);
            }
            html += '<circle cx="' + r + '" cy="' + r + '" r="' + r0 +
            '" fill="white" /><text dominant-baseline="central" transform="translate(' +
            r + ', ' + r + ')">' + total.toLocaleString() + '</text></svg>';
            
            var el = document.createElement('div');
            el.innerHTML = html;
            return el.firstChild;
        },
        donutSegment(start, end, r, r0, color) {
            if (end - start === 1){
                end -= 0.00001;
            } 
            var a0 = 2 * Math.PI * (start - 0.25);
            var a1 = 2 * Math.PI * (end - 0.25);
            var x0 = Math.cos(a0), y0 = Math.sin(a0);
            var x1 = Math.cos(a1), y1 = Math.sin(a1);
            var largeArc = end - start > 0.5 ? 1 : 0;
            
            return ['<path d="M', r + r0 * x0, r + r0 * y0, 'L', r + r * x0, r + r * y0,
            'A', r, r, 0, largeArc, 1, r + r * x1, r + r * y1,
            'L', r + r0 * x1, r + r0 * y1, 'A',
            r0, r0, 0, largeArc, 0, r + r0 * x0, r + r0 * y0,
            '" fill="' + color + '" />'].join(' ');
        },
         handleMarkerClick(e){
            // this.map.on('click','earthquake_label',this.handleMarkerClick);
            this.enterpriseFlag = true
            const map = e.target;
            // console.log(map);
            const features = map.queryRenderedFeatures(e.point,  { layers: ['earthquake_label'] });
            
            console.log(features);
            
            this.parkName = features[0].properties.id
            if (features.length > 0){
                const enterList = JSON.parse(features[0].properties.test)
                // console.log(enterList)
                this.enterpriseList = enterList
                this.getQichachaData(this.enterpriseList[0].enterpriseName)
                // this.map.off('click','earthquake_label',this.handleMarkerClick);
            }
            e.preventDefault()
            setTimeout(()=>{
                if(document.getElementById(this.radar)){
                    this.getSomeOneRadarEnterprise()
                }
            },2000)
        },
        handleTabClick(tab,event){
            console.log(tab.label)
            this.getQichachaData(tab.label)
            console.log(this.activeIndex)
            console.log(this.enterpriseList[this.activeIndex].elements)
            // this.elementsList = this.enterpriseList[this.activeIndex].elements.split(" ")
        },
        getQixiaDistribute(){
            const dottedLine = {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [{
                            'type': 'Feature',
                            'properties': {
                                'color': '#3f96e6',
                                'lineName':'行政区划'
                            },
                            'geometry': {
                                'type': 'LineString',
                                'coordinates': [
                                    [118.897296,32.025992],
                                    [118.896489,32.026298],
                                    [118.896003,32.026496],
                                    [118.895838,32.026511],
                                    [118.895708,32.026492],
                                    [118.895464,32.026407],
                                    [118.89517,32.02593],
                                    [118.894918,32.025663],
                                    [118.894676,32.025616],
                                    [118.894534,32.025577],
                                    [118.894215,32.025505],
                                    [118.893773,32.025544],
                                    [118.893356,32.025736],
                                    [118.893278,32.025983],
                                    [118.893304,32.026209],
                                    [118.894484,32.027327],
                                    [118.895135,32.027919],
                                    [118.895231,32.028177],
                                    [118.894919,32.030918],
                                    [118.894381,32.032066],
                                    [118.893114,32.033436],
                                    [118.892004,32.034575],
                                    [118.890703,32.034956],
                                    [118.889844,32.034967],
                                    [118.889549,32.035083],
                                    [118.888421,32.034255],
                                    [118.887918,32.034719],
                                    [118.886652,32.03446],
                                    [118.885524,32.034634],
                                    [118.882923,32.035594],
                                    [118.882168,32.036146],
                                    [118.881657,32.036933],
                                    [118.881484,32.038394],
                                    [118.881206,32.039961],
                                    [118.881146,32.040286],
                                    [118.881181,32.040394],
                                    [118.881605,32.040732],
                                    [118.882195,32.040875],
                                    [118.882681,32.040992],
                                    [118.88314,32.041213],
                                    [118.882039,32.041004],
                                    [118.882689,32.041923],
                                    [118.882689,32.042192],
                                    [118.882473,32.042576],
                                    [118.879403,32.041501],
                                    [118.879282,32.041419],[118.879153,32.041388],[118.878943,32.041404],[118.878623,32.041936],[118.878181,32.043832],[118.878171,32.043853],[118.878166,32.043876],[118.877661,32.045332],[118.877607,32.045405],[118.877607,32.045463],[118.877637,32.045552],[118.878051,32.045857],[118.878658,32.046147],[118.879646,32.046502],[118.879337,32.046945],[118.879322,32.046969],[118.879273,32.04704],[118.879256,32.047061],[118.879187,32.047162],[118.878649,32.047739],[118.877843,32.048318],[118.877721,32.048697],[118.877765,32.048914],[118.879135,32.049811],[118.879542,32.049741],[118.880453,32.048764],[118.881588,32.047884],[118.881996,32.047844],[118.882022,32.047844],[118.882586,32.048052],[118.883253,32.048403],[118.883947,32.048804],[118.884615,32.049315],[118.88517,32.049849],[118.885552,32.050223],[118.886402,32.0508],[118.886697,32.050914],[118.886879,32.050919],[118.887035,32.050884],[118.887312,32.05076],[118.887668,32.051831],[118.887772,32.052185],[118.887911,32.052808],[118.888128,32.053962],[118.888258,32.054747],[118.888362,32.05609],[118.88838,32.056643],[118.888414,32.057539],[118.888389,32.057839],[118.888362,32.058188],[118.888241,32.058631],[118.887946,32.058679],[118.887313,32.058738],[118.886914,32.058734],[118.886819,32.058766],[118.886767,32.058851],[118.886724,32.059049],[118.886645,32.059172],[118.886645,32.059252],[118.886671,32.059309],[118.886715,32.059329],[118.886914,32.059326],[118.887235,32.059311],[118.88727,32.059326],[118.887287,32.059376],[118.887287,32.059463],[118.887131,32.059699],[118.886863,32.059934],[118.886724,32.06001],[118.886429,32.060038],[118.88616,32.060045],[118.886038,32.060147],[118.886021,32.060271],[118.886012,32.060511],[118.885995,32.060629],[118.885926,32.060754],[118.885822,32.06088],[118.885813,32.060922],[118.885856,32.060959],[118.885969,32.060983],[118.886368,32.060991],[118.886758,32.060958],[118.887105,32.060951],[118.887478,32.060961],[118.888059,32.060961],[118.887634,32.061723],[118.887339,32.062209],[118.887166,32.062186],[118.886689,32.062108],[118.886247,32.062102],[118.886125,32.062141],[118.886047,32.062243],[118.885856,32.062712],[118.885848,32.06287],[118.8859,32.062916],[118.886403,32.062909],[118.886576,32.062937],[118.88668,32.063002],[118.886741,32.063206],[118.88675,32.06336],[118.886741,32.063618],[118.886663,32.063809],[118.88629,32.064306],[118.885701,32.06499],[118.885284,32.06581],[118.885076,32.066561],[118.88492,32.067106],[118.884738,32.067276],[118.884261,32.067363],[118.883515,32.067398],[118.883134,32.067407],[118.882813,32.067509],[118.882657,32.067646],[118.882622,32.067972],[118.882466,32.06838],[118.882284,32.068614],[118.881495,32.069344],[118.880784,32.069766],[118.879328,32.070872],[118.878911,32.071165],[118.878694,32.071274],[118.878391,32.071331],[118.8782,32.071381],[118.878114,32.07142],[118.877984,32.071711],[118.87781,32.071837],[118.87742,32.071631],[118.877221,32.071573],[118.877065,32.071638],[118.877039,32.071653],[118.876865,32.071801],[118.87677,32.071957],[118.876709,32.072046],[118.876458,32.072136],[118.876154,32.072181],[118.87599,32.072268],[118.87592,32.072338],[118.875903,32.072401],[118.875946,32.07257],[118.876059,32.07275],[118.876137,32.072889],[118.876206,32.07293],[118.876311,32.072941],[118.876545,32.07291],[118.876761,32.07291],[118.876918,32.072931],[118.877039,32.073018],[118.87703,32.073141],[118.8769,32.073294],[118.876631,32.073528],[118.876449,32.073752],[118.876206,32.073869],[118.876051,32.07398],[118.876076,32.07408],[118.876129,32.074117],[118.876337,32.074225],[118.876371,32.074262],[118.876363,32.074301],[118.876285,32.074359],[118.876163,32.074416],[118.875999,32.074536],[118.875938,32.074675],[118.875921,32.074785],[118.875938,32.074857],[118.876129,32.075126],[118.876458,32.07531],[118.876692,32.075385],[118.876874,32.075383],[118.877004,32.07535],[118.877256,32.075176],[118.877524,32.075055],[118.87775,32.074887],[118.877941,32.074787],[118.877958,32.074705],[118.877958,32.074577],[118.878097,32.074407],[118.878409,32.07421],[118.879102,32.073953],[118.879406,32.073679],[118.879709,32.073293],[118.879779,32.07293],[118.880221,32.072617],[118.880334,32.072691],[118.880706,32.073415],[118.880863,32.073565],[118.88101,32.073577],[118.881305,32.073556],[118.881443,32.073501],[118.88153,32.073351],[118.881409,32.072965],[118.8814,32.07236],[118.881521,32.072026],[118.881738,32.071737],[118.882163,32.071424],[118.882414,32.071214],[118.88264,32.07092],[118.882701,32.070851],[118.883108,32.07049],[118.883273,32.070375],[118.883516,32.070271],[118.883672,32.070277],[118.883828,32.070357],[118.883897,32.070494],[118.883914,32.07065],[118.88388,32.070761],[118.882519,32.072556],[118.881816,32.073915],[118.881608,32.074167],[118.881669,32.074195],[118.881825,32.074249],[118.882068,32.074331],[118.882839,32.074368],[118.883447,32.074452],[118.883776,32.074586],[118.8846,32.075134],[118.885103,32.075518],[118.884028,32.076903],[118.884184,32.076979],[118.884487,32.077948],[118.884964,32.078321],[118.885545,32.077832],[118.88597,32.077307],[118.886169,32.077213],[118.887072,32.07716],[118.887635,32.077002],[118.888052,32.076647],[118.888269,32.075498],[118.888347,32.075023],[118.888659,32.074701],[118.889353,32.074481],[118.891339,32.07407],[118.892155,32.074033],[118.892484,32.074061],[118.892788,32.074388],[118.892962,32.074616],[118.893066,32.074917],[118.893517,32.07657],[118.894169,32.077868],[118.893068,32.07856],[118.893032,32.078817],[118.89373,32.07941],[118.894362,32.079421],[118.894993,32.079939],[118.895286,32.080024],[118.897173,32.081042],[118.896916,32.081369],[118.896744,32.081753],[118.897075,32.082171],[118.897475,32.082446],[118.89766,32.082462],[118.897965,32.082236],[118.898337,32.082024],[118.898876,32.082001],[118.89998,32.082453],[118.90035,32.082356],[118.900921,32.082432],[118.907818,32.086111],[118.908338,32.086518],[118.908173,32.087662],[118.907882,32.088102],[118.906071,32.089506],[118.905894,32.089874],[118.905638,32.090144],[118.904931,32.090253],[118.904489,32.090649],[118.904304,32.090576],[118.904051,32.09066],[118.903709,32.091187],[118.903517,32.091729],[118.903158,32.092152],[118.90345,32.09297],[118.903298,32.093083],[118.902808,32.093236],[118.901463,32.094627],[118.901242,32.094883],[118.900637,32.095322],[118.899356,32.095154],[118.899204,32.095209],[118.899031,32.09558],[118.897474,32.095023],[118.897326,32.094736],[118.897127,32.094562],[118.895323,32.095485],[118.892911,32.097298],[118.891541,32.098066],[118.891089,32.098188],[118.890274,32.09816],[118.890066,32.098189],[118.889832,32.098315],[118.889043,32.098999],[118.887716,32.100864],[118.887004,32.101804],[118.886467,32.102164],[118.885114,32.102992],[118.884515,32.103353],[118.884056,32.103544],[118.883588,32.103646],[118.882981,32.103545],[118.882373,32.103474],[118.881663,32.103581],[118.881107,32.103551],[118.880622,32.103367],[118.879894,32.103086],[118.879339,32.103126],[118.878611,32.103194],[118.878194,32.103255],[118.877986,32.103132],[118.877804,32.102848],[118.877587,32.101804],[118.877544,32.100845],[118.877448,32.100498],[118.877353,32.100412],[118.877032,32.100436],[118.876027,32.100929],[118.875819,32.100947],[118.875272,32.100666],[118.874787,32.100141],[118.874328,32.099747],[118.873894,32.09965],[118.873443,32.099646],[118.872966,32.099766],[118.871744,32.101015],[118.871632,32.100922],[118.871268,32.100564],[118.870903,32.100261],[118.870019,32.099783],[118.869395,32.099673],[118.868684,32.099678],[118.86813,32.099877],[118.867879,32.10009],[118.867731,32.100539],[118.867662,32.100654],[118.867575,32.100704],[118.867437,32.100706],[118.866943,32.100657],[118.865998,32.100548],[118.864525,32.100283],[118.863857,32.100174],[118.863597,32.100098],[118.862999,32.09975],[118.86215,32.099115],[118.861431,32.098828],[118.860339,32.098599],[118.859966,32.098337],[118.858979,32.096812],[118.858849,32.096671],[118.858623,32.096626],[118.858147,32.09677],[118.857272,32.09716],[118.856448,32.097293],[118.856024,32.097326],[118.855313,32.097532],[118.854768,32.097596],[118.854525,32.09765],[118.854317,32.097714],[118.853919,32.097686],[118.853771,32.097576],[118.853468,32.097429],[118.852853,32.097284],[118.852558,32.097346],[118.852394,32.097428],[118.851831,32.097744],[118.851449,32.097708],[118.851025,32.097576],[118.850479,32.097358],[118.849665,32.097101],[118.849041,32.096979],[118.848036,32.097278],[118.847854,32.097554],[118.846217,32.09765],[118.844779,32.097522],[118.843887,32.097222],[118.84354,32.097223],[118.842812,32.097064],[118.842267,32.097588],[118.842371,32.097791],[118.84244,32.098043],[118.842258,32.098403],[118.841765,32.099029],[118.841773,32.099142],[118.842025,32.099319],[118.8427,32.098832],[118.842995,32.098498],[118.843211,32.09838],[118.843714,32.098353],[118.844129,32.098587],[118.844701,32.09887],[118.844909,32.099182],[118.844961,32.099757],[118.844779,32.100432],[118.844259,32.101138],[118.843619,32.101872],[118.843316,32.101964],[118.84303,32.10188],[118.842657,32.101625],[118.84199,32.101073],[118.83953,32.098923],[118.837814,32.097309],[118.835354,32.09491],[118.834462,32.093998],[118.833954,32.094068],[118.833983,32.094624],[118.83381,32.094811],[118.833494,32.095057],[118.833681,32.095679],[118.834667,32.095497],[118.835074,32.096351],[118.835139,32.096533],[118.835397,32.096697],[118.835655,32.09686],[118.835976,32.09706],[118.836384,32.097492],[118.8365,32.097941],[118.836927,32.097772],[118.837769,32.098447],[118.838762,32.099542],[118.838825,32.099866],[118.839069,32.100097],[118.839,32.100249],[118.84031,32.101047],[118.839808,32.101782],[118.840051,32.102032],[118.840023,32.102432],[118.83967,32.103023],[118.839648,32.103203],[118.839569,32.103293],[118.840124,32.103671],[118.840785,32.103945],[118.840606,32.104241],[118.842317,32.105268],[118.841681,32.106036],[118.838815,32.10503],[118.837627,32.104694],[118.836662,32.104621],[118.836319,32.104858],[118.835719,32.104919],[118.835568,32.105202],[118.83559,32.106111],[118.834354,32.106133],[118.834233,32.105634],[118.834152,32.104946],[118.83438,32.104585],[118.834429,32.10428],[118.834196,32.104166],[118.834015,32.104128],[118.833867,32.104486],[118.833174,32.104424],[118.832583,32.104433],[118.83149,32.104907],[118.831599,32.105118],[118.831529,32.105347],[118.83139,32.105268],[118.830096,32.105188],[118.828808,32.105172],[118.82644,32.104902],[118.826279,32.103602],[118.82498,32.103378],[118.82425,32.10331],[118.823817,32.103333],[118.823107,32.10338],[118.819651,32.103644],[118.819148,32.103665],[118.819312,32.102695],[118.819321,32.102419],[118.819295,32.102059],[118.819182,32.101339],[118.81894,32.100137],[118.818713,32.099093],[118.818663,32.098821],[118.81855,32.097272],[118.81803,32.095669],[118.816314,32.095529],[118.811671,32.095576],[118.811679,32.096192],[118.810016,32.096276],[118.809208,32.096154],[118.809168,32.096191],[118.809126,32.096173],[118.807738,32.097301],[118.806603,32.098065],[118.806526,32.098074],[118.806528,32.098097],[118.806256,32.098189],[118.8061,32.098089],[118.805511,32.097932],[118.803942,32.097479],[118.803232,32.097271],[118.802461,32.097049],[118.802279,32.096917],[118.801724,32.096046],[118.801178,32.095359],[118.800979,32.095136],[118.800502,32.094891],[118.800372,32.094885],[118.800285,32.094903],[118.800121,32.094972],[118.799913,32.095085],[118.799774,32.095137],[118.799471,32.095763],[118.799358,32.095989],[118.799644,32.096114],[118.800285,32.096447],[118.800641,32.096664],[118.801248,32.097116],[118.802712,32.098225],[118.80409,32.099279],[118.804107,32.099399],[118.804021,32.099518],[118.803457,32.099838],[118.803341,32.09993],[118.802996,32.100114],[118.802452,32.100306],[118.801932,32.100487],[118.800918,32.10105],[118.800892,32.101736],[118.800849,32.102858],[118.800763,32.104926],[118.799012,32.104776],[118.7987,32.104718],[118.798683,32.105291],[118.798735,32.106055],[118.798908,32.106788],[118.799125,32.107421],[118.799524,32.107861],[118.79981,32.108318],[118.799949,32.108598],[118.800243,32.109296],[118.801422,32.108928],[118.801561,32.109214],[118.801794,32.11039],[118.802315,32.112953],[118.80241,32.113055],[118.802609,32.113172],[118.803554,32.113318],[118.803684,32.113381],[118.803831,32.113507],[118.803944,32.11363],[118.804247,32.114215],[118.804455,32.114638],[118.804819,32.115614],[118.806136,32.119118],[118.806397,32.120064],[118.806405,32.120404],[118.806336,32.120713],[118.805877,32.121429],[118.80592,32.121486],[118.805946,32.12218],[118.80547,32.122667],[118.80482,32.122804],[118.804153,32.123354],[118.803312,32.124352],[118.803217,32.125113],[118.803286,32.125925],[118.803451,32.126337],[118.803512,32.12643],[118.803599,32.126647],[118.803573,32.126807],[118.803469,32.126894],[118.802949,32.127294],[118.802403,32.127319],[118.801857,32.12712],[118.801033,32.126564],[118.800695,32.126215],[118.800279,32.12571],[118.800011,32.125405],[118.799725,32.125184],[118.799551,32.125019],[118.799265,32.124299],[118.798849,32.123319],[118.79865,32.123067],[118.798329,32.122792],[118.797879,32.122509],[118.795755,32.121752],[118.793857,32.121913],[118.792981,32.122431],[118.792331,32.12412],[118.792124,32.124999],[118.792097,32.125062],[118.791326,32.125948],[118.790433,32.126118],[118.789376,32.125475],[118.787954,32.123144],[118.787078,32.121728],[118.785777,32.120934],[118.78439,32.120683],[118.782786,32.122013],[118.781754,32.122886],[118.782648,32.123426],[118.783029,32.123634],[118.783168,32.123627],[118.783393,32.123596],[118.783549,32.123661],[118.783784,32.123739],[118.784425,32.124107],[118.786792,32.125747],[118.78609,32.126768],[118.78596,32.126857],[118.785726,32.126939],[118.785015,32.127144],[118.776482,32.129511],[118.765691,32.132457],[118.769361,32.137424],[118.775669,32.148611],[118.776745,32.157908],[118.773953,32.168078],[118.771664,32.175515],[118.770311,32.179912],[118.769869,32.181337],[118.767848,32.187193],[118.767657,32.187729],[118.76698,32.189684],[118.764751,32.196064],[118.765124,32.201614],[118.768457,32.207471],[118.773766,32.21229],[118.790243,32.222459],[118.807134,32.228411],[118.814534,32.228956],[118.821819,32.229492],[118.827207,32.229888],[118.830325,32.229216],[118.840001,32.227134],[118.848706,32.222911],[118.855004,32.216327],[118.859223,32.209407],[118.863511,32.202363],[118.865799,32.197706],[118.868433,32.192355],[118.872957,32.183156],[118.875973,32.177634],[118.892849,32.178281],[118.909877,32.177637],[118.930102,32.1748],[118.951539,32.175129],[118.978771,32.178681],[118.985321,32.179537],[118.991437,32.180383],[118.999487,32.181497],[119.016171,32.183801],[119.020745,32.185136],[119.033793,32.188947],[119.04278,32.195785],[119.056117,32.209952],[119.073716,32.232544],[119.081992,32.238325],[119.086016,32.241139],[119.107502,32.243958],[119.13231,32.245159],[119.153759,32.243662],[119.177207,32.238898],[119.22901,32.222172],[119.241663,32.216296],[119.236146,32.210408],[119.232277,32.207622],[119.228922,32.205896],[119.224283,32.202835],[119.222801,32.202116],[119.221396,32.201109],[119.220287,32.199921],[119.219706,32.198587],[119.218162,32.193073],[119.21733,32.191633],[119.216255,32.190697],[119.214739,32.190123],[119.209522,32.189444],[119.206836,32.188674],[119.205579,32.188099],[119.199394,32.185839],[119.196656,32.185086],[119.195071,32.184872],[119.193815,32.184838],[119.192662,32.184985],[119.191078,32.18542],[119.189267,32.186306],[119.188072,32.187031],[119.186349,32.188692],[119.185197,32.189451],[119.184547,32.189633],[119.181871,32.189282],[119.179186,32.188432],[119.174993,32.187587],[119.174049,32.187322],[119.172741,32.186762],[119.170593,32.186747],[119.168411,32.186347],[119.166514,32.186136],[119.165058,32.185779],[119.163395,32.185567],[119.160043,32.185558],[119.156673,32.185824],[119.154456,32.186172],[119.148373,32.188524],[119.146614,32.189238],[119.145081,32.189989],[119.14151,32.191925],[119.139422,32.192724],[119.136718,32.19339],[119.135287,32.193461],[119.134421,32.193304],[119.132036,32.192278],[119.12921,32.191461],[119.128256,32.191377],[119.124379,32.190137],[119.123643,32.189767],[119.123053,32.189336],[119.121318,32.187607],[119.119757,32.186623],[119.119279,32.186459],[119.118195,32.186245],[119.116347,32.18638],[119.115957,32.186307],[119.113857,32.185489],[119.108069,32.183758],[119.098206,32.181607],[119.095879,32.180834],[119.094602,32.180211],[119.093552,32.179857],[119.086896,32.178507],[119.085671,32.178402],[119.083542,32.178389],[119.079883,32.178826],[119.078658,32.178731],[119.078258,32.178562],[119.077814,32.178259],[119.077493,32.177879],[119.076458,32.176079],[119.079257,32.174932],[119.076953,32.170656],[119.076013,32.161678],[119.075126,32.161425],[119.069822,32.161327],[119.059636,32.162008],[119.051352,32.160832],[119.042409,32.157706],[119.042387,32.157702],[119.042354,32.157688],[119.04114,32.157263],[119.038284,32.155726],[119.036656,32.154238],[119.036639,32.154218],[119.036619,32.154204],[119.035044,32.152764],[119.031751,32.148661],[119.032577,32.146669],[119.032588,32.146639],[119.032596,32.146621],[119.032866,32.145971],[119.027814,32.141933],[119.022377,32.130901],[119.020914,32.129144],[119.020513,32.128934],[119.016026,32.128485],[119.011243,32.126014],[119.011026,32.125808],[119.011037,32.125007],[119.010174,32.124495],[119.010204,32.124036],[119.009984,32.124105],[119.009632,32.124534],[119.009241,32.124683],[119.008928,32.123189],[119.009702,32.121634],[119.008889,32.115943],[119.009486,32.115752],[119.011138,32.115607],[119.011678,32.115612],[119.013194,32.115446],[119.013103,32.114606],[119.014419,32.1146],[119.014388,32.11477],[119.014479,32.11499],[119.014649,32.115151],[119.014619,32.115281],[119.015633,32.115104],[119.015804,32.115154],[119.016978,32.114987],[119.017008,32.114908],[119.017178,32.114849],[119.017309,32.114279],[119.017389,32.114159],[119.017629,32.11404],[119.018089,32.114156],[119.018411,32.114301],[119.018668,32.114392],[119.018969,32.114519],[119.019119,32.114593],[119.019441,32.114737],[119.019784,32.114901],[119.020106,32.115028],[119.020514,32.115191],[119.020771,32.115264],[119.021929,32.114254],[119.026651,32.115956],[119.026973,32.115846],[119.027273,32.115773],[119.027616,32.1157],[119.028045,32.115573],[119.028432,32.115464],[119.028818,32.115519],[119.029161,32.115537],[119.029419,32.11541],[119.029633,32.115264],[119.029805,32.115191],[119.030105,32.114955],[119.030406,32.114919],[119.030685,32.114846],[119.030814,32.114792],[119.030942,32.114719],[119.031146,32.114586],[119.031468,32.114441],[119.031704,32.114332],[119.031919,32.114259],[119.032069,32.114168],[119.032283,32.114096],[119.032541,32.114023],[119.032884,32.114023],[119.033228,32.114041],[119.033915,32.114041],[119.034322,32.114041],[119.034668,32.114058],[119.037227,32.114304],[119.038219,32.114017],[119.038931,32.113599],[119.039554,32.112911],[119.039924,32.112242],[119.040055,32.112093],[119.040276,32.112003],[119.040727,32.112044],[119.041981,32.111717],[119.044839,32.111634],[119.045381,32.111536],[119.045361,32.111436],[119.044859,32.110944],[119.044348,32.110563],[119.043355,32.110541],[119.042623,32.110319],[119.043706,32.110212],[119.043907,32.110072],[119.042402,32.108869],[119.042201,32.108558],[119.042181,32.108268],[119.042322,32.108299],[119.042984,32.10911],[119.043264,32.109291],[119.043987,32.109513],[119.04494,32.110235],[119.04517,32.110035],[119.044829,32.109235],[119.045039,32.109175],[119.045271,32.108846],[119.044969,32.108255],[119.044979,32.108146],[119.045301,32.108256],[119.045541,32.108446],[119.045711,32.108457],[119.045982,32.107908],[119.046253,32.107788],[119.046444,32.107789],[119.046494,32.108149],[119.046353,32.109008],[119.046384,32.109138],[119.046444,32.109139],[119.047687,32.107702],[119.047798,32.107652],[119.047958,32.107712],[119.047938,32.107802],[119.047657,32.108371],[119.047186,32.10891],[119.046794,32.109859],[119.047918,32.110382],[119.049272,32.110245],[119.049532,32.110066],[119.049754,32.109746],[119.049843,32.108536],[119.051363,32.105496],[119.050679,32.104973],[119.050145,32.104423],[119.049302,32.102755],[119.047894,32.10194],[119.047073,32.101373],[119.046657,32.100825],[119.046677,32.100567],[119.04733,32.099415],[119.048431,32.098911],[119.050004,32.098496],[119.050462,32.098186],[119.050161,32.096351],[119.049719,32.095087],[119.049102,32.094437],[119.046928,32.094273],[119.046017,32.094306],[119.044325,32.094819],[119.044119,32.095204],[119.044147,32.095677],[119.043216,32.095982],[119.042762,32.095906],[119.04137,32.095091],[119.040412,32.094809],[119.039704,32.094701],[119.038408,32.096034],[119.037885,32.096057],[119.036411,32.09504],[119.03162,32.094942],[119.030941,32.095329],[119.030506,32.095265],[119.030114,32.095082],[119.029384,32.095026],[119.028574,32.095817],[119.028277,32.095945],[119.027575,32.095843],[119.026681,32.095261],[119.025655,32.095273],[119.023723,32.09573],[119.022726,32.096888],[119.021605,32.097818],[119.020969,32.098158],[119.019352,32.098081],[119.018569,32.097715],[119.017118,32.096602],[119.016333,32.096331],[119.014154,32.09626],[119.01334,32.096024],[119.012921,32.095769],[119.012177,32.095654],[119.011176,32.095799],[119.009917,32.09656],[119.009282,32.096744],[119.008621,32.096653],[119.008074,32.096516],[119.006688,32.094911],[119.005671,32.093759],[119.005113,32.093323],[119.002803,32.092404],[119.001857,32.091391],[119.001861,32.090962],[119.002089,32.09075],[119.002678,32.089659],[119.003009,32.087695],[119.003289,32.085157],[119.003372,32.082713],[119.003618,32.082048],[119.003874,32.0818],[119.004421,32.081914],[119.007008,32.081954],[119.007684,32.081937],[119.007967,32.081726],[119.008343,32.078199],[119.006715,32.077871],[119.00295,32.076197],[119.002077,32.075601],[118.998457,32.073082],[118.998054,32.072589],[118.99822,32.071577],[118.997593,32.07101],[118.996012,32.070301],[118.995283,32.070066],[118.994459,32.069581],[118.993609,32.068843],[118.993589,32.068128],[118.993324,32.066646],[118.992739,32.066162],[118.991414,32.066423],[118.989623,32.066324],[118.988814,32.066499],[118.985583,32.065662],[118.984888,32.065998],[118.984562,32.066438],[118.984797,32.068229],[118.985521,32.071386],[118.985383,32.071614],[118.980387,32.071803],[118.979964,32.071884],[118.979657,32.072224],[118.979014,32.072326],[118.979706,32.072688],[118.978414,32.072971],[118.977969,32.07272],[118.97776,32.07259],[118.977325,32.072333],[118.976889,32.072075],[118.976663,32.071947],[118.976192,32.071841],[118.97567,32.071898],[118.975139,32.071951],[118.974878,32.071983],[118.974355,32.072038],[118.973824,32.072095],[118.973389,32.072226],[118.973171,32.072361],[118.972736,32.072617],[118.972309,32.072881],[118.971874,32.073138],[118.971447,32.0734],[118.971011,32.073659],[118.970776,32.073938],[118.970759,32.074164],[118.970698,32.074611],[118.970654,32.075059],[118.970628,32.075288],[118.970576,32.07573],[118.97055,32.075961],[118.970541,32.07628],[118.970602,32.076725],[118.970654,32.077177],[118.970689,32.0774],[118.97075,32.077849],[118.970802,32.078294],[118.970863,32.078744],[118.97089,32.07897],[118.970951,32.079417],[118.971011,32.079861],[118.971073,32.080313],[118.971099,32.080536],[118.971194,32.08078],[118.97136,32.081205],[118.971526,32.081637],[118.971691,32.082066],[118.971856,32.082493],[118.971944,32.082708],[118.972353,32.082755],[118.972884,32.082809],[118.973415,32.082862],[118.973938,32.08292],[118.974382,32.083021],[118.974617,32.083121],[118.975104,32.083318],[118.97534,32.083414],[118.975584,32.083512],[118.976063,32.083704],[118.976289,32.083829],[118.975923,32.084431],[118.975688,32.084834],[118.975436,32.085026],[118.975236,32.08518],[118.975035,32.085326],[118.974844,32.08548],[118.974643,32.085631],[118.974443,32.085783],[118.974251,32.085936],[118.97386,32.086237],[118.973668,32.086384],[118.973468,32.086537],[118.973268,32.086689],[118.973206,32.086951],[118.973573,32.087278],[118.973947,32.087598],[118.97413,32.087759],[118.974504,32.088081],[118.974687,32.088246],[118.975062,32.088564],[118.975436,32.088886],[118.975628,32.089047],[118.975994,32.089374],[118.976342,32.089683],[118.976516,32.08985],[118.976699,32.09002],[118.976882,32.090185],[118.977065,32.090351],[118.977239,32.090516],[118.977422,32.090683],[118.977596,32.090849],[118.977779,32.091018],[118.978136,32.091352],[118.978319,32.091515],[118.978493,32.091682],[118.978676,32.091848],[118.978859,32.092015],[118.979042,32.092185],[118.979216,32.092348],[118.979321,32.092633],[118.979486,32.093058],[118.979661,32.093486],[118.979739,32.093699],[118.979904,32.094127],[118.98007,32.094559],[118.980236,32.094987],[118.980314,32.095202],[118.980541,32.095359],[118.980741,32.095507],[118.981141,32.095797],[118.981342,32.095947],[118.981751,32.096239],[118.981951,32.096389],[118.982352,32.096683],[118.982552,32.096827],[118.982962,32.097121],[118.983363,32.097419],[118.98311,32.097592],[118.982709,32.097878],[118.982291,32.098163],[118.981891,32.09845],[118.981621,32.098727],[118.981525,32.098937],[118.981429,32.099148],[118.981333,32.09936],[118.981142,32.099778],[118.981054,32.099991],[118.980959,32.100199],[118.980863,32.100411],[118.980767,32.100621],[118.980584,32.101042],[118.980489,32.101254],[118.980393,32.101462],[118.980306,32.101818],[118.980332,32.102043],[118.980358,32.102269],[118.980393,32.102714],[118.980411,32.10294],[118.980437,32.103163],[118.980445,32.103389],[118.980471,32.103614],[118.980506,32.104064],[118.980532,32.104289],[118.98055,32.104515],[118.980567,32.104739],[118.980585,32.104964],[118.980611,32.10519],[118.980646,32.105637],[118.980663,32.105863],[118.980689,32.106088],[118.980707,32.106312],[118.980724,32.106538],[118.980759,32.106989],[118.980786,32.107213],[118.980803,32.107436],[118.980742,32.107723],[118.98055,32.107874],[118.98035,32.108027],[118.979949,32.108328],[118.979758,32.108475],[118.979366,32.108775],[118.979166,32.108929],[118.978974,32.10908],[118.978573,32.109381],[118.978155,32.109551],[118.977894,32.109574],[118.977362,32.109614],[118.977093,32.109635],[118.97657,32.109681],[118.9763,32.109698],[118.976039,32.109723],[118.975508,32.109765],[118.975246,32.109788],[118.974715,32.10983],[118.974236,32.109727],[118.97401,32.109605],[118.973792,32.109479],[118.973348,32.109228],[118.973122,32.109104],[118.972913,32.108975],[118.972686,32.108855],[118.972468,32.108727],[118.972024,32.108478],[118.971798,32.108352],[118.97158,32.108225],[118.971354,32.108103],[118.971136,32.107974],[118.970701,32.107726],[118.970474,32.1076],[118.970256,32.107476],[118.97003,32.107347],[118.969813,32.107225],[118.969368,32.106976],[118.969142,32.10685],[118.968785,32.106591],[118.968611,32.106417],[118.968428,32.106249],[118.968079,32.105912],[118.967905,32.105744],[118.967548,32.105405],[118.967374,32.105236],[118.9672,32.105062],[118.967026,32.104896],[118.966669,32.104557],[118.966321,32.104217],[118.965964,32.103882],[118.965789,32.103711],[118.965441,32.103374],[118.965267,32.103206],[118.96491,32.102867],[118.964562,32.102528],[118.964388,32.102356],[118.964039,32.102021],[118.963866,32.101847],[118.963596,32.101646],[118.963108,32.101457],[118.962621,32.101269],[118.962142,32.101081],[118.961663,32.100893],[118.961176,32.100706],[118.960688,32.100516],[118.960323,32.100424],[118.959792,32.100421],[118.959522,32.100416],[118.95926,32.100413],[118.958999,32.10041],[118.958729,32.100405],[118.95819,32.1004],[118.957937,32.100399],[118.957668,32.100396],[118.957398,32.100392],[118.956945,32.100289],[118.956693,32.100227],[118.956179,32.100103],[118.955666,32.09998],[118.955152,32.09986],[118.9549,32.099801],[118.954395,32.099676],[118.953882,32.099551],[118.953368,32.099433],[118.952855,32.09931],[118.952603,32.099249],[118.952089,32.099124],[118.951576,32.099006],[118.951063,32.098884],[118.95081,32.098822],[118.950297,32.098698],[118.949783,32.09858],[118.949279,32.098458],[118.949027,32.098396],[118.948644,32.098204],[118.948426,32.098087],[118.947965,32.097849],[118.947513,32.097614],[118.947295,32.097495],[118.946834,32.097257],[118.946617,32.09714],[118.946156,32.096907],[118.945703,32.096674],[118.945512,32.096593],[118.945024,32.096317],[118.944799,32.096199],[118.944346,32.095964],[118.943894,32.095727],[118.943659,32.095597],[118.943607,32.095152],[118.943581,32.094865],[118.943572,32.094637],[118.943554,32.094412],[118.943546,32.094186],[118.943537,32.09396],[118.943537,32.093737],[118.943528,32.093514],[118.943519,32.093288],[118.943511,32.093062],[118.943502,32.092836],[118.943494,32.092611],[118.943484,32.092387],[118.943467,32.092162],[118.943467,32.091936],[118.943459,32.091711],[118.94345,32.091485],[118.943441,32.091263],[118.943433,32.091038],[118.943424,32.090812],[118.943415,32.090586],[118.943406,32.090356],[118.943406,32.090131],[118.943389,32.089907],[118.943398,32.08953],[118.943449,32.089083],[118.943493,32.088634],[118.943536,32.088183],[118.943562,32.087959],[118.943615,32.087512],[118.943658,32.087063],[118.943684,32.086838],[118.943588,32.086622],[118.943058,32.086661],[118.942797,32.086682],[118.942267,32.08672],[118.941736,32.086763],[118.941327,32.08668],[118.940892,32.08641],[118.940475,32.086138],[118.940049,32.085867],[118.939622,32.085595],[118.939196,32.085325],[118.938779,32.085053],[118.938353,32.084781],[118.938144,32.084644],[118.938005,32.084227],[118.937935,32.084011],[118.937796,32.083574],[118.937666,32.083142],[118.937596,32.082923],[118.937457,32.082489],[118.937318,32.082053],[118.937248,32.081831],[118.937109,32.081395],[118.93697,32.080961],[118.936839,32.080527],[118.936691,32.080203],[118.936431,32.07981],[118.936179,32.079413],[118.935918,32.07902],[118.935657,32.078627],[118.935396,32.078234],[118.935135,32.077841],[118.934883,32.077447],[118.934753,32.077248],[118.9345,32.076855],[118.9343,32.076605],[118.9341,32.076462],[118.933692,32.076168],[118.933492,32.076018],[118.933101,32.075723],[118.932892,32.075575],[118.932692,32.075428],[118.932301,32.075134],[118.932092,32.074988],[118.931562,32.074919],[118.931293,32.074886],[118.93078,32.074818],[118.930249,32.074752],[118.929989,32.074717],[118.929459,32.074654],[118.929206,32.074623],[118.928789,32.074788],[118.92832,32.074991],[118.927842,32.07519],[118.927607,32.075288],[118.927121,32.075487],[118.926651,32.075684],[118.926182,32.07588],[118.925938,32.075984],[118.925469,32.076181],[118.924982,32.076378],[118.924513,32.076578],[118.924279,32.076675],[118.923801,32.076875],[118.923323,32.077078],[118.922845,32.077275],[118.922567,32.077377],[118.922298,32.077401],[118.921768,32.077437],[118.921507,32.077461],[118.920986,32.077497],[118.920716,32.077521],[118.920421,32.077465],[118.920317,32.077254],[118.92023,32.077043],[118.920126,32.076835],[118.919934,32.076414],[118.919848,32.076206],[118.919743,32.075995],[118.919657,32.075781],[118.919552,32.075572],[118.919466,32.075362],[118.919361,32.075151],[118.919274,32.074941],[118.919083,32.074522],[118.918988,32.074311],[118.918892,32.074103],[118.918796,32.073888],[118.918701,32.073678],[118.918623,32.07345],[118.918492,32.073016],[118.918423,32.072799],[118.918293,32.072362],[118.918162,32.071924],[118.918023,32.071488],[118.917893,32.071056],[118.917754,32.07062],[118.917624,32.07018],[118.917485,32.069746],[118.917346,32.069312],[118.917285,32.06909],[118.917154,32.068656],[118.917476,32.068411],[118.917675,32.068262],[118.917875,32.068114],[118.918075,32.067961],[118.918474,32.06767],[118.918674,32.067516],[118.918866,32.067369],[118.919065,32.067219],[118.919465,32.066922],[118.919664,32.066772],[118.919864,32.066625],[118.920056,32.066475],[118.920455,32.066178],[118.920655,32.066029],[118.920881,32.06571],[118.920933,32.065263],[118.920994,32.064814],[118.921046,32.064367],[118.921072,32.064143],[118.921133,32.063692],[118.920881,32.063295],[118.920629,32.0629],[118.920377,32.062501],[118.920133,32.062101],[118.919881,32.061704],[118.919638,32.061307],[118.91959,32.061231],[118.919604,32.06115],[118.919864,32.061132],[118.920667,32.059898],[118.920537,32.059774],[118.919214,32.059393],[118.91886,32.059062],[118.918547,32.058129],[118.918169,32.057362],[118.91775,32.056751],[118.916357,32.055283],[118.916315,32.054911],[118.916156,32.054646],[118.916203,32.054451],[118.916315,32.054285],[118.916835,32.054321],[118.918187,32.053119],[118.920024,32.05195],[118.920897,32.051519],[118.919575,32.050238],[118.918234,32.048536],[118.917783,32.047971],[118.917691,32.0478],[118.917551,32.047681],[118.917136,32.047161],[118.916421,32.04615],[118.914443,32.043242],[118.915138,32.042806],[118.915461,32.043295],[118.915765,32.043188],[118.915697,32.042854],[118.91577,32.042724],[118.9157,32.042549],[118.915963,32.042379],[118.916641,32.042896],[118.916728,32.043156],[118.916998,32.043006],[118.916755,32.042228],[118.916952,32.041938],[118.917469,32.041986],[118.918122,32.04161],[118.918521,32.041229],[118.918258,32.040685],[118.91804,32.039919],[118.917651,32.039901],[118.916717,32.040055],[118.913199,32.036315],[118.911467,32.034792],[118.909092,32.032281],[118.907696,32.030939],[118.906644,32.030096],[118.905909,32.029806],[118.898687,32.02739],[118.897851,32.02674],[118.897564,32.026358],[118.897434,32.026167],[118.897296,32.025992]
                                ]
                            },
                            id:'123456sasss'
                        }
                    ]
                }
            }
            // console.log("123")
            if(!this.map.getSource('dottedlines_label')){
                this.map.addSource('dottedlines_label',dottedLine);
            }else{
                return false
            }
            
            // console.log("456")
            // if (!this.map.getLayer('qixiaDis')){
                this.map.addLayer({
                    'id': 'qixiaDis',
                    'type': 'line',
                    'source':'dottedlines_label',
                    'fill':{
                        "fill-color":'#1679d5',
                        "fill-opacity":0.6,
                    },
                    'paint': {
                        'line-dasharray':[3,2],
                        'line-width': 1,
                        "line-opacity":1,
                        // 'line-color': ['get', 'color']
                        'line-color': '#1679d5'
                    }
                });
            // }
        },
        setISP(){
            const ispdata = {
                'type': 'geojson',
                'data':{
                    'type': 'FeatureCollection',
                    "features": [
                    {
                    "type": "Feature",
                    "properties": {
                        "name": "兴智科技园",
                        "height": 70,
                        "base_height": ""
                    },
                    "geometry": {
                        "coordinates": [
                        [
                            [
                            118.872749,
                            32.140334
                            ],
                            [
                            118.872758,
                            32.139775
                            ],
                            [
                            118.873088,
                            32.139779
                            ],
                            [
                            118.873079,
                            32.140349
                            ],
                            [
                            118.872749,
                            32.140334
                            ]
                        ]
                        ],
                        "type": "Polygon"
                    },
                    "id": "096fabce5b5ee9c7f1cccc2e12fc421d"
                    },
                    {
                    "type": "Feature",
                    "properties": {
                        "name": "兴智科技园",
                        "height": 50,
                        "base_height": 0
                    },
                    "geometry": {
                        "coordinates": [
                        [
                            [
                            118.872854,
                            32.139803
                            ],
                            [
                            118.872854,
                            32.139389
                            ],
                            [
                            118.873072,
                            32.13939
                            ],
                            [
                            118.873072,
                            32.139803
                            ],
                            [
                            118.872854,
                            32.139803
                            ]
                        ]
                        ],
                        "type": "Polygon"
                    },
                    "id": "0d185e5ee87a5e57aa10df913c14ecbd"
                    },
                    {
                    "type": "Feature",
                    "properties": {
                        "name": "兴智科技园C幢",
                        "height": 100,
                        "base_height": ""
                    },
                    "geometry": {
                        "coordinates": [
                        [
                            [
                            118.873735,
                            32.139139
                            ],
                            [
                            118.8739,
                            32.139139
                            ],
                            [
                            118.873908,
                            32.139182
                            ],
                            [
                            118.874278,
                            32.139184
                            ],
                            [
                            118.874278,
                            32.138948
                            ],
                            [
                            118.874194,
                            32.138945
                            ],
                            [
                            118.87419,
                            32.138903
                            ],
                            [
                            118.873733,
                            32.138897
                            ],
                            [
                            118.873735,
                            32.139139
                            ]
                        ]
                        ],
                        "type": "Polygon"
                    },
                    "id": "1ec3521eb9efe4a6c175c63b53e29958"
                    },
                    {
                    "type": "Feature",
                    "properties": {
                        "name": "兴智科技园B幢楼顶",
                        "height": 105,
                        "base_height": 100
                    },
                    "geometry": {
                        "coordinates": [
                        [
                            [
                            118.873938,
                            32.139668
                            ],
                            [
                            118.87394,
                            32.139584
                            ],
                            [
                            118.874191,
                            32.139589
                            ],
                            [
                            118.87419,
                            32.13967
                            ],
                            [
                            118.874107,
                            32.13967
                            ],
                            [
                            118.874107,
                            32.139684
                            ],
                            [
                            118.874207,
                            32.139684
                            ],
                            [
                            118.874208,
                            32.13957
                            ],
                            [
                            118.873916,
                            32.13957
                            ],
                            [
                            118.873918,
                            32.139685
                            ],
                            [
                            118.874107,
                            32.139684
                            ],
                            [
                            118.874107,
                            32.13967
                            ],
                            [
                            118.873938,
                            32.139668
                            ]
                        ]
                        ],
                        "type": "Polygon"
                    },
                    "id": "54ea6d428719b3e3a880bc6777482d5a"
                    },
                    {
                    "type": "Feature",
                    "properties": {
                        "name": "兴智科技园A幢",
                        "height": 100,
                        "base_height": ""
                    },
                    "geometry": {
                        "coordinates": [
                        [
                            [
                            118.873268,
                            32.140345
                            ],
                            [
                            118.873905,
                            32.140338
                            ],
                            [
                            118.873906,
                            32.140051
                            ],
                            [
                            118.87327,
                            32.140045
                            ],
                            [
                            118.873268,
                            32.140345
                            ]
                        ]
                        ],
                        "type": "Polygon"
                    },
                    "id": "5a53726126c1ce3723f937a816dc1c1f"
                    },
                    {
                    "type": "Feature",
                    "properties": {
                        "name": "兴智科技园",
                        "height": 50,
                        "base_height": 35
                    },
                    "geometry": {
                        "coordinates": [
                        [
                            [
                            118.872858,
                            32.139392
                            ],
                            [
                            118.872855,
                            32.1391
                            ],
                            [
                            118.873079,
                            32.139102
                            ],
                            [
                            118.873072,
                            32.139392
                            ],
                            [
                            118.872858,
                            32.139392
                            ]
                        ]
                        ],
                        "type": "Polygon"
                    },
                    "id": "5be2009f1b929486a37ff19d1066ec5a"
                    },
                    {
                    "type": "Feature",
                    "properties": {
                        "name": "兴智科技园",
                        "height": 50,
                        "base_height": ""
                    },
                    "geometry": {
                        "coordinates": [
                        [
                            [
                            118.873081,
                            32.138731
                            ],
                            [
                            118.873898,
                            32.138722
                            ],
                            [
                            118.873899,
                            32.138482
                            ],
                            [
                            118.872861,
                            32.138482
                            ],
                            [
                            118.872856,
                            32.139101
                            ],
                            [
                            118.87308,
                            32.139103
                            ],
                            [
                            118.873081,
                            32.138731
                            ]
                        ]
                        ],
                        "type": "Polygon"
                    },
                    "id": "6c2fbe718bf2f0f701b52728f666a2fa"
                    },
                    {
                    "type": "Feature",
                    "properties": {
                        "name": "兴智科技园B幢",
                        "height": 100,
                        "base_height": 0
                    },
                    "geometry": {
                        "coordinates": [
                        [
                            [
                            118.873729,
                            32.139718
                            ],
                            [
                            118.873882,
                            32.139719
                            ],
                            [
                            118.873882,
                            32.139758
                            ],
                            [
                            118.874261,
                            32.139753
                            ],
                            [
                            118.874266,
                            32.139532
                            ],
                            [
                            118.87419,
                            32.139529
                            ],
                            [
                            118.874186,
                            32.139485
                            ],
                            [
                            118.873734,
                            32.139484
                            ],
                            [
                            118.873729,
                            32.139718
                            ]
                        ]
                        ],
                        "type": "Polygon"
                    },
                    "id": "f031e8b126337465bc91c56aadc5eee0"
                    }
                ],
                }
            }
            this.map.addSource('isp',ispdata);
            this.map.addLayer({
                'id': 'ispppp',
                'type': 'fill-extrusion',
                // 'source': {
                //     // GeoJSON Data source used in vector tiles, documented at
                //     // https://gist.github.com/ryanbaumann/a7d970386ce59d11c16278b90dde094d
                //     'type': 'geojson',
                //     'data': ispdata//'https://www.mapbox.com/mapbox-gl-js/assets/indoor-3d-map.geojson'
                // },
                source:ispdata,
                'minzoom': 11,
                'paint': {
                    // See the Mapbox Style Specification for details on data expressions.
                    // https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions

                    // Get the fill-extrusion-color from the source 'color' property.
                    'fill-extrusion-color': '#89d3e6',//'#024c7c',//['get', 'color'],

                    // Get fill-extrusion-height from the source 'height' property.
                    'fill-extrusion-height': ['get', 'height'],

                    // Get fill-extrusion-base from the source 'base_height' property.
                    'fill-extrusion-base': ['get', 'base_height'],

                    // Make extrusions slightly opaque for see through indoor walls.
                    'fill-extrusion-opacity': 0.5
                }
            });
        },
        selectScean(params){
            this.scean = params
        },
        handleAnimateCircle(){
            var size = 200;
            var pulsingDot = {
                width: size,
                height: size,
                data: new Uint8Array(size * size * 4),
                
                onAdd: () =>{
                    var canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    this.context = canvas.getContext('2d');
                },
                
                render:()=>{
                    var duration = 1000;
                    var t = (performance.now() % duration) / duration;
                    
                    var radius = size / 2 * 0.3;
                    var outerRadius = size / 2 * 0.7 * t + radius;
                    var context = this.context;
                    
                    // draw outer circle
                    context.clearRect(0, 0, this.width, this.height);
                    context.beginPath();
                    context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
                    context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
                    context.fill();
                    
                    // draw inner circle
                    context.beginPath();
                    context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
                    context.fillStyle = 'rgba(255, 100, 100, 1)';
                    context.strokeStyle = 'white';
                    context.lineWidth = 2 + 4 * (1 - t);
                    context.fill();
                    context.stroke();
                    
                    // update this image's data with data from the canvas
                    this.data = context.getImageData(0, 0, this.width, this.height).data;
                    
                    // keep the map repainting
                    this.map.triggerRepaint();
                    
                    // return `true` to let the map know that the image was updated
                    return true;
                }
            };
           
 
            this.map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
            
            this.map.addLayer({
                "id": "points",
                "type": "symbol",
                "source": {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [118.8972030341, 32.1540342558]
                            }
                        }]
                    }
                },
                "layout": {
                    "icon-image": "pulsing-dot"
                }
            });
        },
        getQichachaData(name){
            // axios.post('http://120.55.161.93:6011/qichacha/industryDetail?name='+name)
            axios.post('http://121.199.8.188:6011/qichacha/industryDetail?name='+name)
            .then(res=>{
                // console.log(res.data.Result)
                // if(res.data.result.content){
                //     let myData = JSON.parse(res.data.result.content)
                //     //  console.log(myData)
                //     //  console.log("789poi")
                //     this.CompanyProducts = myData.Result.CompanyProducts
                //     this.Employees = myData.Result.Employees
                //     this.Industry = myData.Result.Industry
                //     this.Partners = myData.Result.Partners
                //     this.ScopeIn = myData.Result.Scope
                //     this.legalPerson = myData.Result.OperName
                //     this.ContactInfo = myData.Result.ContactInfo
                //     // axios.post("http://120.55.161.93:6011/qichacha/getPatentCount?name="+name)
                //     axios.post("http://121.199.8.188:6011/qichacha/getPatentCount?name="+name)
                //     .then(res=>{
                //         this.knowledge = res.data.result
                //     })
                // }
                if(res.data.result && res.data.code === 200){
                    // console.log(res.data.Result)
                    let myData = res.data.result
                    // console.log(myData)
                    // console.log("789poi")
                    // this.CompanyProducts = myData.Result.CompanyProducts
                    this.Employees = myData.Result.Employees
                    this.Industry = myData.Result.Industry
                    this.Partners = myData.Result.Partners
                    this.ScopeIn = myData.Result.Scope
                    this.legalPerson = myData.Result.OperName
                    this.ContactInfo = {
                        adress:myData.Result.Address,
                        phone:myData.Result.Address,
                    }
                    axios.post("http://121.199.8.188:6011/qichacha/getPatentCount?name="+name)
                    .then(res=>{
                        this.knowledge = res.data.result
                    })
                }
                
            })
        },
        showInMapbox(params){
            this.sceanFlag = false
            let sceanEnterPrise = []
            parkList.features.forEach(l=>{
                l.properties.test.forEach(el=>{
                    if(params === el.enterpriseId){
                        // console.log(el)
                        sceanEnterPrise.push(el)
                        this.searchReault.features[0].properties.test = sceanEnterPrise
                        this.searchReault.features[0].properties.id = l.properties.id
                        this.searchReault.features[0].geometry.coordinates = l.geometry.coordinates
                    }
                })
            })
            // console.log(this.searchReault)
            this.map.flyTo({
                center:this.searchReault.features[0].geometry.coordinates,
                zoom: 15
            })
            this.map.getSource('earthquakes').setData(this.searchReault)
        },
        setMapTheme(){
            if(this.switchMap){
                this.map.setStyle('mapbox://styles/mapbox/satellite-streets-v11')
            }else{
                this.map.setStyle('http://106.15.47.224:8688/styles/newblue/style.json') 
            }
        },
        getScenList(params){
            axios.post('http://120.55.161.93:6011/companyInfo/listAllCompanyScene?type='+params)
            .then(res=>{
                // console.log(res)
                this.sceanList = res.data.result
            })
        },
        showDetail(params){
            this.enterpriseFlag = false
            // console.log(params)
            this.sceanFlag = true
            let id = parseInt(params)
            axios.post('http://120.55.161.93:6011/companyInfo/getCompanyScene?companySceneId='+id)
            .then(res=>{
                console.log(res)
                this.sceanData = res.data.result
                res.data.result.companySceneImgDTOList.forEach(l=>{
                    // l.scenarioImg = 'http://'+ l.scenarioImg
                    // l.scenarioImg = 'http://'+ l.scenarioImg
                    // console.log(l.scenarioImg.substring(21))
                    l.scenarioImg = 'http://qiniu.iwooke'+ l.scenarioImg.substring(21)
                })
                this.companySceneImgDTOList = res.data.result.companySceneImgDTOList
                let srcArrList = []
                this.companySceneImgDTOList.forEach(l=>{
                    srcArrList.push(l.scenarioImg)
                })
                
                this.srcList = srcArrList
                this.url = this.srcList[0]
                
                // this.videoUrl =  'http://'+ res.data.result.video
                this.videoUrl =  'http://qiniu.iwooke'+ res.data.result.video.substring(21)
            })
            let arrList = [
                {
                    "enterpriseId": "XZKJY045",
                    "enterpriseName": "南京艾弗曼人工智能有限公司",
                    "legalPerson": "李钢",
                    "registeredCapital": "1000",
                    "establishedTime": "2018/1/9",
                    "AIbusiness": "80%",
                    "technologyStratification": "3-硬件终端",
                    "levelOneAI": "智能机器人",
                    "leveltwoAI": "",
                    "enterpriseProfile": "一家智能服务机器人研发商，将AI技术应用于运营商、金融、政务、电商、航空、汽车、物流等行业的服务场景，其研发的机器人具有精准人脸识别、自主定位导航、语音识别对话、数据采集分析、导航避障及定时回充功能",
                    "qualification": "",
                    "AIBusinessDirection": "智能税务服务",
                    "content": "南京艾德曼税务机器人",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路6号兴智科技园A栋2106室",
                    "elements": "终端 网络 平台 模块 系统",
                    "IndustryClassification": "服务机器人"
                },
                {
                    "enterpriseId": "ZDCYY012",
                    "enterpriseName": "捕视者人脸识别技术（江苏）有限公司",
                    "legalPerson": "窦一鸣 ",
                    "registeredCapital": "1000",
                    "establishedTime": "2018/1/29",
                    "AIbusiness": "100%",
                    "technologyStratification": "2-技术层",
                    "levelOneAI": "图像识别",
                    "leveltwoAI": "智慧政务",
                    "enterpriseProfile": "基于人脸识别技术开发智慧政务审批系统、认证识别终端、视频数字化多组态人脸识别系统",
                    "qualification": "",
                    "AIBusinessDirection": "\"人脸识别"
                },
                {
                    "enterpriseId": "烟雾识别\"",
                    "enterpriseName": "捕视者不见面事项审批政务平台软件",
                    "legalPerson": "栖霞高新区",
                    "registeredCapital": "南京市栖霞区马群街道紫东路2号B4栋402室",
                    "establishedTime": "网络 平台 模块 系统",
                    "AIbusiness": "计算机视觉"
                },
                {
                    "enterpriseId": "ZDCYY030",
                    "enterpriseName": "南京子谷大数据科技有限公司",
                    "legalPerson": "朱晶",
                    "registeredCapital": "1000",
                    "establishedTime": "2019/4/19",
                    "AIbusiness": "90%",
                    "technologyStratification": "4-应用层",
                    "levelOneAI": "智慧政务",
                    "leveltwoAI": "",
                    "enterpriseProfile": "搭建网民用户行为模型，为政府提供重点舆情数据追踪，海量视频流数据监测，实时即时阻断等服务",
                    "qualification": "",
                    "AIBusinessDirection": "人工智能+大数据",
                    "content": "搭建网民用户行为模型，为政府提供重点舆情数据追踪，海量视频流数据监测，实时即时阻断等服务",
                    "Itsarea": "栖霞高新区",
                    "area": "南京市栖霞区马群街道紫东路2号紫东国际创意园A7栋102室",
                    "elements": "网络 平台",
                    "IndustryClassification": "大数据服务，法律"
                },
                {
                    "enterpriseId": "XZKJY002",
                    "enterpriseName": "南京人工智能高等研究院有限公司",
                    "legalPerson": "余凯",
                    "registeredCapital": "2700",
                    "establishedTime": "2018/4/24",
                    "AIbusiness": "",
                    "technologyStratification": "2-技术层",
                    "levelOneAI": "图像识别/语音语义",
                    "leveltwoAI": "",
                    "enterpriseProfile": "基于机器学习基础理论、计算机视觉技术、语音语言处理技术、高性能计算等前沿技术研究，重点围绕智能制造、智能城市、智能医疗等重要行业领域进行产学研成果转化",
                    "qualification": "",
                    "AIBusinessDirection": "深度学习芯片、机器视觉等",
                    "content": "南京人工智能高等研究院",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路6号兴智科技园A栋21层",
                    "elements": "终端 网络 平台 模块",
                    "IndustryClassification": "计算机视觉，智能医疗，智能语音"
                },
                {
                    "enterpriseId": "XZKJY005",
                    "enterpriseName": "芯启源（南京）半导体科技有限公司",
                    "legalPerson": "SHENG LU ",
                    "registeredCapital": "10000万美元",
                    "establishedTime": "2016/11/3",
                    "AIbusiness": "70%",
                    "technologyStratification": "1-基础层",
                    "levelOneAI": "集成电路",
                    "leveltwoAI": "芯片设计",
                    "enterpriseProfile": "为国家战略层面的芯片自主知识产权研发和应用不断努力",
                    "qualification": "",
                    "AIBusinessDirection": "网络企业级芯片",
                    "content": "企业级高端网络通讯智能芯片",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路兴智科技园A栋7层",
                    "elements": "算法 芯片 终端",
                    "IndustryClassification": "AI芯片"
                },
                {
                    "enterpriseId": "XZKJY006",
                    "enterpriseName": "南京宇都通讯科技有限公司",
                    "legalPerson": "JUNFENG WANG",
                    "registeredCapital": "1327.58",
                    "establishedTime": "2012/4/20",
                    "AIbusiness": "60%",
                    "technologyStratification": "1-基础层",
                    "levelOneAI": "通信网络",
                    "leveltwoAI": "通信芯片/通信设备",
                    "enterpriseProfile": "立足于SmartCable（有线千兆）和SmartAir（无线千兆）两项自主创新的宽带通讯核心前沿技术，提供千兆宽带接入和千兆家庭网的系统解决方案、关键设备和核心芯片，打造家庭网信息高速干线，支持三网融合、高清/超高清IPTV等应用，努力成为这个新兴的千亿级市场的一流供应商",
                    "qualification": "",
                    "AIBusinessDirection": "智能终端芯片",
                    "content": "三网融合智能芯片",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路6-3号南段4层",
                    "elements": "算法 芯片  网络",
                    "IndustryClassification": "AI芯片"
                },
                {
                    "enterpriseId": "XZKJY007",
                    "enterpriseName": "创新奇智（南京）科技有限公司",
                    "legalPerson": "徐辉",
                    "registeredCapital": "1000",
                    "establishedTime": "2018/6/15",
                    "AIbusiness": "90%",
                    "technologyStratification": "4-应用层",
                    "levelOneAI": "智能商业/智能制造",
                    "leveltwoAI": "工业视觉",
                    "enterpriseProfile": "创新工场AI子公司，以“人工智能赋能商业未来”为使命；以“技术产品”+“行业场景”双轮驱动模式，为制造、零售、金融等行业提供人工智能整体解决方案，已获取中冶赛迪、宗申、格力、宝武钢铁等行业客户；智能零售解决方案，实现场、货、人的智能化管理。智能工业解决方案中基于计算机视觉的无损探伤场景。",
                    "qualification": "省级小巨人企业（创新类）",
                    "AIBusinessDirection": "AI赋能零售、金融、制造业",
                    "content": "人工智能整体解决方案",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路6号兴智科技园B栋第19层",
                    "elements": "网络 平台 模块",
                    "IndustryClassification": "智能制造，智能零售，智能金融，计算机视觉"
                },
                {
                    "enterpriseId": "XZKJY008",
                    "enterpriseName": "南京旷云科技有限公司",
                    "legalPerson": "曹志敏",
                    "registeredCapital": "1000",
                    "establishedTime": "2017/1/10",
                    "AIbusiness": "100%",
                    "technologyStratification": "2-技术层",
                    "levelOneAI": "图像识别",
                    "leveltwoAI": "人脸识别",
                    "enterpriseProfile": "从属于北京旷视，目前为数据中心与研究院相结合的构成",
                    "qualification": "",
                    "AIBusinessDirection": "计算机视觉",
                    "content": "人脸识别人工智能算法、硬件技术、行业解决方案",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路兴智科技园A栋15层",
                    "elements": "算法 网络 平台 模块 系统",
                    "IndustryClassification": "计算机视觉"
                },
                {
                    "enterpriseId": "XZKJY009",
                    "enterpriseName": "江苏南大苏富特智能交通科技有限公司",
                    "legalPerson": "张道林",
                    "registeredCapital": "1000",
                    "establishedTime": "2012/1/20",
                    "AIbusiness": "20%",
                    "technologyStratification": "4-应用层",
                    "levelOneAI": "智能交通",
                    "leveltwoAI": "交通信息化",
                    "enterpriseProfile": "从事城市交通领域的智能化系统集成解决方案及交通信息平台建设、运营、维护服务；主要产品行业监管系统平台、公交管理APP、视频监控管理平台等。",
                    "qualification": "高企、新四板",
                    "AIBusinessDirection": "智慧交通",
                    "content": "交通大数据信息服务整体解决方案",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路6号342室",
                    "elements": "网络 平台 模块",
                    "IndustryClassification": "智能交通"
                },
                {
                    "enterpriseId": "XZKJY010",
                    "enterpriseName": "南京创新工场科技有限公司",
                    "legalPerson": "王咏刚",
                    "registeredCapital": "1000",
                    "establishedTime": "2017/12/12",
                    "AIbusiness": "20%",
                    "technologyStratification": "4-应用层",
                    "levelOneAI": "智能金融",
                    "leveltwoAI": "智能金融",
                    "enterpriseProfile": "成立于2017年12月；2018年9月27日，创新工场南京国际人工智能研究院正式落户南京兴智科技园；致力于培养人工智能高端科研与工程人才，研发以机器学习为核心的前沿人工智能技术，并同计算金融领域相结合，为行业场景提供一流的产品和解决方案",
                    "qualification": "",
                    "AIBusinessDirection": "AI零售、金融",
                    "content": "南京创新工场人工智能研究院",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路6号兴智科技园B栋1006室",
                    "elements": "网络 平台 模块",
                    "IndustryClassification": "智能零售，智能金融"
                },
                {
                    "enterpriseId": "XZKJY011",
                    "enterpriseName": "南京普斯迪尔电子科技有限公司",
                    "legalPerson": "李鑫",
                    "registeredCapital": "3000",
                    "establishedTime": "2010/7/13",
                    "AIbusiness": "",
                    "technologyStratification": "",
                    "levelOneAI": "",
                    "leveltwoAI": "",
                    "enterpriseProfile": "",
                    "qualification": "",
                    "AIBusinessDirection": "\"数据采集、"
                },
                {
                    "enterpriseId": "XZKJY013",
                    "enterpriseName": "南京氪信信息技术有限公司",
                    "legalPerson": "SUN NAN",
                    "registeredCapital": "1100",
                    "establishedTime": "2017/6/22",
                    "AIbusiness": "70%",
                    "technologyStratification": "4-应用层",
                    "levelOneAI": "智能金融",
                    "leveltwoAI": "",
                    "enterpriseProfile": "上海氪信信息技术有限公司的子公司，基于人工智能技术为金融机构提供智能风控、智能营销、智能运营等领域的一体化智能金融解决方案，核心产品及服务体系包括非或然智能引擎平台，模型服务和业务策略咨询",
                    "qualification": "高企",
                    "AIBusinessDirection": "AI+金融",
                    "content": "大数据风控解决方案",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路6号兴智科技园A栋1103室",
                    "elements": "网络 平台 模块 系统",
                    "IndustryClassification": "智能金融"
                },
                {
                    "enterpriseId": "XZKJY014",
                    "enterpriseName": "英麦尔（南京）科技有限公司",
                    "legalPerson": " WUXING ",
                    "registeredCapital": "110",
                    "establishedTime": "2017/1/23",
                    "AIbusiness": "20%",
                    "technologyStratification": "2-技术层",
                    "levelOneAI": "数据服务",
                    "leveltwoAI": "",
                    "enterpriseProfile": "数字供应链共享、协同平台，以共享产能、共享库存、共享数据为基础、实现企业内外部的计划协同、交付协同和异常协同",
                    "qualification": "",
                    "AIBusinessDirection": "供应链智能转型",
                    "content": "公安系统数据分析解决方案",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路兴智科技园c栋2001室",
                    "elements": "算法  网络  ",
                    "IndustryClassification": "云平台，大数据服务"
                },
                {
                    "enterpriseId": "XZKJY015",
                    "enterpriseName": "南京仁通信息技术有限公司",
                    "legalPerson": "秦旭彦 ",
                    "registeredCapital": "200",
                    "establishedTime": "2012/9/18",
                    "AIbusiness": "10%",
                    "technologyStratification": "4-应用层",
                    "levelOneAI": "智能交通",
                    "leveltwoAI": "",
                    "enterpriseProfile": "从事智能交通领域的软硬件研发和销售工作，业务主要包括交通咨询服务以及智慧停车体系两大领域；南京仁通主攻汽车后服务市场，近两年公司业务范围不断拓展，新开辟了洗车及相关涉车服务，随着南京市内几个新建点位的开业，目前已形成洗车连锁效应",
                    "qualification": "高企",
                    "AIBusinessDirection": "智慧城市",
                    "content": "智能城市道路交通、停车场解决方案",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区恒泰路8号汇智科技园B2栋1004室",
                    "elements": "网络 平台 ",
                    "IndustryClassification": "智能交通"
                },
                {
                    "enterpriseId": "XZKJY016",
                    "enterpriseName": "南京佑驾科技有限公司",
                    "legalPerson": "刘国清",
                    "registeredCapital": "3000",
                    "establishedTime": "2018/2/24",
                    "AIbusiness": "100%",
                    "technologyStratification": "3-硬件终端",
                    "levelOneAI": "智能网联汽车",
                    "leveltwoAI": "高级辅助驾驶系统",
                    "enterpriseProfile": "目前公司主推的产品是高级驾驶辅助系统（ADAS），并逐渐向不同Level的自动驾驶演进",
                    "qualification": "",
                    "AIBusinessDirection": "自动驾驶",
                    "content": "Minieye高级辅助驾驶和无人驾驶系统",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路6号兴智科技园A栋18层",
                    "elements": "终端 网络 平台 模块 系统",
                    "IndustryClassification": "智能驾驶，OS"
                },
                {
                    "enterpriseId": "XZKJY017",
                    "enterpriseName": "南京快轮智能科技有限公司",
                    "legalPerson": "刘峰 ",
                    "registeredCapital": "83",
                    "establishedTime": "2014/6/10",
                    "AIbusiness": "70%",
                    "technologyStratification": "4-应用层",
                    "levelOneAI": "智能交通",
                    "leveltwoAI": "智能代步工具",
                    "enterpriseProfile": "服务上有车辆运营监控；产品上有智能滑板车",
                    "qualification": "高企、培育独角兽",
                    "AIBusinessDirection": "\"智能代步工具"
                },
                {
                    "enterpriseId": "XZKJY035",
                    "enterpriseName": "南京阿波罗机器人科技有限公司",
                    "legalPerson": "李学骏",
                    "registeredCapital": "190",
                    "establishedTime": "2015/4/30",
                    "AIbusiness": "10%",
                    "technologyStratification": "4-应用层",
                    "levelOneAI": "智慧教育",
                    "leveltwoAI": "",
                    "enterpriseProfile": "服务于4~16岁儿童及青少年，启发孩子掌握机器人的内部构造及编程实现，帮助孩子理解和体验各种理论性、技术性、经验性科学知识与技能",
                    "qualification": "",
                    "AIBusinessDirection": "AI教育",
                    "content": "青少年机器人教育（编程、模型）",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路6号兴智科技园B栋1002室",
                    "elements": "网络 平台 系统",
                    "IndustryClassification": "智能教育"
                },
                {
                    "enterpriseId": "XZKJY036",
                    "enterpriseName": "南京云孚智能科技有限公司",
                    "legalPerson": "张文斌",
                    "registeredCapital": "201",
                    "establishedTime": "2018/8/14",
                    "AIbusiness": "90%",
                    "technologyStratification": "2-技术层",
                    "levelOneAI": "语音语义",
                    "leveltwoAI": "",
                    "enterpriseProfile": "语义技术服务商，核心产品包括NLP工具包、知识图谱、文本挖掘、对话系统、舆情监测等，致力于以顶尖的语义技术助力企业智能升级。合作伙伴包括腾讯、百度、科大讯飞、滴滴、VIVO、神州泰岳、传神语联网、慧科等知名企业",
                    "qualification": "",
                    "AIBusinessDirection": "自然语言处理",
                    "content": "基于知识图谱的工业类语义服务",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路6号兴智科技园C栋1808室",
                    "elements": "网络 平台 系统",
                    "IndustryClassification": "自然语言处理"
                },
                {
                    "enterpriseId": "XZKJY037",
                    "enterpriseName": "南京海果智能科技有限公司",
                    "legalPerson": "屈桢深 ",
                    "registeredCapital": "250",
                    "establishedTime": "2015/2/5",
                    "AIbusiness": "60%",
                    "technologyStratification": "2-技术层",
                    "levelOneAI": "数据服务",
                    "leveltwoAI": "",
                    "enterpriseProfile": "致力于人工智能技术在互联网金融、机器视觉等方面的行业应用；致力于互联网保险和互联网金融的大数据应用，构建基于Hadoop、Spark、Storm等大数据核心技术的互联网保险和互联网金融商业支撑系统，服务保险/金融机构和投资人",
                    "qualification": "",
                    "AIBusinessDirection": "",
                    "content": "大输液智能灯检机",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区创智科技园C栋1703室",
                    "elements": "网络 平台 模块",
                    "IndustryClassification": "大数据服务"
                },
                {
                    "enterpriseId": "XZKJY038",
                    "enterpriseName": "南京青虹网络科技有限公司",
                    "legalPerson": "薛靖",
                    "registeredCapital": "200",
                    "establishedTime": "2017/9/14",
                    "AIbusiness": "30%",
                    "technologyStratification": "2-技术层",
                    "levelOneAI": "VR/AR",
                    "leveltwoAI": "",
                    "enterpriseProfile": "致力于虚拟现实（VR）相关产业，积极打造“VR+”产业链，主要从事航拍无人机、VR全景拍摄、VR全景监控等相关领域的产品和服务",
                    "qualification": "",
                    "AIBusinessDirection": "VR",
                    "content": "VR全景及网络平台的技术开发、咨询与服务",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路6号兴智科技园C栋1004室",
                    "elements": "终端 网络 平台 模块",
                    "IndustryClassification": "移动设备，云平台"
                },
                {
                    "enterpriseId": "XZKJY039",
                    "enterpriseName": "南京京东智汇信息技术有限公司",
                    "legalPerson": "张雱",
                    "registeredCapital": "2000",
                    "establishedTime": "2018/5/14",
                    "AIbusiness": "70%",
                    "technologyStratification": "2-技术层",
                    "levelOneAI": "图像识别/语音语义/机器学习",
                    "leveltwoAI": "",
                    "enterpriseProfile": "“京东（南京）人工智能研究院”将聚焦语音语义、计算机视觉、机器学习等技术领域，以京东实际的业务场景需求为驱动，专注于持续性的算法创新，成为京东生态系统大平台里重要的组成部分",
                    "qualification": "",
                    "AIBusinessDirection": "语音语义、计算机视觉、机器学习",
                    "content": "京东（南京）人工智能研究院",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区红枫科技园D12栋10层",
                    "elements": "网络 平台 模块",
                    "IndustryClassification": "计算机视觉，智能语音，机器学习"
                },
                {
                    "enterpriseId": "XZKJY040",
                    "enterpriseName": "南京轩宁信息技术有限公司",
                    "legalPerson": "司轩斌 ",
                    "registeredCapital": "200",
                    "establishedTime": "2019/5/27",
                    "AIbusiness": "80%",
                    "technologyStratification": "2-技术层",
                    "levelOneAI": "生物识别",
                    "leveltwoAI": "",
                    "enterpriseProfile": "无官网，无介绍",
                    "qualification": "",
                    "AIBusinessDirection": "屏下指纹识别",
                    "content": "全屏指纹识别",
                    "Itsarea": "经开区",
                    "area": "南京市雨花台区花神庙10号02栋602室",
                    "elements": "终端 网络 平台 模块",
                    "IndustryClassification": "生物识别"
                },
                {
                    "enterpriseId": "XZKJY041",
                    "enterpriseName": "南京众乐互联科技有限公司",
                    "legalPerson": "程仁庆 ",
                    "registeredCapital": "100",
                    "establishedTime": "2018/8/28",
                    "AIbusiness": "60%",
                    "technologyStratification": "4-应用层",
                    "levelOneAI": "智能金融",
                    "leveltwoAI": "",
                    "enterpriseProfile": "无官网，无介绍",
                    "qualification": "",
                    "AIBusinessDirection": "智慧金融",
                    "content": "基于人工智能算法的消费行为收集、产能供需匹配的溯源系统",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路6号兴智科技园A栋1103室",
                    "elements": "网络 平台 ",
                    "IndustryClassification": "智能金融，OS"
                },
                {
                    "enterpriseId": "XZKJY042",
                    "enterpriseName": "南京鹏特信息科技有限公司",
                    "legalPerson": "刘波",
                    "registeredCapital": "1200",
                    "establishedTime": "2015/1/13",
                    "AIbusiness": "20%",
                    "technologyStratification": "4-应用层",
                    "levelOneAI": "智能安防",
                    "leveltwoAI": "安防硬件产品",
                    "enterpriseProfile": "南京鹏特主要产品有4G执法记录仪，4G手持单兵，4G高清车载，4G应急指挥中心（布控球）一体化手提箱",
                    "qualification": "",
                    "AIBusinessDirection": "\"无线视屏"
                },
                {
                    "enterpriseId": "智能安全帽\"",
                    "enterpriseName": "无线通信技术研究及产品开发",
                    "legalPerson": "经开区",
                    "registeredCapital": "南京市秦淮区科巷1号1417室",
                    "establishedTime": "网络 平台 模块",
                    "AIbusiness": "智能安防"
                }
            ]
            var t;
            for(var i = 0;i < arrList.length; i++){
            var rand = parseInt(Math.random()*arrList.length);
            // console.log(rand)
                t = arrList[rand];
                arrList[rand] =arrList[i];
                arrList[i] = t;
            }
            let nanyou = [{
                    "enterpriseId": "XZKJY001",
                    "enterpriseName": "南京南邮信息产业技术研究院有限公司",
                    "legalPerson": "孙海安",
                    "registeredCapital": "2000",
                    "establishedTime": "2014/12/31",
                    "AIbusiness": "",
                    "technologyStratification": "2-技术层",
                    "levelOneAI": "语音语义/生物识别",
                    "leveltwoAI": "机器人/智能家居",
                    "enterpriseProfile": "围绕新一代信息技术的发展，特别是在宽带无线通信、大数据、移动互联、智慧城市、信息材料以及信息服务等相关领域，以创新的运作模式推动技术的产业化，着力推动产业链的协同创新，力争建设成为国内知名、国际上有影响力的信息 技术战略性新兴产业创新中心，打造成为国内一流信息产业技术研发创新平台、成果转移孵化平台、项目投资管理平台、产业公共服务平台、创新人才培养平台",
                    "qualification": "高企",
                    "AIBusinessDirection": "语音语义、机器人、智能家居、生物识别",
                    "content": "南京南邮信息产业技术研究院",
                    "Itsarea": "经开区",
                    "area": "南京经济技术开发区兴智路兴智科技园B栋906室",
                    "elements": "算法 终端 网络 平台 模块 系统",
                    "IndustryClassification": "智能语音，自然语言处理，云平台，大数据服务，计算机视觉，智能安防，智能家居，服务机器人"
                }]
            this.officeList =nanyou.concat(arrList.slice(0,3))
        },
        showImgBox(){
            // this.imgTitle = 
            this.imgDialogVisible = true
        }
    }
}
</script>

<style scoped lang="css">
    #map{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .headerBox{
        position: absolute;
        left: 20px;
        z-index: 2;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .switchBox{
        position: absolute;
        right: 20px;
        top: 50px;
        z-index: 2;
        color: #ffffff;
        margin-right: 10px;
        display: flex;
        align-items: center;
    }
     .switchTitle{
        font-size: 18px;
        margin-right: 10px;
    }
    .title{
        color: #ffffff;
        font-size: 30px;
        margin-left: 10px;
    }
    .bottomBox{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 2;
    }
    .itemsNav{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 80px;
        cursor: pointer;
    }
    .itemsNav i{
        color: #ffffff;
        font-size: 30px;
        margin-bottom: 10px;
    }
    .itemsNav .name{
       color: #ffffff;
        font-size: 20px;
        margin: 10px 0 0 0;
    }
    .activeitemsNav{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 80px;
        cursor: pointer;
    }
    .activeitemsNav i{
        color: #F9CE5F;
        font-size: 30px;
        margin-bottom: 10px;
    }
    .activeitemsNav .name{
       color: #F9CE5F;
        font-size: 20px;
        margin: 10px 0 0 0;
    }
</style>