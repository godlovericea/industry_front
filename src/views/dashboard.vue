<template>
  <div id="map">
    <div class="headerBox">
      <img src="../../src/assets/images/logo.png" alt="" />
      <p class="title">中国(南京)智谷产业生态分布图</p>
    </div>
    <div class="switchBox">
      <span class="switchTitle">卫星影像</span
      ><el-switch
        v-model="switchMap"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="setMapTheme"
      ></el-switch>
    </div>
    <div class="bottomBox">
      <div
        v-for="item in navBarList"
        :key="item.id"
        :class="[isClick === item.id ? 'activeitemsNav' : 'itemsNav']"
        @click="getItemData(item.id)"
      >
        <i :class="item.icon"></i>
        <p class="name">{{ item.name }}</p>
      </div>
    </div>
    <div class="leftBox">
      <div class="leftItemsBox">
        <div class="leftheaderBox">
          <p class="headerTitle">行业从业人数</p>
        </div>
        <div class="etitle">从业人数: 36200人</div>
        <div id="enterprise"></div>
      </div>
      <div class="leftItemsBox">
        <div class="leftheaderBox">
          <p class="headerTitle">企业数量及产业规模</p>
        </div>
        <div class="etitle">
          总数:{{ enterTotal }}家，总产值：{{ totalValue }}亿元
        </div>
        <!-- <div id="outputValue"></div> -->
        <div id="modelll"></div>
      </div>
    </div>
    <div class="rightBox">
      <el-input
        v-model="search"
        placeholder="请输入企业名称或企业类型"
        @input="getSearchResult"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getSearchResult"
        ></el-button>
      </el-input>
      <div style="height:20px"></div>
      <div class="leftheaderBox">
        <p class="headerTitle" v-if="companyType === 1">人工智能应用场景</p>
        <p class="headerTitle" v-if="companyType === 2">光电技术应用场景</p>
        <p class="headerTitle" v-if="companyType === 3">生物医药应用场景</p>
        <p class="headerTitle" v-if="companyType === 4">应用场景</p>
      </div>
      <div class="content">
        <div class="btnGroups" v-if="companyType === 1">
          <md-tabs @md-changed="getScenList" md-alignment="fixed">
            <md-tab class="movies" id="1" md-label="智慧城市">
              <div
                class="cardBox"
                v-for="(item, index) in sceanList"
                :key="index"
                @click="clusterMapDis"
              >
                <div v-if="item.sonSceanClass === 1 && item.state === 'N'">
                  <div class="cardContent">
                    <p class="cardTitle">{{ item.scene }}</p>
                    <p class="cardDetail">{{ item.scenarioDefined }}</p>
                    <el-button
                      type="text"
                      style="color:'#ffffff'"
                      @click="showDetail(item.sceneId)"
                      >查看更多>></el-button
                    >
                  </div>
                </div>
              </div>
            </md-tab>
            <md-tab class="movies" id="2" md-label="智能制造">
              <div
                class="cardBox"
                v-for="(item, index) in sceanList"
                :key="index"
                @click="clusterMapDis"
              >
                <div v-if="item.sonSceanClass == 2 && item.state === 'N'">
                  <div class="cardContent">
                    <p class="cardTitle">{{ item.scene }}</p>
                    <p class="cardDetail">{{ item.scenarioDefined }}</p>
                    <el-button
                      type="text"
                      style="color:'#ffffff'"
                      @click="showDetail(item.sceneId)"
                      >查看更多>></el-button
                    >
                  </div>
                </div>
              </div>
            </md-tab>

            <md-tab id="3" class="movies" md-label="公共安全">
              <div
                class="cardBox"
                v-for="(item, index) in sceanList"
                :key="index"
                @click="clusterMapDis"
              >
                <div v-if="item.sonSceanClass == 3 && item.state === 'N'">
                  <div class="cardContent">
                    <p class="cardTitle">{{ item.scene }}</p>
                    <p class="cardDetail">{{ item.scenarioDefined }}</p>
                    <el-button
                      type="text"
                      style="color:'#ffffff'"
                      @click="showDetail(item.sceneId)"
                      >查看更多>></el-button
                    >
                  </div>
                </div>
              </div>
            </md-tab>
          </md-tabs>
        </div>
        <div class="movies" v-if="companyType !== 1">
          <div
            class="cardBox"
            v-for="(item, index) in sceanList"
            :key="index"
            @click="clusterMapDis"
          >
            <div class="cardContent">
              <p class="cardTitle">{{ item.scene }}</p>
              <p class="cardDetail">{{ item.scenarioDefined }}</p>
              <el-button
                type="text"
                style="color:'#ffffff'"
                @click="showDetail(item.sceneId)"
                >查看更多>></el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sceanDetailDialog" v-if="sceanFlag">
      <div class="sceanDialogHeader">
        <p class="dialogTitle">{{ sceanData.scene }}</p>
        <i class="el-icon-close" @click="closeDialog"></i>
      </div>
      <div class="divider"></div>
      <div class="sceanBox">
        <p class="stepsTitle">① 场景描述:</p>
        <div class="stepsContent">
          <p class="stepsDetail">{{ sceanData.scenarioDefined }}</p>
        </div>
        <p class="stepsTitle">② 图片和视频介绍:</p>
        <div class="stepsContent">
          <!-- <img class="shortcut" v-for="(item,index) in companySceneImgDTOList" :key="index" :src="item.scenarioImg" alt=""> -->
          <el-image
            style="width: 200px; height: 120px"
            :src="url"
            :preview-src-list="srcList"
          >
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
            <!-- <div class="sceanEnterItems" v-for="item in officeList" :key="item.companyId" @click="showInMapbox(item.comName)"> -->
            <div
              class="sceanEnterItems"
              v-for="item in officeList"
              :key="item.companyId"
            >
              <p class="enterName">{{ item.comName }}</p>
              <p class="enterP">法人:{{ item.operName }}</p>
              <p class="enterP">注册资金:{{ item.registCapi }}万元</p>
              <p class="enterP">地址:{{ item.address }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sceanDetailDialog" v-if="enterpriseFlag">
      <div class="sceanDialogHeader">
        <p class="dialogTitle">{{ parkName }}</p>
        <i class="el-icon-close" @click="closeEnterpriseDialog"></i>
      </div>
      <div class="divider"></div>
      <div class="enterpriseBox">
        <el-tabs
          v-model="activeIndex"
          :tab-position="tabPosition"
          style="height: 200px;"
          :stretch="false"
          @tab-click="handleTabClick"
        >
          <el-tab-pane
            v-for="(item, index) in enterpriseList"
            :key="index"
            :label="item.enterpriseName"
          >
            <div class="enterpriseDetail">
              <singleEcharts :id="item.enterpriseName"></singleEcharts>
              <div class="detailBox">
                <p>法人：{{ legalPerson }}</p>
                <p>注册资金：{{ item.registeredCapital }}万元</p>
                <p>AI方向：{{ item.AIbusiness }}</p>
                <p>主营业务：{{ item.content }}</p>
                <p>所属区：{{ item.Itsarea }}</p>
                <p>地址：{{ item.area }}</p>
              </div>
            </div>
            <div class="tagBox">
              <p class="qichachaTitle">公司基本信息（以下数据来源于企查查）</p>
              <div class="taglist">
                <p class="tagTitle">主要职员：</p>
                <div
                  v-for="(item, index) in Employees"
                  :key="index"
                  class="tagCintent"
                >
                  <p>
                    <span>{{ item.Name }}</span>
                    <span class="secondSpan">{{ item.Job }}</span>
                  </p>
                </div>
                <p class="tagTitle">产品信息：</p>
                <div
                  v-for="(item, index) in CompanyProducts"
                  :key="index"
                  class="tagCintent"
                >
                  <p>
                    所属领域:<span class="secondSpan">{{ item.Domain }}</span>
                  </p>
                  <p>
                    商标图片:<a
                      :href="item.ImageUrl"
                      target="_blank"
                      style="color:#fff;margin-left:10px"
                      >{{ item.ImageUrl }}</a
                    >
                  </p>
                  <p>
                    商标名称:<span class="secondSpan">{{ item.Name }}</span>
                  </p>
                  <p>
                    官网地址:<a
                      :href="item.Link"
                      target="_blank"
                      style="color:#fff;margin-left:10px"
                      >{{ item.Link }}</a
                    >
                  </p>
                  <p>
                    产品标签:<span class="secondSpan">{{ item.Tags }}</span>
                  </p>
                </div>
                <p class="tagTitle">知识产权：</p>
                <div class="tagCintent">
                  <p>专利数量：{{ knowledge }}</p>
                </div>
                <p class="tagTitle">产业信息：</p>
                <div class="tagCintent">
                  <p>产业范围：{{ Industry.Industry }}</p>
                </div>
                <p class="tagTitle">股东信息：</p>
                <div
                  v-for="item in Partners"
                  :key="item.KeyNo"
                  class="tagCintent"
                >
                  <span>{{ item.StockName }}</span>
                  <span class="secondSpan">{{ item.StockPercent }}</span>
                </div>
                <p class="tagTitle">主营业务：</p>
                <div class="tagCintent">
                  <p>{{ ScopeIn }}</p>
                </div>
                <p class="tagTitle">联系方式：</p>
                <div class="tagCintent">
                  <p>
                    邮箱：<span class="secondSpan">{{
                      ContactInfo.Email
                    }}</span>
                  </p>
                  <p>
                    电话：<span class="secondSpan">{{
                      ContactInfo.PhoneNumber
                    }}</span>
                  </p>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="sceanDetailDialog" v-if="searchFlag">
      <div class="sceanDialogHeader">
        <p class="dialogTitle">{{ searchEnterprise }}</p>
        <i class="el-icon-close" @click="closeEnterpriseDialog"></i>
      </div>
      <div class="divider"></div>
      <div class="enterpriseBox">
        <el-tabs :tab-position="tabPosition" :stretch="false">
          <el-tab-pane :label="enterpriseName">
            <div class="enterpriseDetail">
              <singleEcharts :id="enterpriseName"></singleEcharts>
              <div class="detailBox">
                <p>法人：{{ enterprise.legalPerson }}</p>
                <p>注册资金：{{ enterprise.registeredCapital }}万元</p>
                <p>AI方向：{{ enterprise.AIbusiness }}</p>
                <p>主营业务：{{ enterprise.content }}</p>
                <p>所属区：{{ enterprise.Itsarea }}</p>
                <p>地址：{{ enterprise.area }}</p>
              </div>
            </div>
            <div class="tagBox">
              <el-tag
                effect="dark"
                type="warning"
                closable
                v-for="(item, index) in elementsList"
                :key="index"
                >{{ item }}</el-tag
              >
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <div>
        为优化体验效果，请点击下载<a
          target="_blank"
          href="https://www.google.cn/chrome/"
          >chrome浏览器</a
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="查看图片"
      :visible.sync="imgDialogVisible"
      width="50%"
      center
    >
      <el-image
        style="width: 100px; height: 100px"
        :src="url"
        :preview-src-list="srcList"
      >
      </el-image>
      <el-carousel :interval="4000">
        <el-carousel-item
          v-for="(item, index) in companySceneImgDTOList"
          :key="index"
        >
          <img class="realImg" :src="item.scenarioImg" alt="" />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
// 万里
import mapboxgl from "mapbox-gl";
import parkList from "../jsonFile/汇总.json";
import algorithm from "../assets/distributeFile/算法.json";
import idCard from "../assets/distributeFile/芯片.json";
import model from "../assets/distributeFile/模块.json";
import system from "../assets/distributeFile/系统.json";
import network from "../assets/distributeFile/网络.json";
import platform from "../assets/distributeFile/平台.json";
import terminal from "../assets/distributeFile/终端.json";
import smartGov from "../assets/distributeFile/智慧政务.json";
import echarts from "echarts";
import singleEcharts from "../components/singleEcharts";
import axios from "axios";
import dottedLine from "./qixia.json";
// import dottedLine from './栖霞区.json'
import ispdata from "./ispData.json";
import pos1 from "../svg/icon-01.png";
import pos2 from "../svg/icon-02.png";
import pos3 from "../svg/icon-03.png";
import pos4 from "../svg/icon-04.png";
import pos5 from "../svg/icon-05.png";
import pos6 from "../svg/icon-06.png";
import {
  listAllCompanyScene,
  getCompanyScene,
  industryDetail,
  getPatentCount,
} from "@/api/home";
export default {
  data() {
    return {
      centerDialogVisible: false,
      map: "", //地图实例
      switchMap: false,
      navBarList: [
        {
          id: 1,
          name: "算法",
          icon: "iconfont icon-wangluo",
        },
        {
          id: 2,
          name: "芯片",
          icon: "iconfont icon-xinpian",
        },
        {
          id: 3,
          name: "模块",
          icon: "iconfont icon-modular",
        },
        {
          id: 4,
          name: "终端",
          icon: "iconfont icon-zhongduan",
        },
        {
          id: 5,
          name: "系统",
          icon: "iconfont icon-xitong",
        },
        {
          id: 6,
          name: "网络",
          icon: "iconfont icon-network",
        },
        {
          id: 7,
          name: "平台",
          icon: "iconfont icon-pingtai",
        },
        {
          id: 8,
          name: "全部",
          icon: "iconfont icon-quanbu",
        },
      ], // 底部导航栏菜单
      isClick: 8, // 默认选择全部
      search: "", //搜索框输入内容
      scean: 1, //场景,
      sceanList: [],
      sceanFlag: false,
      sceanData: {},
      circle: {
        alogthom: 30,
        IDcard: 30,
        model: 30,
        last: 30,
        system: 30,
        network: 30,
        box: 30,
      },
      enterpriseFlag: false,
      tabPosition: "left",
      markers: {},
      markersOnScreen: {},
      colors: ["#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c"],
      marker: "",
      enterpriseList: [],
      parkName: "",
      activeIndex: 0,
      radar: "",
      radarFlag: false,
      elementsList: ["算法", "芯片", "终端", "系统", "平台"],
      searchReault: {
        type: "FeatureCollection",
        crs: {
          type: "name",
          properties: {
            name: "urn:ogc:def:crs:OGC:1.3:CRS84",
          },
        },
        features: [
          {
            type: "Feature",
            properties: {
              id: "地理信息园",
              mag: 1,
              time: 1507425650893,
              felt: null,
              tsunami: 0,
              test: [],
            },
            geometry: {
              type: "Point",
              coordinates: [118.9196460753, 32.0805948414],
            },
          },
        ],
      },
      searchFlag: false,
      searchEnterprise: "",
      enterprise: {},
      officeList: [],
      totalValue: 581.95,
      enterTotal: 248,
      activeName: "first",
      CompanyProducts: [],
      Employees: [],
      detail: {},
      Industry: {},
      Partners: [],
      ScopeIn: "",
      knowledge: 0,
      legalPerson: "",
      ContactInfo: {},
      companySceneImgDTOList: [],
      videoUrl: "",
      imgTitle: "",
      imgDialogVisible: false,
      url: "",
      srcList: [],
      virusList: [],
      parkList: parkList,
      companyType: 1,
      popup: "",
    };
  },
  components: {
    singleEcharts,
  },
  mounted() {
    this.checkLogin();
    this.checkBrowserVersion();
    this.initMap();
    this.getRadarEnterprise();
    // this.getOutputValue()
    this.getEnterpriseMode();
    this.popup = new mapboxgl.Popup();
    // this.getScenList(1)
  },
  methods: {
    checkLogin() {
      if (!sessionStorage.getItem("user")) {
        this.$router.push({
          path: "/",
        });
      } else {
        this.companyType = JSON.parse(
          sessionStorage.getItem("user")
        ).sceneMainClass[0];
      }
    },
    checkBrowserVersion() {
      var browser = navigator.appName;
      var b_version = navigator.appVersion;
      var version = parseFloat(b_version);
      if (browser === "Netscape" && version < 5) {
        // alert("请下载最新版浏览器")
        window.location.href = "https://www.google.cn/chrome/";
        return false;
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
    initMap() {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoibnl5anl5YW5mYXBlbmciLCJhIjoiY2p3ajU4eXI2MGdxcDQ4cGI4cHI2bHhjcSJ9.m4FzyOH_5Yo3YVnroLxk-w";
      this.map = new mapboxgl.Map({
        container: "map",
        // style: 'http://106.15.47.224:8688/styles/newblue/style.json',
        style: "mapbox://styles/zplinze/ck2wvh2pa05ip1cr8supcaivg",
        center: [118.908456, 32.131199],
        zoom: 11.0,
        pitch: 60,
        bearing: -0.03,
      });
      this.map.on("styledata", () => {
        this.setISP();
        // this.setAllDistribute();
        this.getAllDistribute();
        this.getQixiaDistribute();
      });
      this.map.on("mouseenter", "earthquake_label", (e) => {
        // console.log(e);
        let poptitle = e.features[0].properties.id;
        this.popup = new mapboxgl.Popup({
          closeButton: false,
        })
          .setLngLat(e.lngLat)
          .setText(poptitle)
          .addTo(this.map);
      });
      this.map.on("mouseleave", "earthquake_label", (e) => {
        this.popup.remove();
      });
    },
    getItemData(params) {
      this.isClick = params;
      console.log(params);
      let total = [102.3, 20.8, 38.6, 85.6, 65.1, 21.5, 98.5, 581.95];
      let entertotal = [202, 100, 198, 156, 187, 21.5, 190, 212];
      this.totalValue = total[params - 1];
      this.enterTotal = entertotal[params - 1];
      let arr = [
        algorithm,
        idCard,
        model,
        terminal,
        system,
        network,
        platform,
        parkList,
      ];
      // this.map.getSource('earthquakes').setData(arr[params-1])
      this.parkList = arr[params - 1];
      // this.setAllDistribute()
      this.getAllDistribute();
    },
    // 获取雷达图
    getRadarEnterprise() {
      let myChart = echarts.init(document.getElementById("enterprise"));
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
              color: "#fff",
              // backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5],
            },
          },
          indicator: [
            { name: "算法", max: 8000 },
            { name: "芯片", max: 8000 },
            { name: "模块", max: 8000 },
            { name: "终端", max: 8000 },
            { name: "系统", max: 8000 },
            { name: "网络", max: 8000 },
            { name: "平台", max: 8000 },
          ],
          splitArea: {
            areaStyle: {
              color: ["#101B26"],
              shadowColor: "rgba(0, 0, 0, 0.3)",
              shadowBlur: 10,
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(114, 131, 150, 1)",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(114, 131, 150, 1)",
            },
          },
        },
        series: [
          {
            name: "从业人数",
            type: "radar",
            areaStyle: {
              normal: {
                color: "#1087F6", // 图表中各个图区域的颜色
                areaStyle: {
                  type: "default",
                  opacity: 0.8, // 图表中各个图区域的透明度
                  color: "#ff0000", // 图表中各个图区域的颜色
                },
              },
            },
            data: [
              {
                value: [4800, 3200, 4300, 5400, 6500, 4500, 7500],
                name: "从业人数",
                itemStyle: {
                  normal: {
                    color: "#1087F6", // 图表中各个图区域的颜色
                  },
                },
              },
            ],
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    // 获取柱状图
    getEnterpriseMode() {
      let myChart = echarts.init(document.getElementById("modelll"));
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          top: "15%",
          right: "3%",
          left: "10%",
          bottom: "20%",
        },
        xAxis: [
          {
            type: "category",
            data: ["算法", "芯片", "模块", "终端", "系统", "网络", "平台"],
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.12)",
              },
            },
            axisLabel: {
              margin: 20,
              color: "#e2e9ff",
              textStyle: {
                fontSize: 14,
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "数量",
            nameTextStyle: {
              color: "#fff",
            },
            splitNumber: 5,
            axisLabel: {
              formatter: "{value}",
              color: "#e2e9ff",
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.12)",
              },
            },
          },
        ],
        series: [
          {
            type: "bar",
            barWidth: "16px",
            data: [
              {
                name: "算法",
                value: 202,
                // itemStyle: {
                //     normal: {
                //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: 'rgba(242,241,110,1)' // 0% 处的颜色
                //         }, {
                //             offset: 1,
                //             color: 'rgba(242,241,110,0.2)' // 100% 处的颜色
                //         }], false),
                //         barBorderRadius: [30, 30, 30, 30],
                //         shadowColor: 'rgba(242,241,110,1)',
                //         shadowBlur: 4,
                //     }
                // }
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: "#11b09b", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#1f6ccc", // 100% 处的颜色
                        },
                      ],
                      false
                    ),
                    barBorderRadius: [2, 2, 2, 2],
                    shadowColor: "rgba(0,219,177,1)",
                    shadowBlur: 4,
                  },
                },
              },
              {
                name: "芯片",
                value: 106,
                // itemStyle: {
                //     normal: {
                //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: 'rgba(242,183,101,1)' // 0% 处的颜色
                //         }, {
                //             offset: 1,
                //             color: 'rgba(242,183,101,0.2)' // 100% 处的颜色
                //         }], false),
                //         barBorderRadius: [30, 30, 30, 30],
                //         shadowColor: 'rgba(242,183,101,1)',
                //         shadowBlur: 4,
                //     }
                // }
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: "#11b09b", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#1f6ccc", // 100% 处的颜色
                        },
                      ],
                      false
                    ),
                    barBorderRadius: [2, 2, 2, 2],
                    shadowColor: "rgba(0,219,177,1)",
                    shadowBlur: 4,
                  },
                },
              },
              {
                name: "模块",
                value: 198,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: "#11b09b", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#1f6ccc", // 100% 处的颜色
                        },
                      ],
                      false
                    ),
                    barBorderRadius: [2, 2, 2, 2],
                    shadowColor: "rgba(0,219,177,1)",
                    shadowBlur: 4,
                  },
                },
              },
              {
                name: "终端",
                value: 156,
                // itemStyle: {
                //     normal: {
                //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: 'rgba(204,73,109,1)' // 0% 处的颜色
                //         }, {
                //             offset: 1,
                //             color: 'rgba(204,73,109,0.2)' // 100% 处的颜色
                //         }], false),
                //         barBorderRadius: [30, 30, 30, 30],
                //         shadowColor: 'rgba(204,73,109,1)',
                //         shadowBlur: 4,
                //     }
                // }
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: "#11b09b", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#1f6ccc", // 100% 处的颜色
                        },
                      ],
                      false
                    ),
                    barBorderRadius: [2, 2, 2, 2],
                    shadowColor: "rgba(0,219,177,1)",
                    shadowBlur: 4,
                  },
                },
              },
              {
                name: "系统",
                value: 187,
                // itemStyle: {
                //     normal: {
                //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: 'rgba(188,128,139,1)' // 0% 处的颜色
                //         }, {
                //             offset: 1,
                //             color: 'rgba(188,128,139,0.2)' // 100% 处的颜色
                //         }], false),
                //         barBorderRadius: [30, 30, 30, 30],
                //         shadowColor: 'rgba(188,128,139,1)',
                //         shadowBlur: 4,
                //     }
                // }
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: "#11b09b", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#1f6ccc", // 100% 处的颜色
                        },
                      ],
                      false
                    ),
                    barBorderRadius: [2, 2, 2, 2],
                    shadowColor: "rgba(0,219,177,1)",
                    shadowBlur: 4,
                  },
                },
              },
              {
                name: "网络",
                value: 190,
                // itemStyle: {
                //     normal: {
                //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: 'rgba(22,121,212,1)' // 0% 处的颜色
                //         }, {
                //             offset: 1,
                //             color: 'rgba(22,121,212,0.2)' // 100% 处的颜色
                //         }], false),
                //         barBorderRadius: [30, 30, 30, 30],
                //         shadowColor: 'rgba(22,121,212,1)',
                //         shadowBlur: 4,
                //     }
                // }
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: "#11b09b", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#1f6ccc", // 100% 处的颜色
                        },
                      ],
                      false
                    ),
                    barBorderRadius: [2, 2, 2, 2],
                    shadowColor: "rgba(0,219,177,1)",
                    shadowBlur: 4,
                  },
                },
              },
              {
                name: "平台",
                value: 212,
                // itemStyle: {
                //     normal: {
                //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //             offset: 0,
                //             color: 'rgba(134,224,126,1)' // 0% 处的颜色
                //         }, {
                //             offset: 1,
                //             color: 'rgba(134,224,126,0.2)' // 100% 处的颜色
                //         }], false),
                //         barBorderRadius: [30, 30, 30, 30],
                //         shadowColor: 'rgba(134,224,126,1)',
                //         shadowBlur: 4,
                //     }
                // }
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: "#11b09b", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#1f6ccc", // 100% 处的颜色
                        },
                      ],
                      false
                    ),
                    barBorderRadius: [2, 2, 2, 2],
                    shadowColor: "rgba(0,219,177,1)",
                    shadowBlur: 4,
                  },
                },
              },
            ],
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    // 获取产值饼图
    getOutputValue() {
      let myChart = echarts.init(document.getElementById("outputValue"));

      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          // x: 'right',
          right: 30,
          top: 10,
          data: ["算法", "芯片", "模块", "终端", "系统", "网络", "平台"],
          textStyle: {
            color: "#ffffff",
          },
        },
        series: [
          {
            name: "产值",
            type: "pie",
            center: ["40%", "50%"],
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center",
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "20",
                  fontWeight: "bold",
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              {
                value: 1548,
                name: "算法",
                itemStyle: {
                  color: "#F2F16E",
                },
              },
              {
                value: 310,
                name: "芯片",
                itemStyle: {
                  color: "#F2B765",
                },
              },
              {
                value: 234,
                name: "模块",
                itemStyle: {
                  color: "#00DBB1",
                },
              },
              {
                value: 135,
                name: "终端",
                itemStyle: {
                  color: "#CC496D",
                },
              },
              {
                value: 1548,
                name: "系统",
                itemStyle: {
                  color: "#BC808B",
                },
              },
              {
                value: 1048,
                name: "网络",
                itemStyle: {
                  color: "#1679D4",
                },
              },
              {
                value: 1288,
                name: "平台",
                itemStyle: {
                  color: "#86E07E",
                },
              },
            ],
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    getSearchResult() {
      if (!this.search) {
        this.map.getSource("earthquakes").setData(parkList);
      }
      // this.enterpriseFlag = true
      parkList.features.forEach((el) => {
        el.properties.test.forEach((l) => {
          if (l.enterpriseName.indexOf(this.search)) {
            this.searchReault.features[0].properties.test.push(l);
            this.searchReault.features[0].geometry.coordinates =
              el.geometry.coordinates;
          }
        });
      });
      this.map.getSource("earthquakes").setData(this.searchReault);
      // this.searchEnterprise = this.searchReault.features[0].properties.test[0].enterpriseName
      // console.log(this.searchReault.features[0].properties)
    },
    // 点击场景设置图层数据
    clusterMapDis() {
      // this.map.getSource('earthquakes').setData(smartGov)
      // this.handleAnimateCircle()
    },
    closeDialog() {
      this.sceanFlag = false;
      this.sceanData = {};
    },
    closeEnterpriseDialog() {
      this.enterpriseFlag = false;
    },
    getSomeOneRadarEnterprise() {
      let myChart = echarts.init(document.getElementById(this.radar));
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
              color: "#fff",
              // backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5],
            },
          },
          indicator: [
            { name: "算法", max: 6500 },
            { name: "芯片", max: 16000 },
            { name: "模块", max: 30000 },
            { name: "终端", max: 38000 },
            { name: "系统", max: 52000 },
            { name: "网络", max: 25000 },
            { name: "平台", max: 25000 },
          ],
          splitArea: {
            areaStyle: {
              color: ["#114474"],
              shadowColor: "rgba(0, 0, 0, 0.3)",
              shadowBlur: 10,
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(114, 131, 150, 1)",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(114, 131, 150, 1)",
            },
          },
        },
        series: [
          {
            name: "预算 vs 开销（Budget vs spending）",
            type: "radar",
            areaStyle: {
              normal: {
                color: "#1087F6", // 图表中各个图区域的颜色
                areaStyle: {
                  type: "default",
                  opacity: 0.8, // 图表中各个图区域的透明度
                  color: "#ff0000", // 图表中各个图区域的颜色
                },
              },
            },
            data: [
              {
                value: [4300, 10000, 28000, 35000, 50000, 19000, 5200],
                name: "预算分配（Allocated Budget）",
                itemStyle: {
                  normal: {
                    color: "#1087F6", // 图表中各个图区域的颜色
                  },
                },
              },
            ],
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    getAllDistribute() {
      var mag1 = ["<", ["get", "mag"], 5];
      var mag2 = ["all", [">=", ["get", "mag"], 10], ["<", ["get", "mag"], 20]];
      var mag3 = ["all", [">=", ["get", "mag"], 20], ["<", ["get", "mag"], 30]];
      var mag4 = ["all", [">=", ["get", "mag"], 30], ["<", ["get", "mag"], 40]];
      var mag5 = [">=", ["get", "mag"], 40];

      if (!this.map.getSource("earthquakes")) {
        this.map.addSource("earthquakes", {
          type: "geojson",
          data: this.parkList,
          cluster: false,
          clusterRadius: 0,
          clusterProperties: {
            // keep separate counts for each magnitude category in a cluster
            mag1: ["+", ["case", mag1, 1, 0]],
            mag2: ["+", ["case", mag2, 1, 0]],
            mag3: ["+", ["case", mag3, 1, 0]],
            mag4: ["+", ["case", mag4, 1, 0]],
            mag5: ["+", ["case", mag5, 1, 0]],
          },
        });
      } else {
        this.map.getSource("earthquakes").setData(this.parkList);
      }

      if (!this.map.getLayer("earthquake_circle")) {
        this.map.addLayer({
          id: "earthquake_circle",
          type: "circle",
          source: "earthquakes",
          // "filter": ["!=", "cluster", true],
          paint: {
            // "circle-color": ["case",
            // mag1, this.colors[0],
            // mag2, this.colors[1],
            // mag3, this.colors[2],
            // mag4, this.colors[3], this.colors[4]],
            "circle-opacity": 0.6,
            "circle-radius": 20,
          },
        });
      }
      //  if (!this.map.getLayer('earthquake_circle')){
      //     this.map.addLayer({
      //         "id": "earthquake_circle",
      //         "type": "circle",
      //         "source": "earthquakes",
      //         // "filter": ["!=", "cluster", true],
      //         // cluster:false,
      //         // layout:{
      //         //     "icon-allow-overlap": true
      //         // }
      //         // "paint": {
      //         //     "circle-color": ["case",
      //         //     mag1, this.colors[0],
      //         //     mag2, this.colors[1],
      //         //     mag3, this.colors[2],
      //         //     mag4, this.colors[3], this.colors[4]],
      //         //     "circle-opacity": 0.6,
      //         //     "circle-radius": 0
      //         // }
      //     });
      // }

      this.map.loadImage(pos1, (error, image) => {
        if (error) throw error;
        if (!this.map.hasImage("pos1")) this.map.addImage("pos1", image);
      });
      this.map.loadImage(pos2, (error, image) => {
        if (error) throw error;
        if (!this.map.hasImage("pos2")) this.map.addImage("pos2", image);
      });
      this.map.loadImage(pos3, (error, image) => {
        if (error) throw error;
        if (!this.map.hasImage("pos3")) this.map.addImage("pos3", image);
      });
      this.map.loadImage(pos4, (error, image) => {
        if (error) throw error;
        if (!this.map.hasImage("pos4")) this.map.addImage("pos4", image);
      });
      this.map.loadImage(pos5, (error, image) => {
        if (error) throw error;
        if (!this.map.hasImage("pos5")) this.map.addImage("pos5", image);
      });
      this.map.loadImage(pos6, (error, image) => {
        if (error) throw error;
        if (!this.map.hasImage("pos6")) this.map.addImage("pos6", image);
      });
      if (!this.map.getLayer("earthquake_label")) {
        this.map.addLayer({
          id: "earthquake_label",
          type: "symbol",
          source: "earthquakes",
          cluster: false,
          clusterMaxZoom: 1,
          clusterRadius: 1,
          // "filter": ["!=", "cluster", true],

          layout: {
            "text-field": [
              "number-format",
              ["get", "mag"],
              { "min-fraction-digits": 0, "max-fraction-digits": 1 },
            ],
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-size": 18,
            "text-allow-overlap": true,
            // "icon-image": "cat"
            "icon-image": [
              "case",
              mag1,
              "pos1",
              mag2,
              "pos2",
              mag3,
              "pos3",
              mag4,
              "pos4",
              mag5,
              "pos5",
              "pos6",
            ],
            "icon-allow-overlap": true,
          },
          paint: {
            // "text-color": ["case", ["<", ["get", "mag"], 3], "black", "white"]
            "text-color": "#13212E",
            //  "text-color": ["case",
            //     mag1, "#333333",
            //     mag2, "#333333",
            //     mag3, "#dddddd",
            //     mag4, "#dddddd",
            //     mag5, "#000000",
            //     "#000000",
            // ]
          },
        });
        this.map.on("click", "earthquake_label", this.handleMarkerClick);
      }

      // this.map.on('styledata', (e)=> {

      // });
    },
    updateMarkers() {
      var newMarkers = {};
      var features = this.map.querySourceFeatures("earthquakes");

      // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
      // and add it to the map if it's not there already
      for (var i = 0; i < features.length; i++) {
        var coords = features[i].geometry.coordinates;
        var props = features[i].properties;
        // console.log(!props.cluster)
        if (!props.cluster) {
          continue;
        }
        var id = props.cluster_id;
        console.log(id);

        this.marker = this.markers[id];
        if (!this.marker) {
          var el = this.createDonutChart(props);
          this.marker = this.markers[id] = new mapboxgl.Marker({
            element: el,
          }).setLngLat(coords);
        }
        newMarkers[id] = marker;

        if (!this.markersOnScreen[id]) {
          this.marker.addTo(this.map);
        }
      }
      // for every marker we've added previously, remove those that are no longer visible
      for (id in this.markersOnScreen) {
        if (!newMarkers[id]) {
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
      var fontSize =
        total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
      var r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
      var r0 = Math.round(r * 0.6);
      var w = r * 2;

      var html =
        '<svg width="' +
        w +
        '" height="' +
        w +
        '" viewbox="0 0 ' +
        w +
        " " +
        w +
        '" text-anchor="middle" style="font: ' +
        fontSize +
        'px sans-serif">';

      for (i = 0; i < counts.length; i++) {
        html += this.donutSegment(
          offsets[i] / total,
          (offsets[i] + counts[i]) / total,
          r,
          r0,
          this.colors[i]
        );
      }
      html +=
        '<circle cx="' +
        r +
        '" cy="' +
        r +
        '" r="' +
        r0 +
        '" fill="white" /><text dominant-baseline="central" transform="translate(' +
        r +
        ", " +
        r +
        ')">' +
        total.toLocaleString() +
        "</text></svg>";

      var el = document.createElement("div");
      el.innerHTML = html;
      return el.firstChild;
    },
    donutSegment(start, end, r, r0, color) {
      if (end - start === 1) {
        end -= 0.00001;
      }
      var a0 = 2 * Math.PI * (start - 0.25);
      var a1 = 2 * Math.PI * (end - 0.25);
      var x0 = Math.cos(a0),
        y0 = Math.sin(a0);
      var x1 = Math.cos(a1),
        y1 = Math.sin(a1);
      var largeArc = end - start > 0.5 ? 1 : 0;

      return [
        '<path d="M',
        r + r0 * x0,
        r + r0 * y0,
        "L",
        r + r * x0,
        r + r * y0,
        "A",
        r,
        r,
        0,
        largeArc,
        1,
        r + r * x1,
        r + r * y1,
        "L",
        r + r0 * x1,
        r + r0 * y1,
        "A",
        r0,
        r0,
        0,
        largeArc,
        0,
        r + r0 * x0,
        r + r0 * y0,
        '" fill="' + color + '" />',
      ].join(" ");
    },
    handleMarkerClick(e) {
      // this.map.on('click','earthquake_label',this.handleMarkerClick);
      this.enterpriseFlag = true;
      const map = e.target;
      // console.log(map);
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["earthquake_label"],
      });

      console.log(features);

      this.parkName = features[0].properties.id;
      if (features.length > 0) {
        const enterList = JSON.parse(features[0].properties.test);
        // console.log(enterList)
        this.enterpriseList = enterList;
        this.getQichachaData(this.enterpriseList[0].enterpriseName);
        // this.map.off('click','earthquake_label',this.handleMarkerClick);
      }
      e.preventDefault();
      setTimeout(() => {
        if (document.getElementById(this.radar)) {
          this.getSomeOneRadarEnterprise();
        }
      }, 2000);
    },
    handleTabClick(tab, event) {
      console.log(tab.label);
      this.getQichachaData(tab.label);
      console.log(this.activeIndex);
      console.log(this.enterpriseList[this.activeIndex].elements);
      // this.elementsList = this.enterpriseList[this.activeIndex].elements.split(" ")
    },
    getQixiaDistribute() {
      if (!this.map.getSource("dottedlines_label")) {
        this.map.addSource("dottedlines_label", dottedLine);
      } else {
        return false;
      }
      this.map.addLayer({
        id: "qixiaDisfill",
        type: "fill",
        source: "dottedlines_label",
        paint: {
          "fill-color": "#ffffff",
          "fill-opacity": 0.05,
        },
      });
      this.map.addLayer({
        id: "qixiaDisline",
        type: "line",
        source: "dottedlines_label",
        paint: {
          "line-dasharray": [3, 2],
          "line-width": 1.5,
          "line-opacity": 1,
          "line-color": "#ffffff",
        },
      });
    },
    setISP() {
      if (!this.map.getSource("isp")) {
        this.map.addSource("isp", ispdata);
      } else {
        return false;
      }

      this.map.addLayer({
        id: "ispppp",
        type: "fill-extrusion",
        // 'source': {
        //     // GeoJSON Data source used in vector tiles, documented at
        //     // https://gist.github.com/ryanbaumann/a7d970386ce59d11c16278b90dde094d
        //     'type': 'geojson',
        //     'data': ispdata//'https://www.mapbox.com/mapbox-gl-js/assets/indoor-3d-map.geojson'
        // },
        source: ispdata,
        minzoom: 11,
        paint: {
          // See the Mapbox Style Specification for details on data expressions.
          // https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions

          // Get the fill-extrusion-color from the source 'color' property.
          "fill-extrusion-color": "#89d3e6", //'#024c7c',//['get', 'color'],

          // Get fill-extrusion-height from the source 'height' property.
          "fill-extrusion-height": ["get", "height"],

          // Get fill-extrusion-base from the source 'base_height' property.
          "fill-extrusion-base": ["get", "base_height"],

          // Make extrusions slightly opaque for see through indoor walls.
          "fill-extrusion-opacity": 0.5,
        },
      });
    },
    selectScean(params) {
      this.scean = params;
    },
    handleAnimateCircle() {
      var size = 200;
      var pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        onAdd: () => {
          var canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext("2d");
        },

        render: () => {
          var duration = 1000;
          var t = (performance.now() % duration) / duration;

          var radius = (size / 2) * 0.3;
          var outerRadius = (size / 2) * 0.7 * t + radius;
          var context = this.context;

          // draw outer circle
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          );
          context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
          context.fill();

          // draw inner circle
          context.beginPath();
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
          context.fillStyle = "rgba(255, 100, 100, 1)";
          context.strokeStyle = "white";
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();

          // update this image's data with data from the canvas
          this.data = context.getImageData(0, 0, this.width, this.height).data;

          // keep the map repainting
          this.map.triggerRepaint();

          // return `true` to let the map know that the image was updated
          return true;
        },
      };

      this.map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });

      this.map.addLayer({
        id: "points",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [118.8972030341, 32.1540342558],
                },
              },
            ],
          },
        },
        layout: {
          "icon-image": "pulsing-dot",
        },
      });
    },
    getQichachaData(name) {
      let myData = {
        name: name,
      };
      industryDetail(myData).then((res) => {
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
        //     axios.post("http://120.55.161.93:6011/qichacha/getPatentCount?name="+name)
        //     .then(res=>{
        //         this.knowledge = res.data.result
        //     })
        // }
        if (res.data.result && res.data.code === 200) {
          // console.log(res.data.Result)
          let myData = res.data.result;
          // console.log(myData)
          // console.log("789poi")
          // this.CompanyProducts = myData.Result.CompanyProducts
          this.Employees = myData.Result.Employees;
          this.Industry = myData.Result.Industry;
          this.Partners = myData.Result.Partners;
          this.ScopeIn = myData.Result.Scope;
          this.legalPerson = myData.Result.OperName;
          this.ContactInfo = {
            adress: myData.Result.Address,
            phone: myData.Result.Address,
          };
          // axios.post("http://120.55.161.93:6011/qichacha/getPatentCount?name="+name)
          let myData1 = {
            name: name,
          };
          getPatentCount(myData1).then((res) => {
            this.knowledge = res.data.result;
          });
        }
      });
    },
    showInMapbox(params) {
      console.log(params);
      this.sceanFlag = false;
      let sceanEnterPrise = [];
      parkList.features.forEach((l) => {
        l.properties.test.forEach((el) => {
          if (params === el.enterpriseName) {
            // console.log(el)
            sceanEnterPrise.push(el);
            this.searchReault.features[0].properties.test = sceanEnterPrise;
            this.searchReault.features[0].properties.id = l.properties.id;
            this.searchReault.features[0].geometry.coordinates =
              l.geometry.coordinates;
          }
        });
      });
      // console.log(this.searchReault)
      this.map.flyTo({
        // center:this.searchReault.features[0].geometry.coordinates,
        center: [118.873729, 32.139718],
        zoom: 15,
      });
      // this.map.getSource('earthquakes').setData(this.searchReault)
    },
    setMapTheme() {
      if (this.switchMap) {
        this.map.setStyle("mapbox://styles/mapbox/satellite-streets-v11");
      } else {
        this.map.setStyle(
          "http://106.15.47.224:8688/styles/newblue/style.json"
        );
      }
    },
    getScenList(params) {
      this.sceanList = [];
      let myData = {
        sonSceneId: params,
        type: this.companyType,
      };
      listAllCompanyScene(myData).then((res) => {
        // console.log(res)
        this.sceanList = res.data.result;
        // res.data.result.forEach(l=>{
        //     if(l.state === 'N'){
        //         this.sceanList.push(l)
        //     }
        // })
        // this.sceanList = this.unique1(this.sceanList)
      });
    },
    unique1(arr) {
      var hash = [];
      for (var i = 0; i < arr.length; i++) {
        if (hash.indexOf(arr[i]) == -1) {
          hash.push(arr[i]);
        }
      }
      return hash;
    },
    showDetail(params) {
      this.enterpriseFlag = false;
      // console.log(params)
      this.sceanFlag = true;
      let id = parseInt(params);
      let myData = {
        companySceneId: id,
      };
      getCompanyScene(myData).then((res) => {
        let sceanId = 93;
        this.sceanData = res.data.result;
        console.log(this.sceanData);
        res.data.result.companySceneImgDTOList.forEach((l) => {
          // l.scenarioImg = 'http://'+ l.scenarioImg
          // l.scenarioImg = 'http://'+ l.scenarioImg
          // console.log(l.scenarioImg.substring(21))
          l.scenarioImg = "http://qiniu.iwooke" + l.scenarioImg.substring(21);
        });
        this.companySceneImgDTOList = res.data.result.companySceneImgDTOList;
        let srcArrList = [];
        this.companySceneImgDTOList.forEach((l) => {
          srcArrList.push(l.scenarioImg);
        });

        this.srcList = srcArrList;
        this.url = this.srcList[0];

        // this.videoUrl =  'http://'+ res.data.result.video
        this.videoUrl =
          "http://qiniu.iwooke" + res.data.result.video.substring(21);

        let arrList = [
          {
            enterpriseId: "HFKJY008",
            enterpriseName: "南京科沃斯机器人技术有限公司",
            legalPerson: "高翔",
            registeredCapital: "2000",
            establishedTime: "2018/6/28",
            AIbusiness: "100%",
            technologyStratification: "4-应用层",
            levelOneAI: "智能家居",
            leveltwoAI: "扫地机器人",
            enterpriseProfile: "科沃斯机器人全资子公司",
            qualification: "",
            AIBusinessDirection: "家用服务机器人、智能家居",
            content: "科沃斯机器人（南京）人工智能研究院",
            Itsarea: "经开区",
            area: "南京经济技术开发区红枫科技园C2栋第5、6层西侧",
            elements: "算法 终端 网络 平台 模块",
            IndustryClassification: "服务机器人，智能家居",
          },
          {
            enterpriseId: "XLZG001",
            enterpriseName: "图灵人工智能研究院（南京）有限公司",
            legalPerson: "姚期智",
            registeredCapital: "1714.6",
            establishedTime: "2018/3/28",
            AIbusiness: "100%",
            technologyStratification: "2-技术层",
            levelOneAI: "机器学习",
            leveltwoAI: "",
            enterpriseProfile:
              "一个人工智能研究机构。南京京图灵人工智能研究院未来将融入世界人工智能创新网络，促进南京人工智能产业高端发展，建立AI技术为传统产业赋能平台。同时，研究院还计划每年在南京市举办一场全球人工智能领域的顶尖论坛。",
            qualification: "",
            AIBusinessDirection: "AI交叉领域研究",
            content: "图灵人工智能研究院",
            Itsarea: "栖霞高新区",
            area: "南京市栖霞区仙林街道齐民路6号5栋601室",
            elements: "算法 网络 平台 模块",
            IndustryClassification: "机器学习，知识图谱",
          },
          {
            enterpriseId: "ZDCYY012",
            enterpriseName: "捕视者人脸识别技术（江苏）有限公司",
            legalPerson: "窦一鸣 ",
            registeredCapital: "1000",
            establishedTime: "2018/1/29",
            AIbusiness: "100%",
            technologyStratification: "2-技术层",
            levelOneAI: "图像识别",
            leveltwoAI: "智慧政务",
            enterpriseProfile:
              "基于人脸识别技术开发智慧政务审批系统、认证识别终端、视频数字化多组态人脸识别系统",
            qualification: "",
            AIBusinessDirection: '"人脸识别',
          },
          {
            enterpriseId: "XZKJY045",
            enterpriseName: "南京艾弗曼人工智能有限公司",
            legalPerson: "李钢",
            registeredCapital: "1000",
            establishedTime: "2018/1/9",
            AIbusiness: "80%",
            technologyStratification: "3-硬件终端",
            levelOneAI: "智能机器人",
            leveltwoAI: "",
            enterpriseProfile:
              "一家智能服务机器人研发商，将AI技术应用于运营商、金融、政务、电商、航空、汽车、物流等行业的服务场景，其研发的机器人具有精准人脸识别、自主定位导航、语音识别对话、数据采集分析、导航避障及定时回充功能",
            qualification: "",
            AIBusinessDirection: "智能税务服务",
            content: "南京艾德曼税务机器人",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路6号兴智科技园A栋2106室",
            elements: "终端 网络 平台 模块 系统",
            IndustryClassification: "服务机器人",
          },

          {
            enterpriseId: "ZDCYY030",
            enterpriseName: "南京子谷大数据科技有限公司",
            legalPerson: "朱晶",
            registeredCapital: "1000",
            establishedTime: "2019/4/19",
            AIbusiness: "90%",
            technologyStratification: "4-应用层",
            levelOneAI: "智慧政务",
            leveltwoAI: "",
            enterpriseProfile:
              "搭建网民用户行为模型，为政府提供重点舆情数据追踪，海量视频流数据监测，实时即时阻断等服务",
            qualification: "",
            AIBusinessDirection: "人工智能+大数据",
            content:
              "搭建网民用户行为模型，为政府提供重点舆情数据追踪，海量视频流数据监测，实时即时阻断等服务",
            Itsarea: "栖霞高新区",
            area: "南京市栖霞区马群街道紫东路2号紫东国际创意园A7栋102室",
            elements: "网络 平台",
            IndustryClassification: "大数据服务，法律",
          },
          {
            enterpriseId: "XZKJY002",
            enterpriseName: "南京人工智能高等研究院有限公司",
            legalPerson: "余凯",
            registeredCapital: "2700",
            establishedTime: "2018/4/24",
            AIbusiness: "",
            technologyStratification: "2-技术层",
            levelOneAI: "图像识别/语音语义",
            leveltwoAI: "",
            enterpriseProfile:
              "基于机器学习基础理论、计算机视觉技术、语音语言处理技术、高性能计算等前沿技术研究，重点围绕智能制造、智能城市、智能医疗等重要行业领域进行产学研成果转化",
            qualification: "",
            AIBusinessDirection: "深度学习芯片、机器视觉等",
            content: "南京人工智能高等研究院",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路6号兴智科技园A栋21层",
            elements: "终端 网络 平台 模块",
            IndustryClassification: "计算机视觉，智能医疗，智能语音",
          },
          {
            enterpriseId: "XZKJY005",
            enterpriseName: "芯启源（南京）半导体科技有限公司",
            legalPerson: "SHENG LU ",
            registeredCapital: "10000万美元",
            establishedTime: "2016/11/3",
            AIbusiness: "70%",
            technologyStratification: "1-基础层",
            levelOneAI: "集成电路",
            leveltwoAI: "芯片设计",
            enterpriseProfile:
              "为国家战略层面的芯片自主知识产权研发和应用不断努力",
            qualification: "",
            AIBusinessDirection: "网络企业级芯片",
            content: "企业级高端网络通讯智能芯片",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路兴智科技园A栋7层",
            elements: "算法 芯片 终端",
            IndustryClassification: "AI芯片",
          },
          {
            enterpriseId: "XZKJY006",
            enterpriseName: "南京宇都通讯科技有限公司",
            legalPerson: "JUNFENG WANG",
            registeredCapital: "1327.58",
            establishedTime: "2012/4/20",
            AIbusiness: "60%",
            technologyStratification: "1-基础层",
            levelOneAI: "通信网络",
            leveltwoAI: "通信芯片/通信设备",
            enterpriseProfile:
              "立足于SmartCable（有线千兆）和SmartAir（无线千兆）两项自主创新的宽带通讯核心前沿技术，提供千兆宽带接入和千兆家庭网的系统解决方案、关键设备和核心芯片，打造家庭网信息高速干线，支持三网融合、高清/超高清IPTV等应用，努力成为这个新兴的千亿级市场的一流供应商",
            qualification: "",
            AIBusinessDirection: "智能终端芯片",
            content: "三网融合智能芯片",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路6-3号南段4层",
            elements: "算法 芯片  网络",
            IndustryClassification: "AI芯片",
          },
          {
            enterpriseId: "XZKJY007",
            enterpriseName: "创新奇智（南京）科技有限公司",
            legalPerson: "徐辉",
            registeredCapital: "1000",
            establishedTime: "2018/6/15",
            AIbusiness: "90%",
            technologyStratification: "4-应用层",
            levelOneAI: "智能商业/智能制造",
            leveltwoAI: "工业视觉",
            enterpriseProfile:
              "创新工场AI子公司，以“人工智能赋能商业未来”为使命；以“技术产品”+“行业场景”双轮驱动模式，为制造、零售、金融等行业提供人工智能整体解决方案，已获取中冶赛迪、宗申、格力、宝武钢铁等行业客户；智能零售解决方案，实现场、货、人的智能化管理。智能工业解决方案中基于计算机视觉的无损探伤场景。",
            qualification: "省级小巨人企业（创新类）",
            AIBusinessDirection: "AI赋能零售、金融、制造业",
            content: "人工智能整体解决方案",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路6号兴智科技园B栋第19层",
            elements: "网络 平台 模块",
            IndustryClassification: "智能制造，智能零售，智能金融，计算机视觉",
          },
          {
            enterpriseId: "XZKJY008",
            enterpriseName: "南京旷云科技有限公司",
            legalPerson: "曹志敏",
            registeredCapital: "1000",
            establishedTime: "2017/1/10",
            AIbusiness: "100%",
            technologyStratification: "2-技术层",
            levelOneAI: "图像识别",
            leveltwoAI: "人脸识别",
            enterpriseProfile:
              "从属于北京旷视，目前为数据中心与研究院相结合的构成",
            qualification: "",
            AIBusinessDirection: "计算机视觉",
            content: "人脸识别人工智能算法、硬件技术、行业解决方案",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路兴智科技园A栋15层",
            elements: "算法 网络 平台 模块 系统",
            IndustryClassification: "计算机视觉",
          },
          {
            enterpriseId: "XZKJY009",
            enterpriseName: "江苏南大苏富特智能交通科技有限公司",
            legalPerson: "张道林",
            registeredCapital: "1000",
            establishedTime: "2012/1/20",
            AIbusiness: "20%",
            technologyStratification: "4-应用层",
            levelOneAI: "智能交通",
            leveltwoAI: "交通信息化",
            enterpriseProfile:
              "从事城市交通领域的智能化系统集成解决方案及交通信息平台建设、运营、维护服务；主要产品行业监管系统平台、公交管理APP、视频监控管理平台等。",
            qualification: "高企、新四板",
            AIBusinessDirection: "智慧交通",
            content: "交通大数据信息服务整体解决方案",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路6号342室",
            elements: "网络 平台 模块",
            IndustryClassification: "智能交通",
          },
          {
            enterpriseId: "XZKJY010",
            enterpriseName: "南京创新工场科技有限公司",
            legalPerson: "王咏刚",
            registeredCapital: "1000",
            establishedTime: "2017/12/12",
            AIbusiness: "20%",
            technologyStratification: "4-应用层",
            levelOneAI: "智能金融",
            leveltwoAI: "智能金融",
            enterpriseProfile:
              "成立于2017年12月；2018年9月27日，创新工场南京国际人工智能研究院正式落户南京兴智科技园；致力于培养人工智能高端科研与工程人才，研发以机器学习为核心的前沿人工智能技术，并同计算金融领域相结合，为行业场景提供一流的产品和解决方案",
            qualification: "",
            AIBusinessDirection: "AI零售、金融",
            content: "南京创新工场人工智能研究院",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路6号兴智科技园B栋1006室",
            elements: "网络 平台 模块",
            IndustryClassification: "智能零售，智能金融",
          },
          {
            enterpriseId: "XZKJY011",
            enterpriseName: "南京普斯迪尔电子科技有限公司",
            legalPerson: "李鑫",
            registeredCapital: "3000",
            establishedTime: "2010/7/13",
            AIbusiness: "",
            technologyStratification: "",
            levelOneAI: "",
            leveltwoAI: "",
            enterpriseProfile: "",
            qualification: "",
            AIBusinessDirection: '"数据采集、',
          },
          {
            enterpriseId: "XZKJY013",
            enterpriseName: "南京氪信信息技术有限公司",
            legalPerson: "SUN NAN",
            registeredCapital: "1100",
            establishedTime: "2017/6/22",
            AIbusiness: "70%",
            technologyStratification: "4-应用层",
            levelOneAI: "智能金融",
            leveltwoAI: "",
            enterpriseProfile:
              "上海氪信信息技术有限公司的子公司，基于人工智能技术为金融机构提供智能风控、智能营销、智能运营等领域的一体化智能金融解决方案，核心产品及服务体系包括非或然智能引擎平台，模型服务和业务策略咨询",
            qualification: "高企",
            AIBusinessDirection: "AI+金融",
            content: "大数据风控解决方案",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路6号兴智科技园A栋1103室",
            elements: "网络 平台 模块 系统",
            IndustryClassification: "智能金融",
          },
          {
            enterpriseId: "XZKJY014",
            enterpriseName: "英麦尔（南京）科技有限公司",
            legalPerson: " WUXING ",
            registeredCapital: "110",
            establishedTime: "2017/1/23",
            AIbusiness: "20%",
            technologyStratification: "2-技术层",
            levelOneAI: "数据服务",
            leveltwoAI: "",
            enterpriseProfile:
              "数字供应链共享、协同平台，以共享产能、共享库存、共享数据为基础、实现企业内外部的计划协同、交付协同和异常协同",
            qualification: "",
            AIBusinessDirection: "供应链智能转型",
            content: "公安系统数据分析解决方案",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路兴智科技园c栋2001室",
            elements: "算法  网络  ",
            IndustryClassification: "云平台，大数据服务",
          },
          {
            enterpriseId: "XZKJY015",
            enterpriseName: "南京仁通信息技术有限公司",
            legalPerson: "秦旭彦 ",
            registeredCapital: "200",
            establishedTime: "2012/9/18",
            AIbusiness: "10%",
            technologyStratification: "4-应用层",
            levelOneAI: "智能交通",
            leveltwoAI: "",
            enterpriseProfile:
              "从事智能交通领域的软硬件研发和销售工作，业务主要包括交通咨询服务以及智慧停车体系两大领域；南京仁通主攻汽车后服务市场，近两年公司业务范围不断拓展，新开辟了洗车及相关涉车服务，随着南京市内几个新建点位的开业，目前已形成洗车连锁效应",
            qualification: "高企",
            AIBusinessDirection: "智慧城市",
            content: "智能城市道路交通、停车场解决方案",
            Itsarea: "经开区",
            area: "南京经济技术开发区恒泰路8号汇智科技园B2栋1004室",
            elements: "网络 平台 ",
            IndustryClassification: "智能交通",
          },
          {
            enterpriseId: "XZKJY016",
            enterpriseName: "南京佑驾科技有限公司",
            legalPerson: "刘国清",
            registeredCapital: "3000",
            establishedTime: "2018/2/24",
            AIbusiness: "100%",
            technologyStratification: "3-硬件终端",
            levelOneAI: "智能网联汽车",
            leveltwoAI: "高级辅助驾驶系统",
            enterpriseProfile:
              "目前公司主推的产品是高级驾驶辅助系统（ADAS），并逐渐向不同Level的自动驾驶演进",
            qualification: "",
            AIBusinessDirection: "自动驾驶",
            content: "Minieye高级辅助驾驶和无人驾驶系统",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路6号兴智科技园A栋18层",
            elements: "终端 网络 平台 模块 系统",
            IndustryClassification: "智能驾驶，OS",
          },
          {
            enterpriseId: "XZKJY017",
            enterpriseName: "南京快轮智能科技有限公司",
            legalPerson: "刘峰 ",
            registeredCapital: "83",
            establishedTime: "2014/6/10",
            AIbusiness: "70%",
            technologyStratification: "4-应用层",
            levelOneAI: "智能交通",
            leveltwoAI: "智能代步工具",
            enterpriseProfile: "服务上有车辆运营监控；产品上有智能滑板车",
            qualification: "高企、培育独角兽",
            AIBusinessDirection: '"智能代步工具',
          },
          {
            enterpriseId: "XZKJY035",
            enterpriseName: "南京阿波罗机器人科技有限公司",
            legalPerson: "李学骏",
            registeredCapital: "190",
            establishedTime: "2015/4/30",
            AIbusiness: "10%",
            technologyStratification: "4-应用层",
            levelOneAI: "智慧教育",
            leveltwoAI: "",
            enterpriseProfile:
              "服务于4~16岁儿童及青少年，启发孩子掌握机器人的内部构造及编程实现，帮助孩子理解和体验各种理论性、技术性、经验性科学知识与技能",
            qualification: "",
            AIBusinessDirection: "AI教育",
            content: "青少年机器人教育（编程、模型）",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路6号兴智科技园B栋1002室",
            elements: "网络 平台 系统",
            IndustryClassification: "智能教育",
          },
          {
            enterpriseId: "XZKJY036",
            enterpriseName: "南京云孚智能科技有限公司",
            legalPerson: "张文斌",
            registeredCapital: "201",
            establishedTime: "2018/8/14",
            AIbusiness: "90%",
            technologyStratification: "2-技术层",
            levelOneAI: "语音语义",
            leveltwoAI: "",
            enterpriseProfile:
              "语义技术服务商，核心产品包括NLP工具包、知识图谱、文本挖掘、对话系统、舆情监测等，致力于以顶尖的语义技术助力企业智能升级。合作伙伴包括腾讯、百度、科大讯飞、滴滴、VIVO、神州泰岳、传神语联网、慧科等知名企业",
            qualification: "",
            AIBusinessDirection: "自然语言处理",
            content: "基于知识图谱的工业类语义服务",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路6号兴智科技园C栋1808室",
            elements: "网络 平台 系统",
            IndustryClassification: "自然语言处理",
          },
          {
            enterpriseId: "XZKJY037",
            enterpriseName: "南京海果智能科技有限公司",
            legalPerson: "屈桢深 ",
            registeredCapital: "250",
            establishedTime: "2015/2/5",
            AIbusiness: "60%",
            technologyStratification: "2-技术层",
            levelOneAI: "数据服务",
            leveltwoAI: "",
            enterpriseProfile:
              "致力于人工智能技术在互联网金融、机器视觉等方面的行业应用；致力于互联网保险和互联网金融的大数据应用，构建基于Hadoop、Spark、Storm等大数据核心技术的互联网保险和互联网金融商业支撑系统，服务保险/金融机构和投资人",
            qualification: "",
            AIBusinessDirection: "",
            content: "大输液智能灯检机",
            Itsarea: "经开区",
            area: "南京经济技术开发区创智科技园C栋1703室",
            elements: "网络 平台 模块",
            IndustryClassification: "大数据服务",
          },
          {
            enterpriseId: "XZKJY038",
            enterpriseName: "南京青虹网络科技有限公司",
            legalPerson: "薛靖",
            registeredCapital: "200",
            establishedTime: "2017/9/14",
            AIbusiness: "30%",
            technologyStratification: "2-技术层",
            levelOneAI: "VR/AR",
            leveltwoAI: "",
            enterpriseProfile:
              "致力于虚拟现实（VR）相关产业，积极打造“VR+”产业链，主要从事航拍无人机、VR全景拍摄、VR全景监控等相关领域的产品和服务",
            qualification: "",
            AIBusinessDirection: "VR",
            content: "VR全景及网络平台的技术开发、咨询与服务",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路6号兴智科技园C栋1004室",
            elements: "终端 网络 平台 模块",
            IndustryClassification: "移动设备，云平台",
          },
          {
            enterpriseId: "XZKJY039",
            enterpriseName: "南京京东智汇信息技术有限公司",
            legalPerson: "张雱",
            registeredCapital: "2000",
            establishedTime: "2018/5/14",
            AIbusiness: "70%",
            technologyStratification: "2-技术层",
            levelOneAI: "图像识别/语音语义/机器学习",
            leveltwoAI: "",
            enterpriseProfile:
              "“京东（南京）人工智能研究院”将聚焦语音语义、计算机视觉、机器学习等技术领域，以京东实际的业务场景需求为驱动，专注于持续性的算法创新，成为京东生态系统大平台里重要的组成部分",
            qualification: "",
            AIBusinessDirection: "语音语义、计算机视觉、机器学习",
            content: "京东（南京）人工智能研究院",
            Itsarea: "经开区",
            area: "南京经济技术开发区红枫科技园D12栋10层",
            elements: "网络 平台 模块",
            IndustryClassification: "计算机视觉，智能语音，机器学习",
          },
          {
            enterpriseId: "XZKJY040",
            enterpriseName: "南京轩宁信息技术有限公司",
            legalPerson: "司轩斌 ",
            registeredCapital: "200",
            establishedTime: "2019/5/27",
            AIbusiness: "80%",
            technologyStratification: "2-技术层",
            levelOneAI: "生物识别",
            leveltwoAI: "",
            enterpriseProfile: "无官网，无介绍",
            qualification: "",
            AIBusinessDirection: "屏下指纹识别",
            content: "全屏指纹识别",
            Itsarea: "经开区",
            area: "南京市雨花台区花神庙10号02栋602室",
            elements: "终端 网络 平台 模块",
            IndustryClassification: "生物识别",
          },
          {
            enterpriseId: "XZKJY041",
            enterpriseName: "南京众乐互联科技有限公司",
            legalPerson: "程仁庆 ",
            registeredCapital: "100",
            establishedTime: "2018/8/28",
            AIbusiness: "60%",
            technologyStratification: "4-应用层",
            levelOneAI: "智能金融",
            leveltwoAI: "",
            enterpriseProfile: "无官网，无介绍",
            qualification: "",
            AIBusinessDirection: "智慧金融",
            content: "基于人工智能算法的消费行为收集、产能供需匹配的溯源系统",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路6号兴智科技园A栋1103室",
            elements: "网络 平台 ",
            IndustryClassification: "智能金融，OS",
          },
          {
            enterpriseId: "XZKJY042",
            enterpriseName: "南京鹏特信息科技有限公司",
            legalPerson: "刘波",
            registeredCapital: "1200",
            establishedTime: "2015/1/13",
            AIbusiness: "20%",
            technologyStratification: "4-应用层",
            levelOneAI: "智能安防",
            leveltwoAI: "安防硬件产品",
            enterpriseProfile:
              "南京鹏特主要产品有4G执法记录仪，4G手持单兵，4G高清车载，4G应急指挥中心（布控球）一体化手提箱",
            qualification: "",
            AIBusinessDirection: '"无线视屏',
          },
          {
            enterpriseId: '智能安全帽"',
            enterpriseName: "无线通信技术研究及产品开发",
            legalPerson: "经开区",
            registeredCapital: "南京市秦淮区科巷1号1417室",
            establishedTime: "网络 平台 模块",
            AIbusiness: "智能安防",
          },
        ];

        let nanyou = [
          {
            enterpriseId: "XZKJY001",
            enterpriseName: "南京南邮信息产业技术研究院有限公司",
            legalPerson: "孙海安",
            registeredCapital: "2000",
            establishedTime: "2014/12/31",
            AIbusiness: "",
            technologyStratification: "2-技术层",
            levelOneAI: "语音语义/生物识别",
            leveltwoAI: "机器人/智能家居",
            enterpriseProfile:
              "围绕新一代信息技术的发展，特别是在宽带无线通信、大数据、移动互联、智慧城市、信息材料以及信息服务等相关领域，以创新的运作模式推动技术的产业化，着力推动产业链的协同创新，力争建设成为国内知名、国际上有影响力的信息 技术战略性新兴产业创新中心，打造成为国内一流信息产业技术研发创新平台、成果转移孵化平台、项目投资管理平台、产业公共服务平台、创新人才培养平台",
            qualification: "高企",
            AIBusinessDirection: "语音语义、机器人、智能家居、生物识别",
            content: "南京南邮信息产业技术研究院",
            Itsarea: "经开区",
            area: "南京经济技术开发区兴智路兴智科技园B栋906室",
            elements: "算法 终端 网络 平台 模块 系统",
            IndustryClassification:
              "智能语音，自然语言处理，云平台，大数据服务，计算机视觉，智能安防，智能家居，服务机器人",
          },
        ];
        // if(id === 93){
        //     this.officeList =nanyou.concat(arrList.slice(0,2))
        // }else{
        //     var t;
        //     for(var i = 0;i < arrList.length; i++){
        //     var rand = parseInt(Math.random()*arrList.length);
        //     // console.log(rand)
        //         t = arrList[rand];
        //         arrList[rand] =arrList[i];
        //         arrList[i] = t;
        //     }
        //     this.officeList =nanyou.concat(arrList.slice(0,3))
        // }

        this.officeList = res.data.result.companyUserDTOList;
      });
    },
    showImgBox() {
      // this.imgTitle =
      this.imgDialogVisible = true;
    },
    setAllDistribute() {
      // this.map.on("load",()=>{

      this.parkList.features.forEach((marker) => {
        var el = document.createElement("div");
        var txt = document.createElement("h1");
        txt.innerText = marker.properties.mag;
        el.appendChild(txt);
        let magNum = parseInt(marker.properties.mag);

        if (magNum < 9.5) {
          el.style.backgroundImage =
            "url(" + require("../svg/icon-01.png") + ")";
        } else if (magNum > 9.5 && magNum < 20.5) {
          el.style.backgroundImage =
            "url(" + require("../svg/icon-02.png") + ")";
        } else if (magNum > 20.5 && magNum < 30.5) {
          el.style.backgroundImage =
            "url(" + require("../svg/icon-03.png") + ")";
        } else if (magNum > 30.5 && magNum < 40.5) {
          el.style.backgroundImage =
            "url(" + require("../svg/icon-04.png") + ")";
        } else if (magNum > 50.5 && magNum < 60.5) {
          el.style.backgroundImage =
            "url(" + require("../svg/icon-05.png") + ")";
        } else {
          el.style.backgroundImage =
            "url(" + require("../svg/icon-06.png") + ")";
        }
        el.className = "marker";

        el.style.width = "43px";
        el.style.height = "53px";

        el.addEventListener("click", () => {
          // window.alert(marker.properties.id);
          this.enterpriseFlag = true;
          // const map = e.target;
          // console.log(map);
          // const features = map.queryRenderedFeatures(e.point,  { layers: ['earthquake_label'] });

          // console.log(features);

          this.parkName = marker.properties.id;
          const enterList = marker.properties.test;
          this.enterpriseList = enterList;
          this.getQichachaData(this.enterpriseList[0].enterpriseName);
          // if (features.length > 0){
          //     const enterList = JSON.parse(markers.properties.test)
          //     // console.log(enterList)
          //     this.enterpriseList = enterList
          //     this.getQichachaData(this.enterpriseList[0].enterpriseName)
          //     // this.map.off('click','earthquake_label',this.handleMarkerClick);
          // }
          // e.preventDefault()
          setTimeout(() => {
            if (document.getElementById(this.radar)) {
              this.getSomeOneRadarEnterprise();
            }
          }, 2000);
        });

        // add marker to map
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .addTo(this.map);
      });
      // })
    },
  },
};
</script>

<style scoped lang="css">
#map {
  width: 100%;
  height: 100%;
  position: relative;
}
.headerBox {
  position: absolute;
  left: 20px;
  z-index: 2;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.switchBox {
  position: absolute;
  right: 20px;
  top: 50px;
  z-index: 2;
  color: #ffffff;
  margin-right: 10px;
  display: flex;
  align-items: center;
}
.switchTitle {
  font-size: 18px;
  margin-right: 10px;
}
.title {
  color: #ffffff;
  font-size: 30px;
  margin-left: 10px;
}
.bottomBox {
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
.itemsNav {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80px;
  cursor: pointer;
}
.itemsNav i {
  color: #ffffff;
  font-size: 30px;
  margin-bottom: 10px;
}
.itemsNav .name {
  color: #ffffff;
  font-size: 20px;
  margin: 10px 0 0 0;
}
.activeitemsNav {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80px;
  cursor: pointer;
}
.activeitemsNav i {
  color: #f9ce5f;
  font-size: 30px;
  margin-bottom: 10px;
}
.activeitemsNav .name {
  color: #f9ce5f;
  font-size: 20px;
  margin: 10px 0 0 0;
}
</style>
