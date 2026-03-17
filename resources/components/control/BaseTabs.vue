<template>
<v-card>
    <v-toolbar dense tile :height="height" :color="(!!$slots.start || !!$slots.end) ? bgcolor : ''">
        <div v-if="$slots.start">
            <slot name="start"></slot>
        </div>
        <v-tabs v-model="activeTabHash" :height="height" :background-color="(!$slots.start || !$slots.end) ? bgcolor : 'transparent'" active-class="primaryTextFour" :class="cssclass" dark next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows slider-size="5">
            <v-tabs-slider></v-tabs-slider>
            <v-tab v-for="tab in tabs" :key="tab.hash" v-html="tab.header" :disabled="tab.isDisabled" :href="'#'+tab.hash">{{ tab.header }}</v-tab>
        </v-tabs>
        <div v-if="$slots.end">
            <slot name="end"></slot>
        </div>
    </v-toolbar>
    <v-tabs-items v-model="activeTabHash" ref="children">
        <slot></slot>
    </v-tabs-items>
</v-card>
</template>

<script>
export default {
    props: {
        activeTab: {
            type: Number,
            default: -1,
        },
        bgcolor: {
            type: String,
            default: "primary-gradient"
        },
        cssclass: {
            type: String,
            default: null
        },
        height: {
            type: Number,
            default: 35,
        },
    },
    data: () => ({
        tabs: [],
        activeTabHash: "",
        activeTabIndex: -1,
        lastActiveTabHash: "",
    }),
    computed: {},
    created() {},
    watch: {
        activeTabIndex(val) {
            if (val != this.activeTab) {
                // this.activeTab = val;
                this.$emit("tabchanged", val);
            }

            this.selectTab(this.getTabHash(val));
        },

        activeTabHash(val) {
            if (val != this.activeTab) {
                // this.activeTab = val;
                this.$emit("tabchanged", this.getTabIndex(val));
            }
            this.selectTab(val);
        },

        activeTab(val) {
            if (val != this.activeTabIndex) {
                this.activeTabIndex = val;
            }
        },
    },
    mounted() {
        let _tabs = this.$refs.children.$children;
        _tabs.forEach(e => {
            if (e.isDisabled && e.isDisabled == true) {
                let lNull="";
            } else if (e.isDisabled == false) {
                this.tabs.push(e);
            }
        });
        // this.tabs = this.$refs.children.$children;
        if (this.tabs.length) {
            this.activeTabIndex = 0;
            const tab = this.tabs.find((tab) => this.tabs.indexOf(tab) === 0);
            this.activeTabHash = tab.hash;
        }
    },
    methods: {
        changeTabsDynamically(val) {
            this.selectTab(this.getTabHash(val));
        },
        findTab(hash) {
            return this.tabs.find((tab) => tab.hash === hash);
        },
        selectTab(selectedTabHash, event) {

            // See if we should store the hash in the url fragment.
            if (event && !this.options.useUrlFragment) {
                event.preventDefault();
            }
            const selectedTab = this.findTab(selectedTabHash);
            if (!selectedTab) {
                return;
            }
            if (selectedTab.isDisabled) {
                event.preventDefault();
                return;
            }
            if (this.lastActiveTabHash === selectedTab.hash) {
                this.$emit("clicked", {
                    tab: selectedTab
                });
                return;
            }
            this.tabs.forEach((tab) => {
                tab.isActive = tab.hash === selectedTab.hash;
            });
            this.$emit("changed", {
                tab: selectedTab
            });
            this.activeTabHash = selectedTab.hash;
            //this.activeTabIndex = this.getTabIndex(selectedTabHash);
            this.lastActiveTabHash = this.activeTabHash = selectedTab.hash;
        },
        setTabVisible(hash, visible) {
            const tab = this.findTab(hash);
            if (!tab) {
                return;
            }
            tab.isVisible = visible;
            if (tab.isActive) {
                // If tab is active, set a different one as active.
                tab.isActive = visible;
                this.tabs.every((tab, index, array) => {
                    if (tab.isVisible) {
                        tab.isActive = true;
                        return false;
                    }
                    return true;
                });
            }
        },

        getTabIndex(hash) {
            const tab = this.findTab(hash);

            return this.tabs.indexOf(tab);
        },

        getTabHash(index) {

            const tab = this.tabs.find((tab) => this.tabs.indexOf(tab) === index);

            if (!tab) {
                return;
            }

            return tab.hash;
        },

        getActiveTab() {
            return this.tabs[this.activeTabIndex];
        },

        getActiveTabIndex() {
            return this.getTabIndex(this.activeTabHash);
        },
    },
};
</script>
