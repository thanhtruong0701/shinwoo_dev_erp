<!--
2021-01-07: はやしりゅう - create compoment
-->

<template >
  <v-dialog persistent id="modal" :max-width="width" v-model="isModalVisible">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ title }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="close">mdi-close-thick</v-icon>
      </v-card-title>
      <v-card-text v-if="head" style="margin-top: 2px">
        <slot name="header"> </slot>
      </v-card-text>
      <v-card-text style="margin-top: 2px">
        <slot name="body"> </slot>
      </v-card-text>
      <v-card-actions
        style="margin-top: 2px; padding-right: 20px; padding-left: 20px"
        v-if="modal_mode != 0"
      >
        <v-row>
          <v-spacer></v-spacer>
          <BaseButton
            icon_type="done"
            :btn_text="$t('done')"
            @onclick="check"
            v-if="modal_mode == 1"
          />
          <BaseButton
            icon_type="ok"
            :btn_text="$t('ok')"
            @onclick="check"
            v-if="modal_mode == 2"
          />
          <BaseButton
            icon_type="no"
            :btn_text="$t('no')"
            @onclick="close"
            v-if="modal_mode == 3"
          />
          <BaseButton
            icon_type="yes"
            color="light-blue"
            :btn_text="$t('yes')"
            @onclick="check"
            v-if="modal_mode == 3"
          />
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!--    
  <div v-show="isModalVisible">
    <transition name="modal " >
       
        <div class="modal-mask">
            
          <div class="modal-wrapper">
            

            <div class="modal-container" v-bind="$attrs" :style="{ width:  width }" >
              
               <div   >
                
             
             <div class="modal-container-body">
                <div class="modal-header" v-if="head">
                <slot name="header">
               
                </slot>
              </div>

              <div class="modal-body">
                <slot name="body">
                  default body
                </slot>
              </div>

              <div class="modal-footer">
                <slot name="footer">
                  <v-row justify="end">
                    <v-btn
                    depressed
                    
                    style="height: 100% !important"
                    @click="check"
                  
                  >
  
                      <BaseIcon icon_type="done"  /> 
                      <span class="text-center" >{{ $t('done') }}</span>
        
                  
                  
                  
                  </v-btn>
                  <v-btn
                    depressed
                    
                    style="height: 100% !important"
                    @click="close"
                  
                  >
             
                      <BaseIcon icon_type="cancel"  />
                       <span class="text-center" >{{ $t('cancel') }}</span>
            
                  
                  
                  
                  </v-btn>
                   
                  
                 
                </v-row>
                </slot>
              </div>
             </div>

              
            </div>
          </div>
        </div>
      </transition>
  </div> -->
</template>

<script>
import BaseButton from "@/components/control/BaseButton";

export default {
  name: "modal",
  props: {
    width: {
      type: String,
      default: "300px",
    },
    title: {
      type: String,
    },
    mode: {
      type: String,
      validator: function (value) {
        return ["No", "Done", "Ok", "YesNo"].indexOf(value) !== -1;
      },
    },
  },
  data() {
    return {
      isModalVisible: false,
    };
  },
  components: {
    BaseButton,
  },
  computed: {
    head() {
      return !!this.$slots.header;
    },

    modal_mode() {
      if (this.mode == "Done") {
        return 1;
      } else if (this.mode == "Ok") {
        return 2;
      } else if (this.mode == "YesNo") {
        return 3;
      } else if (this.mode == "No") {
        return 0;
      }

      return 3;
    },
  },
  methods: {
    close() {
      this.hide();
      this.$emit("close", false);
    },
    check() {
      this.hide();
      this.$emit("close", true);
    },
    show() {
      this.isModalVisible = true;
    },
    hide() {
      this.isModalVisible = false;
    },
  },
};
</script>
<style scoped>
.modal-mask {
  position: fixed;
  _z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-container-body {
  padding: 15px 15px;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>




