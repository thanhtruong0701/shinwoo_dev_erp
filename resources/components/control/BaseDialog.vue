<template>
  <transition name="dialog">
    <v-overlay :z-index="zindex" :value="value">
        <div v-if="value" class="dialog-backdrop" @click="handleBackdropClick" :width="width" :height="height">
            <div class="dialog-container" @click.stop>
                <slot/>
            </div>
        </div>
    </v-overlay>
  </transition>
</template>

<script>
export default {
  name: "BaseDialog",
  props: {
    width: { type: [Number, String], default: 1000 },
    height: { type: [Number, String], default: 600 },
    zindex: { type: [Number, String], default: 500 },
    value: { type: Boolean, default: false },
  },
  methods: {
    handleBackdropClick() {
      //this.$emit("update:active", false);
    }
  }
};
</script>

<style scoped>
.dialog-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-container {
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
  padding: 0px;
  background-color: #fff;

  position: absolute;
  top: 50%; right: 50%;
  transform: translate(50%,-50%);
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s;
}
.dialog-enter,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-active .dialog-container,
.dialog-leave-active .dialog-container {
  transition: transform 0.4s;
}
.dialog-enter .dialog-container,
.dialog-leave-to .dialog-container {
  transform: scale(0.9);
}
</style>
