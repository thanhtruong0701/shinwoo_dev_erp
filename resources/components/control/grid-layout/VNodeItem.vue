<script>
export default {
  name: "v-node-item",

  props: {
    nodeValue: {
      type: Object,
      required: true
    }
  },

  render(h) {
    return h(
      'div',
      {
        style: { height: "100%" } 
      },
      [this.nodeValue]
    )
  }
}
</script>