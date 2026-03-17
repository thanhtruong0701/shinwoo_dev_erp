<template>
  <v-col v-bind="$attrs" cols="12" sm="12" md="6" lg="6">
    <slot> </slot>
  </v-col>
</template>

<script>
export default {
  name: "col-3-6-layout",
};
</script>
