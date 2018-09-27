<!--激活-->
<template>
  <div class="app-account">
    <top-header></top-header>
    <div class="main">
      <div class="users">
        <div class="wrapper" v-if="!isActiveSuccess">
          <h2>账号激活</h2>
          <section class="phone">
            <el-input v-model.trim="actives.phone"
                      ref="phone"
                      placeholder="请输入手机号"
                      autofocus
                      @input="handlePhoneChange"
                      @keyup.native.enter="handleLogin"></el-input>
          </section>
          <section class="code">
            <el-row>
              <el-col :span="14">
                <el-input v-model.trim="actives.code"
                          ref="code"
                          placeholder="请输入短信验证码"
                          @input="handleCodeChange"
                          @keyup.native.enter="handleLogin"></el-input>
              </el-col>
              <el-col :span="8" :offset="1">
                <el-button type="primary" plain
                           :disabled="disabledCode"
                           tabindex="-1"
                           @click="handleCode">{{ btnCountDown || '获取验证码' }}
                </el-button>
              </el-col>
            </el-row>
          </section>
          <section class="password">
            <el-input v-model="actives.password"
                      ref="password"
                      placeholder="请输入6-20位密码，包含数字、字母或符号"
                      type="password"
                      @input="handlePasswordChange"
                      @keyup.native.enter="handleLogin"></el-input>
          </section>
          <section class="picturevalidate">
            <el-input v-model="actives.passwordok"
                      ref="passwordok"
                      placeholder="确认新密码"
                      type="password"
                      @input="handlePasswordChange"
                      @keyup.native.enter="handleLogin"></el-input>
          </section>
          <section class="act action">
            <el-button type="primary"
                       :loading="loading"
                       @click="handleLogin">提交
            </el-button>
          </section>
          <section class="act cancle">
            <el-button @click="handleCancel">取消</el-button>
          </section>
        </div>
        <!--<div class="wrapper" v-else>-->
          <!--<section class="isactivation">-->
            <!--<p class="success"><i class="el-icon-circle-check"></i>账号已激活</p>-->
            <!--<p>3s后自动返回登录界面</p>-->
          <!--</section>-->
          <!--<div class="footertext">-->
            <!--<p>-->
              <!--若不能自动返回，请点击-->
              <!--<router-link :to="{name: 'LoginPage', params: {phone: actives.phone}}" title="跳转到登录链接">跳转链接</router-link>-->
            <!--</p>-->
          <!--</div>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import {doActivate, sendCode} from '../../api/user';
  import TopHeader from './components/header.vue';

  const ILLEGAL_PHONE = 'ILLEGAL_PHONE';
  const ILLEGAL_PASSWORD = 'ILLEGAL_PASSWORD';
  const ILLEGAL_PASSWORD_NO_SPACE = 'ILLEGAL_PASSWORD_NO_SPACE';
  const NULL_CODE = 'NULL_CODE';
  const NULL_PASSWORD = 'NULL_PASSWORD';
  const INCONSISTENT_PASSWORD = 'INCONSISTENT_PASSWORD';
  const NO_AUTHORITY = 'NO_AUTHORITY';
  const NETWORK_ERROR = 'NETWORK_ERROR';
  const SEND_CODE_SUCCESS = 'SEND_CODE_SUCCESS';
  const SEND_CODE_FAILED = 'SEND_CODE_FAILED';
  const USAGE_ACTIVATE = 'REGISTER';  //识别注册验证码
  const phoneRegexp = /^1[34578]\d{9}$/;
  export default {
    name: 'ActivationPasswordPage',
    components: {TopHeader},
    data() {
      return {
        isActiveSuccess: false,
        actives: {
          phone: '',
          password: '',
          code: '',
          passwordok: ''
        },
        disabledCode: true,
        btnCountDown: '',
        loading: false,
      }
    },
    created() {
      this.actives.phone = this.$route.params.phone;
      // this.$refs.phone.$emit('input', this.actives.phone);
      // this.$refs.phone.$refs.input.focus();
      // console.log('refs',this.$refs);
      // console.log('phone',this.$refs['phone']);

    },
    methods: {
      //监听手机号码
      handlePhoneChange(phone) {
        this.disabledCode = !phoneRegexp.test(phone);
        this.$refs.phone.$refs.input.classList.remove('error');
      },
      //监听短信验证码
      handleCodeChange(code) {
        if (code) {
          this.$refs.code.$refs.input.classList.remove('error');
        }
      },
      //监听新密码
      handlePasswordChange(password) {
        if (password) {
          this.$refs.password.$refs.input.classList.remove('error');
          this.$refs.passwordok.$refs.input.classList.remove('error');
        }
      },

      //获取验证码
      handleCode() {
        const phone = this.actives.phone;
        this.sendCode(USAGE_ACTIVATE, phone);
      },
      handleLogin() {
        const phone = this.actives.phone;
        const code = this.actives.code;
        const password = this.actives.password;
        const passwordok = this.actives.passwordok;

        if (!phoneRegexp.test(phone)) { //非法手机号
          this.$refs.phone.$refs.input.focus();
          this.$refs.phone.$refs.input.classList.add('error');
          this.$message({
            message: this.getMessageByIllegalType(ILLEGAL_PHONE),
            type: 'error'
          });
        } else if (!code) { //空验证码
          this.$refs.code.$refs.input.focus();
          this.$refs.code.$refs.input.classList.add('error');
          this.$message({
            message: this.getMessageByIllegalType(NULL_CODE),
            type: 'error'
          });
        } else if (!password) { //空密码
          this.$refs.password.$refs.input.focus();
          this.$refs.password.$refs.input.classList.add('error');
          this.$message({
            message: this.getMessageByIllegalType(NULL_PASSWORD),
            type: 'error'
          });
        } else if (passwordok !== password) { //两次密码不一样
          this.$refs.password.$refs.input.focus();
          this.$refs.password.$refs.input.classList.add('error');
          this.$refs.passwordok.$refs.input.classList.add('error');
          this.$message({
            message: this.getMessageByIllegalType(INCONSISTENT_PASSWORD),
            type: 'error'
          });
        } else if (!password.match(new RegExp('(?!^[0-9]+$)(?!^[a-zA-Z]+$)(?!^[^a-zA-Z0-9]+$)^.{6,20}$')) ||
          password.indexOf(' ') > -1) { //密码不合规
          this.$refs.password.$refs.input.focus();
          this.$refs.password.$refs.input.classList.add('error');
          this.$refs.passwordok.$refs.input.classList.add('error');
          if (password.indexOf(' ') > -1) {
            this.$message({
              message: this.getMessageByIllegalType(ILLEGAL_PASSWORD_NO_SPACE),
              type: 'error'
            });
          } else {
            this.$message({
              message: this.getMessageByIllegalType(ILLEGAL_PASSWORD),
              type: 'error'
            });
          }
        } else {
          this.loading = true;
          this.doActivate(phone,code,password);
        }
      },


      handleCancel() {
        const phone = this.actives.phone;
        this.$router.push({ name: 'LoginPage', params: { phone } });
      },

      //激活
      doActivate(phone, phoneCode, password) {
        doActivate(phone, phoneCode, password).then(({data}) => {
          if (data.code == 200) {
            this.$message({
              message: '激活成功',
              type: 'success'
            });
            this.$router.push({ name: 'LoginPage', params: { phone } });
          } else if (data.code === '201002') {
            if (data.message.indexOf('手机') > -1) {
              this.$refs.phone.$refs.input.focus();
              this.$refs.phone.$refs.input.classList.add('error');
            } else if (data.message.indexOf('验证码') > -1) {
              this.$refs.code.$refs.input.focus();
              this.$refs.code.$refs.input.classList.add('error');
            } else if (data.message.indexOf('密码') > -1) {
              this.$refs.password.$refs.input.focus();
              this.$refs.password.$refs.input.classList.add('error');
              this.$refs.passwordok.$refs.input.classList.add('error');
            }
          } else if (data.code == '202002') {
            this.$refs.code.$refs.input.focus();
            this.$refs.code.$refs.input.classList.add('error');
          }else {
            this.$message({
              message: data.message,
              type: 'error'
            });
          }
        })
      },

      sendCode(usage, phone) {
        sendCode(usage, phone).then(({data}) => {
          if (data.code == 200) {
            this.countDown(60);
            this.$message({
              message: this.getMessageByIllegalType(SEND_CODE_SUCCESS),
              type: 'success'
            })
          } else {
            this.$message({
              message: data.message,
              type: 'error'
            })
          }
        }).catch(() => {
          this.$message({
            message: this.getMessageByIllegalType(NETWORK_ERROR),
            type: 'error'
          })
        })
      },
      countDown(sec) {
        if (sec >= 0) {
          this.disabledCode = true;
          this.btnCountDown = `剩余${sec}s`;
          setTimeout(() => {
            this.countDown(--sec);
          }, 1000)
        } else {
          this.disabledCode = false;
          this.btnCountDown = '';
        }
      },
      getMessageByIllegalType(type) {
        let msg = '';
        switch (type) {
          case ILLEGAL_PHONE:
            msg = '请输入正确的手机号';
            break;
          case ILLEGAL_PASSWORD:
            msg = '密码为6-20位数字、字母或符号';
            break;
          case ILLEGAL_PASSWORD_NO_SPACE:
            msg = '密码不能包含空格';
            break;
          case NULL_PASSWORD:
            msg = '请输入密码';
            break;
          case NULL_CODE:
            msg = '请输入验证码';
            break;
          case INCONSISTENT_PASSWORD:
            msg = '两次密码不一致';
            break;
          case NO_AUTHORITY:
            msg = '没有系统权限';
            break;
          case NETWORK_ERROR:
            msg = '您的网络有问题，请稍后再试';
            break;
          case SEND_CODE_FAILED:
            msg = '发送验证码失败';
            break;
          case SEND_CODE_SUCCESS:
            msg = '发送成功';
            break;
          default:
            msg = type;
            break;
        }
        return msg;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
