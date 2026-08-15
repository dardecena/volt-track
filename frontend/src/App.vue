<script setup lang="ts">

</script>

<template>
 <v-app>
   <!-- Navigation  -->
   <v-navigation-drawer color="red" width="240">
     <div class="d-flex align-center ga-2 pa-4">
       <v-avatar size="32" color="primary">
         <v-icon icon="mdi-lightning-bolt" color="white" size="20" />
       </v-avatar>
       <span class="text-h6 font-weight-bold">VoltTrack</span>
     </div>
     <v-list nav density="compact" class="px-2">
       <v-list-item
           title="Fleet Monitor"
           prepend-icon="mdi-view-dashboard"
           active
       />
     </v-list>
   </v-navigation-drawer>
   <!-- Header  -->
   <v-app-bar flat color="green">
     <v-app-bar-title class="header-title">
       <div>Fleet monitor</div>
     </v-app-bar-title>
     <v-spacer />
     <v-btn
         icon="mdi-refresh"
         variant="text"
         color="grey-darken-1"
     />
   </v-app-bar>
   <!-- FleetTable and StatusPanel  -->
   <v-main></v-main>
 </v-app>
</template>

<style scoped>

.header-title {
  flex: 0 1 auto;
  min-width: 0;
}

</style>