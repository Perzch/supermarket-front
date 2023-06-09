<script lang="ts" setup>
import { ref,onMounted,computed, type Ref, type ComputedRef } from 'vue';
import {api,request} from '@/request';
import TableLayout from '@/components/TableLayout.vue';
import { ElNotification } from 'element-plus';
import type { Product } from '@/interface';

const productIds:Ref = ref([])
const productNames:Ref = ref([])
const tableData:Ref<Product[]> = ref([])
const product:Ref<Product> = ref({
    categoryName: '',
    createDate: '',
    id: 0,
    manufacturers: '',
    name: '',
    nowPrice: 0,
    price: 0,
    saleCount: 0,
    stock: 0,
    yieldDate: '',
    count: 0
}) //商品信息
const amount:Ref = ref(0) //实收金额
const loading = ref(false)
const amountPayable:ComputedRef = computed(() => { //支付金额
    return tableData.value.reduce((pre,cur) => pre + cur.nowPrice * cur.count, 0)
})
const giveChange:ComputedRef = computed(() => { //找零
    return amountPayable.value?amount.value - amountPayable.value:0
})

const getProductInfo:Function = async (val:number, column:string) => {
    const res = (await request({
        url: api.product + (column === 'id'?'/':'/name/') + val,
        method: 'get'
    })).data
    loading.value = true
    if(res.code === 200) {
        product.value = res.data
        product.value.count = 1
    } else ElNotification.error(res.message)
    loading.value = false
}

const addData:Function = async () => {
    if(product.value.stock === 0) return ElNotification.error('请填写完整!')
    if(product.value.stock < product.value.count) return ElNotification.error('库存不足!')
    if(product.value?.count <= 0 || !product.value.name || product.value.id <= 0) return ElNotification.error('请填写完整!')
    const data = tableData.value.find(item => item.id === product.value.id)
    if(data) {
        data.count += product.value.count
    } else {
        tableData.value.push(product.value)
    }
    product.value = {
        categoryName: '',
        createDate: '',
        id: 0,
        manufacturers: '',
        name: '',
        nowPrice: 0,
        price: 0,
        saleCount: 0,
        stock: 0,
        yieldDate: '',
        count: 0
    }
}

const resetData:Function = () => {
    tableData.value = []
}

const submit:Function = async () => {
    if(giveChange.value < 0) return ElNotification.error('实收金额不足!')
    // 提交saleCount和pid
    const res = (await request({
        url: api.sale,
        method: 'post',
        data: {
            ids: tableData.value.map(item => {
                return {
                    id: item.id,
                    count: item.count
                }
            })
        }
    })).data
    if(res.code === 200) {
        ElNotification.success('提交成功!')
        product.value = {
            categoryName: '',
            createDate: '',
            id: 0,
            manufacturers: '',
            name: '',
            nowPrice: 0,
            price: 0,
            saleCount: 0,
            stock: 0,
            yieldDate: '',
            count: 0
        }
        amount.value = 0
        tableData.value = []
    } else ElNotification.error(res.message)
}

onMounted(async () => {
    loading.value = true
    const res = (await request({
        url: api.productIds,
        method: 'get'
    })).data
    if(res.code === 200) {
        productIds.value = res.data
        productIds.value.sort()
    }else ElNotification.error(res.message)

    const response = (await request({
        url: api.productNames,
        method: 'get'
    })).data
    if(response.code === 200) {
        productNames.value = response.data
        productNames.value.sort()
    } else ElNotification.error(response.message)
    loading.value = false
})
</script>

<template>
    <div class="warp">
        <table-layout tableTitle="某某大学学院校内超市收银台">
            <el-form label-position="top" class="data-form" size="large">
                <el-form-item label="商品编号:" class="items-center">
                    <el-select v-model="product.id" filterable placeholder="Select" clearable @change="(val:number) => getProductInfo(val,'id')">
                        <el-option
                        v-for="item in productIds"
                        :key="item"
                        :label="item"
                        :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称:" class="items-center">
                    <el-select v-model="product.name" filterable placeholder="Select" clearable @change="(val:number) => getProductInfo(val,'name')">
                        <el-option
                        v-for="item in productNames"
                        :key="item"
                        :label="item"
                        :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="购买数量:" class="items-center">
                    <el-input-number v-model="product.count" :min="0"/>
                </el-form-item>
                <el-form-item label="销售单价:" class="items-center">
                    ￥{{ product.nowPrice }}
                </el-form-item>
                <el-form-item label="应付金额:" class="items-center">
                    ￥{{ amountPayable }}
                </el-form-item>
                <el-form-item label="实收金额:" class="items-center">
                    <el-input-number v-model="amount" :min="0"/>
                </el-form-item>
                <el-form-item label="找零:">
                    ￥{{ giveChange }}
                </el-form-item>
                <el-form-item label="操作:" class="items-center">
                    <el-button type="success" @click="addData">添加</el-button>
                    <el-button type="error" @click="resetData">清空</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData">
                <el-table-column label="商品编号" prop="id"></el-table-column>
                <el-table-column label="商品名称" prop="name"></el-table-column>
                <el-table-column label="购买数量" prop="count"></el-table-column>
                <el-table-column label="售价">
                    <template #default="{ row }">
                        <span>￥{{ row.nowPrice.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="总价">
                    <template #default="{ row }">
                        <span>￥{{ (row.nowPrice * row.count).toFixed(2) }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end">
                <div class="flex-1"></div>
                <div class="flex-1"></div>
                <el-button class="flex-1" type="primary" @click="submit" size="large">提交</el-button>
            </div>
        </table-layout>
    </div>
</template>

<style scoped lang="scss">
.warp {
    @apply w-full mx-auto flex items-center;
    .data-form {
        @apply bg-white p-4 rounded-md mx-auto gap-4 grid grid-cols-4;
    }
}
</style>