<template>
<v-tab-item class="pa-2" :value="hash" :disabled="isDisabled" :transition="false" :eager="eager">
    <slot />
</v-tab-item>
</template>

<script>
export default {
    props: {
        name: {
            required: true
        },
        prefix: {
            default: ""
        },
        suffix: {
            default: ""
        },
        isDisabled: {
            default: false
        },
    },
    data: () => ({
        id: Math.floor(Math.random() * 1000000),
        isActive: false,
        isVisible: true,
    }),
    computed: {
        header() {
            return this.prefix + this.name + this.suffix;
        },
        computedId() {
            return this.id;
        },
        hash() {
            if (this.isDisabled) {
                return "";
            }
            return "" + this.computedId;
        },
        eager() {
            if (this.$attrs.hasOwnProperty("eager")) {
                return this.$attrs['eager'] && this.$attrs.hasOwnProperty("eager");
            }
            return true;
        }
    },
};
</script>
