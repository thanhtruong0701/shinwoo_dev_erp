<template>
   <table
               :style="'transform: scale('+scale2+');transform-origin: top left'"
                  cellspacing="0"
                  cellspadding="0"
              >
                <tr v-for="(row, ridx) in tmp" :key="ridx">
                  <td v-for="(item, cidx) in tmp[ridx]" :key="cidx" style="padding-right:10px">
                   
                    <div  v-if="ridx==1 && cidx==1" >
                      <labels
                      :title="labelsTitle.charAt(0)"
                      :name="'AREA'"
                      ></labels>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                      <labels
                      :title="labelsTitle.charAt(1)"
                      :name="'RACK'"
                      ></labels>
                     </div>
                     <div v-for="(lb, idx) in lstLabels" :key="idx"  >
                   
                      <labels 
                      v-if="ridx==1 && cidx==idx+3  && idx!=null && idborder==cidx" 
                      :title="'0'+(idx+1)"
                      :name="'Rack No'"
                      :border='"Y"'
                      ></labels>
                       <labels 
                      v-else-if="ridx==1 && cidx==idx+3  && idx!=null && idborder!=cidx" 
                      :title="'0'+(idx+1)"
                      :name="'Rack No'"
                      :border='"N"'
                      ></labels>
                     </div>
                    <rack 
                    :item="item" 
                    v-if="item" 
                    :title="item.LOC_NAME"
                    :itemPk="item.ITEM_NAME"
                    :itemQty="item.STOCK_QTY"
                    :pk="item.PK"
                    :parent="item.TLG_IN_STORAGE_PK"
                    :row="item?ridx:null"
                    :col="item?cidx:null"
                    :border="item.Border"

                    
                    >
                    </rack>
                    <rack v-else 
                    :nextCol="item.R==ridx &&  item.C ==cidx-1 && (cidx-1)%2==1?cidx:0"
                    :nextRow="item.R == ridx &&  item.C ==(cidx-1)?ridx:null"
                    > &nbsp; </rack>
                  </td>
                </tr>
               </table>
</template>

<script>

import Warehouse from '@/components/part/80/50/8050080_warehouse'
import Rack from '@/components/part/80/50/8050080_rack'
import Label from '@/components/part/80/50/8050080_label'
export default {
  name: 'warehouse_group',
    props: {
        labelsTitle:{
            type: String,
            default: [],
        },
        tmp: {
            type: Array,
            default: [],
        },
          lstLabels: {
            type: Array,
            default: [],
        },
        scale2:{
            type: Number
        },
          idborder:{
            type: Number
        }


    },
   components: {
    'warehouse': Warehouse,
    'rack': Rack,
    'labels': Label,
    },
  data: () => ({
    
  }),
  watch: {
 
  },
  mounted(){
    
  },
  computed: {
  
   
  },
  methods: {
  
  }
}
</script>
