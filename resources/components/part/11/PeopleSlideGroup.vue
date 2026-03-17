<template>
  <v-slide-group 
    :show-arrows="!$attrs.hasOwnProperty('show-arrows') ? 'always' : $attrs['show-arrows']" 
    @click:prev="decreasePage" @click:next="increasePage" 
    max-width="100%" class="fill-height d-flex justify-center"
  >
    <template #prev>
      <v-icon :color="iconColor ? iconColor : 'primary'">mdi-arrow-left-bold-box</v-icon>
    </template>
    <template #next>
      <v-icon :color="iconColor ? iconColor : 'primary'">mdi-arrow-right-bold-box</v-icon>
    </template>
    <v-slide-item
      v-for="(_personItem, idx) in rebuildPeople" 
      :key="idx"                
    >
      <v-card outlined :width="cardWidth * 3" color="transparent" >
        <v-row no-gutters>
          <v-col cols="12" lg="4" v-for="(person, idx2) in _personItem" :key="idx2" class="px-1 py-1"   >
            <v-card :class="person.TEMPERATURE >= 37 ? 'border-red' : ''" outlined :width="cardWidth" :height="heightItem">
              <person-item-info :personItem="person" :itemWidth="cardWidth" :showDate="showDate" />
            </v-card>
          </v-col>
        </v-row>
        
      </v-card>
    </v-slide-item>
  </v-slide-group>
</template>

<script>
export default {
  name: 'people-slide-group',

  components: {
    PersonItemInfo: () => import("@/components/part/11/PersonItemInfo"),
  },

  props: {
    cardWidth: Number,
    people: Array,
    iconColor: String,
    page: Number,
    heightItem: {
      type: Number,
      default: 155
    },
    row: {
      type: Number,
      default: 1
    },
    showDate: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    itemsPerRow: 3,
    rebuildPeople:[],
    callIdx:0,
  }),

  watch:{
    people(val){
      this.rebuildPeople = this.rebuild();
    },
  },
  

  

  methods: {
    increasePage() {
      var newPage = this.page;
      newPage++;
      this.$emit("updatePage", newPage)
    },
    decreasePage() {
      var newPage = this.page;
      newPage--;
      this.$emit("updatePage", newPage)
    },

    rebuild() {
      this.callIdx++;
      if (!(this.people && this.people.length > 0)) return [];

      let _peoples = new Array();
      let numOfPage =(this.people.length % (this.row * this.itemsPerRow) ) == 0 ? (this.people.length / (this.row * this.itemsPerRow) ) : Math.floor((this.people.length / (this.row * this.itemsPerRow) )) + 1 ;
      let itemPerPage = (this.row * this.itemsPerRow);

      for(let i = 0; i < numOfPage; i++ ) {
        let _itemTmp =   [...this.people.filter( (q, idx) => idx >= (i*itemPerPage) && idx < (i*itemPerPage + itemPerPage)  )] //  [...this.people.splice( i*itemPerPage, i*itemPerPage + itemPerPage )];
        _peoples.push(_itemTmp);
      }

      return _peoples;
    },
  }
}
</script>

<style lang="scss" scoped>
.border-red {
  border: 5px solid #D32F2F !important;
}
</style>