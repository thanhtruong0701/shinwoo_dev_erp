<template>
  <!-- Time picker -->
  <v-dialog max-width="480" v-model="timepicker">
    <v-card>
      <v-row dense align="center" justify="space-between">
        <v-col cols="12">
          <v-time-picker
            color="blue lighten-1"
            v-model="newValue"
            :landscape="$vuetify.breakpoint.smAndUp"
          ></v-time-picker>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          small
          raised
          color="green lighten-5"
          @click="timepicker = false"
          >{{ $t("cancel") }}</v-btn
        >
        <v-btn small raised color="success" @click="returnValue">{{
          $t("ok")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "time-picker-dialog",
  props: {
    inputValue: {
      type: String,
      default: ""
    }
  },

  data: () => ({
    timepicker: true,
    value: ""
  }),

  computed: {
    newValue: {
      get: function() {
        if (this.value) {
          return this.value;
        }
        return null;
      },
      set: function(newvalue) {
        this.value = newvalue;
      }
    }
  },

  mounted() {
    this.value = this.inputValue;
  },

  watch: {
    timepicker(val) {
      if (val === false) {
        this.$emit("onCloseDialog");
      }
    },
    inputValue: {
      handler(val) {
        if (val) {
          this.value = val;
        }
      }
    }
  },

  methods: {
    returnValue() {
      this.$emit("returnValue", this.newValue);
      this.$emit("onCloseDialog");
    }
  }
};
</script>
