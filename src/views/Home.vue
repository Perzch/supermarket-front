<script setup>
import HeaderMenu from "@/layout/HeaderMenu.vue";
</script>
<template>
  <div class="warp flex flex-col h-screen">
    <el-header>
      <div class="flex items-center gap-2 p-4">
        <img src="../assets/Melly-Text.png" alt="logo" class="h-12" />
      </div>
    </el-header>
    <div class="flex flex-1">
      <header-menu></header-menu>
      <router-view></router-view>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .warp{
    background: url('../assets/unnamed.png') center/cover no-repeat fixed;
    img {
      -webkit-user-drag: none;
    }
  }
</style>