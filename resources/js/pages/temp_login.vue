<template>
    <div class="login-wrapper">
        <div class="login-form">
            <form >
                <div v-if="showForm" class="login-input-box">
                    <div class="form-group">
                        <input v-model="userData.email" type="email" class="form-control"  placeholder="Email">
                    </div>

                    <div class="form-group">
                        <input v-model="userData.password" type="password" class="form-control"  placeholder="Wachtwoord">
                    </div>
                </div>

                <div v-else class="verification-input-box">
                    <div class="form-group">
                        <input v-model="verificationCode" type="number" class="form-control"  placeholder="verificatie code">
                    </div>
                </div>

                <div class="button-box">
                    <button :disabled="submitForm" @click="this.switchToVerification" class="btn btn-default" type="submit">Button <i v-if="showLoader" class="fas fa-spin fa-sync-alt"></i></button>
                </div>

            </form>

        </div>
    </div>
</template>

<script>
    import Auth from '../policies/authenticate';
    export default {
        name: "login",
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
        }
    }
</script>

<style lang="scss" scoped>
    .login-wrapper{
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .login-form{
        width: 50%;
        height: 50%;
        background-color: #4cae4c;
        padding: 0 1.5em;
        display: flex;
        align-items: center;
        justify-content: center;
        .button-box{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .spin{
        -webkit-transform-origin: 50% 58%;
        transform-origin:50% 58%;
        -ms-transform-origin:50% 58%; /* IE 9 */
        -webkit-animation: spin .2s infinite linear;
        -moz-animation: spin .2s infinite linear;
        -o-animation: spin .2s infinite linear;
        animation: spin .2s infinite linear;
    }



</style>