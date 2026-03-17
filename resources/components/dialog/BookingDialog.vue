<template>
	<v-dialog id="bank-dialog" max-width="1400" v-model="dialogIsShow" transition="dialog-top-transition" persistent>
		<v-card>
			<v-card-title class="headline primary-gradient white--text py-2">
				<span>{{ $t("booking") }}</span>
				<v-spacer></v-spacer>
				<v-icon dark @click="onClose()">mdi-close-thick</v-icon>
			</v-card-title>
			<v-container fluid class="pa-2" v-resize="onResize">
				<v-row dense>
					<DataGridView column-resizing-mode="widget" ref="grdTop" :header="headerGrdTop" :filterRow="true" select_mode="Single" :auto_load="false" :max_height="heightGrdD" sel_procedure="LG_SEL_4044010_01_1_NOCACHE" upd_procedure="LG_SEL_4044010_01_1_NOCACHE" @cellDblClick="cellDblClick1" :filter_paras="filterPara1" :update_paras="['PK']" @onAfterLoadData="onProcess3" />
				</v-row>
				<v-row dense>
					<v-col md="2">
						<BaseInput :label="$t('product_qty')" v-model="modelMaster.PRODUCT_QTY" @keyPressEnter="onClick01('search')" readonly />
					</v-col>
					<v-col md="2">
						<BaseInput :label="$t('total_booking')" v-model="modelMaster.TOTAL_BOOKING" @keyPressEnter="onClick01('search')" readonly />
					</v-col>
					<v-col md="4">
						<div class="d-flex justify-center">
							<BaseButton icon_type="remove" :btn_text="$t('remove')" :disabled="isProcessing" @onclick="onClick01('remove')" />
							<BaseButton icon_type="process" :btn_text="$t('make_booking')" :disabled="isProcessing" @onclick="onClick01('make_booking')" />
							<BaseButton icon_type="close" :btn_text="$t('return_main_form')" :disabled="isProcessing" @onclick="onClick01('return_main_form')" />
						</div>
					</v-col>
					<v-col md="1">
						<BaseInput :label="$t('count_item')" v-model="modelMaster.COUNT_ITEM" @keyPressEnter="onClick01('search')" readonly />
					</v-col>
				</v-row>
				<v-row dense>
					<DataGridView column-resizing-mode="widget" ref="grdMiddle" :header="headerGrdMiddle" :filterRow="true" select_mode="Single" :auto_load="false" :max_height="heightGrdD" sel_procedure="LG_SEL_4044010_01_2_NOCACHE" upd_procedure="LG_UPD_4044010_01_1" @row-updated="onRowUpdated1" :filter_paras="filterPara2" :update_paras="['PK', 'TLG_IN_WAREHOUSE_PK', 'WH_NAME', 'TLG_IT_ITEM_PK', 'ITEM_CODE', 'ITEM_NAME', 'UOM', 'BOOK_QTY', 'LOT_NO', 'PO_NO', 'TLG_SA_SALEORDER_M_PK', 'TLG_SA_SALEORDER_D_PK', 'OLD_TLG_SA_SALEORDER_M_PK', 'OLD_PO_NO', 'OPER_SEQ', 'LOC_ID', 'TLG_IN_WHLOC_PK',]" @onAfterLoadData="onProcess2" @rowCount="onRowCount1" />
				</v-row>
				<v-row dense>
					<v-col md="2">
						<div class="d-flex justify-center">
							<BaseButton icon_type="search" :btn_text="$t('view_booked_slip')" :disabled="isProcessing" @onclick="onClick01('view_booked_slip')" />
						</div>
					</v-col>
					<v-col offset-md="1" md="2">
						<BaseInput :label="$t('total_booked')" v-model="modelMaster.TOTAL_BOOKED" @keyPressEnter="onClick01('search')" readonly />
					</v-col>
					<v-col md="1">
						<div class="d-flex justify-center">
							<BaseButton icon_type="remove" :btn_text="$t('cancel_slip')" :disabled="isProcessing" @onclick="onClick01('cancel_slip')" />
						</div>
					</v-col>
				</v-row>
				<v-row dense>
					<DataGridView column-resizing-mode="widget" ref="grdBottom" :header="headerGrdBottom" :filterRow="true" select_mode="Single" :auto_load="false" :max_height="heightGrdD" sel_procedure="LG_SEL_4044010_01_3_NOCACHE" upd_procedure="LG_UPD_4044010_01_2" :filter_paras="filterPara3" :update_paras="['SLIP_NO','EX_DATE','WH_NAME','ITEM_CODE','ITEM_NAME','UOM','EX_QTY','EX_LOT_NO','EX_PO_NO','TLG_ST_EXCHANGE_M_PK','TLG_SA_SALEORDER_D_PK','TLG_BOM_WI_PK','BOM_VERSION',]" @onAfterLoadData="onProcess4" />
				</v-row>
  			
				<ConfirmDialog ref="confirmDialog1" @onConfirm="onClick01('agree_cfm_1')"></ConfirmDialog>
				<ConfirmDialog ref="confirmDialog2" @onConfirm="onClick01('agree_cfm_2')"></ConfirmDialog>
			</v-container>
		</v-card>
	</v-dialog>
	</template>
	
	<script>
	import ConfirmDialog from "@/components/dialog/ConfirmDialog";
	
	export default {
		layout: "default",
		middleware: "user",
		props: {
			objSend:{
				type: Object,
				default: () => { return {} },
			},
			callBackData: {
				type: Array,
				default: () => {
					return []
				},
			},
		},
	
		components: {
    ConfirmDialog,},
	
		data: () => ({
			bookedQty1:0,
			unique1:"",
			f_flag_book:0,
			modelMaster:{
				PRODUCT_QTY:0,
				TOTAL_BOOKING:0,
				TOTAL_BOOKED:0,
				OPERATE_SEQ:"",
				COUNT_ITEM:0,
			},
			headerGrdBottom: [],
			headerGrdMiddle: [],
			headerGrdTop: [],
			dialogIsShow: false,
			itemCell: {},
			typeSite:"",
		}),
	
		async created() {
			await this.getDataList();
		},
	
		watch: {
			dialogIsShow(val) {
				if (val) {
					// bi loi delay nen phai setimeout, code chay nhanh nen chua kip load ref cua popup.
					setTimeout(() => {
						this.$refs.grdTop.loadData()
					}, 10);
				}else{
					this.$refs.grdTop.Clear()
					this.$refs.grdMiddle.Clear()
					this.$refs.grdBottom.Clear()
				}
			},
		},
	
		mounted() {
		},
	
		computed: {
			filterPara3(){
				return [this.objSend.P_SALEORDER_M_PK, this.objSend.P_ORDER_D_PK, this.objSend.P_ITEM_PK, this.objSend.P_SALEORDER_M_PK, ]
			},
			filterPara2(){
				return [this.objSend.P_ITEM_PK]
			},
			filterPara1(){
				return [ this.objSend.P_ITEM_PK, this.objSend.P_TLG_WI_BOM_PK, this.objSend.P_BOM_VER, this.objSend.P_SALEORDER_M_PK, this.objSend.P_ORDER_D_PK, ]
			},
			user() {
				return this.$store.getters["auth/user"];
			},
			heightGrdD() {
				if (this.windowHeight <= 768) {
					return this.windowHeight * 0.38;
				} else {
					return this.windowHeight * 0.30;
				}
			},
		},
	
		methods: {
			onRowCount1(data){
				this.modelMaster.COUNT_ITEM = data
			},
			onRowUpdated1(){
				this.onSumBooking()
			},
			cellDblClick1(row){
				const item1 = row.data
				let arr1 = this.$refs.grdMiddle.getDataSource()
				for (let index = 0; index < arr1.length; index++) {
					const ee1 = arr1[index];
					if (ee1.PK == item1.ITEM_LOTNO && ee1.TLG_IN_WHLOC_PK == item1.TLG_IN_WHLOC_PK) {
						this.showNotification("warning",this.$t("duplicate_item!"),"",3000)
						return
					}
				}
				let book1 = 0
				if(this.bookedQty1+item1.AVAILABLE_QTY > this.objSend.P_ORDER_QTY){
					book1 = this.objSend.P_ORDER_QTY - this.bookedQty1
					this.bookedQty1 = this.objSend.P_ORDER_QTY
				}else{
					this.bookedQty1 += item1.AVAILABLE_QTY
					book1 = item1.AVAILABLE_QTY
				}
				if(book1>0){
					let obj = {
						PK: item1.ITEM_LOTNO, 
						TLG_IN_WAREHOUSE_PK: item1.TLG_IN_WAREHOUSE_PK, 
						WH_NAME: item1.WH_NAME, 
						TLG_IT_ITEM_PK: item1.TLG_IT_ITEM_PK, 
						ITEM_CODE: item1.ITEM_CODE, 
						ITEM_NAME: item1.ITEM_NAME, 
						UOM: item1.UOM, 
						BOOK_QTY: book1, 
						LOT_NO: item1.LOT_NO, 
						PO_NO: this.objSend.P_PO_NO, 
						TLG_SA_SALEORDER_M_PK: this.objSend.P_SALEORDER_M_PK, 
						TLG_SA_SALEORDER_D_PK: this.objSend.P_ORDER_D_PK, 
						OLD_TLG_SA_SALEORDER_M_PK: item1.TLG_SA_SALEORDER_M_PK, 
						OLD_PO_NO: item1.PO_NO, 
						OPER_SEQ: null, 
						LOC_ID: item1.LOC_ID, 
						TLG_IN_WHLOC_PK: item1.TLG_IN_WHLOC_PK, 
						TLG_BOM_WI_PK: item1.TLG_WI_BOM_PK, 
						BOM_VERSION: item1.BOM_VERSION, 
					}
					this.$refs.grdMiddle.addRowStruct(obj)
					this.onSumBooking()
				}
			},
			onClickCell(cell) {
				this.itemCell = cell.data;
			},
			onDblClickCell(row) {
			},
			async loadDataSearch(){
			},
			async onSumBooking(){
				this.bookedQty1 = 0
				let data1 = this.$refs.grdMiddle.getDataSource()
				data1.forEach(ee1 => {
					this.bookedQty1+=Number(ee1.BOOK_QTY)
				});
				this.modelMaster.TOTAL_BOOKING = this.bookedQty1
			},
			async onSumBooked(){
				let tmp1 = 0
				let data1 = this.$refs.grdBottom.getDataSource()
				if(data1){
					if(data1.length>0){
						data1.forEach(ee1 => {
							tmp1+=Number(ee1.EX_QTY)
						});
					}
				}
				this.modelMaster.TOTAL_BOOKED = tmp1
			},
			async onProcess5(){
				this.f_flag_book = 1
				this.$refs.grdBottom.deleteAllRows()
				setTimeout(() => {
					this.$refs.grdBottom.saveData()
				}, 250);
			},
			async onProcess4(){
				this.onSumBooked()
				if(this.f_flag_book==1){
					this.f_flag_book = 0
					this.$refs.grdTop.loadData()
				}
			},
			async onProcess3(){
				if(this.f_flag_book==1){
					this.f_flag_book = 0
					this.$refs.grdBottom.loadData()
				}
			},
			async onProcess2(data1){
				this.countItem(data1)
				// xử lý booking khi add xog lưới 2 middle
				const dso1 = { type: 'process', updpro: 'LG_PRO_4044010_01_1', para: [this.unique1, this.objSend.P_ITEM_PK, this.objSend.P_ORDER_D_PK, this.objSend.P_TLG_WI_BOM_PK, this.objSend.P_BOM_VER], }
				const res1 = await this._dsoCall(dso1, 'process', false)
				if(res1){
					this.showNotification("success",this.$t("booking_finish!"),"",3000)
					this.$refs.grdTop.loadData()
					this.$refs.grdBottom.loadData()
				}
			},
			async onProcess1(){
				this.unique1 = this._uniqueID()
				this.$refs.grdMiddle.setValueColumn("OPER_SEQ",this.unique1,true)
				this.f_flag_book = 1
				this.$refs.grdMiddle.saveData()
			},
			async countItem(data1){
				this.modelMaster.COUNT_ITEM = data1.length
			},
			async onRemove1(){
				this.$refs.grdMiddle.deleteRows()
				setTimeout(() => {
					this.$refs.grdMiddle.saveData()
				}, 250);
				
			},
			async onMakeBooking(){
				if(this.modelMaster.TOTAL_BOOKING > this.objSend.P_ORDER_QTY){
					this.showNotification("warning",this.$t("total_booking_qty_over_product_qty."),"",3000)
					return
				}
				this.$refs.confirmDialog1.showConfirm( this.$t("do_you_want_to_make_booking?") );
			},
			onCancelSlip() {
				let data1 = this.$refs.grdBottom.getDataSource()
				if(data1){
					if(data1.length>0){
						this.$refs.confirmDialog2.showConfirm( this.$t("do_you_want_to_cancel_slip?") );
					}
				}
			},
			onClose() {
				this.dialogIsShow = false
				this.$refs.grdTop.Clear()
				this.$refs.grdMiddle.Clear()
				this.$refs.grdBottom.Clear()
				this.$emit("callBackData",1)
			},
			onClick01(action) {
				switch (action) {
					case "cancel_slip":
						this.onCancelSlip()
						break;
					case "view_booked_slip":
						this.$refs.grdBottom.loadData()
						break;
					case "return_main_form":
						this.onClose()
						break;
					case "remove":
						this.onRemove1()
						break;
					case "agree_cfm_2":
						this.onProcess5()
						break;
					case "agree_cfm_1":
						this.onProcess1()
						break;
					case "make_booking":
						this.onMakeBooking()
						break;
					case "search":
						this.$refs.grdD.loadData();
						break;
				}
			},
		
			async getDataList() {
				//
				this.initHeader();
			},
			initHeader() {
				this.headerGrdTop = [ 
					{ dataField: "ITEM_LOTNO", caption: this.$t("item_lotno"), width: 120, allowEditing: false, visible: false,}, 
					{ dataField: "TLG_IN_WAREHOUSE_PK", caption: this.$t("tlg_in_warehouse_pk"), width: 120, allowEditing: false, visible: false,}, 
					{ dataField: "WH_NAME", caption: this.$t("wh_name"), width: 120, allowEditing: false, }, 
					{ dataField: "TLG_IT_ITEM_PK", caption: this.$t("tlg_it_item_pk"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "ITEM_CODE", caption: this.$t("item_code"), width: 120, allowEditing: false, }, 
					{ dataField: "ITEM_NAME", caption: this.$t("item_name"), width: 120, allowEditing: false, }, 
					{ dataField: "UOM", caption: this.$t("uom"), width: 120, allowEditing: false, }, 
					{ dataField: "STOCK_QTY", caption: this.$t("stock_qty"), width: 120, allowEditing: false, }, 
					{ dataField: "LOT_NO", caption: this.$t("lot_no"), width: 120, allowEditing: false, }, 
					{ dataField: "PO_NO", caption: this.$t("po_no"), width: 120, allowEditing: false, }, 
					{ dataField: "BOOK_QTY", caption: this.$t("book_qty"), width: 120, allowEditing: false, }, 
					{ dataField: "AVAILABLE_QTY", caption: this.$t("available_qty"), width: 120, allowEditing: false, }, 
					{ dataField: "TLG_SA_SALEORDER_M_PK", caption: this.$t("tlg_sa_saleorder_m_pk"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "TLG_WI_BOM_PK", caption: this.$t("tlg_wi_bom_pk"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "BOM_VERSION", caption: this.$t("bom_version"), width: 120, allowEditing: false, }, 
					{ dataField: "LOC_ID", caption: this.$t("loc_id"), width: 120, allowEditing: false, }, 
					{ dataField: "TLG_IN_WHLOC_PK", caption: this.$t("tlg_in_whloc_pk"), width: 120, allowEditing: false, visible: false, }, 
				]
				this.headerGrdMiddle = [ 
					{ dataField: "PK", caption: this.$t("pk"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "TLG_IN_WAREHOUSE_PK", caption: this.$t("tlg_in_warehouse_pk"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "WH_NAME", caption: this.$t("wh_name"), width: 120, allowEditing: false, }, 
					{ dataField: "TLG_IT_ITEM_PK", caption: this.$t("tlg_it_item_pk"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "ITEM_CODE", caption: this.$t("item_code"), width: 120, allowEditing: false, }, 
					{ dataField: "ITEM_NAME", caption: this.$t("item_name"), width: 120, allowEditing: false, }, 
					{ dataField: "UOM", caption: this.$t("uom"), width: 120, allowEditing: false, }, 
					{ dataField: "BOOK_QTY", caption: this.$t("book_qty"), width: 120, allowEditing: true, }, 
					{ dataField: "LOT_NO", caption: this.$t("lot_no"), width: 120, allowEditing: false, }, 
					{ dataField: "PO_NO", caption: this.$t("po_no"), width: 120, allowEditing: false, }, 
					{ dataField: "TLG_SA_SALEORDER_M_PK", caption: this.$t("tlg_sa_saleorder_m_pk"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "TLG_SA_SALEORDER_D_PK", caption: this.$t("tlg_sa_saleorder_d_pk"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "OLD_TLG_SA_SALEORDER_M_PK", caption: this.$t("old_tlg_sa_saleorder_m_pk"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "OLD_PO_NO", caption: this.$t("old_po_no"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "OPER_SEQ", caption: this.$t("oper_seq"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "LOC_ID", caption: this.$t("loc_id"), width: 120, allowEditing: false, }, 
					{ dataField: "TLG_IN_WHLOC_PK", caption: this.$t("tlg_in_whloc_pk"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "TLG_BOM_WI_PK", caption: this.$t("tlg_bom_wi_pk"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "BOM_VERSION", caption: this.$t("bom_version"), width: 120, allowEditing: false, }, 
				]
				this.headerGrdBottom = [ 
					{ dataField: "SLIP_NO", caption: this.$t("slip_no"), width: 120, allowEditing: false, allowMerge: true,}, 
					{ dataField: "EX_DATE", caption: this.$t("ex_date"), width: 120, allowEditing: false, allowMerge: true,}, 
					{ dataField: "WH_NAME", caption: this.$t("wh_name"), width: 120, allowEditing: false, allowMerge: true,}, 
					{ dataField: "ITEM_CODE", caption: this.$t("item_code"), width: 120, allowEditing: false, }, 
					{ dataField: "ITEM_NAME", caption: this.$t("item_name"), width: 120, allowEditing: false, }, 
					{ dataField: "UOM", caption: this.$t("uom"), width: 120, allowEditing: false, }, 
					{ dataField: "EX_QTY", caption: this.$t("ex_qty"), width: 120, allowEditing: false, }, 
					{ dataField: "EX_LOT_NO", caption: this.$t("ex_lot_no"), width: 120, allowEditing: false, }, 
					{ dataField: "EX_PO_NO", caption: this.$t("ex_po_no"), width: 120, allowEditing: false, }, 
					{ dataField: "TLG_ST_EXCHANGE_M_PK", caption: this.$t("tlg_st_exchange_m_pk"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "TLG_SA_SALEORDER_D_PK", caption: this.$t("tlg_sa_saleorder_d_pk"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "TLG_BOM_WI_PK", caption: this.$t("tlg_bom_wi_pk"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "BOM_VERSION", caption: this.$t("bom_version"), width: 120, allowEditing: false, visible: false, }, 
					{ dataField: "LOC_ID", caption: this.$t("loc_id"), width: 120, allowEditing: false, }, 
					{ dataField: "TLG_IN_WHLOC_PK", caption: this.$t("tlg_in_whloc_pk"), width: 120, allowEditing: false, visible: false, }, 
				]
			},
		},
	};
	</script>
	
	<style>
	</style>
	