<template>
  <GwTransition :transitionType="transition">
    <BaseWrapper :borderColor="borderColor" :borderWidth="borderWidth" :color="color" :flat="isFlat" :id="`gw-grid-layout-id-${keyID}`" :height="containerHeight ? containerHeight : height" v-show="visible">
      <v-container fluid :class="myContainerClass" v-resize="updateHeight" :style="`height: ${containerHeight ? containerHeight : height}px`">
        <v-row :dense="rowAttrs.dense" :no-gutters="rowAttrs.noGutters" :align="rowAttrs.align" :justify="rowAttrs.justify" class="fill-height">
          <v-col v-for="(vnode) in renderSlots()" :key="vnode.data.slot" v-bind="renderColsAttrs(vnode.data)">
            <VNodeItem :nodeValue="vnode"></VNodeItem>
          </v-col>
        </v-row>
      </v-container>
    </BaseWrapper>
  </GwTransition>
  <!-- Lưu ý -->
  <!-- 
    Phải tách biệt (không được nhét) các thẻ popup (thẻ v-dialog hay component popup) hoặc các thẻ (component) có tính năng show overlay (như v-overlay) với component GwGridLayout.
    Nên tách biệt các thẻ/component nói trên với component GwGridLayout bằng thẻ div.
    Vd:
    <template>
      <div>
        <GwGridLayout>
          ...
        </GwGridLayout>

        <các thẻ/component popup />
      </div>
    </template>
  -->
</template>

<script>
import VNodeItem from "@/components/control/grid-layout/VNodeItem";
export default {
  name: "gw-grid-layout",

  components: {
    VNodeItem,
  },

  props: {
    /* Đổ màu background cho container. */
    color: {
      type: String,
      default: "#fff"
    },
    /* Thuộc tính align cho thẻ v-row */
    align: {
      type: String,
      default: "center"
      // Accept values: start, center, end, baseline, stretch.
    },
    /* Thuộc tính justify cho thẻ v-row */
    justify: {
      type: String,
      default: "start"
      // Accept values: start, center, end, space-between, space-around.
    },
    /* Số v-col trên 1 dòng */
    colsPerRow: {
      type: [ String, Number ],
      default: 1
    },
    /* 
      Phần trăm chiều cao (height) cho container. Nếu như dùng "percentHeight" thì sẽ không dùng "containerHeight" và ngược lại. 
      Props này có giá trị để tính toán ra thông số chiều cao cho container (Xem biến "height" ở phần "computed" để biết thêm chi tiết) 
    */
    percentHeight: {
      type: [ String, Number ],
      default: 100
    },
    /* Set class css cho thẻ v-container */
    containerClass: String,
    /* Giá trị cho chiều cao (height) của container. Nếu như dùng "containerHeight" thì không dùng "percentHeight" và ngược lại. */
    containerHeight: [ String, Number ],
    /* Loại bỏ padding & margin cho thẻ v-container */
    noPadding: Boolean,
    /* Khai báo là true nếu như dùng component này bên trong thẻ v-dialog */
    forDialog: {
      type: Boolean,
      default: false
    },
    /* Ẩn/Hiện component này */
    visible: {
      type: Boolean,
      default: true
    },
    /* Hiệu ứng transition khi ẩn/hiện component này. Chỉ có tác dụng khi toggle true/false biến "visible" */
    transition: {
      type: String,
      default: "fade" // Các giá trị khác bao gồm: fab, fade, expand, scale, scroll-x, scroll-x-reverse, scroll-y, scroll-y-reverse, slide-x, slide-x-reverse, slide-y, slide-y-reverse
    },
    /* Màu viền cho khung layout (màu viền này được apply lên thẻ v-sheet trong component BaseWrapper) */
    borderColor: String,
    /* Độ dày viền cho khung layout (được apply lên thẻ v-sheet trong component BaseWrapper) */
    borderWidth: Number
  },

  mounted() {},

  computed: {
    isFlat() {
      return this.$attrs.hasOwnProperty("flat");
    },
    isChildren() {
      return this.$attrs.hasOwnProperty("child");
    },
    keyID() {
      return this._uniqueID();
    },
    rowAttrs() {
      return {
        "dense": this.$attrs.hasOwnProperty("dense"),
        "noGutters": this.$attrs.hasOwnProperty("no-gutters"),
        align: this.align,
        justify: this.justify
      }
    },
    colsValue() {
      return {
        lg: Math.floor(12 / parseInt(this.colsPerRow)),
        md: Math.floor(12 / parseInt(this.colsPerRow)),
        sm: Math.floor(12 / parseInt(this.colsPerRow)),
        xs: this.isNoResponsive ? Math.floor(12 / parseInt(this.colsPerRow)) : 12,
      }
    },
    myContainerClass() {
      if(!!this.noPadding) {
        return "pa-0 ma-0"
      }
      return this.containerClass;
    },
    height() {
      const myHeight = !this.forDialog ? (!this.myContainerClass ? (this.isChildren ? this.formContainerHeight - 32 : this.formContainerHeight) : this.formContainerHeight - 8) : this.windowHeight;
      return this._calculateHeight(myHeight, this.percentHeight);
    },
    isNoResponsive() {
      return this.$attrs.hasOwnProperty("noResponsive");
    }
  },

  methods: {
    renderSlots() {
      //console.log("renderSlots!");
      if(Object.values(this.$slots).length > 1) {
        return Object.values(this.$slots).map(item => item[0]);
      }
      return (this.$slots.default || []).filter(vnode => !!vnode.tag).map((item,index) => {
        item.data = Object.assign(item.data, { slot: `slot-${index+1}` });
        return item;
      })
    },
    renderColsAttrs(value) {
      const attrsDefault = {
        id: `column-${value.slot}`,
        lg: value.attrs?.colspan ? (value.attrs.colspan === "auto" ? (12 - this.colsValue.lg - (value.attrs?.offset ? value.$attrs.offset : 0)) : value.attrs.colspan) : this.colsValue.lg,
        md: value.attrs?.colspan ? (value.attrs.colspan === "auto" ? (12 - this.colsValue.md - (value.attrs?.offset ? value.$attrs.offset : 0)) : value.attrs.colspan) : this.colsValue.md,
        sm: value.attrs?.colspan ? (value.attrs.colspan === "auto" ? (12 - this.colsValue.sm - (value.attrs?.offset ? value.$attrs.offset : 0)) : value.attrs.colspan) : this.colsValue.sm,
        cols: this.isNoResponsive ? (value.attrs?.colspan ? (value.attrs.colspan === "auto" ? (12 - this.colsValue.xs - (value.attrs?.offset ? value.$attrs.offset : 0)) : value.attrs.colspan) : this.colsValue.xs) : 12,
        offset: value.attrs?.offset ? value.attrs.offset : 0     
      }
      if(value?.attrs && value.attrs["align-self"]) {        
        const alignSelfAttr = { "align-self": value.attrs["align-self"] }
        return { ...attrsDefault, ...alignSelfAttr }
      }
      return attrsDefault;
    },
    updateHeight() {
      this.$emit("callBackHeight", this.height)
    }
  }
}
</script>
