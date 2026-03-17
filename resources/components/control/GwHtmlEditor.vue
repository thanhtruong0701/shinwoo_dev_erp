<template>
  <div>
    <DxHtmlEditor 
      id="htmlEditor"
      ref="htmlEditor"
      :allowSoftLineBreak="true"
      :focusStateEnabled="true"
      :mediaResizing="{
        allowedTargets: ['image'],
        enabled: true
      }"
      :height="height"
      :onValueChanged="onValueChanged"
      :toolbar="toolBarOptions"
      :value="value"
      valueType="html"
    >
    </DxHtmlEditor>

    <v-dialog max-width="50%" v-model="popupVisible">
      <v-card :height="height">
        <v-card-title class="headline primary-gradient white--text py-2">
          <span>{{ $t("html_code_preview") }}</span>
          <v-spacer></v-spacer>
          <v-icon dark @click="popupVisible = false">mdi-close-thick</v-icon>
        </v-card-title>
        <BaseWrapper class="px-4 py-2" :height="htmlCodePreviewHeight">
          <BaseTextarea auto-grow rows="10" v-model="htmlCode" />
        </BaseWrapper>
        <v-card-actions>
          <v-spacer></v-spacer> 
          <v-btn dark depressed color="primary6" @click="submitHtmlCode">{{ $t('submit') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { DxHtmlEditor } from 'devextreme-vue/html-editor';
export default {
  name: "gw-html-editor",

  components: {
    DxHtmlEditor
  },

  props: {
    value: String,
    height: {
      type: [String, Number],
      default: 500
    },
    imageFromLocal: {
      type: Boolean,
      default: false
    }
  },

  data:()=>({
    sizeValues: ['7.5pt','8pt', '10pt', '11pt', '12pt', '13pt', '14pt', '18pt', '24pt', '36pt'],
    fontValues: ['Arial', 'Calibri', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'],
    headerValues: [false, 1, 2, 3, 4, 5],
    popupVisible: false,
    htmlCode: ""
  }),

  computed: {
    htmlEditorRefs() {
      return this.$refs.htmlEditor;
    },
    htmlEditorInstance() {
      return this.htmlEditorRefs.instance;
    },
    toolBarItemImage() {
      if(!this.imageFromLocal) {
        return "image"
      }
      return {
        formatName: "image",
        options: {
          onClick: () => {
            this.insertImage()
          }
        }
      }
    },
    toolBarOptions() {
      return {
        container: null,
        items: [
          "undo", "redo", 
          "separator",
          { formatName: "size", formatValues: this.sizeValues },
          { formatName: "font", formatValues: this.fontValues },
          "separator",
          "bold", "italic", "strike", "underline",
          "separator",
          "link",
          "separator",
          "alignLeft", "alignCenter", "alignRight", "alignJustify",
          "separator",
          "orderedList", "bulletList",
          "separator",
          { formatName: "header", formatValues: this.headerValues },
          "separator",
          "color", "background",
          "separator",
          "clear", "codeBlock", "blockquote",
          "separator",
          this.toolBarItemImage,
          "separator",
          "insertTable", "deleteTable", "insertRowAbove", "insertRowBelow", "deleteRow", "insertColumnLeft", "insertColumnRight", "deleteColumn",
          "seperator",
          {
            options: {
              text: this.$t("show_html_code"),
              stylingMode: 'text',
              onClick: () => {
                this.popupVisible = true;
              },
            },
            widget: "dxButton"
          }
        ],
        multiline: true
      }
    },
    htmlCodePreviewHeight() {
      return Math.floor(this.height - 48 - 52);
    }
  },

  watch: {
    popupVisible(val) {
      if(val) {
        this.htmlCode = this.value;
      }
    }
  },

  methods: {
    onValueChanged({ element, event, previousValue, value }) {
      this.$emit("input", value)
    },

    insertImage() {
      const editor = this.htmlEditorInstance;
      if (!editor._imgUpload) {
        editor._imgUpload = $("<input>")
        .attr({ type: "file", accept: "image/png, image/gif, image/jpeg", hidden: true })
        .on("change", (e) => {
          if (e.target.files != null && e.target.files[0] != null) {
            let reader = new FileReader();
            reader.onload = e => {
              const selection = editor.getSelection();
              const pasteIndex = selection ? selection.index : editor.getLength();
              editor.insertEmbed(pasteIndex, "extendedImage", { src: e.target.result });
              editor.setSelection(pasteIndex + 1, "silent");
              e.target.value = "";
            };
            reader.readAsDataURL(e.target.files[0]);
          }
        })
        .appendTo(editor.element());
      }
      editor._imgUpload.click();
    },

    submitHtmlCode() {
      this.popupVisible = false;
      this.$emit("input", this.htmlCode)
    }
  }
}
</script>