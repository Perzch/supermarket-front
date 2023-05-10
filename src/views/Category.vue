<script setup>
import {ref,onMounted} from "vue";
import { api, request } from 'request'
import { ElMessageBox, ElNotification } from "element-plus";
const tableData = ref([])
const editInfo = ref({})
const cur = ref('')
const dialogFormVisible = ref(false)
const loading = ref(true)
const getData = async (config) => {
    loading.value = true
    const res = await request({
        url: api.category,
        ...config
    })
    tableData.value = res.data.data
    loading.value = false
}
onMounted( async () => {
    getData({
        method: 'get'
    })
})
const sortChange = (column) => {
    if(!column.order) return
    getData({
        method: 'get',
        params: {
            sortColumn: column.prop,
            sort: column.order === 'ascending' ? 'asc' : 'desc'
        }
    })
}
const handleEdit = (index, row) => {
    cur.value = '修改分类'
    editInfo.value = {...tableData.value[index]}
    dialogFormVisible.value = true
}
const handleAdd = () => {
    cur.value = '添加分类'
    editInfo.value = {}
    dialogFormVisible.value = true
}
const handleDelete = (index, row) => {
    ElMessageBox.confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        loading.value = true
        const res = (await request({
            method: 'delete',
            url: api.category + '/' + row.id
        })).data
        if(res.code === 200) {
            ElNotification.success(res.message)
            tableData.value.splice(index, 1)
        } else {
            ElNotification.warning(res.message)
        }
        loading.value = false
    })
}
const submitForm = async () => {
    loading.value = true
    const config = {
        method: 'put',
        url: api.category,
        data: editInfo.value
    }
    if(cur.value === '添加分类') {
        config.method = 'post'
    }
    const res = (await request(config)).data
    if(res.code === 200) {
        ElNotification.success(res.message)
        if(cur.value === '添加分类') {
            tableData.value.push(res.data)
        } else {
            // 将返回的数据更新到tableData中
            tableData.value[tableData.value.findIndex(item => item.id === res.data.id)] = res.data
        }
        dialogFormVisible.value = false
    } else ElNotification.warning(res.message)
    loading.value = false
}
</script>

<template>
    <div class="warp" v-loading="loading">
        <el-table border  :data="tableData" @sort-change="sortChange" >
            <el-table-column prop="id" label="编号" sortable="custom"/>
            <el-table-column prop="name" label="分类名称" sortable="custom"/>
            <el-table-column prop="recommend" label="推荐指数" sortable="custom"/>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex justify-center py-4">
            <el-button size="large" type="success" @click="handleAdd">添加</el-button>
        </div>
        <el-dialog v-model="dialogFormVisible" draggable :title="cur" width="30%">
            <el-form :model="editInfo" label-position="top">
                <el-form-item label="分类名称" label-width="auto">
                    <el-input v-model="editInfo.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="推荐指数" label-width="auto">
                    <el-input v-model="editInfo.recommend" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                    <el-button size="large" type="primary" @click="submitForm()">提交</el-button>
                    <el-button size="large" @click="dialogFormVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<style scoped lang="scss">
.warp {
    @apply w-5/6 mx-auto my-4;
}
</style>