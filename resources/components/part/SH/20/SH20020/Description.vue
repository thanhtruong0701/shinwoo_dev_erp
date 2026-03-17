<template>
  <base-wrapper :height="limitHeight">
    <v-container>
      <v-row align="center" justify="space-between">
        <v-col cols="12">
          <BaseTextarea :label="$t('goods_remark')" rows="3" v-model="masterData.GOODS_MARKS" />
        </v-col>
        <v-col cols="12">
          <BaseTextarea :label="$t('manufacture_remark')" rows="3" v-model="masterData.MANUFACTURE_MARKS" />
        </v-col>
        <v-col cols="12">
          <BaseTextarea :label="$t('lc_marks')" rows="3" v-model="masterData.LC_MARKS" />
        </v-col>
        <v-col cols="12">
          <BaseTextarea :label="$t('packing_marks')" rows="3" v-model="masterData.PACKING_MARKS" />
        </v-col>
        <v-col lg="6" cols="12">
          <BaseInput number :label="$t('carton_number')" v-model="masterData.CARTON_NUM" />
        </v-col>
        <v-col lg="6" cols="12">
          <BaseInput number :label="$t('container_number')" v-model="masterData.CONTAINER_NUM" />
        </v-col>
        <v-col cols="12">
          <BaseTextarea :label="$t('invoice_remarks')" rows="3" v-model="masterData.INVOICE_MARKS" />
        </v-col>
      </v-row>
    </v-container>
  </base-wrapper>
</template>

<script>
export default {
  name: "description",

  props: {
    formHeight: Number,
    masterData: Object
  },

  computed: {
    limitHeight() {
      return Math.floor((this.formHeight*85)/100)
    }
  }
}
</script>