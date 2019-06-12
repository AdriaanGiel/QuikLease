<template>
    <header class="header">
        <div class="logo-holder">
            <IconBase class="logo" width="100%" height="100%" viewBox="0 0 803 903" icon-name="Logo"><Logo></Logo></IconBase>
        </div>
    </header>
</template>

<script>
    import IconBase from "../components/IconBase";
    import Logo from '../components/icons/Logo'

    export default {
        name: "Custom-Header",
        components: {IconBase, Logo}
    }
</script>

<style scoped>
    .header{
        width: 100%;
        height: 13%;
    }
    .logo{
        padding: 70% 0%;
    }
    .logo-holder{
        display: block;
        margin: 0px auto;
        width: 11%;
        height: 11%;
    }
</style>