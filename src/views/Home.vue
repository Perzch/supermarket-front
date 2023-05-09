<script setup>
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue';
import MyButton from 'components/MyButton.vue';
import { api,request } from 'request'
const user = reactive({
    username: '',
    password: ''
})
const error = reactive({
    username: false,
    password: false
})
// 验证用户名
const validateUsername = () => {
    error.username = user.username.trim().length < 3 || user.username.trim().length > 10;
}
// 验证密码
const validatePassword = () => {
    error.password = user.password.trim().length < 6 || user.password.trim().length > 18;
}
// 登录方法
const login = async () => {
    validateUsername()
    validatePassword()
    if (error.username || error.password) {
        return
    }
    const res = await request({
        url: api.login,
        method: 'post',
        data: user
    })
}
</script>
<template>
    <div class="warp">
            <div class="box">
                <p class="title">登录</p>
                <el-form class="form-box" label-width="auto" label-position="top" size="large" :model="user" hide-required-asterisk>
                    <el-form-item prop="username">
                        <template #label>账户</template>
                        <el-input v-model="user.username" placeholder="账户" clearable @blur="validateUsername" :class="{'error-input':error.username}">
                            <template #suffix>
                                <i class="fa-solid" :class="{'fa-user text-primary':!error.username,'fa-triangle-exclamation text-danger':error.username}"></i>
                            </template>
                        </el-input>
                        <el-text class="mx-1" type="danger" v-show="error.username" size="small">用户名长度为3-10位</el-text>
                    </el-form-item>
                    <el-form-item prop="password">
                        <template #label>密码</template>
                        <el-input v-model="user.password" placeholder="密码" type="password" show-password clearable  :class="{'error-input':error.password}" @blur="validatePassword">
                            <template #suffix>
                                <i class="fa-solid fa-triangle-exclamation text-danger" v-show="error.password"></i>
                            </template>
                        </el-input>
                        <el-text class="mx-1" type="danger" v-show="error.password" size="small">密码长度为6-18位</el-text>
                    </el-form-item>
                </el-form>
                <div class="w-full items-center flex justify-between">
                    <my-button class="duration-300" @click="login">登录</my-button>
                </div>
            </div>
    </div>
</template>
<style lang='scss' scoped>
.warp {
    @apply bg-no-repeat bg-cover h-screen w-screen flex items-center;
    // 响应式调整
    @apply p-4 sm:pr-4 md:pr-10 xl:pr-80 2xl:pr-80;
    @apply justify-center sm:justify-end md:justify-end lg:justify-end xl:justify-end 2xl:justify-end;
    background-image: url('../assets/photo-index.webp');
    .box {
        @apply bg-white flex flex-col gap-4;
        // 响应式调整
        @apply p-10 sm:p-10 md:p-14 lg:p-14 xl:p-14 2xl:py-14 2xl:px-24;
        @apply w-full sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-3/5 2xl:w-2/5;
        //@apply h-2/3 sm:h-2/3 md:h-2/3 lg:h-2/3 xl:h-2/3 2xl:h-2/3;
        .title {
            @apply text-5xl font-bold;
        }
        .change-type-text {
            @apply text-gray-500;
            span {
                @apply text-green-800 cursor-pointer;
                @apply hover:text-green-600 hover:underline;
            }
        }
    }
    :deep(.el-input__wrapper) {
        @apply shadow-none bg-transparent border-b border-primary;
        // 输入框聚焦时增加下边框的宽度，去除背景和边框
        @apply focus:shadow-none focus:bg-transparent focus-within:border-b-2 focus-within:border-primary;
        &.is-focus {
            @apply outline-none shadow-none
        }
    }
    .error-input {
        :deep(.el-input__wrapper) {
            border-color: #ee4266;
        }
    }
}
</style>