<template>
	<v-dialog id="bank-dialog" max-width="1600" v-model="dialogIsShow" transition="dialog-top-transition" persistent>
		<v-card>
			<v-card-title class="headline primary-gradient white--text py-2">
				<span>{{ $t("popup_get_item_from_wi") }}</span>
				<v-spacer></v-spacer>
				<v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
			</v-card-title>
			<v-container fluid class="pa-2" v-resize="onResize">
				<v-row dense>
					<v-col md="2" offset-md="2"> 
						<BaseSelect item-value="PK" item-text="TEXT" :label="$t('factory')" :lstData="lstFactory" v-model="itemFactory" :text_all="$t('all')" disableSearch />
					</v-col>
					<v-col md="2">
						<BaseSelect item-value="PK" item-text="TEXT" :label="$t('line')" :lstData="lstLine1" v-model="itemLine1" :text_all="$t('all')" disableSearch />
					</v-col>
					<v-col md="2">
						<BaseSelect item-value="PK" item-text="TEXT" :label="$t('line')" :lstData="lstLine2" v-model="itemLine2" :text_all="$t('all')" disableSearch />
					</v-col>
					<v-col md="2">
						<BaseSelect item-value="PK" item-text="TEXT" :label="$t('w_process')" :lstData="lstProcess1" v-model="itemProcess1" :text_all="$t('all')" disableSearch />
					</v-col>
				</v-row>
				<v-row dense>
					<v-col md="1" offset-md="2"> 
						<BaseDatePicker :label="$t('wi_date_fr')" v-model="txtDate1" today />
					</v-col>
					<v-col md="1">
						<BaseDatePicker :label="$t('wi_date_to')" v-model="txtDate2" today />
					</v-col>
					<v-col md="2">
						<BaseInput :label="$t('wi')" v-model="txtWI" @keyPressEnter="onClick01('search')" />
					</v-col>
					<v-col md="1">
						<BaseSelect item-value="CODE" item-text="NAME" :label="$t('shift')" :lstData="lstShift" v-model="itemShift" :text_all="$t('all')" disableSearch />
					</v-col>
					<v-col md="1">
						<BaseCheckbox :label="$t('bal')" true-value="Y" false-value="N" v-model="chkBal" />
					</v-col>
					<v-col md="2">
						<div class="d-flex justify-end">
							<BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClick01('search')" />
							<BaseButton icon_type="select" :btn_text="$t('select')" :disabled="isProcessing" @onclick="onClick01('select')" />
						</div>
					</v-col>
				</v-row>
				<v-row dense>
					<v-col md="2" offset-md="2"> 
						<BaseInput :label="$t('ord_no')" v-model="txtOrdNo" @keyPressEnter="onClick01('search')" />
					</v-col>
					<v-col md="2"> 
						<BaseInput :label="$t('item')" v-model="txtItemCodeName" @keyPressEnter="onClick01('search')" />
					</v-col>
				</v-row>
				<v-row dense>
					<BaseGridView column-resizing-mode="widget" ref="grdUp" :height="heightGrdTab1" :header="headerGrdTab1" sel_procedure="LG_SEL_4075010_01_1" :filter_paras="[itemFactory,itemLine1,itemLine2,itemProcess1,itemShift,txtDate1,txtDate2,txtWI,chkBal,txtOrdNo,txtItemCodeName]" upd_procedure="" :update_paras="['PK']" selectionmode="multiplerows" :autocheckbox='false' />
				</v-row>
			</v-container>
		</v-card>
	</v-dialog>
	</template>
	
	<script>
	import moment from "moment";
	
	export default {
		layout: "default",
		middleware: "user",
		props: {
			callBackData: {
				type: Array,
				default: () => {
					return []
				},
			},
		},
	
		components: {},
	
		data: () => ({
			headerGrdTab1:[],
			dialogIsShow: false,
			lstFactory         : [],
			itemFactory        : "",
			lstLine1           : [],
			itemLine1          : "",
			lstLine2           : [],
			itemLine2          : "",
			lstProcess1        : [],
			itemProcess1       : "",
			txtDate1           : "",
			txtDate2           : "",
			lstShift           : [],
			itemShift          : "",
			txtWI              : "",
			chkBal             : "Y",
			txtOrdNo           : "",
			txtItemCodeName    : "",
		}),
	
		async created() {
			this.getDataList()
			this.initHeader()
		},
	
		watch: {
			dialogIsShow(val){
				if(!val){
					this.$refs.grdUp.Clear()
				}
			},
			itemLine2(val){
				this.onLoadWProcess(val)
			},
		},
	
		mounted() {
		},
	
		computed: {
			user() {
				return this.$store.getters["auth/user"];
			},
			heightGrdTab1() {
				if (this.windowHeight <= 768) {
					return this.windowHeight * 0.38;
				} else {
					return this.windowHeight * 0.4;
				}
			},
		},
	
		methods: {
			async onLoadWProcess(val){
				const dso = { type: "list", selpro: "LG_SYS_GET_W_PROCESS_1", para: [this.itemFactory, this.itemLine1, val] }
				const result1 = await this._dsoCall(dso, "select", false)
				if(result1){
					if(result1.length>0){
						this.lstProcess1 = result1
					}
				}
			},
			async onGetCommonCode(code){
				const dso = { type: "list", selpro: "LG_GET_COMMONCODE", para: [code] }
				const result = await this._dsoCall(dso, "select", false)
				return result
			},
			async onGetLine(code){
				const dso1 = { type: "list", selpro: "LG_GET_LINE", para: [code] };
				const result1 = await this._dsoCall(dso1, "select", false);
				return result1
			},
			async getDataList(){
				this.lstFactory = await this._getFactoryByUsery(this.user.PK, this.user.PR_LEVEL)
				const result1 = await this.onGetLine(1);
				if(result1){
					if(result1.length>0){
						this.lstLine1 = result1	
					}
				}
				const result2 = await this.onGetLine(2);
				if(result2){
					if(result2.length>0){
						this.lstLine2 = result2	
					}
				}
				this.lstShift = await this.onGetCommonCode('LGPC0020')

			},
			initHeader(){
				this.headerGrdTab1 = [ 
					{ dataField: "WI_NO", caption: this.$t("wi_no"), width: 120, allowEditing: false, }, 
					{ dataField: "LINE_NAME", caption: this.$t("line_name"), width: 120, allowEditing: false, }, 
					{ dataField: "WH_NAME", caption: this.$t("def_wh_name"), width: 120, allowEditing: false, }, 
					{ dataField: "WP_NAME", caption: this.$t("work_process"), width: 120, allowEditing: false, }, 
					{ dataField: "ITEM_CODE", caption: this.$t("item_code"), width: 120, allowEditing: false, }, 
					{ dataField: "ITEM_NAME", caption: this.$t("item_name"), width: 120, allowEditing: false, }, 
					{ dataField: "UOM", caption: this.$t("uom"), width: 120, allowEditing: false, }, 
					{ dataField: "WI_QTY", caption: this.$t("wi_qty"), width: 120, allowEditing: false, }, 
					{ dataField: "IN_QTY", caption: this.$t("in_qty"), width: 120, allowEditing: false, }, 
					{ dataField: "BAL", caption: this.$t("bal_qty"), width: 120, allowEditing: false, }, 
					{ dataField: "TLG_PB_LINE_GROUP_PK", caption: this.$t("tlg_pb_line_group_pk"), width: 120, allowEditing: false, hidden: true,}, 
					{ dataField: "TLG_PB_LINE_PK", caption: this.$t("tlg_pb_line_pk"), width: 120, allowEditing: false, hidden: true,}, 
					{ dataField: "TLG_PB_PROCESS_PK", caption: this.$t("tlg_pb_process_pk"), width: 120, allowEditing: false, hidden: true,}, 
					{ dataField: "TLG_PB_WORK_PROCESS_PK", caption: this.$t("tlg_pb_work_process_pk"), width: 120, allowEditing: false, hidden: true,}, 
					{ dataField: "ITEM_PK", caption: this.$t("item_pk"), width: 120, allowEditing: false, hidden: true,}, 
					{ dataField: "WI_PK", caption: this.$t("wi_pk"), width: 120, allowEditing: false, hidden: true,}, 
					{ dataField: "TABLE_NAME", caption: this.$t("table_name"), width: 120, allowEditing: false, hidden: true,}, 
					{ dataField: "WH_PK", caption: this.$t("wh_pk"), width: 120, allowEditing: false, hidden: true,}, 
					{ dataField: "WORK_SHIFT", caption: this.$t("shift_cd"), width: 120, allowEditing: false, }, 
					{ dataField: "LINE_ID", caption: this.$t("line_cd"), width: 120, allowEditing: false, }, 
					{ dataField: "CHARGER_PK", caption: this.$t("charger_pk"), width: 120, allowEditing: false, hidden: true,}, 
					{ dataField: "FULL_NAME", caption: this.$t("charger_name"), width: 120, allowEditing: false, }, 
					{ dataField: "REVISION_NO", caption: this.$t("lot_revision"), width: 120, allowEditing: false, }, 
					{ dataField: "ATT01", caption: this.$t("machine_st_h"), width: 120, allowEditing: false, }, 
					{ dataField: "ATT02", caption: this.$t("machine_worker_st_h"), width: 120, allowEditing: false, }, 
				]
			},
			onSelectItem(){
				let arrItem = this.$refs.grdUp.getSelectedRows()
				if(arrItem){
					if(arrItem.length>0){
						this.$emit("callBackData",arrItem)
						this.dialogIsShow = false
						this.$refs.grdUp.Clear()
					}
				}
			},
			onClick01(action){
				switch (action) {
					case "search":
						this.$refs.grdUp.loadData()
						break;
					case "select":
						this.onSelectItem()
						break;
				
					default:
						break;
				}
			},
		},
	};
	</script>
	
	<style>
	</style>
	