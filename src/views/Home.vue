<script setup>
import HeaderMenu from "@/layout/HeaderMenu.vue";
</script>
<template>
  <div class="flex h-screen">
    <header-menu></header-menu>
    <router-view></router-view>
  </div>
</template>
<style scoped>
  div{
    background: url('../assets/unnamed.png') center/cover no-repeat fixed;
  }
</style>