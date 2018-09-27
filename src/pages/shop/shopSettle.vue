<!--商户管理-商户结算-->
<template>
  <div class="box">
    <!--=======商户管理-商户结算页-筛选条件===start========-->
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="贷款编号">
            <kd-input v-model="searchParams.loanApplyId" placeholder="请输入贷款编号" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="商品订单号">
            <kd-input v-model="searchParams.platOrderId" placeholder="请输入商品订单号" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商户名称">
            <kd-input v-model="searchParams.shopName" placeholder="请输入商户名称" clearable></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="生成时间">
            <el-date-picker
              v-model="searchParams.createdTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="实际结算时间">
            <el-date-picker
              v-model="searchParams.transferDate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="结算方式">
            <kd-select v-model="searchParams.transferType" :group="$enum.CLEAR_WAY" placeholder="请选择结算方式" clearable></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="结算状态">
            <kd-select v-model="searchParams.transferStatus" :group="$enum.CLEAR_STATUS" placeholder="请选择结算状态" clearable></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" title="查询" @click="handleSearch"></el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" title="导出 Excel" @click="handleExport">导出 Excel</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--=======商户管理-商户结算页-筛选条件===end========-->

    <!--=======商户管理-商户结算页-列表数据===start========-->
    <el-row>
      <el-table :data="settlementList" ref="multipleTable" @selection-change="handleSelectionChange"> border>
        <el-table-column type="selection" :selectable="selectable" width="50" align="center"></el-table-column>
        <el-table-column v-for="(col, index) in settlementTable" :prop="col.prop" :label="col.label" :key="index" align="center" :formatter="col.formatter||$tableDefFormat"></el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination
        :total="searchParams.total"
        :page-size="searchParams.pageSize"
        :current-page.sync="searchParams.pageNum"
        layout="total, prev, pager, next, jumper"
        @current-change="handleSearch"></el-pagination>
    </el-row>
    <!--=======商户管理-商户结算页-列表数据===end========-->

    <!--=======商户管理-商户结算页-批量结算===start========-->
    <el-row v-if="settleParams.isShow">
      <el-form class="form-label flex fixed-width" :model="settleParams" :rules="settleRules" ref="settleParams">
        <el-row type="flex" justify="center" class="mgt20">
          <el-col :span="6">
            <el-form-item label="放款账户" prop="orgPartyId">
              <kd-select v-model="settleParams.orgPartyId" :group="$enum.LOAN_BANK_ACCOUNT" placeholder="请选择放款账户" clearable></kd-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结算方式" prop="transferType">
              <kd-select v-model="settleParams.transferType" :group="$enum.CLEAR_WAY" placeholder="请选择结算方式" clearable></kd-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-form-item label="应结算金额">
              <kd-input v-model.number="settleParams.settleBalance" mode="VIEW"></kd-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="账户余额" prop="availableBalance">
              <kd-input v-model="settleParams.availableBalance" mode="VIEW"></kd-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" title="查询" @click="handelSellet">结算</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <!--=======商户管理-商户结算页-批量结算===end========-->

  </div>
</template>

<script>

  // 获取商户结算数据
  import {getSettleList, getAccountAmount, commitSettle, exportSettleExcel} from '../../api/shop';

  export default {
    data() {
      return {
        // 筛选条件
        searchParams: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        // 结算内容
        settleParams: {
          settleBalance: 0,
          availableBalance: 0,
          shopSettleIds: [],
          isShow: false
        },
        // 结算表单校验规则
        settleRules: {
          orgPartyId: [
            {required: true, message: '请选择放款账户', trigger: 'change'}
          ],
          transferType: [
            {required: true, message: '请选择结算方式', trigger: 'change'}
          ],
          availableBalance: [
            {required: true, message: '账户余额不足', trigger: 'blur'}
          ],
        },
        // 列表数据
        settlementList: [],
        // 选中数据
        multipleSelection: [],
        // 列表title
        settlementTable: [
          {
            label: "贷款编号",
            prop: "loanApplyId"
          },
          {
            label: "商品订单号",
            prop: "platOrderId"
          },
          {
            label: "生成时间",
            prop: "createdTime"
          },
          {
            label: "商户名称",
            prop: "shopName"
          },
          {
            label: "商户银行卡号",
            prop: "accNo"
          },
          {
            label: "结算金额",
            prop: "settleAmount"
          },
          {
            label: "结算项目名称",
            prop: "settleItemName"
          },
          {
            label: "结算方式",
            prop: "transferType",
            formatter: (row, col, val) => this.$filter(val, this.$enum.CLEAR_WAY)
          },
          {
            label: "结算状态",
            prop: "transferStatus",
            formatter: (row, col, val) => this.$filter(val, this.$enum.CLEAR_STATUS)
          },
          {
            label: "实际结算时间",
            prop: "transferDate"
          },
          {
            label: "实际结算金额",
            prop: "realSettleAmount"
          },
          {
            label: "放款账户",
            prop: "orgAccountName",
            formatter: (row, col, val) => this.$filter(val, this.$enum.LOAN_BANK_ACCOUNT)
          },
          {
            label: "操作人",
            prop: "updatedBy"
          }
        ]
      };
    },
    created() {
      this.handleSearch()
    },
    methods: {
      /**
       * 获取结算数据
       */
      handleSearch() {
        const _self = this;

        // 时间控件处理，将生成时间拆分赋值到createdTimeStart、createdTimeEnd
        if (_self.searchParams.createdTime && _self.searchParams.createdTime.length === 2) {
          _self.searchParams.createdTimeStart = _self.searchParams.createdTime[0];
          _self.searchParams.createdTimeEnd = _self.searchParams.createdTime[1];
        } else {
          delete _self.searchParams.createdTimeStart;
          delete _self.searchParams.createdTimeEnd;
        }

        // 时间控件处理，将实际结算时间拆分赋值到transferDateStart、transferDateEnd
        if (_self.searchParams.transferDate && _self.searchParams.transferDate.length === 2) {
          _self.searchParams.transferDateStart = _self.searchParams.transferDate[0];
          _self.searchParams.transferDateEnd = _self.searchParams.transferDate[1];
        } else {
          delete _self.searchParams.transferDateStart;
          delete _self.searchParams.transferDateEnd;
        }

        getSettleList(_self.searchParams).then((result => {
          result = result.data;
          if (result.code == 200) {
            _self.searchParams.total = result.body.total;
            _self.settlementList = result.body.content;

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
       * 列表选中监听
       * @param val 被选中的数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.settleParams.settleBalance = 0;
        this.settleParams.shopSettleIds = [];
        this.settleParams.isShow = false;
        val.forEach((_) => {
          this.settleParams.isShow = true;
          this.settleParams.settleBalance += _.settleAmount;
          this.settleParams.shopSettleIds.push(_.shopSettleId);
        })
      },
      handelSellet() {
        // 提交时，表单内容校验
        this.$refs['settleParams'].validate()
          .then(() => {
            commitSettle(this.settleParams).then((result => {
              result.data.code == 200 && this.handleSearch()
            }))
          })
          .catch(() => {
            this.$message({
              showClose: true,
              message: '表单校验失败',
              type: 'error'
            });
          })
      },
      /**
       * 调整列表checkbox是否可选中
       * @param row 当前行信息
       * @returns {number} 1:可选中，0:不可选中
       */
      selectable(row) {
        if (row.transferStatus != 1 && row.transferStatus != 2 && (!this.multipleSelection[0] || (this.multipleSelection[0] && this.multipleSelection[0].shopId === row.shopId))) {
          return 1;//可选
        } else {
          return 0;//不可选
        }
      },
      /**
       * 导出Excel功能
       */
      handleExport() {
        const _self = this;
        exportSettleExcel(_self.searchParams)
          .then((result => {
            if (result.status == 200) {
              let data = result.data;
              let filename = result.headers["content-disposition"]
                ? result.headers["content-disposition"].split("filename=")[1]
                : "settlement_list.xlsx";
              this.$downloadExcel(data, filename);
            }
          }))
      }
    },
    watch: {
      'settleParams.orgPartyId'(val) {
        this.settleParams.partyId = val;
        this.settleParams.availableBalance = 0;
        val && getAccountAmount({partyId: val}).then((result => {
          result = result.data;
          if (result.code == 200 && result.body) {
            this.settleParams.availableBalance = result.body.availableBalance || 0
          }
        }))
      },
      'settleParams.isShow'(val) {
        val && getAccountAmount({partyId: val}).then((result => {
          result = result.data;
          if (result.code == 200 && result.body) {
            this.settleParams.availableBalance = result.body.availableBalance || 0
          }
        }))
      }
    }
  };
</script>
