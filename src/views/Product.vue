<script>
import { computed, onMounted, ref, watchEffect } from 'vue';
import { api, request } from 'request'
import { ElNotification,ElMessageBox } from 'element-plus';
import TableLayout from 'components/TableLayout.vue';
export default {
  components: {
    TableLayout
  },
  data() {
    return {
      tableData: [],
      editInfo: {},
      cur: '',
      queryData: {
        name:undefined,
        categoryName:undefined,
        startYieldDate: '',
        endYieldDate: ''
      },
      sort: '',
      sortColumn: '',
      page: 0,
      loading: false,
      dialogFormVisible: false,
      categoryNames: []
    }
  },
  methods: {
    getData: async function() {
      this.loading = true
      const params = {
        page: this.page
      }
      // 如果有排序列
      if(this.sortColumn) params.sortColumn = this.sortColumn
      // 如果有排序方向
      if(this.sort) params.sort = this.sort === 'ascending' ? 'asc' : 'desc'
      // 返回响应体body
      const res = ((await request({
        url: api.product,
        method: 'get',
        params: {
          ...this.queryData,
          ...params
        }
      })).data)
      if(res.code === 200) {
        this.tableData = res.data
      } else {
        ElNotification.error(res.message)
      }
      this.loading = false
    },
    submitForm: async function() {
      this.loading = true
      const config = {
        // 如果是添加商品，method为post，如果是修改商品，method为put
        method: this.cur === '添加商品' ? 'post' : 'put',
        url: api.product,
        data: this.editInfo
      }
      const res = (await request(config)).data
      if(res.code === 200) {
        ElNotification.success(res.message)
        getData()
        this.dialogFormVisible = false
      } else ElNotification.warning(res.message)
      this.loading = false
    },
    handleAddCount(index,row) {
      this.loading = true
      ElMessageBox.prompt('请输入需要增加的库存数量', '增加库存', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /^\d+$/,
        inputErrorMessage: '请输入正整数',
      }).then(async ({value}) => {
        //TODO:补充
      })
      this.loading = false
    },
    handleDelete(index,row) {
      ElMessageBox.confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // TODO:需要补充
      })
    },
    sortChange: async function(column) {
    //   TODO:补充
    },
    handleEdit(index,row) {
    //   TODO:补充
    },
    handleAdd() {
    //   TODO:补充
    }
  },
  mounted() {
  //   获取数据
  }
}
</script>

<template>
    <div class="warp" v-loading="loading">
        <table-layout tableTitle="湖南工业学院校内超市商品库存信息">
            <el-form label-position="left" class="flex justify-around gap-4" size="large">
                <el-form-item label="商品名称:" class="items-center">
                    <el-input v-model="queryData.name" placeholder="商品名称" />
                </el-form-item>
                <el-form-item label="商品类别:" class="items-center">
                </el-form-item>
                <el-form-item label="生产时间由:" class="items-center">
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">查询</el-button>
                    <el-button type="success">添加</el-button>
                </el-form-item>
            </el-form>
            <el-table border  :data="tableData.content" @sort-change="sortChange" header-row-class-name="text-black" table-layout="auto">
                <el-table-column prop="id" label="编号" sortable="custom"/>
                <el-table-column prop="categoryName" label="分类" sortable="custom"/>
                <el-table-column prop="name" label="名称" sortable="custom"/>
                <el-table-column prop="yieldDate" label="生产日期" sortable="custom"/>
                <el-table-column prop="manufacturers" label="厂家" sortable="custom"/>
                <el-table-column prop="price" label="进价" sortable="custom"/>
                <el-table-column prop="createDate" label="进货日期" sortable="custom"/>
                <el-table-column prop="stock" label="库存数" sortable="custom"/>
                <el-table-column prop="nowPrice" label="售价" sortable="custom"/>
                <el-table-column prop="saleCount" label="售出数" sortable="custom"/>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="success">添加库存</el-button>
                        <el-button type="primary">修改</el-button>
                        <el-button type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-between p-2">
                <p class="w-fit text-sm text-gray-500">共  条数据</p>
            </div>
        </table-layout>
    </div>
</template>

<style scoped lang="scss">
.warp {
    @apply w-full mx-auto flex items-center;
}
</style>