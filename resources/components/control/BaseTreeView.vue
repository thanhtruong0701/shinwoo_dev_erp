<template>
    <v-sheet style="overflow: hidden;" :width="width" :height="height"  v-if="treeRendered">
        <v-card-title class="subtitle-1 primary-gradient white--text py-1 d-flex" v-show="label ? true : false">
            <span>{{$t(label)}}</span>
            <v-spacer></v-spacer>
            <BaseInput :outlined="true"  :label="$t('search')" v-model="searchText" @keyPressEnter="onSearch" style="width: 50% !important" class="white" v-show="search"></BaseInput>
        </v-card-title>
        
        <JqxTree ref="myTree" v-if="treeRendered" class="px-0"
            :width="'99.5%'" :height="'90%'" :source="myValue"
            @itemClick="itemClick"
            :allowDrag="allowDrag"
            :allowDrop="allowDrop"
        >
        </JqxTree>
    </v-sheet>
</template>

<script>
export default {
    name: "base-tree-view",

    props:{
        label: {        type: String,           default: null  },
        value:{         type: [Array],          default: null },
        width:{         type: [String, Number], default: '100%' },
        height:{        type: [String, Number], default: '100%' },
        expand:{        type: Boolean,          default: true },
        childrenKey:{   type: String,           default: "items" },
        keyExpr:{       type: String,           default: "PK"  },
        displayExpr:{   type: String,           default: "TEXT"  },
        search:{        type: Boolean,          default: true },
        allowDrag:{        type: Boolean,          default: false },
        allowDrop:{        type: Boolean,          default: false },
    },

    data: () => ({
        firstValue:null,
        myValue:null,
        treeRendered:false,
        searchText:"",
        folderIcon: require('@/assets/icons/folder.png'),
        documentIcon: require('@/assets/icons/document.png'),
        numberIcons: [
            null,
            require('@/assets/icons/1.png'),
            require('@/assets/icons/2.png'),
            require('@/assets/icons/3.png'),
            require('@/assets/icons/4.png'),
            require('@/assets/icons/5.png'),
            require('@/assets/icons/6.png'),
            require('@/assets/icons/7.png'),
            require('@/assets/icons/8.png'),
            require('@/assets/icons/9.png'),
            require('@/assets/icons/10.png'),
        ],
    }),

    computed:
    {
        user: function () {
            return this.$store.getters["auth/user"];
        },
    },
    watch: {
        value(val) {
            this.myValue = val;
            this.onload();
        },
        myValue(val) {
            this.$emit("input", this.my_value); 
        }
    },

    methods:{
        async onload(){
            this.treeRendered = false;
            let that = this;
            setTimeout(() => {
                let recursor = function ( obj ) {
                    obj["label"] = obj[that.displayExpr];
                    obj["expanded"] = that.expand;
                    obj["value"] = obj[that.keyExpr];
                    obj["found"] = true;
                    
                    if(obj[that.childrenKey] && obj[that.childrenKey].length > 0) {
                        obj["icon"] = that.folderIcon;
                        obj[that.childrenKey].map(q => {
                            q = recursor(q);
                            return q;
                        });
                    } else {
                        obj["icon"] = that.documentIcon;
                    }

                    if(obj.hasOwnProperty("LVL")) {
                        obj["icon"] = that.numberIcons[obj["LVL"]];
                        obj["iconsize"] = 25; 
                    }
                    
                    return obj;
                };

                this.myValue = this.myValue.map( q => {
                    q = recursor(q);
                    return q;
                });

                this.firstValue = JSON.parse(JSON.stringify(this.myValue));
                this.treeRendered = true;
            }, 50);
        },

        itemClick(event) {
            let that = this;
            let selectedData = this.$refs.myTree.getSelectedItem();
            if(!!selectedData) {
                let data = null; 
                let findItem = function(obj) {
                    if(obj == undefined ) return null;
                    
                    if(obj[that.keyExpr] == selectedData.value) {
                        return obj;
                    } else {
                        if(obj[that.childrenKey] && obj[that.childrenKey].length > 0) {
                            for(let i = 0; i< obj[that.childrenKey].length; i++) {
                                let item = findItem(obj[that.childrenKey][i ] )
                                if(item) return item;
                            }
                        }
                    }
                    return null;
                }
            

                for(let i = 0; i< this.myValue.length ; i++) {
                    data = findItem(this.myValue[i]);
                    if(data) break;
                }
                this.$emit("itemClick", event, data);
            }
        },

        onSearch(_value){
            this.treeRendered = false;
            let _tmpVal = typeof _value == "string" ? _value : this.searchText;
            // let _tmpVal = !!_value ? _value : this.searchText;
            setTimeout(() => {
                let tmp = JSON.parse(JSON.stringify(this.firstValue));
                let that = this;
                let recursor = function ( obj ) {
                    let b = false;

                    if(obj[that.childrenKey] && obj[that.childrenKey].length > 0) {
                        for(let i = 0; i <  obj[that.childrenKey].length; i++) {
                            obj[that.childrenKey][i] =  recursor(obj[that.childrenKey][i]);
                        }
                    } 
                    if(!!obj[that.childrenKey] && obj[that.childrenKey].length > 0 
                        && obj[that.childrenKey].findIndex(q => q !=undefined && q["found"]) >=0  
                    ) {
                        obj["found"] = true;
                    } else {
                        obj["found"] = false;
                    }

                    b = _tmpVal == null || _tmpVal == ""   
                        || obj[that.displayExpr].toUpperCase().includes(_tmpVal.toUpperCase())  ;

                    if(b ||obj["found"]) {
                        obj["found"] = true;
                        return obj;
                    } 
                }

                if(tmp && tmp.length > 0) {
                    for(let i = 0; i < tmp.length; i++) {
                        tmp[i] =  recursor(tmp[i]);
                    };
                }

                this.myValue = [...tmp];
                
                this.treeRendered = true;
                this.$refs.myTree.refresh();
            }, 10);
            
        },
    }

};
</script>
