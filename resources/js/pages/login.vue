<template>
    <div class="background">
        <div class="container">
            <div class="logo">
                <IconBase x="0px" y="0px" viewBox="0 0 803 903" icon="Logo"><Logo class="logosvg"></Logo></IconBase>
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
    .logosvg > g#fleet {
        animation-name: move;
        animation-duration: 2s;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
    }

    .background {
        height: 100%;
        width: 100%;
        background-color: black;
        animation-name: colorchangebw;
        animation-delay: 5s;
        animation-duration: 2s;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
    }

    .container {
        height: inherit;
        width: inherit;
        margin: auto auto;
    }

    .logo {
        height: inherit;
        width: inherit;
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

    @keyframes move {
        from {
            opacity: 100;
        }

        to {
            opacity: 0;
        }
    }
</style>