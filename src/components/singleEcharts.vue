<template>
    <div class="echarts">
        <div :id="id" class="mychart"></div>
    </div>
</template>

<script>
import echarts from "echarts"
export default {
    data() {
        return {
            // questionName:'电动车保修是三年吗？'
        }
    },
    props: ["id"],
    mounted() {
        setTimeout(() => {
            this.getSomeOneRadarEnterprise()
        })
    },
    methods: {
        getSomeOneRadarEnterprise() {
            let myChart = echarts.init(document.getElementById(this.id))
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
                    radius: "70%",
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
                        { name: "算法", max: 100 },
                        { name: "芯片", max: 100 },
                        { name: "模块", max: 100 },
                        { name: "终端", max: 100 },
                        { name: "系统", max: 100 },
                        { name: "网络", max: 100 },
                        { name: "平台", max: 100 },
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
                                value: [90, 80, 50, 70, 50, 70, 60],
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
            }
            myChart.setOption(option)
            window.addEventListener("resize", () => {
                myChart.resize()
            })
        },
    },
}
</script>
<style scoped>
.mychart {
    height: 300px;
    width: 300px;
}
</style>
