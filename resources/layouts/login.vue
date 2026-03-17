<template>
  <v-app>
    <client-only>
      <notifications></notifications>
    </client-only>

    <v-overlay z-index="9999" :value="isLoading">
      <v-progress-circular indeterminate color="#fff" size="64" :width="7"></v-progress-circular>
    </v-overlay>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'login',

  data:()=>({
    isLoading: true
  }),

  mounted() {
    this.isLoading = false
  }
}
</script>