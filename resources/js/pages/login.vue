<template>
    <div class="background">
        <div class="container">
            <div class="circle">
            </div>
            <div class="logo">
                <IconBase x="0px" y="0px" width="100%" height="100%" viewBox="0 0 803 903" icon="Logo"><Logo class="logosvg"></Logo></IconBase>
            </div>
        </div>
    </div>
</template>

<script>
    import IconBase from '../../components/IconBase';
    import Logo from '../../components/icons/Logo';
    export default {
        name: "login",
        components: {
            IconBase,
            Logo
        }
    }
</script>

<style scoped>
    .background {
        height: 100vh;
        width: 100vw;
        background-color: black;
        animation-name: colorchangebw;
        animation-delay: 2s;
        animation-duration: 2s;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
    }

    .container {

        height: inherit;
        width: inherit;
        margin: auto auto;
    }

    .circle {
        position: absolute;
        left: 25%;
        top: 30%;
        height: 500px;
        width: 500px;
        border-radius: 50%;
        margin: auto auto;
        background-color: white;
    }

    .logo {
        position: absolute;
        left: 33%;
        top: 33%;
        height: 33%;
        width: 33%;
        margin: auto auto;
    }

    @keyframes colorchangebw {
        from {
            background-color: black;
        }

        to {
            background-color: white;
        }
    }
</style>