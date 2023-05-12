<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue';
import { api, request } from 'request'
import { ElNotification,ElMessageBox } from 'element-plus';
import TableLayout from 'components/TableLayout.vue';

const tableData = ref([])
const queryData = ref({
    categoryName: undefined,
    startYieldDate: '',
    endYieldDate: ''
})
const categoryNames = ref([])
const yieldDateArray = ref([])
const sort = ref('')
const sortColumn = ref('')
const page = ref(0)
const loading = ref(false)
const pageComputed = computed({
    get: () => page.value +1,
    set: val => {
        page.value = val -1
        getData()
    }
})

watchEffect(() => {
    if(!yieldDateArray.value) {
        queryData.value.startYieldDate = undefined;
        queryData.value.endYieldDate = undefined;
        return
    }
    queryData.value.startYieldDate = yieldDateArray.value[0];
    queryData.value.endYieldDate = yieldDateArray.value[1];
})

const getData = async () => {
    loading.value = true
    const params = {
        page: page.value
    }
    // 如果有排序列
    if(sortColumn.value) params.sortColumn = sortColumn.value
    // 如果有排序方向
    if(sort.value) params.sort = sort.value === 'ascending' ? 'asc' : 'desc'
    // 返回响应体body
    const res = ((await request({
        url: api.sale,
        method: 'get',
        params: {
            ...queryData.value,
            ...params
        }
    })).data)
    if(res.code === 200) {
        tableData.value = res.data
    } else {
        ElNotification.error(res.message)
    }
    loading.value = false
}
const sortChange = async column => {
    sort.value = column.order
    sortColumn.value = column.prop
    if(!column.order) return
    getData()
}
const downloadAllData = () => {
    request({
        url: api.printSales,
        method: 'get',
        responseType: 'blob'
    }).then(res => {
        const url = URL.createObjectURL(res.data)
        window.open(url)
        URL.revokeObjectURL(url)
    })
}

onMounted(async () => {
    loading.value = true
    getData();
    const res = (await request({
        url: api.categoryNames,
        method: 'get'
    })).data
    categoryNames.value = res.data
    loading.value = false
})
</script>

<template>
    <div class="warp" v-loading="loading">
        <table-layout tableTitle="湖南工业学院校内超市商品销售记录">
            <el-form label-position="left" class="flex gap-4 justify-around">
                <el-form-item label="商品类别:" class="items-center">
                    <el-select v-model="queryData.categoryName" filterable placeholder="Select" size="large" clearable >
                        <el-option
                        v-for="item in categoryNames"
                        :key="item"
                        :label="item"
                        :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="时间由:" class="items-center">
                    <el-date-picker
                        v-model="yieldDateArray"
                        type="daterange"
                        range-separator="到"
                        start-placeholder="年-月-日"
                        end-placeholder="年-月-日"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        size="large"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getData">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table border  :data="tableData.content" @sort-change="sortChange" header-row-class-name="text-black" table-layout="auto">
                <el-table-column prop="id" label="编号" sortable="custom" width="100"/>
                <el-table-column prop="product.id" label="商品编号" sortable="custom" width="120"/>
                <el-table-column prop="product.name" label="商品名称" sortable="custom" width="120"/>
                <el-table-column prop="product.categoryName" label="所属分类" sortable="custom" width="120"/>
                <el-table-column label="进价" sortable="custom" width="100">
                    <template #default="scope">
                        <span>￥{{ scope.row.product.price.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="售价" sortable="custom" width="100">
                    <template #default="scope">
                        <span>￥{{ scope.row.product.nowPrice.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="saleCount" label="销量" sortable="custom" width="100"/>
                <el-table-column label="销售额" width="100">
                    <template #default="scope">
                        <span>￥{{ (scope.row.product.nowPrice * scope.row.saleCount).toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="净利润" width="100">
                    <template #default="scope">
                        <span>￥{{ ((scope.row.product.nowPrice - scope.row.product.price) * scope.row.saleCount).toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间" sortable="custom" width="120"/>
            </el-table>
            <div class="flex justify-between p-2">
                <p class="w-fit text-sm text-gray-500">共{{ tableData.totalElements }}条数据</p>
                <el-button type="success" @click="downloadAllData">下载全部数据</el-button>
                <el-pagination layout="prev, pager, next" background :hide-on-single-page="true" :page-count="tableData.totalPages" v-model:current-page="pageComputed"/>
            </div>
        </table-layout>
    </div>
</template>

<style scoped lang="scss">
.warp {
    @apply w-full mx-auto flex items-center;
}
</style>