<template>
  <v-col v-bind="$attrs" cols="12" sm="12" md="12" lg="12">
    <slot></slot>
  </v-col>
</template>

<script>
export default {
  name: "col-full-layout",
};
</script>
