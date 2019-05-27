<template lang="html">
  <div class="#game-board">
    <game-ship
      v-for="(ship, index) in ships"
      ref="ships"
      :key="index"
      :size="ship.size"
    />
  </div>
</template>

<script>
import Ship from './Ship.vue'
export default {
  components: {
    'game-ship': Ship
  },
  props: {
    width: { type: Number, required: true }
  },
  data() {
    return {
      ships: [],
      missedAttacks: []
    }
  },

  methods: {
    valCoord(a) {
      return Number.isInteger(a) && a >= 0 && a < this.width
    },
    _shipAtPoint({ x, y }) {
      return this.ships.findIndex(ship => {
        return (
          (ship.start.x === x && ship.start.y <= y && ship.end.y >= y) ||
          (ship.start.y === y && ship.start.x <= x && ship.end.x >= x)
        )
      })
    },
    _shipOnPath({ start, end, mov, fix }) {
      let counter = start[mov]
      while (counter <= end[mov]) {
        if (this._shipAtPoint({ [fix]: start[fix], [mov]: counter }) >= 0)
          return true
        counter++
      }
      return false
    },
    _shipBetween({ start, end }) {
      let { mov, fix } =
        start.x === end.x ? { mov: 'y', fix: 'x' } : { mov: 'x', fix: 'y' }
      return this._shipOnPath({ start, end, mov, fix })
    },
    _newShipOn({ axis, start, end }) {
      const size = Math.abs(start[axis] - end[axis])
      return size >= 1 && size <= 5 && this.ships.push({ size, start, end })
    },
    newShip({ start, end }) {
      if (
        ![start.x, start.y, end.x, end.y].every(this.valCoord) ||
        this._shipBetween({ start, end })
      )
        return false

      return (
        (start.x - end.x === 0 && this._newShipOn({ axis: 'y', start, end })) ||
        (start.y - end.y === 0 && this._newShipOn({ axis: 'x', start, end }))
      )
    },
    receiveAttack({ x, y }) {
      const shipIndex = this._shipAtPoint({ x, y })
      if (shipIndex >= 0) {
        const shipVM = this.$refs.ships[shipIndex]
        const { start, end } = this.ships[shipIndex]
        const location = start.x === end.x ? y - start.y : x - start.x
        return !!(shipVM.hit(location))
      } else {
        return !(this.missedAttacks.some(e => e.x === x && e.y === y))
        && !!this.missedAttacks.push({ x, y })
      }
    },
    allShipsSunk() {
      return this.$refs.ships.every(ship => ship.isSunk())
    }
  }
}
</script>

<style lang="css" scoped></style>
