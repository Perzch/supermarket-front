<script setup>
</script>
<template>
    <button>
        <slot></slot>
    </button>
</template>
<style lang='scss' scoped>
button {    
    @apply border-2 border-green-900 text-center rounded-sm py-2 transition-all duration-100 ease-in-out px-8 self-center text-primary;
    @apply hover:text-white focus-within:text-white;
    &:hover,&:focus-within {
        @apply bg-primary;
    }
}
</style>