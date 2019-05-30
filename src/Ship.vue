<template>
  <div
    class="ship tile" v-if= "display">
    <img
      :src="require(`./assets/images/ships/${size}${rotated ? 'R' : ''}.png`)"
      alt="A ship"
      >
  </div>
</template>

<script>
export default {
  name: 'Ship',
  props: {
    size: { type: Number, required: true },
    rotated: {type: Boolean, default: false},
    player: {type: Boolean, default: true}
  },
  data() {
    return {
      hits: []
    }
  },
  computed: {
    display() {
      return this.player || this.isSunk()
    }
  },
  methods: {
    hit(location) {
      return (
        !this.hits.includes(location) &&
        Number.isInteger(location) &&
        location <= this.size - 1 &&
        location >= 0 &&
        this.hits.push(location)
      )
    },
    isSunk() {
      return this.hits.length >= this.size
    }
  }
}
</script>

<style lang="css" scoped>
  img {
    width: 100%;
    height: 100%;
  }
  .ship.tile {
    background-color: blue;
  }


</style>
