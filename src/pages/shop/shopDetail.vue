<!--商户管理-商户详情-->
<template>

  <div class="box">
    <el-col :span="8">
      <el-form label-width="140px" :model="shopInfo" :rules="shopInfoRules" ref="shopInfo">

        <!--=======商户管理-商户详情页-个人、对公通用表单===start========-->
        <el-form-item label="商户名称" prop="shopName">
          <kd-input v-model="shopInfo.shopName" :mode="editMode" placeholder="请输入商户名称"></kd-input>
        </el-form-item>

        <el-form-item label="账户类型" prop="accType">
          <el-radio-group v-model.number="shopInfo.accType" :disabled="mode ==='VIEW'">
            <el-radio :label="1">个人账户</el-radio>
            <el-radio :label="2">对公账户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联账号" prop="loginMobile">
          <kd-input v-model="shopInfo.loginMobile" :mode="mode" placeholder="请输入关联账号"></kd-input>
        </el-form-item>

        <!--=======商户管理-商户详情页-个人、对公通用表单===end========-->

        <!--=======商户管理-商户详情页-个人表单===start========-->
        <template v-if="shopInfo.accType===1">
          <el-form-item label="姓名" prop="accName">
            <kd-input v-model="shopInfo.accName" :mode="mode" placeholder="请输入姓名"></kd-input>
          </el-form-item>

          <el-form-item label="身份证号码" prop="accId">
            <kd-input v-model="shopInfo.accId" :mode="mode" placeholder="请输入身份证号码"></kd-input>
          </el-form-item>

          <el-form-item label="银行卡号" prop="accNo">
            <kd-input v-model="shopInfo.accNo" :mode="mode" placeholder="请输入银行卡号"></kd-input>
          </el-form-item>

          <el-form-item label="银行预留手机号" prop="accMobile">
            <kd-input v-model="shopInfo.accMobile" :mode="mode" placeholder="请输入银行预留手机号"></kd-input>
          </el-form-item>
        </template>
        <!--=======商户管理-商户详情页-个人表单===end========-->

        <!--=======商户管理-商户详情页-对公表单===start========-->
        <div v-else>
          <el-form-item label="社会信用代码" prop="accId">
            <kd-input v-model="shopInfo.accId" :mode="mode" placeholder="请输入社会信用代码"></kd-input>
          </el-form-item>

          <el-form-item label="公司名称" prop="accName">
            <kd-input v-model="shopInfo.accName" :mode="editMode" placeholder="请输入公司名称"></kd-input>
          </el-form-item>

          <el-form-item label="银行卡号" prop="accNo">
            <kd-input v-model="shopInfo.accNo" :mode="mode" placeholder="请输入银行卡号"></kd-input>
          </el-form-item>

          <el-form-item label="银行预留手机号" prop="accMobile">
            <kd-input v-model="shopInfo.accMobile" :mode="mode" placeholder="请输入银行预留手机号"></kd-input>
          </el-form-item>

          <el-form-item label="银行卡所属银行" prop="bankCode">
            <kd-select v-model="shopInfo.bankCode" :mode="editMode" :options="bankOptions" @change="bankChangeValue" placeholder="请选择银行卡所属银行"></kd-select>
          </el-form-item>

          <el-form-item label="开户行所在省" prop="provinceCode">
            <kd-select v-model="shopInfo.provinceCode" :mode="editMode" @change="provinceChangeValue" region="省" placeholder="请选择开户行所在省"></kd-select>
          </el-form-item>

          <el-form-item label="开户行所在市" prop="cityCode">
            <kd-select v-model="shopInfo.cityCode" :mode="editMode" @change="cityChangeValue" :region="shopInfo.provinceName" placeholder="请输入选择开户行所在市"></kd-select>
          </el-form-item>

          <el-form-item label="开户行支行" prop="branchName">
            <kd-input v-model="shopInfo.branchName" :mode="editMode" placeholder="请输入开户行支行"></kd-input>
          </el-form-item>
        </div>
        <!--=======商户管理-商户详情页-对公表单===end========-->

        <el-form-item>
          <el-button type="primary" @click="submitForm">{{editMode ==='VIEW'?'编辑':'保存'}}</el-button>
        </el-form-item>

      </el-form>
    </el-col>
  </div>

</template>

<script>

  // 获取商户详情、创建商户信息、更新商户信息
  import {getShopDetail, createShop, updateShop, getBankList, getPartyId} from '../../api/shop';

  export default {
    data() {
      return {
        // 列表页编辑
        mode: 'VIEW',
        // 详情页编辑
        editMode: 'VIEW',
        bankOptions: [],
        // 商户信息
        shopInfo: {
          accType: 0
        },
        // 表单校验规则
        shopInfoRules: {
          shopName: [
            {required: true, message: '请输入商户名称', trigger: 'blur'}
          ],
          accType: [
            {required: true, message: '请选择账户类型', trigger: 'change'}
          ],
          loginMobile: [
            {required: true, message: '请输入关联账号', trigger: 'blur'},
            {validator: this.validatePartyId, trigger: 'blur'}
          ],
          accNo: [
            {required: true, message: '请输入银行卡号', trigger: 'blur'},
            {pattern: this.$valid.card, message: "请输入正确的银行卡号", trigger: "blur"}
          ],
          accMobile: [
            {required: true, message: '请输入银行预留手机号', trigger: 'blur'},
            {pattern: this.$valid.mobile, message: "请输入正确的手机号", trigger: "blur"}
          ],
          bankCode: [
            {required: true, message: '请选择银行卡所属银行', trigger: 'change'}
          ],
          provinceCode: [
            {required: true, message: '请选择开户行所在省', trigger: 'change'}
          ],
          cityCode: [
            {required: true, message: '请输入选择开户行所在市', trigger: 'change'}
          ],
          branchName: [
            {required: true, message: '请输入开户行支行', trigger: 'blur'}
          ],
          accName: {},
          accId: {}
        }
      };
    },
    created() {

      const _self = this;

      // 获取列表进入页面状态，VIEW:查看、CREATE:新增、EDIT:编辑
      if (_self.$route.query.mode === 'CREATE') _self.mode = 'CREATE';
      _self.editMode = _self.$route.query.mode;

      // 商户id
      _self.shopInfoId = _self.$route.query.shopInfoId;

      // 商户类型，默认个人，触发watch，调整规则
      _self.shopInfo.accType = 1;

      // 根据mode调整面包屑文字内容
      let title = '';
      switch (_self.mode) {
        case 'CREATE':
          title = '新增商户';
          break;
        case 'VIEW':
          title = '查看商户';
          break;
        case 'EDIT':
          title = '编辑商户';
          break;
        default:
          title = '新增商户';
          _self.mode = 'CREATE';
          _self.editMode = 'CREATE';
          break;
      }
      _self.$route.meta.title = title;

      // 获取商户详细信息
      _self.getShopDetail();

    },
    methods: {
      /**
       * 获取商户详细数据
       */
      getShopDetail() {
        const _self = this;
        _self.mode !== 'CREATE' && _self.shopInfoId && getShopDetail({shopInfoId: _self.shopInfoId})
          .then((result => {
            result = result.data;
            if (result.code == 200) {
              _self.shopInfo = result.body;
            } else {
              _self.$message({
                showClose: true,
                message: result.message,
                type: 'error'
              });
            }
          }))
      },
      /**
       * 底部按钮点击操作执行
       */
      submitForm() {
        const _self = this;

        console.log(1111)
        // 提交时，表单内容校验
        this.$refs['shopInfo'].validate()
          .then(() => {
            console.log(22222)
            // 创建时，调用新增商户接口
            if (_self.editMode === 'CREATE') {
              createShop(_self.shopInfo)
                .then((result => {
                  result = result.data;
                  if (result.code == 200) {
                    this.$message({
                      type: 'success',
                      message: '添加成功'
                    });
                    this.$router.go(-1);
                  } else {
                    _self.$message({
                      showClose: true,
                      message: result.message,
                      type: 'error'
                    });
                  }
                }))

              // 列表页点击查看进入，详情页点击编辑，将可编辑内容置为可编辑状态
            } else if (_self.editMode === 'VIEW') {
              this.editMode = 'EDIT';

              // 保存时，调用更新商户接口
            } else if (_self.editMode === 'EDIT') {
              updateShop(_self.shopInfo)
                .then((result => {
                  result = result.data;
                  if (result.code == 200) {
                    this.$message({
                      type: 'success',
                      message: '编辑成功'
                    });
                    this.$router.go(-1);
                  } else {
                    _self.$message({
                      showClose: true,
                      message: result.message,
                      type: 'error'
                    });
                  }
                }))
            }
          })
          .catch(() => {
            _self.$message({
              showClose: true,
              message: '表单校验失败',
              type: 'error'
            });
          })
      },
      /**
       * 省份select变动监听
       * @param value 选取后的省份文字信息
       */
      provinceChangeValue(value) {
        this.shopInfo.cityName = ''; // 选取后将城市文字信息置为空
        this.shopInfo.provinceName = value; // 选取后provinceText赋值省份文字信息
      },
      /**
       * 城市select变动监听
       * @param value 选取后的城市文字信息
       */
      cityChangeValue(value) {
        this.shopInfo.cityName = value;// 选取后cityName赋值城市文字信息
      },
      /**
       * 银行select变动监听
       * @param value 选取后的银行文字信息
       */
      bankChangeValue(value) {
        this.shopInfo.bankName = this.bankOptions.find(_ => _.value === value).text;
      },
      /**
       * 根据输入的关联账号手机号，获取用户partyId
       *
       */
      validatePartyId(rule, value, callback) {
        const _self = this;

        if (_self.mode === 'CREATE') {
          getPartyId({cellphone: value}).then((result => {
            result = result.data;
            if (result.code == 200 && result.body && result.body.partyId) {
              this.shopInfo.partyId = result.body.partyId;
              callback();
            } else {
              callback(new Error('未找到关联账号，请重新输入'));
            }
          }))
        } else {
          callback();
        }
      }
    },
    watch: {
      /**
       * 账户类型监听
       * @param val 1:个人账户，2:对公账户
       */
      'shopInfo.accType'(val) {
        const _self = this;

        // 根据accType，加载不同校验规则及提示信息；个人时，accName为姓名；对公时，accName为公司
        _self.shopInfoRules.accName = [
          {required: true, message: val === 1 ? '请输入姓名' : '请输入公司名称', trigger: 'blur'}
        ];

        // 根据accType，加载不同校验规则及提示信息；个人时，accId为身份证号码；对公时，accId为社会信用代码
        _self.shopInfoRules.accId = [
          {required: true, message: val === 1 ? '请输入身份证号码' : '请输入社会信用代码', trigger: 'blur'},
          {pattern: val === 1 ? _self.$valid.ident : _self.$valid.usciCode, message: val === 1 ? '请输入正确的身份证号码' : '请输入正确的社会信用代码', trigger: "blur"}
        ];

        val !== 1 && getBankList()
          .then((result => {
            result = result.data;
            if (result.code == 200) {

              this.bankOptions = result.body.map(_ => ({
                text: _.bankName,
                value: _.bankCode
              }))

            } else {
              _self.$message({
                showClose: true,
                message: result.message,
                type: 'error'
              });
            }
          }));

        // 清除表单校验提示内容
        _self.$refs['shopInfo'].clearValidate();

      }
    }
  };

</script>
