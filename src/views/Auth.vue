<script setup>
import {reactive, ref, onUnmounted} from 'vue';
import {useAuthStore} from "store";
import {useRouter} from "vue-router";
import JSEncrypt from 'jsencrypt'
const router = useRouter()
const authStore = useAuthStore()
const user = reactive({
    username: '',
    password: '',
    captcha: ''
})
const error = reactive({
    username: false,
    password: false,
    captcha: false
})
let captchaImg = ref('/api/auth/captcha?'+Math.random())
// 验证用户名
const validateUsername = () => {
    error.username = user.username.trim().length < 3 || user.username.trim().length > 10;
}
// 验证密码
const validatePassword = () => {
    error.password = user.password.trim().length < 6 || user.password.trim().length > 18;
}
const validateCaptcha = () => {
    error.captcha = user.captcha.trim() === '';
}
// 登录方法
const login = async () => {
    validateUsername()
    validatePassword()
    validateCaptcha()
    if (error.username || error.password || error.captcha) {
        return
    }
    if(await authStore.login({
        username: user.username,
        password: goEncrypt(user.password),
        captcha: user.captcha
    })) await router.push('/')
}
const goEncrypt = (data) =>{
        const encryptor = new JSEncrypt()
        // 之前生成的公钥
        const publicKey =
        `-----BEGIN PUBLIC KEY-----
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmUYcJJ33776uoIuCOL9NMzNfCLTsygg14uEABbbiQBgw0yRP24kgvdvJh8lc+xkglRDKcirjjIc3FB06nOoAKbfitDi+jG4tbM5VBVAsB+83tIpX2wFnQimFB1TD2ByUIP9YQOBZIKiLOjpHle7IQr53t+cOW3mQWADvMAbqIHQIDAQAB
        -----END PUBLIC KEY-----`
        encryptor.setPublicKey(publicKey)
        return encryptor.encrypt(data)
}
const windowKeyDown = (e) => {
    if (e.keyCode === 13) {
        login()
    }
}
// 监听回车键
window.addEventListener('keydown', windowKeyDown)
onUnmounted(() => {
    // 取消监听回车键
    window.removeEventListener('keydown', windowKeyDown)
})
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
                    <el-form-item prop="captcha">
                        <template #label>验证码</template>
                        <img :src="captchaImg" alt="图片验证码" title="点击再次获取验证码" @click="captchaImg = '/api/auth/captcha?'+Math.random()" class="cursor-pointer">
                        <el-input v-model="user.captcha" placeholder="验证码" clearable :class="{'error-input':error.captcha}" @blur="validateCaptcha">
                            <template #suffix>
                                <i class="fa-solid fa-triangle-exclamation text-danger" v-show="error.captcha"></i>
                            </template>
                        </el-input>
                        <el-text class="mx-1" type="danger" v-show="error.captcha" size="small">验证码不能为空</el-text>
                    </el-form-item>
                </el-form>
                <div class="w-full items-center flex justify-between">
                    <div></div>
                    <el-button @click="login" size="large" type="primary">登录</el-button>
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