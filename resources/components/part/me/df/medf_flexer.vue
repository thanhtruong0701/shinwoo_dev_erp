<template>
	<GwFlexBox ref="flexerWrapper" id="flexerWrapper" color="transparent" class="flex-column mr-1 mb-1" justify="start" :width="width ? width : wrapperWidth" :height="height">
		<v-card dark flat tile color="blue darken-4" class="text-center text-md-caption font-weight-bold">{{ flexerTitle }}</v-card>		
		<v-card flat tile class="d-flex align-center justify-space-between" v-for="(flexer, index) in flexerArr" :key="index">
			<v-card outlined tile class="d-flex align-center justify-center" width="40%" height="100%">
				<div class="font-weight-bold w-100 text-center preLine" :class="windowHeight > 768 ? 'text-body-2' : 'text-caption'">{{ flexer.title }}</div>
				<!-- <v-card-subtitle class="ma-0 pa-2 font-weight-bold">{{ flexer.title }}</v-card-subtitle> -->
			</v-card>
			<v-card outlined tile class="d-flex align-center justify-center" width="30%" height="100%">
				<div class="font-weight-bold w-100 text-center preLine" :class="windowHeight > 768 ? 'text-body-2' : 'text-caption'">{{ flexer.value }}</div>
				<!-- <v-card-subtitle class="ma-0 pa-2 font-weight-bold">{{ flexer.value }}</v-card-subtitle> -->
			</v-card>
			<v-card outlined tile class="d-flex align-center justify-center" width="30%" height="100%">
				<div class="font-weight-bold w-100 text-center preLine" :class="windowHeight > 768 ? 'text-body-2' : 'text-caption'">{{ flexer.uom }}</div>
				<!-- <v-card-subtitle class="ma-0 pa-2 font-weight-bold">{{ flexer.uom }}</v-card-subtitle> -->
			</v-card>

			<!-- <v-data-table              
				dense hide-default-header hide-default-footer				
				:headers="headers"
				:items="flexerArr"
				:headers-length="2"
			></v-data-table> -->
		</v-card>
	</GwFlexBox>
</template>

<script>
//#088209
export default {
  name: 'flexer',

  props: {
    flexerArr: {
      type: Array,
      default: [],
    },
    flexerTitle: {
      type: String,
      default: "abcdef"
    },
		flexerLength: Number,
		width: [String, Number],
		height: [String, Number]
  },

	/* mounted() {
		console.log(this.flexerArr[0])
	}, */

	computed: {
		headers() {
			let newHeader = [];
			const defaultHeaders = [
				{ text: "title", value: "title", width: "30%" },
				{ text: "value", value: "value", width: "20%" },
				{ text: "uom", value: "uom", width: "30%" }
			];
			defaultHeaders.forEach(item => {
				if(this.flexerArr[0][item.value] !== "") {
					newHeader.push(item)
				}
			})	
			return newHeader;		
		},
		wrapperWidth() {			
			return this.flexerLength ? `${Math.ceil(100/this.flexerLength)-1}%` : "auto";
		}
	}
}
</script>

<style lang="scss">
#flexerWrapper {
	.preLine {
		white-space: pre-line;
	}
	.flexerArr {
		border-top: 2px solid #000 !important;
		border-left: 2px solid #000 !important;
		border-right: 2px solid #000 !important;
		.v-card:nth-child(2) {
			border-left: 2px solid #000 !important;
			border-right: 2px solid #000 !important;
		}
	}
	.flexerArr:last-child {
		border-bottom: 2px solid #000 !important;
	}
}
#flexerWrapper {
	table {
		td + td { 
			border-left: 1px solid #dddddd !important 
		}
	}
}
</style>