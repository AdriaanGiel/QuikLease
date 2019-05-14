<template>
    <header class="header">
        <IconBase icon-name="Logo"><Logo></Logo></IconBase>
    </header>
</template>

<script>
    // import leaseplanButtonOrange from '../../components/buttons/leaseplanButtonOrange';

    import IconBase from "../components/IconBase";
    import Logo from '../components/icons/Logo'


    export default {
        name: "header",
        components: {IconBase, Logo}
    }
</script>

<style scoped>
    .header{
        width: 100%;
        height: 13%;
        background-color: red;
    }

</style>