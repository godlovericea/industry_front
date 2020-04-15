<template>
    <div class="tabBox">
        <div class="helpHeaderBox">
            <h2>产业生态图填报流程帮助文档</h2>
        </div>
        <div class="warnTips">
            <p>为促进产业生态圈建设的发展，优化资源配置，开展南京经济技术开发区内企业产业生态图素材征集工作，特开发产业生态图资料收集系统，该系统帮助文档如下：</p>
        </div>
        <div class="helpContent">
            <p class="contentTitle">一、流程介绍</p>
            <div>
                <img src="../../assets/help/steps.png" alt="" class="stepsPng">
            </div>
            <p class="contentTitle">二、功能介绍</p>
            <p>1，登录</p>
            <p>输入正确的用户名和密码，点击 <el-button type="text" @click="goLogin">登录</el-button>按钮，即可进入系统。</p>
            <p>2，注册</p>
            <p>新企业用户在登录页面上点击<el-button type="text" @click="goRegister">注册</el-button>按钮，即可进入公司注册页面。</p>
            <p>请正确填写公司名称、企业类型、统一社会信用代码、用户名、密码和确认密码。填写过程中，请根据公司实际情况填写企业类型。</p>
            <p>3，基本信息</p>
            <p>用户登录系统后选择进入【基本信息】页面</p>
            <p>完善基本信息资料并完成提交</p>
            <p>4，场景信息</p>
            <p>用户点击左栏【场景信息】，进入场景信息页面</p>
            <p>场景信息包含场景分类、场景名称、场景定义、场景关键字、上传图片（提供不超过8张描述场景的图片，单张图大小不超过4M,格式为png或jpeg）、上传视频（视频大小不超过100M，格式为MP4）等，填报完毕点击提交</p>
        </div>
        <div class="concatBox">
            <p class="contentTitle">三、产业生态图QQ交流群(群号：1065561981)</p>
            <div class="">
                <img src="../../assets/help/qq.png" alt="" class="qqPng">
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        goLogin(){
            this.$router.push({
                path:'/'
            })
        },
        goRegister(){
            this.$router.push({
                path:'/register'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.tabBox{
    padding: 20px;
    background-color: #2d3a4b;
    // height: 100%;
    .helpHeaderBox{
        width: 100%;
        text-align: center;
        color: #ffffff;
    }
    .warnTips{
        color: #f4f4f4;
        font-size: 18px;
    }
    .helpContent{
        color: #fff;
        .contentTitle{
            font-size: 20px;
        }
        .stepsPng{
            width: 60%;
        }
    }
    .concatBox{
        color: #fff;
        font-size: 20px;
    }
    .pagnation{
        padding: 20px 0;
        text-align: center;
    }
}
</style>