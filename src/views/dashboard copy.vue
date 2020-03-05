<template>
    <div id="map">
        <div class="headerBox">
            <img src="../../src/assets/images/logo.png" alt="">
            <p class="title">中国(南京)智谷产业生态分布图</p>
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
                    <p class="headerTitle">企业分类</p>
                </div>
                <div id="enterprise"></div>
            </div>
            <div class="leftItemsBox">
                <div class="leftheaderBox">
                    <p class="headerTitle">人工智能产业规模</p>
                </div>
                <!-- <div id="mode"></div> -->
                <div class="modeBox">
                    <van-circle :clockwise="false" v-model="circle.alogthom" :rate="30" size="100px" :stroke-width="60"  layer-color="#101B26" color="#1679D5" text="算法"/>
                    <van-circle :clockwise="false" v-model="circle.IDcard" :rate="30" size="100px" :stroke-width="60" layer-color="#101B26" color="#00DBB1" text="芯片"/>
                    <van-circle :clockwise="false" v-model="circle.model" :rate="80" size="100px" :stroke-width="60" layer-color="#101B26" color="#FFE171" text="模块"/>
                    <van-circle :clockwise="false" v-model="circle.last" :rate="40" size="100px" :stroke-width="60" layer-color="#101B26" color="#FF83F1" text="终端"/>
                    <van-circle :clockwise="false" v-model="circle.system" :rate="60" size="100px" :stroke-width="60" layer-color="#101B26" color="#BC808B" text="系统"/>
                    <van-circle :clockwise="false" v-model="circle.network" :rate="70" size="100px" :stroke-width="60" layer-color="#101B26" color="#F3B865" text="网络"/>
                    <van-circle :clockwise="false" v-model="circle.box" :rate="20" size="100px" :stroke-width="60" layer-color="#101B26" color="#CC496D" text="平台"/>
                </div>
            </div>
        </div>
        <div class="rightBox">
            <el-input v-model="search" placeholder="请输入企业名称或企业类型" @input="getSearchResult">
                <el-button slot="append" icon="el-icon-search" @click="getSearchResult"></el-button>
            </el-input>
            <div style="height:20px"></div>
            <div class="leftheaderBox">
                <p class="headerTitle">中国(南京)智谷标志性场景</p>
            </div>
            <div class="content">
                <el-select v-model="scean" style="width:100%" placeholder="请选择应用场景">
                    <el-option label="智慧政务" value="1"></el-option>
                    <el-option label="智慧民生" value="2"></el-option>
                    <el-option label="智慧产业" value="3 "></el-option>
                </el-select>
                <div class="cardBox" v-for="(item,index) in sceanList" :key="index" >
                    <div v-if="item.id == scean">
                        <img class="carImg" :src="item.imgUrl" alt="">
                        <div class="cardContent">
                            <p class="cardTitle">{{item.title}}</p>
                            <p class="cardDetail">{{item.info}}</p>
                            <el-button type="text" @click="showDetail(item.index)">查看更多>></el-button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        <div class="sceanDetailDialog" v-if="sceanFlag">
            <div class="sceanDialogHeader">
                <p class="dialogTitle">{{sceanData.title}}</p>
                <i class="el-icon-close" @click="closeDialog"></i>
            </div>
            <div class="divider"></div>
            <div>
                <el-popover placement="top" trigger="click">
                    <img class="realImg" src="../assets/smartGov/内容01.jpg" alt="">
                    <img class="shortcut" slot="reference" src="../assets/smartGov/内容01.jpg" alt="">
                </el-popover>
                <el-popover placement="top" trigger="click">
                    <img class="realImg" src="../assets/smartGov/内容02.jpg" alt="">
                    <img class="shortcut" slot="reference" src="../assets/smartGov/内容02.jpg" alt="">
                </el-popover>
                <el-popover placement="top" trigger="click">
                    <img class="realImg" src="../assets/smartGov/内容03.jpg" alt="">
                    <img class="shortcut" slot="reference" src="../assets/smartGov/内容03.jpg" alt="">
                </el-popover>
                <video class="myVideo" src="../assets/smartGov/以人找房.mp4" controls></video>
            </div>
            <div class="divider"></div>
            <div class="sceanInfo">
                <p>{{sceanData.info}}</p>
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
                                <p>法人：{{item.legalPerson}}</p>
                                <p>注册资金：{{item.registeredCapital}}万元</p>
                                <p>AI方向：{{item.AIbusiness}}</p>
                                <p>主营业务：{{item.content}}</p>
                                <p>所属区：{{item.Itsarea}}</p>
                                <p>地址：{{item.area}}</p>
                            </div>
                        </div>
                       <div class="tagBox">
                            <el-tag v-for="(item,index) in elementsList" :key="index">{{item}}</el-tag>
                       </div>
                    </el-tab-pane>
                </el-tabs>
                
            </div>
        </div>
    </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import parkList from '../jsonFile/汇总.json'
import algorithm from '../assets/distributeFile/算法.json'
import idCard from '../assets/distributeFile/芯片.json'
import model from '../assets/distributeFile/模块.json'
import system from '../assets/distributeFile/系统.json'
import network from '../assets/distributeFile/网络.json'
import platform from '../assets/distributeFile/平台.json'
import terminal from '../assets/distributeFile/终端.json'
import echarts from 'echarts'
import singleEcharts from '../components/singleEcharts'
export default {
    data(){
        return{
            map:'',//地图实例
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
            scean:'1',//场景,
            sceanList:[
                {
                    id:1,
                    index:0,
                    imgUrl:require('../assets/images/card1.jpg'),
                    title:'智慧城市人口管理',
                    info:'人口，法人与房屋进行关联，实现以人找房，以房查人。举例，以一栋楼为例，这栋楼里有131个居民，居民的个人信息上面我们可以查看到，但是有一些个人隐私问题，我们做了脱敏的处理，同时这里面有21个法人，法人的基本信息，他的姓名，联系方式，经营范围，经营方式和成立日期等信息，在上面我们都可以查看到。',
                },
                {
                    id:1,
                    index:1,
                    imgUrl:require('../assets/images/card2.jpg'),
                    title:'智慧公安',
                    info:'人口，法人与房屋进行关联，实现以人找房，以房查人。举例，以一栋楼为例，这栋楼里有131个居民，居民的个人信息上面我们可以查看到，但是有一些个人隐私问题，我们做了脱敏的处理，同时这里面有21个法人，法人的基本信息，他的姓名，联系方式，经营范围，经营方式和成立日期等信息，在上面我们都可以查看到。',
                },
                {
                    id:2,
                    index:2,
                    imgUrl:require('../assets/images/card3.jpg'),
                    title:'智慧校园',
                    info:'人口，法人与房屋进行关联，实现以人找房，以房查人。举例，以一栋楼为例，这栋楼里有131个居民，居民的个人信息上面我们可以查看到，但是有一些个人隐私问题，我们做了脱敏的处理，同时这里面有21个法人，法人的基本信息，他的姓名，联系方式，经营范围，经营方式和成立日期等信息，在上面我们都可以查看到。',
                },
                {
                    id:2,
                    index:3,
                    imgUrl:require('../assets/images/card4.jpg'),
                    title:'智慧城市',
                    info:'人口，法人与房屋进行关联，实现以人找房，以房查人。举例，以一栋楼为例，这栋楼里有131个居民，居民的个人信息上面我们可以查看到，但是有一些个人隐私问题，我们做了脱敏的处理，同时这里面有21个法人，法人的基本信息，他的姓名，联系方式，经营范围，经营方式和成立日期等信息，在上面我们都可以查看到。',
                },
                {
                    id:3,
                    index:4,
                    imgUrl:require('../assets/images/card5.jpg'),
                    title:'智能制造',
                    info:'人口，法人与房屋进行关联，实现以人找房，以房查人。举例，以一栋楼为例，这栋楼里有131个居民，居民的个人信息上面我们可以查看到，但是有一些个人隐私问题，我们做了脱敏的处理，同时这里面有21个法人，法人的基本信息，他的姓名，联系方式，经营范围，经营方式和成立日期等信息，在上面我们都可以查看到。',
                },
                {
                    id:3,
                    index:5,
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
            elementsList:[],
            dataSource:parkList
        }
    },
    components:{
        singleEcharts
    },
    mounted(){
        this.initMap()
        this.getRadarEnterprise()
        // this.getEnterpriseMode()
    },
    methods:{
        initMap(){
            mapboxgl.accessToken = 'pk.eyJ1Ijoibnl5anl5YW5mYXBlbmciLCJhIjoiY2p3ajU4eXI2MGdxcDQ4cGI4cHI2bHhjcSJ9.m4FzyOH_5Yo3YVnroLxk-w';
            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'http://106.15.47.224:8688/styles/newblue/style.json',
                center: [118.908456,32.131299],
                zoom: 12.0
            })
            // setTimeout(()=>{
            //     this.getAllDistribute()
            // },1000)
            this.getItemData(8)
        },
        getItemData(params){
            let arr = [algorithm,idCard,model,terminal,system,network,platform,parkList]
            this.isClick = params
            this.dataSource = arr[params-1]
            setTimeout(()=>{
                this.getAllDistribute(this.dataSource)
            },1000)
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
        // 获取柱状图
        getEnterpriseMode(){
            let myChart=echarts.init(document.getElementById('mode'))
            let option = {
                xAxis: {
                    type: 'category',
                    data: ['算法', '芯片', '模块', '终端', '系统', '网络', '平台'],
                    nameTextStyle: {   // 坐标轴名称样式
                        color: '#fff',
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#ffffff'
                        }
                    },
                    axisTick:{
                        lineStyle:{
                            color:'#728396'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine:{
                        lineStyle:{
                            color:'#ffffff'
                        }
                    },
                    axisTick:{
                        lineStyle:{
                            color:'#728396'
                        }
                    }
                },
                series: [{
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar',
                    itemStyle:{
                        color:'#1087F6'
                    }
                }]
            };
            myChart.setOption(option);
            window.addEventListener("resize", () => { myChart.resize();});
        },
        getSearchResult(){

        },
        showDetail(index){
            console.log(index)
            this.sceanFlag = true
            this.sceanList.forEach(l=>{
                if(l.index === index){
                    this.sceanData = l
                }
            })
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
        getAllDistribute(dataSource){
            var mag1 = ["<", ["get", "mag"], 5];
            var mag2 = ["all", [">=", ["get", "mag"], 10], ["<", ["get", "mag"], 20]];
            var mag3 = ["all", [">=", ["get", "mag"], 20], ["<", ["get", "mag"], 30]];
            var mag4 = ["all", [">=", ["get", "mag"], 30], ["<", ["get", "mag"], 40]];
            var mag5 = [">=", ["get", "mag"], 40];
            this.map.addSource('earthquakes', {
                "type": "geojson",
                "data": dataSource,
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
            this.enterpriseFlag = true
            const map = e.target;
            // console.log(map);
            const features = map.queryRenderedFeatures(e.point,  { layers: ['earthquake_label'] });
            console.log(features);
            this.parkName = features[0].properties.id
            if (features.length > 0){
                const enterList = JSON.parse(features[0].properties.test)
                console.log(enterList)
                this.enterpriseList = JSON.parse(features[0].properties.test)
            }
            setTimeout(()=>{
                this.getSomeOneRadarEnterprise()
                
            },2000)
            
        },
        handleTabClick(){
            console.log(this.activeIndex)
            console.log(this.enterpriseList[this.activeIndex].elements)
            this.elementsList = this.enterpriseList[this.activeIndex].elements.split(" ")
        },
    }
}
</script>
<style scoped>
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
        color: #1679D5;
        font-size: 30px;
        margin-bottom: 10px;
    }
    .itemsNav .name{
       color: #1679D5;
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
        color: #ffffff;
        font-size: 30px;
        margin-bottom: 10px;
    }
    .activeitemsNav .name{
       color: #ffffff;
        font-size: 20px;
        margin: 10px 0 0 0;
    }
</style>