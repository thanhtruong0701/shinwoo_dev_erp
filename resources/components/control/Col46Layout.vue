<template>
  <v-col v-bind="$attrs" cols="12" sm="12" md="8" lg="8">
    <slot></slot>
  </v-col>
</template>

<script>
export default {
  name: "col-4-6-layout",
};
</script>
