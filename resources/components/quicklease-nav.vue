<template>
    <nav class="nav">
        <div class="back">
            <IconBase width="100%" height="100%" viewBox="0 0 803 903" icon-name="arrow-left"><Arrowleft></Arrowleft></IconBase>
        </div>
        <div class="logo-holder">
            <IconBase class="logo" width="100%" height="100%" viewBox="0 0 803 903" icon-name="Logo"><Logo></Logo></IconBase>
        </div>
    </nav>
</template>

<script>
    import IconBase from "../components/IconBase";
    import Logo from '../components/icons/Logo'
    import Arrowleft from '../components/icons/arrow-left'


    export default {
        name: "nav",
        components: {IconBase, Arrowleft, Logo}
    }
</script>

<style scoped>
    .nav{
        width: 100%;
        height: 13%;
    }
    .back{
        float: left;
        width: 115px;
        margin-top: 62px;
    }
    .logo{
        padding: 70% 0%;
    }
    .logo-holder{
        float: right;
    }
</style>