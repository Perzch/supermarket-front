<script lang="ts" setup>
import { computed, onMounted, ref, watchEffect, type Ref } from 'vue';
import { api, request } from '@/request'
import { ElNotification } from 'element-plus';
import TableLayout from '@/components/TableLayout.vue';
import type { PageAble, SaleDto } from '@/interface';

const tableData:Ref = ref([])
const queryData:Ref<SaleDto> = ref({
    categoryName: undefined,
    startCreateDate: '',
    endCreateDate: ''
})
const pageAble:Ref<PageAble> = ref({
    page: 0,
    limit: 10
})
const categoryNames = ref([])
const loading = ref(false)
const pageComputed = computed({
    get: () => pageAble.value.page +1,
    set: val => {
        pageAble.value.page = val -1
        getData()
    }
})

const getData:Function = async () => {
    loading.value = true
    // 返回响应体body
    const res = ((await request({
        url: api.sale,
        method: 'get',
        params: {
            ...queryData.value,
            ...pageAble.value
        }
    })).data)
    if(res.code === 200) {
        tableData.value = res.data
    } else {
        ElNotification.error(res.message)
    }
    loading.value = false
}
const sortChange:Function = async (config:{column:string,prop:string,order:string}) => {
    pageAble.value.sort = config.order === 'ascending' ? 'asc' : 'desc'
    pageAble.value.sortColumn = config.prop
    if(!config.order) return
    getData()
}
const downloadAllData:Function = () => {
    request({
        url: api.printSales,
        method: 'get',
        responseType: 'blob'
    }).then(res => {
        // 打开新窗口下载
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
    <div class="warp" v-loading.fullscreen.lock="loading">
        <table-layout tableTitle="湖南工业学院校内超市商品销售记录">
            <el-form label-position="left" size="large" class="flex gap-4 justify-around">
                <el-form-item label="商品类别:" class="items-center">
                    <el-select v-model="queryData.categoryName" filterable placeholder="Select" clearable >
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
                            v-model="queryData.startCreateDate"
                            type="date"
                            placeholder="年-月-日"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD"
                        />
                        <span class="mx-2">到</span>
                        <el-date-picker
                                v-model="queryData.endCreateDate"
                                type="date"
                                placeholder="年-月-日"
                                format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD"
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