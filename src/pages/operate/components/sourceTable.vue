<template>
  <span>
    <el-button size="mini" icon="el-icon-plus" @click="HandleAddSource"><span v-if="btntext">{{btntext}}</span></el-button>
    <el-table :data="sourceListMap" border v-if="sourceListMap && sourceListMap.length || btntext">
      <el-table-column v-for="(col, index) in sourceTableMap" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width"
        :key="index" align="center"></el-table-column>
      <el-table-column label="参与商品数" align="center" v-if="addgoods">
        <template slot-scope="scope" >             
          {{scope.row.shopGoodsList ? scope.row.shopGoodsList.length : '0'}}     
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" v-if="!isradio">
        <template slot-scope="scope">  
          <el-tooltip content="增加商品数" v-if="addgoods">
            <el-button size="mini" icon="el-icon-plus" @click="handleAddGoodsItem(scope)"></el-button>
          </el-tooltip>          
          <el-tooltip content="删除">
            <el-button size="mini" icon="el-icon-delete" @click="handleDeleteSourceItem(scope)" :disabled="scope.row.disabled"></el-button>
          </el-tooltip>         
        </template>
      </el-table-column>
    </el-table>

    <!-- == 来源选择start  ====================== -->
    <el-dialog :title="sourceTitle" :visible.sync="dialogSourceVisible" :width="type=='COUPON' ? '800px':'600px'">
      <source-dialog v-if="dialogSourceVisible && !isradio" :list="dialogList" :table="dialogTable" :total="dialogTotal" :limit="dialogLimit" :page="dialogPage" @submit="dialogSubmit" :isradio="isradio" @pagination="handlePagination"></source-dialog>
      <source-dialog v-if="isradio" :list="dialogList" :table="dialogTable" :total="dialogTotal" :limit="dialogLimit" :page="dialogPage" @submit="dialogSubmit" :isradio="isradio" @pagination="handlePagination"></source-dialog>
    </el-dialog>
    <!-- == 来源选择end  ======================== -->

    <!-- == 商品选择start  ====================== -->
    <el-dialog title="商品列表" :visible.sync="dialogGoodsVisible" width="620px">
      <addGoods @getgoods="handleGoodsSubmit" :list="dialogGoodsList" v-if="dialogGoodsVisible"></addGoods>
    </el-dialog>
    <!-- == 商品选择start  ====================== -->
  </span>
</template>

<script>
import sourceDialog from './sourceDialog'
import addGoods from './addGoods'
import {getShopInfoList, getChannelList, getPromotionList, getLuckyDrawList, getCouponPublishedList} from '@/api/operate'

export default {
  components: {sourceDialog, addGoods},
  props:{
    type: {
      type: String,
      required: true
    },
    isradio: {
      default: false,
      type: Boolean
    },
    btntext: {
      type: String
    },
    addgoods: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      sourceListMap: this.list,
      sourceTableMap: {},
      sourceTitle: '',
      dialogSourceVisible: false,
      // ==goods
      dialogGoodsVisible: false,
      itemIndex: undefined,
      dialogGoodsList:[], // 传递的list列表
      // == dialog
      dialogList: [],
      dialogTable: [],
      dialogTotal: 0,
      dialogLimit: 10,
      dialogPage: 1,
      // map
      SOURCE_TABLE_MAP: { 
        SHOP: [{
            label: "商户id",
            prop: "shopCode"
          },
          {
            label: "商户名称",
            prop: "shopName"
          }
        ],
        CHANNEL: [{
            label: "渠道id",
            prop: "channelCode"
          },
          {
            label: "渠道名称",
            prop: "channelName"
          }
        ],
        PROMOTION: [{
            label: "促销id",
            prop: "strategyId"
          },
          {
            label: "促销名称",
            prop: "name"
          }
        ],
        LUCKY_DRAW: [{
            label: "抽奖id",
            prop: "luckyDrawId"
          },
          {
            label: "抽奖名称",
            prop: "luckyDrawName"
          }
        ],
        COUPON: [{
            label: "卡券id",
            prop: "publishNo"
          },
          {
            label: "卡券类型",
            prop: "couponCategory",
            formatter:(row, col, val) => (this.$enum.COUPON_TYPE_MAP[val])
          },
          {
            label: '卡券状态',
            prop: 'status',
            formatter:(row, col, val) => (this.$enum.COUPON_STATUS_MAP[val])
          }
        ],
      },
      SOURCE_TITLE_MAP: {
        SHOP: '商户列表',
        CHANNEL: '渠道列表',
        PROMOTION: '绑定促销',
        LUCKY_DRAW: '绑定抽奖',
        COUPON: '绑定卡券'
      },
      DIALOG_TABLE_MAP: {
        SHOP: [{
          prop: 'shopName',
          label: '商户名称'
        }],
        CHANNEL: [{
          prop: 'channelName',
          label: '渠道名称'
        }],
        PROMOTION: [{
          prop: 'strategyId',
          label: '促销id'
        },{
          prop: 'name',
          label: '促销名称'
        }],
        LUCKY_DRAW: [{
            label: "抽奖id",
            prop: "luckyDrawId"
          },
          {
            label: "抽奖名称",
            prop: "luckyDrawName"
          }
        ],
        COUPON: [{
            label: "卡券id",
            prop: "publishNo"
          },
          {
            label: "卡券名称",
            prop: "couponName"
          },
          {
            label: '卡券状态',
            prop: 'status',
            formatter:(row, col, val) => (this.$enum.COUPON_STATUS_MAP[val])
          }
        ],
      }
    }
  },
  mounted() {
    this.sourceTableMap = this.SOURCE_TABLE_MAP[this.type]
    // == dialog
    this.dialogTable = this.DIALOG_TABLE_MAP[this.type]
    this.getData()
  },
  methods: {
    // 点击增加来源数据
    HandleAddSource() {
      this.sourceTitle = this.SOURCE_TITLE_MAP[this.type]
      this.dialogSourceVisible = true
    },

    // 删除一行数据数据
    handleDeleteSourceItem(scope) {
      this.$confirm('确认删除该条数据？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        this.sourceListMap.splice(scope.$index, 1)
        this.handleDataFormat()  // 格式化数据并向上传值
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // =================== goods
    handleAddGoodsItem(scope) {
      this.dialogGoodsVisible = true
      this.itemIndex = scope.$index
      let shopGoodsList = this.sourceListMap[this.itemIndex].shopGoodsList
      while(this.dialogGoodsList.length > 0 ) {
        this.dialogGoodsList.shift()
      }
      // 设置 dialogGoodsList 要传递到子组件的数据 
      shopGoodsList && shopGoodsList.forEach((i, ix) => {
        let obj = {number: ix + 1, goodsId: i.goodsId}
        i.disabled && (obj.disabled = true)
        this.$set(this.dialogGoodsList, ix, obj) 
      }) 
    },
    // 子组件addGoods传值
    handleGoodsSubmit(val) {
      this.dialogGoodsVisible = false
      var obj = {...this.sourceListMap[this.itemIndex], shopGoodsList: val}
      this.$set(this.sourceListMap, this.itemIndex, obj)

      this.handleDataFormat() // 格式化数据并向上传值
    },

    //  =================== source
    // 子组件sourceDialog传值
    dialogSubmit(val) {
      if(this.isradio) {
        this.sourceListMap = [val] // 单选的对象，变成表格格式
      } else {
        let hash = {}
        let id = this.SOURCE_TABLE_MAP[this.type][0].prop // 获取各种数据的id的prop，根据id进行过滤
        let newArr = this.sourceListMap.concat(val) // 旧数据合并新数据
        this.sourceListMap = newArr.reduce((item, next) => { // 从旧到新过滤重复
          hash[next[id]] ? '' : hash[next[id]] = true && item.push(next)
          return item
        }, [])
      }
      this.sourceTableMap = this.SOURCE_TABLE_MAP[this.type] // table的列名称
      this.dialogSourceVisible = false
      this.handleDataFormat() // 格式化数据并向上传值
    },

    // 处理数据格式 -- 删除和增加数据的时候都触发
    handleDataFormat() {
      let res
      if(this.isradio) {
        let val = this.sourceListMap[0]
        // 处理返回需要的格式 return Object: {id, name}
        if(this.type == 'PROMOTION') {
          res = {id: val.strategyId, name: val.name  }
        }
        if(this.type == 'LUCKY_DRAW') {
          res = {id: val.luckyDrawId, name: val.luckyDrawName}
        }
        // end
      } else {
        // 处理返回需要的格式 return Array: [{sourceId, sourceName, sourceType}]
        if(this.type == 'CHANNEL')  {
          res = this.sourceListMap.map(i=>{
            return {sourceId:i.channelCode, sourceName:i.channelName, sourceType: this.type}
          })
        }
        if(this.type == 'SHOP')  {
          if(this.addgoods) {
            // 处理返回需要的格式 return  Array: [{sourceId, sourceName, sourceType, goodsId}]
            res = []
            this.sourceListMap.forEach(shop => {
              let obj = {sourceId:shop.shopCode, sourceName:shop.shopName, sourceType:'SHOP'}
              shop.shopGoodsList ? shop.shopGoodsList.forEach(good => res.push({...obj, goodsId: good.goodsId})) : res.push(obj)
            })
          } else {
            res = this.sourceListMap.map(i=>{
              return {sourceId:i.shopCode, sourceName:i.shopName, sourceType: this.type}
            })
          }
        }
        // end
      }
      // 传值父组件
      !!res ? this.$emit('submit', res, this.type) : this.$emit('submit', this.sourceListMap, this.type)
    },

    handlePagination(limit, page) {
      this.dialogPage = page
      this.dialogLimit = limit
      this.getData()
    },

    getData() {
      let res
      if(this.type === 'SHOP') {
        res = getShopInfoList({pageNum: this.dialogPage, pageSize: this.dialogLimit})
      }
      if(this.type === 'CHANNEL') {
        res = getChannelList({pageNum: this.dialogPage, pageSize: this.dialogLimit})
      }
      if(this.type === 'PROMOTION') {
        res = getPromotionList({pageNum: this.dialogPage, pageSize: this.dialogLimit, isEnable: true })
      }
      if(this.type === 'LUCKY_DRAW') {
        res = getLuckyDrawList({pageNum: this.dialogPage, pageSize: this.dialogLimit })
      }
      if(this.type === 'COUPON') {
        res = getCouponPublishedList({pageNum: this.dialogPage, pageSize: this.dialogLimit })
      }
      res.then(res => {
        if(this.type === 'COUPON') {
          if(res.data.success) {
            this.dialogTotal = res.data.data.total
            this.dialogList = res.data.data.list
          }
        } else {
          if(res.data.code == '200') {
            this.dialogTotal = res.data.body.total
            this.dialogList = res.data.body.content
          }
        }
      })
    },

  }
}
</script>

