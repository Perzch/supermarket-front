import {defineStore} from "pinia";
import {ref} from "vue";
import { api,request } from 'request'
import { ElNotification,ElMessageBox } from "element-plus";
export const useAuthStore = defineStore('auth',() => {
    const username = ref('')
    const token = ref('')

    const exit = (router) => {
        ElMessageBox.confirm('确认退出吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            username.value = ''
            token.value = ''
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            ElNotification.success("退出成功")
            router.push('/auth')
        })
    }

    const login = async (user,router) => {
        const res = await request({
            url: api.login,
            method: 'post',
            data: user
        })
        if(res.data.code === 200) {
            localStorage.setItem('token', res.data.data)
            localStorage.setItem('username', user.username)
            username.value = user.username
            token.value = res.data.data
            ElNotification.success("登录成功")
            router.push("/")
        } else ElNotification.error(res.data.message)
    }
    return {
        username,token,exit,login
    }
})