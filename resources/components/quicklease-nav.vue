<template>
    <nav class="nav">
        <div class="back">
            <IconBase width="100%" height="100%" viewBox="0 0 803 903" icon-name="arrow-left-2"><Arrowleft2 fill="grey"></Arrowleft2></IconBase>
        </div>
        <div class="logo-holder">
            <IconBase class="logo" width="100%" height="100%" viewBox="0 0 803 903" icon-name="Logo"><Logo></Logo></IconBase>
        </div>
    </nav>
</template>

<script>
    import IconBase from "../components/IconBase";
    import Logo from '../components/icons/Logo'
    import Arrowleft2 from '../components/icons/arrow-left-2'


    export default {
        name: "nav",
        components: {IconBase, Arrowleft2, Logo}
    }
</script>

<style scoped>
    .nav{
        width: 100%;
        height: 13%;
    }
    .back{
        float: left;
        width: 100px;
        margin-top: 62px;
    }
    .logo{
        padding: 70% 0%;
    }
    .logo-holder{
        float: right;
    }
</style>