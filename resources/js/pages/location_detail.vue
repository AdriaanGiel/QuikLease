<template>
    <section>
        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <quicklease_nav></quicklease_nav>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <li class="custom-list-item location-detail" >
                        <ul class="location">
                            <li class="custom-list-item name" v-text="location.name"></li>
                            <li class="custom-list-item type" v-text="location.type"></li>
                            <b><li class="custom-list-item amount" v-text="location.amount"></li></b>
                        </ul>
                    </li>
                </div>
            </div>
            <div class="google-map" style="height: 400px; overflow: hidden">
                <google-map />
            </div>
            <div>
                <table class="table table-striped" style="margin-top: 8%;">
                    <thead>
                    <tr>
                        <th>Total bikes</th>
                        <th>Added bikes</th>
                        <th>Removed bikes</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>John</td>
                        <td>Doe</td>
                        <td>john@example.com</td>
                    </tr>
                    <tr>
                        <td>Mary</td>
                        <td>Moe</td>
                        <td>mary@example.com</td>
                    </tr>
                    <tr>
                        <td>July</td>
                        <td>Dooley</td>
                        <td>july@example.com</td>
                    </tr>
                    <tr>
                        <td>July</td>
                        <td>Dooley</td>
                        <td>july@example.com</td>
                    </tr>
                    <tr>
                        <td>July</td>
                        <td>Dooley</td>
                        <td>july@example.com</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <Logout></Logout>
        </div>
    </section>
</template>

<script>
    import quicklease_nav from "../../components/quicklease-nav";
    import GoogleMap from "../../components/GoogleMap";
    import Logout from "../../components/buttons/logout";
    import School from "../models/School";

    export default {
        name: "location_detail",
        components:{
            GoogleMap,
            quicklease_nav,
            Logout
        },
        data: function () {
            return {
                items: [
                    { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
                    { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
                    { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
                    { age: 38, first_name: 'Jami', last_name: 'Carney' }
                ],
                location: {}
            }
        },
        beforeCreate(){
            School.find(this.$route.params.id).then((res) => {
                this.location = res.data.school;
                this.location.type = "HogeSchool locatie";
                this.location.amount = this.location.BikeRacks.length;
            })

        }
    }
</script>

<style scoped>

    .custom-list-item{
        list-style: none;
    }
    .location-detail{
        display: block;
        margin: 0px auto;
        width: 40%;
    }
    .location >>> .name{
        font-size: 30px;
    }
    .location >>> .type{
        font-size: 18px;
        border-bottom: 1px solid grey;
    }
    .location >>> .amount{
        font-size: 18px;
        padding: 14px 0px 0px 0px;
    }

</style>