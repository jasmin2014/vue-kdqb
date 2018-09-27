<!-- 用户认证信息 -->
<template>
  <div class="box">
    <div class="info">
      <h4><span>认证情况</span></h4>
    </div>
    <el-form class="flex" label-width="120px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="实名认证">
            <el-input v-model="detail.realName==true ?'已认证':'未认证'" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="协议支付认证">
            <kd-input v-model="detail.accumulationFund==true ?'已认证':'未认证'" disabled></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="淘宝/支付宝认证">
            <kd-input v-model="detail.taobaoAlipay==true ?'已认证':'未认证'" disabled></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="个人信息认证">
            <kd-input v-model="detail.personalInformation==true ?'已认证':'未认证'" disabled></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="联系人认证">
            <kd-input v-model="detail.contact==true ?'已认证':'未认证'" disabled></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="公积金认证">
            <kd-input v-model="detail.accumulationFund==true ?'已认证':'未认证'" disabled></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="微信认证">
            <kd-input v-model="detail.weixin==true ?'已认证':'未认证'" disabled></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="代扣认证">
            <kd-input v-model="detail.withhold==true ?'已认证':'未认证'" disabled></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="芝麻信用认证">
            <kd-input v-model="detail.sesameCredit==true ?'已认证':'未认证'" disabled></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="央行认证">
            <kd-input v-model="detail.centralBank==true ?'已认证':'未认证'" disabled></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="信用卡认证">
            <kd-input v-model="detail.creditCard==true ?'已认证':'未认证'" disabled></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="京东认证">
            <kd-input v-model="detail.jingdong==true ?'已认证':'未认证'" disabled></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="运营商认证">
            <kd-input v-model="detail.operators==true ?'已认证':'未认证'" disabled></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="人脸识别认证">
            <kd-input v-model="detail.face==true ?'已认证':'未认证'" disabled></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="人脸识别评分">
            <kd-input disabled>{{detail.faceScore}}</kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="存管认证">
            <kd-input v-model="detail.depository==true ?'已认证':'未认证'" disabled></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="info">
      <h4><span>认证记录</span></h4>
    </div>
    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center"></el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="search.pageNum"
        :page-size="search.pageSize"
        layout="sizes,total, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import * as api from "../../api/user.js";

  export default {
    components: {},
    data() {
      return {
        id: this.$route.params.id,
        search: {
          pageNum: 1,
          pageSize: 10
        },
        pageTotal: 0,
        list: [],
        detail: {},
        table: [
          {
            label: '认证类型',
            prop: 'verificationType',
            formatter: (row, col, val) => this.$filter(val, this.$enum.AUTH_MODEL)
          },
          {
            label: '认证结果',
            prop: 'verificationResult',
            formatter: (row, col, val) => val == 1 ? '认证成功' : (val==0 ? '认证中' : '认证失败')
          },
          {
            label: '认证分数',
            prop: 'authScore'
          },
          {
            label: '截止有效期',
            prop: 'validityDateEnd'
          },
          {
            label: '操作时间',
            prop: 'verificationTime'
          }
        ]
      }
    },
    computed: {
      appDate: {
        get() {
          if (this.search.openStart || this.search.openEnd) {
            let dateRange = [];
            dateRange[0] = this.search.openStart;
            dateRange[1] = this.search.openEnd;
            return dateRange;
          } else {
            return [];
          }
        },
        set(range) {
          if (range) {
            this.search.openStart = range[0];
            this.search.openEnd = range[1];
          } else {
            this.search.openStart = '';
            this.search.openEnd = '';
          }
        }
      }
    },
    created() {
      this.getData(this.search.pageSize,this.search.pageNum)
      this.getAuthInfo();
    },
    methods: {
      handleCurrentChange(val){
        this.search.pageNum = val
        this.getData(this.search.pageSize,val);
      },
      handleSizeChange(val){
        this.search.pageSize = val
        this.getData(val,this.search.pageNum)
      },
      //获取待办列表
      getData(pageSize,pageNum) {
        const mySearch = this.$deepcopy(this.search);
        mySearch.pageSize = pageSize;
        mySearch.pageNum = pageNum;
        api.getAuthList(this.id, mySearch).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.list = res.body.content;
            this.pageTotal = res.body.total;
          }
        });
      },
      //认证情况
      getAuthInfo() {
        api.getAuthInfo(this.id).then(response => {
          const res = response.data;
          if (res.code == 200) {
            if(res.body){
              this.detail = res.body;
            }
          }
        })
      }
    }
  };
</script>

