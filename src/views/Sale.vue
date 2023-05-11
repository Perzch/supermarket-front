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
const CategoryList = ref([])
const yieldDateArray = ref([])
const sort = ref('')
const sortColumn = ref('')
const page = ref(0)
const loading = ref(false)

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
onMounted(async () => {
    loading.value = true
    getData();
    const res = (await request({
        url: api.category,
        method: 'get'
    })).data
    CategoryList.value = res.data
    loading.value = false
})
</script>

<template>
    <div class="warp" v-loading="loading">
        <table-layout tableTitle="湖南工业学院校内超市商品销售记录">
            <el-form label-position="left" class="flex gap-4 justify-around">
                <el-form-item label="商品类别:" class="items-center">
                    <el-select v-model="queryData.categoryName" placeholder="Select" size="large" clearable >
                        <el-option
                        v-for="item in CategoryList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
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
                <el-table-column prop="id" label="编号" sortable="custom"/>
                <el-table-column prop="product.id" label="商品编号" sortable="custom"/>
                <el-table-column prop="product.name" label="商品名称" sortable="custom"/>
                <el-table-column prop="product.categoryName" label="所属分类" sortable="custom"/>
                <el-table-column prop="product.price" label="进价" sortable="custom"/>
                <el-table-column prop="product.nowPrice" label="售价" sortable="custom"/>
                <el-table-column prop="saleCount" label="销量" sortable="custom"/>
                <el-table-column label="销售额">
                    <template #default="scope">
                        <span>{{ scope.row.product.nowPrice * scope.row.saleCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="净利润">
                    <template #default="scope">
                        <span>{{ (scope.row.product.nowPrice - scope.row.product.price) * scope.row.saleCount }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end p-2">
                <el-pagination layout="prev, pager, next" background :hide-on-single-page="true" :total="tableData.totalElements" :current-page="page + 1"/>
            </div>
        </table-layout>
    </div>
</template>

<style scoped lang="scss">
.warp {
    @apply w-full mx-auto flex items-center;
}
</style>