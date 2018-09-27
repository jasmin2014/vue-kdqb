<!--运营管理 充值服务中心-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>

<template>
<div class="box">
  <!--=========运营管理-充值服务中心-话费 start===========-->


  <el-radio-group v-model="radioTab" style="margin-bottom: 50px;">
    <el-radio-button label="话费"></el-radio-button>
    <el-radio-button label="流量"></el-radio-button>
    <el-radio-button label="油卡"></el-radio-button>
  </el-radio-group>

  <el-form class="form-label flex fixed-width">
    <el-row>
      <el-col :span="7">
        <el-form-item label="运营商">
          <el-input v-model="search.name" placeholder="运营商" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="状态">
          <el-input v-model="search.name" placeholder="状态" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" title="查询" @click="handleSearch"></el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item>
          <el-button type="primary" title="新增" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <el-table :data="list" border :loading="tableLoading">
    <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
    <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width" :key="index" align="center"></el-table-column>
    <el-table-column label="操作" align="center" fixed="right" width="200">
      <template slot-scope="scope">            
        <el-tooltip content="启用">
          <el-button size="small">启用</el-button>
        </el-tooltip>
        <el-tooltip content="编辑">
          <el-button size="small" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
        </el-tooltip>
        <el-tooltip content="删除">
          <el-button size="small" icon="el-icon-delete"></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>

  <el-row type="flex" justify="center" class="mgt20">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]"
      :page-size="limit" layout="prev, pager, next,jumper,sizes,total" :total="total">
    </el-pagination>
  </el-row>

  
  <el-dialog :title="dialogType+radioTab" :visible.sync="dialogVisible" width="500px">
    <el-form label-width="80px" style="width: 430px;">
      <el-form-item label="运营商">
        <kd-select v-model="form.name" :options="operatorOptions"></kd-select>
      </el-form-item>
      <el-form-item label="面值">
        <kd-select  v-model="form.price"  :options="priceOptions"></kd-select>
      </el-form-item>
      <el-form-item label="成本价">
        <el-input type="number" v-model="form.basePrice" placeholder="成本价"></el-input>
      </el-form-item>
      <el-form-item label="销售价">
        <el-input type="number" v-model="form.salePrice" placeholder="销售价"></el-input>
      </el-form-item>
      <el-form-item label="展示图片">
        <el-button size="mini">上传</el-button>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio v-model="form.isActive" :label="1">启用</el-radio>
        <el-radio v-model="form.isActive" :label="0">禁用</el-radio>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>

  <!--=========运营管理-充值服务中心-话费 end===========-->
</div>
</template>

<script>
const FORM_TMP = {
        name: undefined,
        price: undefined,
        basePrice: undefined,
        salePrice: undefined,
        isActive: 1
      }
export default {
  name: "OperateRechargePage",
  data() {
    return {
      radioTab: '话费',
      dialogType: '编辑',
      total: 0, // 列表总数
      limit: 10, // 每页数量
      page: 1, // 当前页数
      tableLoading: false, // table状态
      dialogVisible: false,
      search: {
        name: undefined
      },
      form: {...FORM_TMP},
      list: [{
          id: "DCEM123467989"
      }],
      table: [{
          label: "运营商",
          prop: "id"
        },
        {
          label: "面值（元）",
          prop: "bb"
        },
        {
          label: "成本价（元）",
          prop: "cc"
        },
        {
          label: "销售价（元）",
          prop: "dsg"
        },
        {
          label: "图片",
          prop: "dd"
        },
        {
          label: "状态",
          prop: "isActive"
        }
      ]
    };
  },
  computed: {
    operatorOptions: function () {
      if(this.radioTab == '油卡') {
        return [{
          value: 'oil',
          text: '中国石油'
        }]
      } else {
        return [{
          value: 'chinaMobile',
          text: '中国移动'
        },{
          value: 'chinaUnicom',
          text: '中国联通'
        },{
          value: 'chinaTelecom',
          text: '中国电信'
        }]
      }
    },
    priceOptions: function () {
      return [{
        value: 100,
        text: 100
      },{
        value: 50,
        text: 50
      }]
    }
  },
  methods: {
    handleSearch () {

    },
    handleAdd () {
      this.form = {...FORM_TMP}
      this.dialogType = '新增'
      this.dialogVisible = true
    },
    handleEdit (row) {
      Object.keys(FORM_TMP).forEach((item,i) => {
        this.form[item] = row[item]
      })
      this.dialogType = '编辑'
      this.dialogVisible = true
    },
    getData () {

    },
    handleSizeChange (val) {
      this.limit = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.page = val
      this.getData()
    }
  },
  mounted () {
    this.getData()
  }
}
</script>


