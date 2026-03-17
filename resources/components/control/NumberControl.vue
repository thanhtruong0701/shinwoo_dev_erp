<template>
	<v-text-field  
		dense hide-details :outlined="outlined" :label="label"
		v-model="numberFormatted" v-bind:disabled.sync="disabled" reverse 
		@blur="onBlur"
	></v-text-field>
</template>


<script>
	export default {
		name: 'number-control',
		props: {
			label:{
				type:String,
			},
			prefit:{
				type: String,
				default: ""
			},
			precision:{
				type: Number,
				default: 0
			},
			inputValue: {
				type: Number,
			},
			model:{
				type: Object
			},
			outlined: {
		      type: Boolean,
		      default: false
		    },
			disabled:{
				type: Boolean,
				default: false
			}

		},

		data: () => ({
			value: 0,
			isLeave: false,
			isFirstLoad:true
		}),


		watch:{
			inputValue: {
				immediate: true,
				handler(val) {
					this.value  = val;
					if(this.isFirstLoad) {
						this.isLeave = true;
						this.isFirstLoad= false;
					}
					
					this.returnValue(val)	
				}
			},
		},

		computed: {
			numberFormatted: {
				get: function() {
					if(this.value === null) return null;
					try{
						if(this.isLeave)
							return this._formatCurrency(this.value, this.prefit, this.precision);
						else 
							return this.value+"";
					}
					catch { }
					return null;
					
				},
				set: function(newValue) {
					this.isLeave = false;
					this.value =  Number(newValue.replace(/[^0-9\.]/g, ''));
					this.returnValue(this.value);
					return this.value;
				}
			}
		},

		methods:{
			onBlur(){
				this.isLeave = true;
				//this.numberFormatted = this._formatCurrency(this.value, this.prefit, this.precision)
				this.returnValue(this.value)	;
			},

			returnValue(value) {
				try{ this.model.value = value } catch(e) {}
				this.$emit('returnValue', value, this.model);
			}
		}

	}
</script>	
