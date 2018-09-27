<template>
  <!-- ==  商品列表start  ====================== -->
  <div>
    <!-- <div v-if="oldDisabledList.length > 0" style="color: #999">提示：共{{oldDisabledList.length}}条不可编辑的商品数，新导入的数据为新增的商品，不会覆盖不可编辑的商品</div> -->
    <el-table :data="goodsListComputed" border>
      <el-table-column label="序号" align="center" width="80" >
        <template slot-scope="scope">             
          {{scope.$index + 1 + (pageGoods - 1)*limitGoods }}    
        </template>
      </el-table-column>
      <el-table-column v-for="(col, index) in goodsTable" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width"
        :key="index" align="center"></el-table-column>  
      <el-table-column label="操作" align="center" width="80" >
        <template slot-scope="scope">             
          <el-tooltip content="删除">
            <el-button size="small" :disabled="scope.row.disabled" icon="el-icon-delete" @click="handleDeleteGoods(scope)"></el-button>
          </el-tooltip>         
        </template>
      </el-table-column>
    </el-table>
  
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination @size-change="handleSizeChangeGoods" @current-change="handleCurrentChangeGoods" :current-page="pageGoods" :page-sizes="[10, 20, 50, 100]"
        :page-size="limitGoods" layout="prev, pager, next,jumper,sizes,total" :total="goodsList.length">
      </el-pagination>
    </el-row>
    <div style="display: flex;justify-content: space-between;margin: 20px 0 5px;">
        <el-button @click="handleDownload">下载导入模板</el-button>
        <el-upload
          :action="origin+getBatchUploadUrl"
          :headers="{'Authorization': token}"
          :on-success="handleImportSuccess"
          :on-error="handleImportError"
          :show-file-list="false"
          :file-list="fileList">
          <el-button>上传导入模板</el-button>
        </el-upload>
        <el-button @click="handleExportErr">下载失败数据</el-button>
    </div>
    <div style="text-align: center; color:#999;font-size:12px;">提示：重新上传数据会覆盖上一次导入数据</div>
    <div v-if="uploadTotal>0"><i class="el-icon-success" style="color:#67C23A"></i>
    已成功导入数据<strong>{{uploadTotal}}</strong>条<template v-if="oldDisabledList.length > 0">，不可编辑数据{{oldDisabledList.length}}条， 新增数据{{goodsList.length - oldDisabledList.length}}条，共{{goodsList.length}}条</template></div>
    <div class="dialog-footer mgt20" style="text-align: center;">
      <el-button type="primary" @click="handleSubmitGoods">提交</el-button>
    </div>
  </div>
  <!-- ==  商品列表end  ======================== -->
</template>

<script>
import {activityDownload, activityErrorDownload, getBatchUploadUrl} from '@/api/operate'
export default {
  props: {
    list: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      getBatchUploadUrl: getBatchUploadUrl,
      token: this.$getLocalStorage("token"),
      origin: location.origin,
      fileList: undefined,
      curFile: undefined,
      uploadTotal: 0, // 上传的数量
      oldDisabledList: [],
      // 商品列表 ==================
      limitGoods: 10, // 每页数量
      pageGoods: 1, // 当前页数
      goodsList: this.list,
      goodsTable: [
        // {
        //   label: "序号",
        //   prop: "number",
        //   width: '80'
        // },
        {
          label: "已添加id",
          prop: "goodsId"
        }
      ],
    }
  },
  computed: {
    goodsListComputed: function() {
      if(this.goodsList.length <= this.limitGoods) this.pageGoods = 1
      return this.goodsList.slice((this.pageGoods-1)*this.limitGoods,this.pageGoods*this.limitGoods)
    }, 
  },
  methods: {
    // 下载模板
    handleDownload() {
      activityDownload().then(res => {
        let data = res.data
        let filename = res.headers["content-disposition"]
          ? res.headers["content-disposition"].split("filename=")[1]
          : "商品导入模板.xlsx"
          filename = decodeURI(filename)
        filename = filename.replace(/\"/g, '')
        this.$downloadExcel(data, filename)
      })
    },
    // 文件上传失败
    handleImportError(res) {
      this.$message.error(res.error.description || '文件上传失败')
    },
    // 文件上传成功
    handleImportSuccess(res, file, fileList) {
      if(res.code == '200') {
        this.$message.success('文件上传成功')

        this.oldDisabledList = this.list.filter(i => i.disabled) // 父组件传入的数据中，不可编辑的商品列表
        if(this.oldDisabledList.length > 0) {
          let hash = {}
          let newArr = this.oldDisabledList.concat(res.body) // 旧的数据 合并 文件上传的数据
          this.goodsList = newArr.reduce((item, next) => { // 从旧到新过滤重复
            hash[next.goodsId] ? '' : hash[next.goodsId] = true && item.push(next)
            return item
          }, [])
        } else {
          this.goodsList = res.body // 要改
        }
        this.uploadTotal = res.body.length
        this.curFile = file.raw
      }else {
        this.$message.error('上传失败，请重新上传')
      }
    },
    handleExportErr() {
      activityErrorDownload(this.curFile).then(res => {
        let data = res.data
        let filename = res.headers["content-disposition"]
          ? res.headers["content-disposition"].split("filename=")[1]
          : "商品失败数据.xlsx"
          filename = decodeURI(filename)
        filename = filename.replace(/\"/g, '')
        this.$downloadExcel(data, filename)
      })
    },
    // =================添加商品================
    handleSizeChangeGoods(val) {
      this.limitGoods = val
    },
    handleCurrentChangeGoods(val) {
      this.pageGoods = val
    },
    handleDeleteGoods(scope) {
      this.$confirm(`您正在删除商品ID：${scope.row.goodsId}，是否继续`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.goodsList.splice(scope.$index + (this.pageGoods - 1)*this.limitGoods,1)
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
    handleSubmitGoods() {
      if(this.uploadTotal == 0){
        this.$message.error('请先上传导入模板')
        return 
      }
      this.$emit('getgoods', this.goodsList )
    }
  }
}
</script>

