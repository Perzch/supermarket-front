<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue';
import { api, request } from 'request'
import { ElNotification,ElMessageBox } from 'element-plus';
import TableLayout from 'components/TableLayout.vue';

const tableData = ref([])
const editInfo = ref({
})
const cur = ref('')
const queryData = ref({
    name: undefined,
    categoryName: undefined,
    startYieldDate: '',
    endYieldDate: ''
})
const yieldDateArray = ref([])
const sort = ref('')
const sortColumn = ref('')
const page = ref(0)
const loading = ref(false)
const dialogFormVisible = ref(false)
const categoryNames = ref([])
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
        url: api.product,
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
const handleEdit = (index, row) => {
    cur.value = '修改商品库存信息'
    editInfo.value = {...tableData.value.content[index]}
    dialogFormVisible.value = true
}
const handleAdd = () => {
    cur.value = '添加商品'
    editInfo.value = {}
    dialogFormVisible.value = true
}
const handleAddCount = (index,row) => {
    loading.value = true
    ElMessageBox.prompt('请输入需要增加的库存数量', '增加库存', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /^\d+$/,
        inputErrorMessage: '请输入正整数',
    }).then(async ({value}) => {
        row.stock += Number(value);
        const res = (await request({
            url: api.product,
            method: 'put',
            data: row
        })).data
        if(res.code === 200) {
            ElNotification.success(res.message)
        } else {
            ElNotification.warning(res.message)
            row.stock -= Number(value);
        }
    })
    loading.value = false
}
const handleDelete = (index, row) => {
    ElMessageBox.confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        loading.value = true
        const res = (await request({
            method: 'delete',
            url: api.product + '/' + row.id
        })).data
        if(res.code === 200) {
            ElNotification.success(res.message)
            getData()
        } else ElNotification.warning(res.message)
        loading.value = false
    })
}
const submitForm = async () => {
    loading.value = true
    const config = {
        method: cur.value === '添加商品' ? 'post' : 'put',
        url: api.product,
        data: editInfo.value
    }
    const res = (await request(config)).data
    if(res.code === 200) {
        ElNotification.success(res.message)
        getData()
        dialogFormVisible.value = false
    } else ElNotification.warning(res.message)
    loading.value = false
}
onMounted(async () => {
    loading.value = true
    getData();
    const res = (await request({
        url: api.categoryNames,
        method: 'get'
    })).data
    categoryNames.value = res.data
    categoryNames.value.sort()
    loading.value = false
})
</script>

<template>
    <div class="warp" v-loading="loading">
        <table-layout tableTitle="湖南工业学院校内超市商品库存信息">
            <el-form label-position="left" class="flex justify-around gap-4" size="large">
                <el-form-item label="商品名称:" class="items-center">
                    <el-input v-model="queryData.name" placeholder="商品名称" />
                </el-form-item>
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
                <el-form-item label="生产时间由:" class="items-center">
                    <el-date-picker
                        v-model="yieldDateArray"
                        type="daterange"
                        range-separator="到"
                        start-placeholder="年-月-日"
                        end-placeholder="年-月-日"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getData">查询</el-button>
                    <el-button type="success" @click="handleAdd">添加</el-button>
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
                        <el-button type="success" @click="handleAddCount(scope.$index, scope.row)">添加库存</el-button>
                        <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-between p-2">
                <p class="w-fit text-sm text-gray-500">共{{ tableData.totalElements }}条数据</p>
                <el-pagination layout="prev, pager, next" background :hide-on-single-page="true" :page-count="tableData.totalPages" v-model:current-page="pageComputed"/>
            </div>
        </table-layout>
        <el-dialog v-model="dialogFormVisible" draggable :title="cur" width="50%">
            <el-form :model="editInfo" label-position="right" label-width="auto" :inline="true" size="large">
                <el-form-item label="分类名称:">
                    <el-select v-model="editInfo.categoryName" placeholder="分类名称" clearable >
                        <el-option
                        v-for="item in categoryNames"
                        :key="item"
                        :label="item"
                        :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="名称:">
                    <el-input v-model="editInfo.name" placeholder="名称"/>
                </el-form-item>
                <el-form-item label="生产日期:">
                    <el-date-picker
                        v-model="editInfo.yieldDate"
                        type="date"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        placeholder="生产日期"
                    />
                </el-form-item>
                <el-form-item label="厂家:">
                    <el-input v-model="editInfo.manufacturers" placeholder="厂家"/>
                </el-form-item>
                <el-form-item label="进货日期:">
                    <el-date-picker
                        v-model="editInfo.createDate"
                        type="date"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        placeholder="进货日期"
                    />
                </el-form-item>
                <br>
                <el-form-item label="库存数:">
                    <el-input-number v-model="editInfo.stock" :min="0" placeholder="库存数"/>
                </el-form-item>
                <el-form-item label="售价:">
                    <el-input-number v-model="editInfo.nowPrice" :min="0" placeholder="售价"/>
                </el-form-item>
                <el-form-item label="售出数:">
                    <el-input-number v-model="editInfo.saleCount" :min="0" placeholder="售出数"/>
                </el-form-item>
                <el-form-item label="进价:">
                    <el-input-number v-model="editInfo.price" :min="0"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button size="large" type="primary" @click="submitForm()">提交</el-button>
                <el-button size="large" @click="dialogFormVisible = false">取消</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped lang="scss">
.warp {
    @apply w-full mx-auto flex items-center;
}
</style>