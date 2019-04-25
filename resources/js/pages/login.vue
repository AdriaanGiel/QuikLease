<template>
    <div class="background">
        bla
        <div class="container">
            <div class="logo">
                <IconBase icon="Logo"><Logo></Logo></IconBase>
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
    .st0 {
        fill: #3FA9F5;
    }

    .st1 {
        fill: #FF931E;
    }
    .background {
        height: 100%;
        width: 100%;
        background-color: black;
        animation-name: colorchangebw;
        animation-duration: 2s;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
        animation-play-state: running;
    }

    .logo {
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