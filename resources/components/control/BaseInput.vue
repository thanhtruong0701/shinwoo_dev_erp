<template>
<div :class="isNumber ? 'numberRight' : ''">
    <v-text-field ref="baseInput" v-bind="$attrs" dense :color="currentTheme" :hide-details="showDetails ? false : true" :outlined="
        themesuport === 2 || $attrs.hasOwnProperty('outlined') || $attrs.hasOwnProperty('acntoutlined') ? true : false " 
        :class="themesuport === 2 ? `rounded-0 ${addClass}` : `${addClass}`" 
        :clearable="showClearable" 
        :background-color="bgcolor ? bgcolor : isMandatory ? 'yellow lighten-3' : '' " 
        :validate-on-blur="rules && rules.length ? true : false" 
        :error="error" 
        :rules="rules" 
        :suffix="suffix"
        @blur="onBlur" 
        @click="emitOnclick" 
        @dblclick="emitOnDblClick" 
        @keypress.enter="emitOnKeyPress"
        
        :value="formatValue" @input="inputValue($event)"
        >
        <template v-slot:prepend v-if="showICon">
            <BaseIcon icon_type="input" :icon_size="true" />
        </template>
        <template v-slot:append>
            <slot name="append"></slot>
        </template>
    </v-text-field>
</div>
</template>

<script>
import moment from 'moment';
export default {
    name: "base-input",
    props: [
        "value",
        "rules",
        "key_name",
        "bgcolor",
        "precision",
        "suffix",
        "error",
        "template",
        "addClass"
    ],

    data() {
        return {
            my_value: null,
            isWatch: false,
            isLeave: false,
            timeOnChange: 500,
            timeOut: null,
            onChange: false,
            themesuport: 1,



            //vng-207 20241104 FIX PERFORMANCE -- MOVE FROM COMPUTED TO METHOD
            showClearable: true,
            showICon: false,
            isReadonly: false,
            isNumber: false,
            showDetails: false,
            formatValue:null,
            startInputTime: null,
        };
    },

    created() {
        this.showClearable = this.isClearable();
        this.showICon = this.isShowICon();
        this.isReadonly = this.$attrs.hasOwnProperty("readonly") ? true : false;
        this.isNumber = this.$attrs.hasOwnProperty("number") ? true : false;
        this.showDetails = this.$attrs.hasOwnProperty("showDetails") ? true : false;
    },

    mounted() {
        this.my_value = this.value;
        this.isWatch = true;
        this.isLeave = true;

        this._processTheme();
    },

    computed: {
        isMandatory() {
            return this.$attrs.hasOwnProperty("mandatory") || (this.rules != null && this.rules) ? true : false;
        },  
    },

    watch: {
        value(val) {
            if (val !== this.my_value) this.my_value = val;
        },
        my_value(val) {
            if (this.isWatch) {
                if (this.value == undefined || val !== this.value) {
                    this.processChangeValue(val);
                }
            }

            this.formatValue = val;
        },
        isLeave(val) {
            if(this.isNumber && !isNaN(this.my_value) && val) {
                let precision = this.precision;
                if (this.$attrs.number > 0) precision = this.$attrs.number;

                this.formatValue = new Intl.NumberFormat('en-US', {
                                        minimumFractionDigits: precision ?? 0,
                                        maximumFractionDigits: precision ?? 10
                                    }).format(parseFloat(this.my_value) );
            } else {
                this.formatValue = this.my_value;
            }
        },
        
    },

    methods: {
        processChangeValue(val) {
            this.startInputTime = moment();
            this.$emit("input", this.my_value);

            setTimeout(() => {
                let _startTimeInput = moment(JSON.parse(JSON.stringify(this.startInputTime)));
                let _endTimeInput = _startTimeInput.add(this.timeOnChange, 'ms');
                if(_endTimeInput.diff(moment(), 'ms') <= 0) {
                    this._onChanged();
                }
            }, this.timeOnChange + 100);
        },

        _onChanged() {
            this.$emit("changed", this.my_value);
            this.$emit("change", this.my_value, this.key_name);
        },

        emitOnclick(val) {
            this.$emit("click", val);
        },
        emitOnKeyPress(val) {
            this.$emit("keyPressEnter", val);
        },
        emitOnDblClick(val) {
            this.$emit("dblClick", val);
        },
        onBlur() {
            this.isLeave = true;
        },
        _processTheme() {
            try {
                if (this.curLang.THEME_SUPPORT > 0) {
                    this.themesuport = this.curLang.THEME_SUPPORT;
                } else {
                    this.themesuport = 1;
                }
            } catch (error) {
                this.themesuport = 1;
            }

            // test theme
            // this.themesuport = 2;
        },
        focus() {
            this.$refs.baseInput.focus();
        },





        //vng-207 20241104 FIX PERFORMANCE -- MOVE FROM COMPUTED TO METHOD
        isClearable() {
            if (this.$attrs.hasOwnProperty("readonly")) {
                return false;
            }

            if (this.$attrs.hasOwnProperty("number")) {
                return false;
            }

            if (this.$attrs.hasOwnProperty("disabled")) {
                return false;
            }

            return this.$attrs.hasOwnProperty("clearable") && this.$attrs.clearable !== false;
        },
        isShowICon() {
            if (this.$attrs.hasOwnProperty("icon")) {
                if (this.$attrs.icon == "false") {
                    return false;
                }
                return true;
            }
            return false;
        },

        inputValue(val) {
            this.isLeave = false;
            if(this.isNumber) {
                if(val === "-") {
                    this.my_value = val;
                    return;
                }
                if(val.startsWith("-")) {
                    this.my_value = Number(val.replace(/[^0-9\.]/g, '')) * -1;
                } else {
                    this.my_value = Number(val.replace(/[^0-9\.]/g, ''))
                }
                
            }else {
                this.my_value = val;
            }
        }
    },
};
</script>

<style scoped>
.right-input>div>div>div>input {
    text-align: right;
}
</style>
