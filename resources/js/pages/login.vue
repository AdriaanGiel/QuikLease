<template>
    <div class="background">
        <div class="container">
            <div class="logincircle">
            </div>    
            <div class="logo">
                <IconBase x="0px" y="0px" width="100%" height="100%" viewBox="0 0 803 903" icon="Logo"><Logo class="logosvg"></Logo></IconBase>
            </div>
            <div class="inputs">
                <div class="loginform" v-show="this.showForm">
                    <form class="form" action="/" method="post">
                        <div class="form-group label-placeholder">
                            <label for="i5p" class="control-label">label-placeholder</label>
                            <input type="email" class="form-control" id="i5p">
                            <span class="help-block">This is a hint as a <code>span.help-block.hint</code></span>
                        </div>
                        <div class="form-group label-placeholder">
                            <label for="i5p" class="control-label">label-placeholder</label>
                            <input type="email" class="form-control" id="i5p">
                            <span class="help-block">This is a hint as a <code>span.help-block.hint</code></span>
                        </div>
                        <input type="submit">
                    </form>
                </div>
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
        },
        data(){
            return {
                showForm: false
            }
        },
        mounted(){
            setTimeout(() => {
                    console.log('in settimeout')
                this.showForm = true
                }, 4000);
        },
        
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
        animation-name: logototop;
        animation-duration: 1s;
        animation-delay: 3s;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
    }

    .loginform {
        position: absolute;
        left: 33%;
        top: 33%;
        height: 33%;
        width: 33%;
        margin: auto auto;
        animation-name: loginfadein;
        animation-duration: 1s;
        animation-delay: 4s;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
    }

    @keyframes loginfadein {
        0% {
            opacity: 0;
            transform: translateY(-10);
            display:block;
        }

        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes logototop {
        0% {
            transform: translateY(0) scale(1);
        }

        100% {
            transform: translateY(-110%) scale(0.3);
        }
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