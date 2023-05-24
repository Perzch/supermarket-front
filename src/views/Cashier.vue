<script lang="ts" setup>
import { ref,onMounted,computed, type Ref, type ComputedRef } from 'vue';
import {api,request} from '@/request';
import TableLayout from '@/components/TableLayout.vue';
import { ElNotification } from 'element-plus';

const productIds:Ref = ref([])
const productNames:Ref = ref([])
const buyCount:Ref = ref(0) //购买数量
const product:Ref = ref({}) //商品信息
const amount:Ref = ref(0) //实收金额
const loading = ref(false)
const amountPayable:ComputedRef = computed(() => { //支付金额
    return product.value.nowPrice?product.value.nowPrice * buyCount.value:0
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
    } else ElNotification.error(res.message)
    loading.value = false
}

const submit:Function = async () => {
    // 提交saleCount和pid
    const res = (await request({
        url: api.sale,
        method: 'post',
        data: {
            pid: product.value.id,
            saleCount: buyCount.value
        }
    })).data
    console.log(res);
    if(res.code === 200) {
        ElNotification.success('提交成功!')
        product.value = {}
        buyCount.value = 0
        amount.value = 0
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
        <table-layout tableTitle="湖南工业学院校内超市收银台">
            <el-form label-position="top" class="data-form" size="large" :inline="true">
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
                <el-form-item label="销售单价:" class="items-center">
                    ￥{{ product.nowPrice }}
                </el-form-item>
                <el-form-item label="购买数量:" class="items-center">
                    <el-input-number v-model="buyCount" :min="0"/>
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
                <div></div>
                <p></p>
                <el-button type="primary" @click="submit">提交</el-button>
            </el-form>
        </table-layout>
    </div>
</template>

<style scoped lang="scss">
.warp {
    @apply w-full mx-auto flex items-center;
    .data-form {
        @apply bg-white p-4 rounded-md mx-auto w-fit gap-4 grid grid-cols-2;
    }
}
</style>