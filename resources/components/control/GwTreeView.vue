<template>
  <div>
    <DxTreeView
      v-bind="$attrs"
      id="gw-tree-view"
      ref="treeView"
      :disabled="disabled"
      :dataStructure="dataStructure"
      :items="myItems"
      :parentIdExpr="dataStructure === 'plain' ? parentKey : ''"
      :keyExpr="keyValue"
      :displayExpr="keyDisplay"
      :width="width"
      :height="height"
      :searchValue="searchValue ? searchValue : ''"
      :searchMode="searchMode"
      :showCheckBoxesMode="checkBoxesMode"
      :onItemClick="onItemClick"
      :onSelectionChanged="onSelectionChanged"
    />
  </div>
</template>

<script>
export default {
  name: "gw-tree-view",

  props: {
    items: Array,
    disabled: Boolean,
    dataStructure: {
      type: String,
      default: "tree"
    },
    width: {
      type: [ String, Number],
      default: "100%"
    },
    height: {
      type: [ String, Number ],
      default: 500
    },
    /* Chỉ khai báo props này khi props dataStructure === "plain" */
    parentKey: {
      type: String,
      default: "parentId"
    },
    keyValue: {
      type: String,
      default: "id"
    },
    keyDisplay: {
      type: String,
      default: "text"
    },
    searchValue: String,
    searchMode: {
      type: String,
      default: "contains" // Accepted Values: 'contains' | 'startswith' | 'equals'
    },
    checkBoxesMode: {
      type: String,
      default: "none" // Accepted Values: 'none' | 'normal' | 'selectAll'
    }
  },

  computed: {
    myItems() {
      return this.items;
    },
    treeViewRefs() {
      return this.$refs.treeView.instance;
    },
  },

  methods: {
    onItemClick({ itemData }) {
      this.$emit("onItemClick", itemData);
    },
    onSelectionChanged({ component }) {
      const selectedValues = component.getSelectedNodes().map((node) => node.itemData);
      this.$emit("onSelectionChanged", selectedValues);
    },
    getSelectedNodes() {
      return this.treeViewRefs.getSelectedNodes();
    },
    getSelectedNodeKeys() {
      return this.treeViewRefs.getSelectedNodeKeys();
    },
    unselectAll() {
      return this.treeViewRefs.unselectAll();
    },
    selectItem(value) {
      return this.treeViewRefs.selectItem(value)
    },
    collapseAll() {
      return this.treeViewRefs.collapseAll()
    },
    expandItem(value) {
      return this.treeViewRefs.expandItem(value)
    }
  }
}
</script>