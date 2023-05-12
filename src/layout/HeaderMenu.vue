<script setup>
import {ref,onMounted} from "vue";
import {useRoute,useRouter} from "vue-router";
import { useAuthStore } from 'store';
const route = useRoute()
const router = useRouter()
const store = useAuthStore()

const activeIndex = ref(route.path)

const exit = () => {
    if(store.exit) router.push('/auth')
}

onMounted(() => {
    let username = localStorage.getItem('username');
    if(username && !store.username) {
        store.username = username
    }
})
</script>

<template>
    <el-menu
            :router = "true"
            :default-active="activeIndex"
            :ellipsis="false"
            mode="vertical"
            popper-effect="light"
            class="py-4 menu">
        <el-menu-item index="/cashier">收银台</el-menu-item>
        <el-menu-item index="/category">商品分类管理</el-menu-item>
        <el-menu-item index="/product">商品库存管理</el-menu-item>
        <el-menu-item index="/sale">销售统计</el-menu-item>
        <div class="flex-grow" />
        <el-menu-item>
            <el-dropdown class="justify-center items-center" @command="exit">
                <div>你好！{{store.username}}</div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </el-menu-item>
    </el-menu>
</template>

<style scoped lang="scss">
.menu {
    mask: linear-gradient(to left, transparent 0%, black 20%);
    @apply backdrop-blur-md bg-white bg-opacity-0 text-black border-0;
    // @apply after:w-full after:h-full after:absolute after:top-0 after:backdrop-blur-md after:-z-1;
    :deep(.el-menu-item),:deep(.el-tooltip__trigger) {
        @apply text-gray-800;
    }
    :deep(.is-active){
        @apply text-black bg-gray-200 bg-opacity-70;
    }
}
</style>