<template>
	<GwFlexBox class="flex-column mx-auto" :width="width" :height="height">
		<v-sheet color="white" height="6%" class="d-flex align-center justify-center">
			<span class="font-weight-bold">{{ovenTitle}}</span>
		</v-sheet>
		<GwFlexBox align="center" justify="center" color="#800a0a" class="text-lg-subtitle-2 text-xl-subtitle-1 overflow-y-hidden" height="10%">
			<v-sheet color="#800a0a" class="font-weight-bold text-center white--text borderBlack" width="10%">O</v-sheet>
			<v-sheet color="#088209" class="text-center  borderBlack" width="23.33%" :class="`${(ovenObj.txtcolorOTop)}--text`">{{ _formatNumber(ovenObj.ValOTop, 0) }}</v-sheet>
			<v-sheet color="#800a0a" class="text-center white--text borderBlack" width="10%">-</v-sheet>
			<v-sheet color="#088209" class="text-center  borderBlack" width="23.33%" :class="`${(ovenObj.txtcolorCTop)}--text`">{{ _formatNumber(ovenObj.ValCTop, 0) }}</v-sheet>
			<v-sheet color="#800a0a" class="font-weight-bold text-center white--text" borderBlack width="10%">D</v-sheet>
			<v-sheet color="#088209" class="text-center  borderBlack" width="23.33%" :class="`${(ovenObj.txtcolorDTop)}--text`">{{ _formatNumber(ovenObj.ValDTop, 0) }}</v-sheet>
		</GwFlexBox>
		<GwFlexBox align="center" justify="center" color="white" class="text-lg-subtitle-2 text-xl-subtitle-1 white--text overflow-y-hidden" height="10%">
			<v-sheet color="#107f77" width="80%">
				<span style="opacity: 0;">A</span>
			</v-sheet>			
		</GwFlexBox>
		<GwFlexBox align="center" justify="center" color="#800a0a" class="text-lg-subtitle-2 text-xl-subtitle-1 white--text overflow-y-hidden" height="10%">
			<v-sheet color="#800a0a" class="font-weight-bold text-center white--text" width="10%">O</v-sheet>
			<v-sheet color="#088209" class="text-center" width="23.33%" :class="`${(ovenObj.txtcolorOTopC)}--text`">{{ _formatNumber(ovenObj.ValOTopC, 0) }}</v-sheet>
			<v-sheet color="#800a0a" class="text-center white--text" width="10%">-</v-sheet>
			<v-sheet color="#088209" class="text-center white--text" width="23.33%">
				<span style="opacity: 0;">A</span>
			</v-sheet>
			<v-sheet color="#800a0a" class="font-weight-bold text-center white--text" width="10%">D</v-sheet>
			<v-sheet color="#088209" class="text-center" width="23.33%" :class="`${(ovenObj.txtcolorDTopC)}--text`">{{ _formatNumber(ovenObj.ValDTopC, 0) }}</v-sheet>
		</GwFlexBox>
		<GwFlexBox align="center" justify="center" color="white" class="text-lg-subtitle-2 text-xl-subtitle-1 overflow-y-hidden" height="10%">
			<v-sheet color="#107f77" width="80%">
				<span style="opacity: 0;">A</span>
			</v-sheet>			
		</GwFlexBox>
		<GwFlexBox align="center" justify="center" color="#800a0a" class="text-lg-subtitle-2 text-xl-subtitle-1 overflow-y-hidden" height="10%">
			<v-sheet color="#800a0a" class="font-weight-bold text-center  white--text" width="10%">O</v-sheet>
			<v-sheet color="#088209" class="text-center" width="23.33%" :class="`${(ovenObj.txtcolorOBotC)}--text`">{{ _formatNumber(ovenObj.ValOBotC, 0) }}</v-sheet>
			<v-sheet color="#800a0a" class="text-center white--text" width="10%">-</v-sheet>
			<v-sheet color="#088209" class="text-center white--text" width="23.33%">
				<span style="opacity: 0;">A</span>
			</v-sheet>
			<v-sheet color="#800a0a" class="font-weight-bold text-center white--text" width="10%">D</v-sheet>
			<v-sheet color="#088209" class="text-center" width="23.33%" :class="`${(ovenObj.txtcolorDBotC)}--text`">{{ _formatNumber(ovenObj.ValDBotC, 0) }}</v-sheet>
		</GwFlexBox>
		<GwFlexBox align="center" justify="center" color="white" class="text-lg-subtitle-2 text-xl-subtitle-1 overflow-y-hidden" height="24%">
			<GwFlexBox color="#107f77" class="flex-column" width="80%" justify="center">
				<GwFlexBox color="#d2d1d0" class="font-weight-bold text-center" justify="center">
					<v-sheet color="transparent" width="60%">Control 1</v-sheet>
					<v-sheet color="white" width="30%" :class="`${(ovenObj.txtcolorControl1)}--text`">{{ _formatNumber(ovenObj.ValControl1, 0) }}</v-sheet>
					<v-sheet color="transparent" width="10%">C</v-sheet>
				</GwFlexBox>
				<GwFlexBox color="#d2d1d0" class="font-weight-bold text-center" justify="center">
					<v-sheet color="transparent" width="60%">Control 2</v-sheet>
					<v-sheet color="white" width="30%" :class="`${(ovenObj.txtcolorControl2)}--text`">{{ _formatNumber(ovenObj.ValControl2, 0) }}</v-sheet>
					<v-sheet color="transparent" width="10%">C</v-sheet>
				</GwFlexBox>
			</GwFlexBox>
		</GwFlexBox>
		<GwFlexBox align="center" justify="center" color="#800a0a" class="text-lg-subtitle-2 text-xl-subtitle-1 overflow-y-hidden" height="10%">
			<v-sheet color="#800a0a" class="font-weight-bold text-center white--text" width="10%">O</v-sheet>
			<v-sheet color="#088209" class="text-center" width="23.33%" :class="`${(ovenObj.txtcolorOBot)}--text`">{{ _formatNumber(ovenObj.ValOBot, 0) }}</v-sheet>
			<v-sheet color="#800a0a" class="text-center  white--text" width="10%">-</v-sheet>
			<v-sheet color="#088209" class="text-center " width="23.33%" :class="`${(ovenObj.txtcolorCBot)}--text`">{{ _formatNumber(ovenObj.ValCBot, 0) }}</v-sheet>
			<v-sheet color="#800a0a" class="font-weight-bold text-center  white--text" width="10%">D</v-sheet>
			<v-sheet color="#088209" class="text-center " width="23.33%" :class="`${(ovenObj.txtcolorDBot)}--text`">{{ _formatNumber(ovenObj.ValDBot, 0) }}</v-sheet>
		</GwFlexBox>
	</GwFlexBox>
</template>

<script>
//#088209
export default {
  name: 'oven_temp',
  props: {
    ovenObj: {
      type: Object,
      default: {},
    },
    ovenTitle: {
      type: String,
      default: "Oven - -"
    },
		width: [String, Number],
		height: [String, Number]
  }  
}
</script>

<style lang="scss" scoped>
.borderBlack {
	border: 1px solid black;
}
</style>
