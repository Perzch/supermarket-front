<script lang="ts" setup>
defineProps<{
    tableTitle: string
}>()
</script>
<template>
    <div class="uiverse">
        <div class="tools">
            <div class="circle">
            <span class="box bg-red-500"></span>
            </div>
            <div class="circle">
            <span class="box bg-yellow-500"></span>
            </div>
            <div class="circle">
            <span class="box bg-blue-500"></span>
            </div>
        </div>
        <p class="text-center text-4xl py-4 font-bold">{{ tableTitle }}</p>
        <slot></slot>
    </div>
</template>
<style lang='scss' scoped>
.uiverse {
    @apply mx-auto w-fit rounded-lg border bg-slate-100 p-6 bg-opacity-80 backdrop-blur-sm shadow-2xl;
    .tools {
        @apply flex items-center p-2 gap-1;
        .circle {
            @apply py-1;
            .box {
                @apply inline-block align-middle w-4 h-4 rounded-full;
            }
        }
    }
}
</style>