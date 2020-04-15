<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.loginName"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.pwd"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item class="forPwclass">
        <div style="background: #2d3a4b;text-align: right;">
          <span style="font-size:14px;color:#ffffff">忘记密码，点击</span>
          <el-button :loading="loading" type="text" style="font-size:14px" @click.native.prevent="handleReset">重置密码</el-button>
        </div>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      <div class="regBox">
        <div>
          <span style="font-size:14px;color:#ffffff">需要帮助，点击</span>
          <el-button :loading="loading" type="text" style="font-size:14px" @click.native.prevent="handleHelp">帮助</el-button>
        </div>
        <div>
          <span style="font-size:14px;color:#ffffff">没有账号，点击</span>
          <el-button :loading="loading" type="text" style="font-size:14px" @click.native.prevent="handleRegister">注册</el-button>
        </div>
      </div>
      <div>
        <p class="tips">本次征求意见的总体目标是，以推动人工智能技术持续创新和与经济社会深度融合为主线，按照并跑、领跑两步走战略，围绕大数据智能、跨媒体智能、群体智能、混合增强智能、自主智能系统等五大方向持续攻关，从基础理论、支撑体系、关键技术、创新应用四个层面构筑知识群、技术群和产品群的生态环境，抢占人工智能技术制高点，妥善应对可能带来的新问题和新挑战，促进大众创业万众创新，使人工智能成为智能经济社会发展的强大引擎。</p>
      </div>
    </el-form>
  </div>
</template>

<script>
import {login} from '../../api/collect'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        loginName: '',
        pwd: ''
      },
      loginRules: {
        
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      let myData={
        loginName:this.loginForm.loginName,
        pwd:this.loginForm.pwd
      }
      login(myData)
      .then(res=>{
        if(res.code === 200){
          sessionStorage.setItem("user", JSON.stringify(res.result))
          // sessionStorage.setItem("userid",res.result.id)
          this.$router.push({
            path:'/home/warning',
            quert:{
              type:res.result.comType
            }
          })
        }else{
          this.$message.error(res.message)
        }
      })
    },
    handleRegister(){
      this.$router.push({
        path:'/register'
      })
    },
    handleReset(){
      this.$router.push({
        path:'/reset'
      })
    },
    handleHelp(){
      this.$router.push({
        path:'/help'
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .forPwclass{
    border: none;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }


  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .regBox{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tips{
    font-size: 14px;
    color: #889aa4;
    line-height: 24px;
  }
}
</style>
