<template>
  <div class="d-flex align-end">
    <v-checkbox
      v-bind="$attrs"
      dense
      hide-details
      class="my-0 py-0"
      :color="currentTheme"
      :rules="$attrs.rules"
      :validate-on-blur="$attrs.rules && $attrs.rules.length ? true : false"
      v-model="myValue"
      @change="$emit('input', $event); $emit('change', $event)"
    >
      <template #label>
        <span class="text-body-2">{{$attrs.label}}</span>
      </template>
    </v-checkbox>
  </div>
</template>

<script>
export default {
  name: "base-checkbox",

  props: ["value"],

  computed: {
    myValue: {
      get() {
        return this.value
      },
      set(newValue) {
        return newValue
      }
    }
  }
};
</script>
