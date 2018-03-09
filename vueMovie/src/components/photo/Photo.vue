<template>
<div id="photo">
    <common-header></common-header>
    <common-footer></common-footer>
</div>
</template>
<script>
    import CommonHeader from '@/components/common/Header'
    import CommonFooter from '@/components/common/Footer'
export default{
    name : 'header',
    data(){
        return {}
    },
    mounted(){
        this.$store.dispatch('changeTitle',['photo','rgb(63, 81, 181)']);
    },
    components : {
        CommonHeader,
        CommonFooter
    }
}

</script>