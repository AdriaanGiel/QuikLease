<template>
    <div class="background">
        <div class="container">
            <div class="logincircle">
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
        animation-delay: 1.5s;
        animation-duration: 2s;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
    }

    .container {
       
        height: inherit;
        width: inherit;
        margin: auto auto;
    }

    .logincircle {
        height: 45vh;
        width: 45vh;
        border-radius: 100%;
        background-color: white;
        position: absolute;
        top: calc(50% - 22.5vh);
        left: calc(50% - 22.5vh);
        -moz-transform: translateX(-50%) translateY(-50%);
        -webkit-transform: translateX(-50%) translateY(-50%);
        transform: translateX(-50%) translateY(-50%);
        animation-name: introcircle;
        animation-duration: 3s;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
    }

    .logo {
        position: absolute;
        left: 33%;
        top: 33%;
        height: 33%;
        width: 33%;
        margin: auto auto;
    }

    @keyframes introcircle {
        0% {
            transform: scale(0.1);
            display: block;
        }

        30% {
            transform: scale(1);
        }

        60% {
            transform: scale(1);
        }
        
        99% {
            transform: scale(5);
        }
        100% {
            transform: scale(5);
            display: none;
        }
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