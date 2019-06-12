<template>
    <div class="modal" :class="classname" tabindex="-1" role="dialog" :style="startstyle">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header mheader">
            <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> -->
            <h4 class="modal-title">QuickLease Fleet Ai</h4>
        </div>
        <div class="modal-body">
            <p>
            Welkom bij QuickLease Fleet. <br><br> Dit systeem werkt met een Ai. De Ai is getraind met verschillende data zoals het weer, tijdstip, aantal studenten op een locatie etc. We hebben deze data gebruikt om een optimale verdeling van fietsen op elke locatie te krijgen en onze gebruikers dus altijd een fiets tot hun beschikking hebben.<br><br>
            De Ai voorspelt het aantal fietsen die je gaat brengen of ophalen op een locatie. Ook al zijn Ai’s heel slim, aan het begin zijn ze nog niet zo accuraat. Sorry voor dat. Tijd leert en zo werkt dat ook voor de QuickLeaseFleet Ai. 
            </p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default btnclose" data-dismiss="modal" @click="closeModal">Ik snap het!</button>
            
        </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
</template>

<script>
export default {
    data(){
        return {
            classname : "fade in",
            startstyle : "display: block"
        }
    },methods:
        {
            closeModal(){
                this.classname = "fade out",
                this.startstyle = " "
            }
        }

    
}
</script>

<style scoped>
.btnclose{
    background-color: #fe8d12;
    color: white;
}

.mheader{
    background-color: #fe8d12;
    color:white;
}
</style>

