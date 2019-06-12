<template>
    <div class="background">
        <div class="container">
            <div class="logincircle">
            </div>
            <div class="logo">
                <IconBase x="0px" y="0px" width="100%" height="100%" viewBox="0 0 803 903" icon="Logo"><Logo class="logosvg"></Logo></IconBase>
            </div>
                <div class="loginform forminputs">
                    <form class="form" action="/" method="post">

                            <div class="inputs" v-if="showForm">
                                <div class="mdc-text-field">
                                    <input class="mdc-text-field__input" v-model="userData.email" type="email">
                                    <div class="mdc-line-ripple"></div>
                                    <label class="mdc-floating-label">Email</label>
                                </div>
                                <div class="mdc-text-field">
                                    <input class="mdc-text-field__input" v-model="userData.password" type="password">
                                    <div class="mdc-line-ripple"></div>
                                    <label class="mdc-floating-label">Wachtwoord</label>
                                </div>
                            </div>

                            <div v-else class="verification-input-box" >
                                <div class="mdc-text-field">
                                    <input class="mdc-text-field__input" v-model="verificationCode" type="number">
                                    <div class="mdc-line-ripple"></div>
                                    <label class="mdc-floating-label">Email</label>
                                </div>
                                
                            </div>

                            <div class="button-box btninput">
                                <button @click="this.loginAndSwitchToVerification" class="btn btn-default" type="submit">Submit <i v-if="showLoader" class="fas fa-spin fa-sync-alt"></i></button>
                            </div>
                        
                    </form>
                </div>
            </div>
    </div>
</template>


<script>
    import IconBase from '../../components/IconBase';
    import Logo from '../../components/icons/Logo';
    import {MDCTextField} from '@material/textfield';
    import Auth from '../policies/authenticate';

    export default {
        name: "login",
        components: {
            IconBase,
            Logo
        },
        watch:{
            userData:{
                handler(val){
                    if(this.userData.email !== "" && this.userData.password !== ""){
                        this.changeButton(false)
                    }else{
                        this.changeButton(true)
                    }
                },
                deep:true
            }
        },
        data(){
            return {
                showForm: true,
                userData: {
                    email: "",
                    password: ""
                },
                submitForm:true,
                showLoader: false,
                verificationCode:0,
                token:""
            }
        },
        methods:{
            changeButton(val){
                this.submitForm = val;
            },
            async loginAndSwitchToVerification(e){
                e.preventDefault();
                this.showLoader = true;
                Auth.getToken(this.userData).then((res) => {
                    this.token = res.data.token;
                    this.showLoader = false;
                    this.showForm = false;
                    this.submitForm = true;
                });
            },
            async verifyCode(e){
                e.preventDefault();

                Auth.handleToken(code,this.token).then((res) => {

                });
            }
        },
        mounted(){
            const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
        },

    }



</script>

<style scoped>
    .body{
        overflow: hidden;
    }
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
        margin: 0px auto;
        display: block;
        animation-name: loginfadein;
        animation-duration: 1s;
        animation-delay: 4s;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
    }

    .forminputs{
        left: 20%;
        top: 23%;
        height: 600px;
        width: 600px;
        margin: 0px auto;
        opacity: 0;
        animation-name: loginfadein;
        animation-duration: 1s;
        animation-delay: 4s;
        animation-iteration-count: 1;
        animation-fill-mode: both;
    }

    .inputs{
        display: block;
        margin: 0px auto;
        width: 60%;
    }

    .btninput button{
        align-content: center;
        margin: 20px auto;
        display: block;
    }

    .form{

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
            height: 45vh;
        }
        100% {
            transform: scale(5);
            display: none;
            height: 0px;
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