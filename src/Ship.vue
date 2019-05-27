<template>
  <div class="" />
</template>

<script>
export default {
  name: 'Ship',
  props: {
    size: { type: Number, required: true }
  },
  data() {
    return {
      sunk: false,
      hits: []
    }
  },
  methods: {
    hit(location) {
      return !this.hits.includes(location) &&
        Number.isInteger(location) &&
        location <= this.size - 1 &&
        location >= 0 &&
        this.hits.push(location)

    },
    isSunk() {
      return this.hits.length >= this.size
    }
  }
}
</script>

<style lang="css" scoped></style>
