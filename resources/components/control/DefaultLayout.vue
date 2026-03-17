<template>
  <v-main fluid class="px-0 pt-2" v-resize="myOnResize">
    <v-row v-if="hasDashBoard">
      <slot name="dashboard" v-bind:DataLayout="data_layout"></slot>
    </v-row>

    <v-card :height="data_layout.masterHeight">
      <v-card-text ref="masterAction" class="master-action" v-if="masterAction">
        <slot name="masterAction" v-bind:DataLayout="data_layout"></slot>
      </v-card-text>

      <v-card-text ref="masterFillter" v-if="masterFillter">
        <slot name="masterFillter" v-bind:DataLayout="data_layout"></slot>
      </v-card-text>

      <v-card-text
        ref="masterActionMore"
        class="master-action"
        v-if="masterActionMore"
      >
        <slot name="masterActionMore" v-bind:DataLayout="data_layout"></slot>
      </v-card-text>

      <v-card-text ref="masterBody">
        <slot name="masterBody" v-bind:DataLayout="data_layout">
        </slot>
      </v-card-text>

      <v-card-text class="mr-0 pt-0"> </v-card-text>
    </v-card>

    <Modal
      ref="detail"
      :title="titleDetail"
      width="1200px"
      :mode="mode"
      @close="onHideDetail"
    >
      <template v-slot:header>
        <slot name="detailAction" v-bind:DataLayout="data_layout"> </slot>
      </template>

      <template v-slot:body>
        <div class="body-detail">
          <slot name="detailContent" v-bind:DataLayout="data_layout"> </slot>
          <slot name="detailData" v-bind:DataLayout="data_layout"> </slot>
        </div>
      </template>
    </Modal>
    <slot></slot>
  </v-main>
</template>

<script>
export default {
  name: "default-layout",
  layout: "default",
  middleware: "user",
  props: {
    titleDetail: {
      type: String,
    },
    title: {
      type: String,
    },
    mode: {
      type: String,
      default: "No",
      validator: function (value) {
        return ["No", "Done", "Ok", "YesNo"].indexOf(value) !== -1;
      },
    },
  },

  computed: {
    hasDashBoard() {
      return !!this.$slots.dashboard;
    },

    masterAction() {
      return !!this.$slots.masterAction;
    },

    masterFillter() {
      return !!this.$slots.masterFillter;
    },

    masterActionMore() {
      return !!this.$slots.masterActionMore;
    },
  },
  data: () => ({
    data_layout: {
      windowHeight: 0,
      top: 0,
      let: 0,

      masterHeight: 0,

      masterActionHeight: 0,
      masterActionWidth: 0,

      masterFillterHeight: 0,
      masterFillterWidth: 0,

      masterActionMoreHeight: 0,
      masterActionMoreWidth: 0,

      masterBodyHeight: 0,
      masterBodyWidth: 0,
    },

    idKey: "idLayout" + Math.floor(Math.random() * 1000000),
  }),

  mounted() {
    this.myOnResize();
  },

  methods: {
    showDetail() {
      this.$refs.detail.show();
    },

    hideDetail() {
      this.$refs.detail.hide();
      this.onHideDetail(false);
    },

    onHideDetail(val) {
      this.$emit("onHideDetail", val);
    },

    myOnResize() {
      this.onResize();

      let h = this.windowHeight - 60;
      this.data_layout.windowHeight = this.windowHeight;
      if (this.$slots.dashboard) {
        h = h - 100;
      }

      h = h - 70;

      this.data_layout.masterHeight = h;

      if (this.$slots.masterAction) {
        try {
          if (this.$refs.masterAction) {
            //  h = h - this.$refs.masterAction.clientHeight;
            this.data_layout.masterActionHeight = this.$refs.masterAction.clientHeight;
            this.data_layout.masterActionWidth = this.$refs.masterAction.clientWidth;
          }
        } catch (error) {}
      }
      if (this.$slots.masterFillter) {
        try {
          if (this.$refs.masterFillter) {
            // h = h - this.$refs.masterFillter.clientHeight;
            this.data_layout.masterFillterHeight = this.$refs.masterFillter.clientHeight;
            this.data_layout.masterFillterWidth = this.$refs.masterFillter.clientWidth;
          }
        } catch (error) {}
      }

      if (this.$slots.masterActionMore) {
        try {
          if (this.$refs.masterActionMore) {
            // h = h - this.$refs.masterActionMore.clientHeight;
            this.data_layout.masterActionMoreHeight = this.$refs.masterActionMore.clientHeight;
            this.data_layout.masterActionMorerWidth = this.$refs.masterActionMore.clientWidth;
          }
        } catch (error) {}
      }

      try {
        this.data_layout.masterBodyHeight =
          h -
          this.data_layout.masterActionHeight -
          this.data_layout.masterFillterHeight -
          this.data_layout.masterActionMoreHeight -
          30;

        if (this.data_layout.masterBodyHeight <= 0) {
          this.data_layout.masterBodyHeight = 200;
        }
        this.data_layout.masterActionWidth = this.data_layout.masterActionWidth;
      } catch (error) {}

      //this.data_layout.top = this.
    },
  },
};
</script>
<style scoped>
.full_height {
  height: 100px !important;
}
.master-action {
}
.body-detail > * {
  margin-top: 5px;
}

.body-detail > * {
  margin-top: 5px;
}
.body-detail > :first-child {
  margin-top: 0px;
}
</style>
