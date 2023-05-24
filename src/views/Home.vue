<script lang="ts" setup>
import HeaderMenu from "@/layout/HeaderMenu.vue";
</script>
<template>
  <div class="warp flex flex-col h-screen">
    <!-- <el-header style="--el-header-padding: 0;">
      <div class="flex items-center gap-2 h-full">
        <h1 class="text-5xl text-white">超市收银系统</h1>
      </div>
    </el-header> -->
    <div class="flex flex-1">
      <header-menu></header-menu>
      <router-view></router-view>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .warp{
    background: url('../assets/unnamed.png') center/cover no-repeat fixed;
    h1 {
      @apply p-2;
    }
  }
</style>