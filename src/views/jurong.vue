<template>
    <div id="map">
        <div class="headerBox">
                <img src="../../src/assets/images/logo.png" alt="">
                <p class="title">中国(句容)产业生态分布图</p>
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
                <p class="headerTitle">应用场景</p>
            </div>
            <div class="content">
                <div class="btnGroups">
                    <md-tabs>
                        <md-tab id="movies" md-label="智慧政务">
                            <div class="cardBox" v-for="(item,index) in sceanList" :key="index" @click="clusterMapDis">
                                <div v-if="item.id == 1">
                                    <div class="cardContent">
                                        <p class="cardTitle">{{item.title}}</p>
                                        <p class="cardDetail">{{item.info}}</p>
                                        <el-button type="text" style="color:'#ffffff'" @click="showDetail(item.index)">查看更多>></el-button>
                                    </div>
                                </div>
                            </div>
                        </md-tab>

                        <md-tab id="music" md-label="智慧民生">
                            <div class="cardBox" v-for="(item,index) in sceanList" :key="index" @click="clusterMapDis">
                                <div v-if="item.id == 2">
                                    <div class="cardContent">
                                        <p class="cardTitle">{{item.title}}</p>
                                        <p class="cardDetail">{{item.info}}</p>
                                        <el-button type="text" style="color:'#ffffff'" @click="showDetail(item.index)">查看更多>></el-button>
                                    </div>
                                </div>
                            </div>
                        </md-tab>

                        <md-tab id="books" md-label="智慧产业">
                            <div class="cardBox" v-for="(item,index) in sceanList" :key="index" @click="clusterMapDis">
                                <div v-if="item.id == 3">
                                    <div class="cardContent">
                                        <p class="cardTitle">{{item.title}}</p>
                                        <p class="cardDetail">{{item.info}}</p>
                                        <el-button type="text" style="color:'#ffffff'" @click="showDetail(item.index)">查看更多>></el-button>
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
                <p class="dialogTitle">{{sceanData.title}}</p>
                <i class="el-icon-close" @click="closeDialog"></i>
            </div>
            <div class="divider"></div>
            <div class="sceanBox">
                <p class="stepsTitle">① 定义如下:</p>
                <div class="stepsContent">
                    <p class="stepsDetail">{{sceanData.info}}</p>
                </div>
                <p class="stepsTitle">② 图片介绍:</p>
                <div class="stepsContent">
                    <el-popover placement="top" trigger="click" v-for="(item,index) in sceanData.imgList" :key="index">
                        <img class="realImg" :src="item" alt="">
                        <img class="shortcut" slot="reference" :src="item" alt="">
                    </el-popover>
                    <!-- <el-popover placement="top" trigger="click">
                        <img class="realImg" src="../assets/smartGov/内容02.jpg" alt="">
                        <img class="shortcut" slot="reference" src="../assets/smartGov/内容02.jpg" alt="">
                    </el-popover>
                    <el-popover placement="top" trigger="click">
                        <img class="realImg" src="../assets/smartGov/内容03.jpg" alt="">
                        <img class="shortcut" slot="reference" src="../assets/smartGov/内容03.jpg" alt="">
                    </el-popover> -->
                </div>
                <p class="stepsTitle">③ 视频介绍:</p>
                <div class="stepsContent">
                    <!-- <video class="myVideo" src="../assets/smartGov/以人找房.mp4" controls></video> -->
                    <video class="myVideo" :src="sceanData.videoUrl" controls></video>
                </div>
                <p class="stepsTitle">④ 关联企业:</p>
                <div class="stepsContent">
                    <div class="sceanEnterBox">
                        <div class="sceanEnterItems" v-for="item in officeList" :key="item.enterpriseId" @click="showInMapbox(item.enterpriseId)">
                            <p class="enterName">{{item.comName}}</p>
                            <p class="enterP">法人:{{item.contact}}</p>
                            <p class="enterP">注册资金:{{item.money}}万元</p>
                            <p class="enterP">地址:{{item.address}}</p>
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
                    <el-tab-pane  v-for="(item,index) in enterpriseList" :key="index" :label="item.comName">
                        <div class="enterpriseDetail">
                            <jurongEcharts :id="item.comName"></jurongEcharts>
                            <div class="detailBox">
                                <p>法人：{{item.contact}}</p>
                                <p>注册资金：{{item.money}}</p>
                                <p>行业分类：{{item.industry}}</p>
                                <p>纳税：{{item.taxes}}</p>
                                <p>产品：{{item.products}}</p>
                                <p>人才缺口：{{item.host}}</p>
                                <p>地址：{{item.address}}</p>
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
                            <jurongEcharts :id="enterpriseName"></jurongEcharts>
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
import jurongjson from '../assets/distributeFile/句容.json'
import echarts from 'echarts'
import jurongEcharts from '../components/jurongEcharts'
import axios from 'axios'
export default {
    data(){
        return{
            map:'',//地图实例
            switchMap:false,
            navBarList:[
                {
                    id:1,
                    name:'新材料、芯片',
                    icon:'iconfont icon-wangluo'
                },
                {
                    id:2,
                    name:'电子电气技术',
                    icon:'iconfont icon-xinpian'
                },
                {
                    id:3,
                    name:'生物医药',
                    icon:'iconfont icon-modular'
                },
                {
                    id:4,
                    name:'新技术应用',
                    icon:'iconfont icon-zhongduan'
                },
                {
                    id:5,
                    name:'机械制造',
                    icon:'iconfont icon-xitong'
                },
                {
                    id:6,
                    name:'其他加工制造',
                    icon:'iconfont icon-network'
                },
                {
                    id:7,
                    name:'其他',
                    icon:'iconfont icon-quanbu'
                },

            ],// 底部导航栏菜单
            isClick:0,// 默认选择全部
            search:'',//搜索框输入内容
            scean:1,//场景,
            sceanList:[
                {
                    id:1,
                    index:0,
                    imgUrl:require('../assets/images/card1.jpg'),
                    imgList:[require('../assets/smartGov/内容01.jpg'),require('../assets/smartGov/内容02.jpg'),require('../assets/smartGov/内容03.jpg')],
                    title:'人口管理',
                    // videoUrl:require('../videos/以人找房.mp4'),
                    videoUrl:'',
                    info:'人口，法人与房屋进行关联，实现以人找房，以房查人。举例，以一栋楼为例，这栋楼里有131个居民，居民的个人信息上面我们可以查看到，但是有一些个人隐私问题，我们做了脱敏的处理，同时这里面有21个法人，法人的基本信息，他的姓名，联系方式，经营范围，经营方式和成立日期等信息，在上面我们都可以查看到。',
                },
                {
                    id:1,
                    index:1,
                    imgUrl:require('../assets/images/card2.jpg'),
                    imgList:[require('../assets/smartGov/智慧查违图片01.jpg'),require('../assets/smartGov/智慧查违图片02.jpg')],
                    title:'违建查处',
                    // videoUrl:require('../videos/违建查处.mp4'),
                    videoUrl:'',
                    info:'我们将全区的房屋划分成ABC类，现在被标注出来是被评为C类的房屋，C类房屋代表的是存在一定安全隐患建筑，那现在可以随便点击一栋楼，以这栋楼为例,可以看见它具体的位置以及它的安全隐患说明是由它的屋面存在加建的情况，所以这栋楼被评为C类房屋。下面我们可以结合全景图来看一下它具体的违禁情况。操场旁边这个橙色屋顶，是刚刚查看的C类房屋，通过全景图可以明确看见屋面确实存在违法加建。下面演示查违系统，我们的查违通过两种方式，天上通过无人机的巡航对全区的房屋进行拍摄，地上进行人工巡查，我们希望通过天上地上相结合，可以加大我们查违的力度，它是七天一个更新周期，高发区域是三天一个更新。现在两张图片进行对比，右边是2月26日拍摄的画面左边是3月22日的画面，在前期这个位置的是没有进行的屋面加建的情况，在后期在屋顶上搭建起来的。那么两张图片是无人机拍摄之后系统进行自动比对，不需要我们人工进行比对，当系统发现不一样的地方会通过勾圈的方式来提示我们，并且会生成报告发送给相关的执法人员，执法人员会去现场核实情况，那么一旦确定这是违法建筑，会对它进行一个精准的处置。',
                },
                {
                    id:1,
                    index:2,
                    imgUrl:require('../assets/images/card2.jpg'),
                    imgList:[require('../assets/smartGov/智慧警务图片01.jpeg'),require('../assets/smartGov/智慧警务图片02.jpeg')],
                    title:'视频布控',
                    // videoUrl:require('../assets/smartGov/智慧警务.mp4'),
                    // videoUrl:require('../videos/视频布控.mp4'),
                    videoUrl:'',
                    info:'龙岗区的警务非常出名，号称24小时破案，通过我们四点五万高清探头85%的案件都能够采集到视频的线索，67%的破案都有视频提供线索，高清探头会分布在我们的学校，医院，车站等重要场所，目前我们展示的只是一部分画面，如果需要调取更多方面的画面是需要一定的权限，同时我们实现了掌上天眼功能，也就是三万多个高清摄像头已经出现在了区领导的手机端口，领导可以通过手机端来查看一些重点场所实施情况。',
                },
                {
                    id:1,
                    index:2,
                    imgUrl:require('../assets/images/card2.jpg'),
                    imgList:[require('../assets/smartGov/智慧警务图片01.jpeg'),require('../assets/smartGov/智慧警务图片02.jpeg')],
                    title:'城区管理',
                    // videoUrl:require('../assets/smartGov/智慧警务.mp4'),
                    // videoUrl:require('../videos/城区管理.mp4'),
                    videoUrl:'',
                    info:'这个系统是龙岗新型智慧城区运行管理中心，它简称为LC，它的定位是我的城市大脑，通过各部门数据汇总分析，打造一个科学决策精准调度的信息平台。它分成了七个板块，第一个板块龙岗概况，主要介绍的是龙岗区的区情区貌，行政区划，气候，人口，交通等数据。第二个板块经济创新，则是各职能部门都比较关注经济指标在上面可以看到收视主体，高新技术，企业，上市企业等数据统计。第三个板块是消防安全和生产安全，它是通过物联网传感技术监测到的数据进行分析，通过我们的41万台感知设备实时监管安全生产培训，目前的形势是呈下降的趋势。第四个板块是城区治理，具体的主要是我们城管局对接过来的数据，我们的网格员采集完数据会上传到分拨中心，分拨中心会自动传到相关职能部门系统，他们学习完毕之后会再反馈回来。第五个板块是政务服务，主要显示区大厅的实时办事量和OA办文情况，还有一个数据共享交换平台。最后两个板块是民生幸福，人居环境，现在是建设一期，再做数据汇集和共享。LC的功能有：态势感知，监测预警，决策分析，综合治理，联动指挥。我们这个城市大脑是必须五大功能紧密相结合才能发挥优势，从发现问题到分析问题，再到解决问题的闭环式的管理，为我们的领导在做一些决策的时候，提供数据支持，做到最精准的调度。',
                },
                {
                    id:1,
                    index:2,
                    imgUrl:require('../assets/images/card2.jpg'),
                    imgList:[require('../assets/smartGov/智慧警务图片01.jpeg'),require('../assets/smartGov/智慧警务图片02.jpeg')],
                    title:'服务机器人',
                    // videoUrl:require('../assets/smartGov/智慧警务.mp4'),
                    // videoUrl:require('../videos/服务机器人.mp4'),
                    videoUrl:'',
                    info:'本款机器人是研究院有限公司自主研发的第二代服务机器人，集声音、视频、行走于一体，具有人机交互、监控摄像、面部识别、自主导航、主动避障、自动充电、EMO急停安全制动装置、多操作系统移动终端控制操作等主流先进技术并可根据客户具体应用场景量身定制个性化的功能及相关应用。应用场景包括银行、政务大厅、税务大厅、公共资源交易中心、医院、机场、商业综合体等。',
                },
                {
                    id:1,
                    index:2,
                    imgUrl:require('../assets/images/card2.jpg'),
                    imgList:[require('../assets/smartGov/智慧警务图片01.jpeg'),require('../assets/smartGov/智慧警务图片02.jpeg')],
                    title:'综合治理',
                    // videoUrl:require('../assets/smartGov/智慧警务.mp4'),
                    videoUrl:'',
                    info:'城市安全综合治理运营中心通过物联网技术汇聚城市数据、面向城市交通运输、通信信息、能源动力、市政基础设施、环境保护、应急防灾六大城市基础设施系统安全管理。从多个方向、多角度对于城市安全问题进行综合治理，保障城市经济、社会和环境的协调发展。',
                },
                {
                    id:2,
                    index:3,
                    imgUrl:require('../assets/images/card3.jpg'),
                    title:'智慧校园',
                    info:'人口，法人与房屋进行关联，实现以人找房，以房查人。举例，以一栋楼为例，这栋楼里有131个居民，居民的个人信息上面我们可以查看到，但是有一些个人隐私问题，我们做了脱敏的处理，同时这里面有21个法人，法人的基本信息，他的姓名，联系方式，经营范围，经营方式和成立日期等信息，在上面我们都可以查看到。',
                },
                {
                    id:2,
                    index:4,
                    imgUrl:require('../assets/images/card4.jpg'),
                    title:'智慧城市',
                    info:'人口，法人与房屋进行关联，实现以人找房，以房查人。举例，以一栋楼为例，这栋楼里有131个居民，居民的个人信息上面我们可以查看到，但是有一些个人隐私问题，我们做了脱敏的处理，同时这里面有21个法人，法人的基本信息，他的姓名，联系方式，经营范围，经营方式和成立日期等信息，在上面我们都可以查看到。',
                },
                {
                    id:2,
                    index:5,
                    imgUrl:require('../assets/images/card4.jpg'),
                    title:'智慧城市',
                    info:'人口，法人与房屋进行关联，实现以人找房，以房查人。举例，以一栋楼为例，这栋楼里有131个居民，居民的个人信息上面我们可以查看到，但是有一些个人隐私问题，我们做了脱敏的处理，同时这里面有21个法人，法人的基本信息，他的姓名，联系方式，经营范围，经营方式和成立日期等信息，在上面我们都可以查看到。',
                },
                {
                    id:3,
                    index:6,
                    imgUrl:require('../assets/images/card5.jpg'),
                    title:'智能制造',
                    info:'人口，法人与房屋进行关联，实现以人找房，以房查人。举例，以一栋楼为例，这栋楼里有131个居民，居民的个人信息上面我们可以查看到，但是有一些个人隐私问题，我们做了脱敏的处理，同时这里面有21个法人，法人的基本信息，他的姓名，联系方式，经营范围，经营方式和成立日期等信息，在上面我们都可以查看到。',
                },
                {
                    id:3,
                    index:7,
                    imgUrl:require('../assets/images/card6.jpg'),
                    title:'AI技术',
                    info:'人口，法人与房屋进行关联，实现以人找房，以房查人。举例，以一栋楼为例，这栋楼里有131个居民，居民的个人信息上面我们可以查看到，但是有一些个人隐私问题，我们做了脱敏的处理，同时这里面有21个法人，法人的基本信息，他的姓名，联系方式，经营范围，经营方式和成立日期等信息，在上面我们都可以查看到。',
                },
                {
                    id:3,
                    index:8,
                    imgUrl:require('../assets/images/card6.jpg'),
                    title:'AI技术',
                    info:'人口，法人与房屋进行关联，实现以人找房，以房查人。举例，以一栋楼为例，这栋楼里有131个居民，居民的个人信息上面我们可以查看到，但是有一些个人隐私问题，我们做了脱敏的处理，同时这里面有21个法人，法人的基本信息，他的姓名，联系方式，经营范围，经营方式和成立日期等信息，在上面我们都可以查看到。',
                }
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
            ContactInfo:{}
        }
    },
    components:{
        jurongEcharts
    },
    mounted(){
        this.initMap()
        this.getRadarEnterprise()
        this.getOutputValue()
        this.getEnterpriseMode()
    },
    methods:{
        initMap(){
            mapboxgl.accessToken = 'pk.eyJ1Ijoibnl5anl5YW5mYXBlbmciLCJhIjoiY2p3ajU4eXI2MGdxcDQ4cGI4cHI2bHhjcSJ9.m4FzyOH_5Yo3YVnroLxk-w';
            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'http://106.15.47.224:8688/styles/newblue/style.json',
                center: [119.1686460000,31.9448328300],
                zoom: 10.0,
                pitch:60,
                bearing:-0.03
            });
            this.map.on("styledata", ()=>{
                this.getAllDistribute();
                this.getJurongDistribute();
            })
            // setTimeout(()=>{
            //     // this.setISP()
            //     this.getAllDistribute()
            //     this.getJurongDistribute()
            // },1000)
        },
        setMapTheme(){
            if(this.switchMap){
                this.map.setStyle('mapbox://styles/mapbox/satellite-streets-v11')
            }else{
                this.map.setStyle('http://106.15.47.224:8688/styles/newblue/style.json') 
            }
        },
        getItemData(params){
            this.isClick = params
            console.log(params)
            let total = [102.3,20.8,38.6,85.6,65.1,21.5,98.5,581.95]
            this.totalValue = total[params-1]

            let disData={
                "type": "FeatureCollection",
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                    },
                },
                "features":[]
            }
            let testList = []
            
            for(let i=0;i<jurongjson.features.length;i++){
                for(let j = 0;j<jurongjson.features[i].properties.test.length;j++){
                    if(params == jurongjson.features[i].properties.test[j].type){
                        testList.push(jurongjson.features[i].properties.test[j])
                    }
                }
                disData.features.push({
                    "type": "Feature",
                    "properties": {
                        "id": jurongjson.features[i].properties.id,
                        "mag": testList.length,
                        "time": 1507425650893,
                        "felt": null,
                        "tsunami": 0,
                        test:testList
                    },
                    "geometry": jurongjson.features[i].geometry
                })
            }

            this.map.getSource('earthquakes').setData(disData)
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
                        { name: '材料', max: 6500},
                        { name: '电子', max: 16000},
                        { name: '生物', max: 30000},
                        { name: '新技术', max: 38000},
                        { name: '机械', max: 52000},
                        { name: '加工', max: 25000},
                        { name: '其他', max: 25000}
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
                    data:['材料','电子','生物','新技术','机械','加工','其他'],
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
                    data:['材料','电子','生物','新技术','机械','加工','其他'],
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
                            {value:1548, name:'材料',itemStyle:{
                                color:'#F2F16E'
                            }},
                            {value:310, name:'电子',itemStyle:{
                                color:'#F2B765'
                            }},
                            {value:234, name:'生物',itemStyle:{
                                color:'#00DBB1'
                            }},
                            {value:135, name:'新技术',itemStyle:{
                                color:'#CC496D'
                            }},
                            {value:1548, name:'机械',itemStyle:{
                                color:'#BC808B'
                            }},
                            {value:1048, name:'加工',itemStyle:{
                                color:'#1679D4'
                            }},
                            {value:1288, name:'其他',itemStyle:{
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
        showDetail(index){
            console.log(index)
            this.sceanFlag = true
            this.sceanList.forEach(l=>{
                if(l.index === index){
                    this.sceanData = l
                }
            })
            this.officeList = [
                {"index":"43","comName":"句容市水务集团有限公司","country":"开发区","contact":"俞  婷","telphone":"15996824731","money":"6000","time":"2014","address":"华阳西路88号","industry":"","products":"电风扇取暖器","income":"1520","taxes":"538","host":"质检员5名，市场营销10名，研发工程师6名，设备工程师10名","remarks":"规上","type":"5","demostrate":""},
                {"index":"24","comName":"江苏海祥消防科技有限公司","country":"开发区","contact":"唐枚娟","telphone":"18952995528","money":"1000万","time":"2015年","address":"崇明西路容宁创业园1#厂房","industry":"消防设备","products":"消防设备、船用设备、机械设备","income":"1050万","taxes":"49万","host":"机械工程师、电气工程师","remarks":"高企","type":"6","demostrate":""},
                {"index":"47","comName":"江苏圣通电力新能源科技有限公司","country":"开发区","contact":"戴雯雯","telphone":"18168588887","money":"11000","time":"2007.8.27","address":"句容经济开发区西二环乡镇工业园区","industry":"新能源","products":"高低压成套设备、智慧路灯","income":"11696","taxes":"117","host":"配电网设计师4名，输电电气设计师2名，输电结构设计师2名","remarks":"规上","type":"2","demostrate":""},
                {"index":"54","comName":"句容华润燃气有限公司","country":"开发区","contact":"尹纪维","telphone":"15162999270","money":"2000","time":"39661","address":"开发区宁杭北路60号","industry":"天然气销售","products":"生产燃气、燃气工程施工","income":"22538","taxes":"2410.38","host":"需要","remarks":"规上","type":"7","demostrate":""}
            ]
        },
        // 点击场景设置图层数据
        clusterMapDis(){
            let disData={
                "type": "FeatureCollection",
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                    },
                },
                "features":[{
                    "type": "Feature",
                    "properties": {
                        "id": '开发区',
                        "mag": 4,
                        "time": 1507425650893,
                        "felt": null,
                        "tsunami": 0,
                        test:[
                            {"index":"43","comName":"句容市水务集团有限公司","country":"开发区","contact":"俞  婷","telphone":"15996824731","money":"6000","time":"2014","address":"华阳西路88号","industry":"","products":"电风扇取暖器","income":"1520","taxes":"538","host":"质检员5名，市场营销10名，研发工程师6名，设备工程师10名","remarks":"规上","type":"5","demostrate":""},
                            {"index":"24","comName":"江苏海祥消防科技有限公司","country":"开发区","contact":"唐枚娟","telphone":"18952995528","money":"1000万","time":"2015年","address":"崇明西路容宁创业园1#厂房","industry":"消防设备","products":"消防设备、船用设备、机械设备","income":"1050万","taxes":"49万","host":"机械工程师、电气工程师","remarks":"高企","type":"6","demostrate":""},
                            {"index":"47","comName":"江苏圣通电力新能源科技有限公司","country":"开发区","contact":"戴雯雯","telphone":"18168588887","money":"11000","time":"2007.8.27","address":"句容经济开发区西二环乡镇工业园区","industry":"新能源","products":"高低压成套设备、智慧路灯","income":"11696","taxes":"117","host":"配电网设计师4名，输电电气设计师2名，输电结构设计师2名","remarks":"规上","type":"2","demostrate":""},
                            {"index":"54","comName":"句容华润燃气有限公司","country":"开发区","contact":"尹纪维","telphone":"15162999270","money":"2000","time":"39661","address":"开发区宁杭北路60号","industry":"天然气销售","products":"生产燃气、燃气工程施工","income":"22538","taxes":"2410.38","host":"需要","remarks":"规上","type":"7","demostrate":""}
                        ]
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [119.1582369000, 31.9480427100]
                    }
                }]
            }
            this.map.getSource('earthquakes').setData(disData)
            
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
            var mag1 = ["<", ["get", "mag"], 5];
            var mag2 = ["all", [">=", ["get", "mag"], 10], ["<", ["get", "mag"], 20]];
            var mag3 = ["all", [">=", ["get", "mag"], 20], ["<", ["get", "mag"], 30]];
            var mag4 = ["all", [">=", ["get", "mag"], 30], ["<", ["get", "mag"], 40]];
            var mag5 = [">=", ["get", "mag"], 40];
            if(!this.map.getSource("earthquakes")){
                this.map.addSource('earthquakes', {
                    "type": "geojson",
                    "data": jurongjson,
                    "cluster": false,
                    "clusterRadius": 80,
                    "clusterProperties": { // keep separate counts for each magnitude category in a cluster
                        "mag1": ["+", ["case", mag1, 1, 0]],
                        "mag2": ["+", ["case", mag2, 1, 0]],
                        "mag3": ["+", ["case", mag3, 1, 0]],
                        "mag4": ["+", ["case", mag4, 1, 0]],
                        "mag5": ["+", ["case", mag5, 1, 0]]
                    }
                });
            }
            if(!this.map.getLayer("earthquake_circle")){
                this.map.addLayer({
                    "id": "earthquake_circle",
                    "type": "circle",
                    "source": "earthquakes",
                    "filter": ["!=", "cluster", true],
                    "paint": {
                        "circle-color": ["case",
                        mag1, this.colors[0],
                        mag2, this.colors[1],
                        mag3, this.colors[2],
                        mag4, this.colors[3], this.colors[4]],
                        "circle-opacity": 0.6,
                        "circle-radius": 20
                    }
                });
            }
            if(!this.map.getLayer("earthquake_label")){
                this.map.addLayer({
                    "id": "earthquake_label",
                    "type": "symbol",
                    "source": "earthquakes",
                    "filter": ["!=", "cluster", true],
                    "layout": {
                        "text-field": ["number-format", ["get", "mag"], {"min-fraction-digits": 0, "max-fraction-digits": 1}],
                        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                        "text-size": 18
                    },
                    "paint": {
                        "text-color": ["case", ["<", ["get", "mag"], 3], "black", "white"]
                    }
                });
            }
            this.map.on('data', (e)=> {
                if (e.sourceId !== 'earthquakes' || !e.isSourceLoaded) {
                    return;
                }
                this.map.on('move', this.updateMarkers);
                this.map.on('moveend',this.updateMarkers);
                this.map.on('click','earthquake_label',this.handleMarkerClick);
                this.updateMarkers();
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
            // console.log(e);
            setTimeout(()=>{
                this.enterpriseFlag = true
            })
            
            const map = e.target;
            // console.log(map);
            const features = map.queryRenderedFeatures(e.point,  { layers: ['earthquake_label'] });
            console.log(features);
            this.parkName = features[0].properties.id
            if (features.length > 0){
                const enterList = JSON.parse(features[0].properties.test)
                console.log(enterList)
                this.enterpriseList = JSON.parse(features[0].properties.test)
                this.getQichachaData(this.enterpriseList[0].comName)
            }
            setTimeout(()=>{
                this.getSomeOneRadarEnterprise()
                
            },2000)
            
        },
        handleTabClick(tab,event){
            console.log(tab.label)
            this.getQichachaData(tab.label)
            console.log(this.activeIndex)
            console.log(this.enterpriseList[this.activeIndex].elements)
            this.elementsList = this.enterpriseList[this.activeIndex].elements.split(" ")
        },
        getJurongDistribute(){
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
                                coordinates: [
                                    [119.24166, 32.2163],
                                    [119.25043, 32.21223],
                                    [119.26978, 32.19987],
                                    [119.27148, 32.19419],
                                    [119.26344, 32.18608],
                                    [119.2508, 32.17783],
                                    [119.24735, 32.15931],
                                    [119.24582, 32.14236],
                                    [119.24676, 32.13706],
                                    [119.25044, 32.13332],
                                    [119.26573, 32.1297],
                                    [119.26992, 32.12237],
                                    [119.27379, 32.11972],
                                    [119.27792, 32.10649],
                                    [119.29546, 32.09821],
                                    [119.29923, 32.09349],
                                    [119.31037, 32.09695],
                                    [119.31923, 32.0913],
                                    [119.32536, 32.08963],
                                    [119.33612, 32.07834],
                                    [119.33999, 32.07162],
                                    [119.34742, 32.06735],
                                    [119.36083, 32.06367],
                                    [119.3624, 32.06227],
                                    [119.36735, 32.05599],
                                    [119.36912, 32.0516],
                                    [119.37144, 32.03802],
                                    [119.37527, 32.03038],
                                    [119.37668, 32.02278],
                                    [119.37651, 32.01682],
                                    [119.36667, 32.00232],
                                    [119.36831, 31.99814],
                                    [119.37792, 31.98815],
                                    [119.38069, 31.98303],
                                    [119.38278, 31.97427],
                                    [119.37933, 31.96863],
                                    [119.37602, 31.96689],
                                    [119.36311, 31.96769],
                                    [119.35217, 31.96407],
                                    [119.34732, 31.95709],
                                    [119.34426, 31.94067],
                                    [119.34579, 31.92413],
                                    [119.33889, 31.90575],
                                    [119.33894, 31.87848],
                                    [119.33848, 31.87441],
                                    [119.33659, 31.87147],
                                    [119.33721, 31.86342],
                                    [119.33939, 31.85859],
                                    [119.32992, 31.84935],
                                    [119.32959, 31.84539],
                                    [119.33422, 31.84121],
                                    [119.33263, 31.83635],
                                    [119.32041, 31.82598],
                                    [119.31381, 31.81384],
                                    [119.31609, 31.81255],
                                    [119.31694, 31.81024],
                                    [119.31353, 31.79883],
                                    [119.31521, 31.79611],
                                    [119.31942, 31.79457],
                                    [119.31824, 31.78724],
                                    [119.31976, 31.78482],
                                    [119.31433, 31.77961],
                                    [119.30466, 31.76558],
                                    [119.30658, 31.75116],
                                    [119.30567, 31.73304],
                                    [119.30905, 31.73171],
                                    [119.32169, 31.73258],
                                    [119.32372, 31.7319],
                                    [119.33, 31.72531],
                                    [119.3292, 31.72305],
                                    [119.3236, 31.71978],
                                    [119.3216, 31.71554],
                                    [119.32484, 31.71014],
                                    [119.32108, 31.70763],
                                    [119.32887, 31.70367],
                                    [119.32443, 31.68918],
                                    [119.31653, 31.67101],
                                    [119.2999, 31.65474],
                                    [119.28892, 31.64898],
                                    [119.28279, 31.6428],
                                    [119.27677, 31.64132],
                                    [119.25837, 31.6322],
                                    [119.23695, 31.62521],
                                    [119.23356, 31.62773],
                                    [119.23251, 31.63227],
                                    [119.22726, 31.6301],
                                    [119.22234, 31.6302],
                                    [119.21658, 31.62781],
                                    [119.21242, 31.62772],
                                    [119.21178, 31.63344],
                                    [119.20622, 31.63709],
                                    [119.20672, 31.64384],
                                    [119.20474, 31.64664],
                                    [119.18732, 31.64915],
                                    [119.18619, 31.65151],
                                    [119.19228, 31.65983],
                                    [119.18744, 31.66682],
                                    [119.18607, 31.67145],
                                    [119.18662, 31.67766],
                                    [119.1902, 31.68314],
                                    [119.19041, 31.68706],
                                    [119.18643, 31.69412],
                                    [119.16908, 31.69788],
                                    [119.16795, 31.69918],
                                    [119.1577, 31.69938],
                                    [119.1562, 31.70424],
                                    [119.15117, 31.70296],
                                    [119.1502, 31.70876],
                                    [119.13868, 31.7221],
                                    [119.13057, 31.72227],
                                    [119.125, 31.73579],
                                    [119.12058, 31.73877],
                                    [119.11443, 31.74026],
                                    [119.11055, 31.74457],
                                    [119.10888, 31.74686],
                                    [119.11082, 31.75136],
                                    [119.10924, 31.75256],
                                    [119.10541, 31.75135],
                                    [119.09401, 31.75606],
                                    [119.0928, 31.76274],
                                    [119.08965, 31.76996],
                                    [119.08579, 31.77396],
                                    [119.07752, 31.77413],
                                    [119.07819, 31.78161],
                                    [119.07711, 31.78395],
                                    [119.06971, 31.78386],
                                    [119.06888, 31.78191],
                                    [119.06576, 31.78195],
                                    [119.05564, 31.78897],
                                    [119.04165, 31.78809],
                                    [119.03497, 31.78366],
                                    [119.02968, 31.78471],
                                    [119.02155, 31.77861],
                                    [119.01721, 31.77848],
                                    [119.01519, 31.77484],
                                    [119.00929, 31.77869],
                                    [119.00644, 31.77882],
                                    [118.99931, 31.76734],
                                    [118.99572, 31.76862],
                                    [118.99121, 31.76552],
                                    [118.98413, 31.76407],
                                    [118.98046, 31.76466],
                                    [118.97934, 31.76691],
                                    [118.98292, 31.77493],
                                    [118.98203, 31.77804],
                                    [118.98279, 31.7833],
                                    [118.9855, 31.78445],
                                    [119.00293, 31.78344],
                                    [119.00788, 31.79234],
                                    [119.00606, 31.79385],
                                    [119.00636, 31.79862],
                                    [118.99816, 31.80167],
                                    [118.99267, 31.80888],
                                    [118.99195, 31.8127],
                                    [118.99003, 31.81281],
                                    [118.98641, 31.81787],
                                    [118.97864, 31.82255],
                                    [118.97128, 31.82471],
                                    [118.97039, 31.82608],
                                    [118.97291, 31.82979],
                                    [118.9708, 31.83099],
                                    [118.96945, 31.8346],
                                    [118.97156, 31.83642],
                                    [118.97782, 31.83626],
                                    [118.97933, 31.83823],
                                    [118.97966, 31.84235],
                                    [118.99227, 31.84414],
                                    [118.99691, 31.8428],
                                    [119.00338, 31.84578],
                                    [119.02591, 31.84636],
                                    [119.03281, 31.85375],
                                    [119.04337, 31.85442],
                                    [119.04586, 31.8584],
                                    [119.05593, 31.86113],
                                    [119.06895, 31.86916],
                                    [119.07346, 31.86473],
                                    [119.09356, 31.86038],
                                    [119.1007, 31.86624],
                                    [119.1033, 31.87799],
                                    [119.10778, 31.88514],
                                    [119.11504, 31.88859],
                                    [119.11703, 31.89283],
                                    [119.11669, 31.89904],
                                    [119.11118, 31.90164],
                                    [119.11268, 31.90683],
                                    [119.11003, 31.91066],
                                    [119.10844, 31.92298],
                                    [119.10563, 31.92882],
                                    [119.10151, 31.93273],
                                    [119.08988, 31.93132],
                                    [119.08495, 31.93591],
                                    [119.07688, 31.93672],
                                    [119.06721, 31.9403],
                                    [119.0553, 31.93955],
                                    [119.05199, 31.93609],
                                    [119.04608, 31.93601],
                                    [119.03752, 31.93899],
                                    [119.02933, 31.95027],
                                    [119.02924, 31.95709],
                                    [119.0344, 31.96226],
                                    [119.04152, 31.96363],
                                    [119.04663, 31.96866],
                                    [119.0531, 31.96877],
                                    [119.06489, 31.97342],
                                    [119.07042, 31.97236],
                                    [119.07497, 31.96935],
                                    [119.08285, 31.97424],
                                    [119.09012, 31.97413],
                                    [119.10024, 31.96709],
                                    [119.10567, 31.96516],
                                    [119.10794, 31.96579],
                                    [119.11088, 31.96908],
                                    [119.11255, 31.97807],
                                    [119.11392, 31.97984],
                                    [119.12113, 31.97755],
                                    [119.12164, 31.98482],
                                    [119.11468, 31.9872],
                                    [119.11423, 31.99827],
                                    [119.11248, 32.00045],
                                    [119.10263, 32.0056],
                                    [119.10087, 32.00232],
                                    [119.09319, 32.0027],
                                    [119.09236, 32.00412],
                                    [119.0979, 32.01124],
                                    [119.09637, 32.01833],
                                    [119.09448, 32.02112],
                                    [119.09494, 32.02799],
                                    [119.09234, 32.03222],
                                    [119.09267, 32.03762],
                                    [119.08774, 32.04563],
                                    [119.08662, 32.05321],
                                    [119.09284, 32.06033],
                                    [119.09851, 32.07162],
                                    [119.10018, 32.08883],
                                    [119.09694, 32.09205],
                                    [119.08975, 32.0897],
                                    [119.08639, 32.09224],
                                    [119.08124, 32.1003],
                                    [119.07978, 32.10732],
                                    [119.06926, 32.10792],
                                    [119.05732, 32.10225],
                                    [119.05524, 32.10419],
                                    [119.05015, 32.10442],
                                    [119.05136, 32.1055],
                                    [119.04927, 32.11024],
                                    [119.0468, 32.10986],
                                    [119.0478, 32.10765],
                                    [119.04644, 32.10914],
                                    [119.04644, 32.10779],
                                    [119.04498, 32.10815],
                                    [119.04494, 32.11024],
                                    [119.04218, 32.10827],
                                    [119.04391, 32.11007],
                                    [119.04262, 32.11032],
                                    [119.04538, 32.11154],
                                    [119.04028, 32.112],
                                    [119.03723, 32.11431],
                                    [119.03254, 32.11402],
                                    [119.02665, 32.11596],
                                    [119.01763, 32.11404],
                                    [119.00889, 32.11594],
                                    [119.00852, 32.11767],
                                    [119.0111, 32.1204],
                                    [119.01103, 32.12581],
                                    [119.01603, 32.12848],
                                    [119.02091, 32.12914],
                                    [119.02781, 32.14193],
                                    [119.03287, 32.14597],
                                    [119.03175, 32.14866],
                                    [119.03828, 32.15573],
                                    [119.05135, 32.16083],
                                    [119.05964, 32.16201],
                                    [119.07601, 32.16168],
                                    [119.07695, 32.17066],
                                    [119.07926, 32.17493],
                                    [119.07646, 32.17608],
                                    [119.07866, 32.17873],
                                    [119.0869, 32.17851],
                                    [119.11928, 32.18646],
                                    [119.12438, 32.19014],
                                    [119.13529, 32.19346],
                                    [119.15667, 32.18582],
                                    [119.17274, 32.18676],
                                    [119.18455, 32.18963],
                                    [119.19108, 32.18542],
                                    [119.19666, 32.18509],
                                    [119.21626, 32.1907],
                                    [119.2214, 32.20111],
                                    [119.23615, 32.21041],
                                    [119.24166, 32.2163]
                                    ]
                            }
                        }
                    ]
                }
            }
            this.map.addSource('dottedline',dottedLine);
            this.map.addLayer({
                'id': 'dottedline',
                'type': 'line',
                'source':'dottedline',
                'paint': {
                    'line-dasharray':[4,3],
                    'line-width': 4,
                    'line-color': ['get', 'color']
                }
            });
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
            axios.post('http://120.55.161.93:6011/qichacha/industryDetail?name='+name)
            .then(res=>{
                console.log(res.data.Result)
                this.CompanyProducts = res.data.result.Result.CompanyProducts
                this.Employees = res.data.result.Result.Employees
                this.Industry = res.data.result.Result.Industry
                this.Partners = res.data.result.Result.Partners
                this.ScopeIn = res.data.result.Result.Scope
                this.legalPerson = res.data.result.Result.OperName
                this.ContactInfo = res.data.result.Result.ContactInfo
                axios.post("http://120.55.161.93:6011/qichacha/getPatentCount?name="+name)
                .then(res=>{
                    this.knowledge = res.data.result
                })
            })
        },
        showInMapbox(params){
            this.sceanFlag = false
            let sceanEnterPrise = []
            jurongjson.features.forEach(l=>{
                l.properties.test.forEach(el=>{
                    if(params === el.enterpriseId){
                        console.log(el)
                        sceanEnterPrise.push(el)
                        this.searchReault.features[0].properties.test = sceanEnterPrise
                        this.searchReault.features[0].properties.id = l.properties.id
                        this.searchReault.features[0].geometry.coordinates = l.geometry.coordinates
                    }
                })
            })
            console.log(this.searchReault)
            this.map.flyTo({
                center:this.searchReault.features[0].geometry.coordinates,
                zoom: 15
            })
            this.map.getSource('earthquakes').setData(this.searchReault)
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
        justify-content: space-between;
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
        width: 130px;
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
        width: 130px;
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