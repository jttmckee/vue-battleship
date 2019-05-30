<template lang="html">
  <div class="#game-board">
    <div class="game-grid">
      <game-ship
        v-for="(ship, index) in ships"
        ref="ships"
        :player = "player"
        :key="index"
        :size="ship.size"
        :style="ships[index].style"
        :rotated="ship.start.x === ship.end.x"
      />
      <div
        v-for="number in numberOfSeaTiles"
        :key="'sea-tile-' + number"
        class="sea-tile tile"
      />
      <div
        v-for="number in numberOfMistTitles"
        :key="'mist-tile-' + number"
        class="mist-tile tile"
      />
    </div>
    <div class="test" />
    <div class="test" />
  </div>
</template>

<script>
import Ship from './Ship.vue'
export default {
  components: {
    'game-ship': Ship
  },
  props: {
    width: { type: Number, required: true },
    player: { type: Boolean, required: true },
    turn: {type: String, default: 'Player'}
  },
  data() {
    return {
      ships: [],
      missedAttacks: [],
      hits: []
        }
  },
  computed: {
    numberOfShipTiles() {
      return this.ships.reduce((total, ship) => ship.size + total, 0)
    },
    numberOfBlankTiles() {
      return this.width * this.width - this.missedAttacks.length

    },
    numberOfMistTitles() {
      return this.player ? 0 : this.numberOfBlankTiles - this.hits.length
    },
    numberOfSeaTiles() {
      return this.player ? this.numberOfBlankTiles - this.numberOfShipTiles : 0
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
    _setShipStyle({ start, end }) {
      return {
        gridColumnStart: `${start.x + 1}`,
        gridColumnEnd: `${end.x + 2}`,
        gridRowStart: `${start.y + 1}`,
        gridRowEnd: `${end.y + 2}`
      }
    },
    _newShipOn({ axis, start, end }) {
      const size = Math.abs(start[axis] - end[axis]) + 1
      return (
        size >= 1 &&
        size <= 5 &&
        this.ships.push({
          size,
          start,
          end,
          style: this._setShipStyle({ start, end })
        })
      )
    },
    newShip({ start, end }) {
      return (
        [start.x, start.y, end.x, end.y].every(this.valCoord) &&
        !this._shipBetween({ start, end }) &&
        ((start.x - end.x === 0 &&
          this._newShipOn({ axis: 'y', start, end })) ||
          (start.y - end.y === 0 && this._newShipOn({ axis: 'x', start, end })))
      )
    },
    randomShip(size) {
      let start = {}
      let end = {}
      let mov, fix
      do {
        mov = Math.random() > 0.5 ? 'x' : 'y'
        fix = mov === 'x' ? 'y' : 'x'
        start[fix] = Math.floor(Math.random() * this.width)
        start[mov] = Math.floor(Math.random() * (this.width - size))
        end[fix] = start[fix]
        end[mov] =  size -1 + start[mov]
      }
      while (!this.newShip({start, end}))

    },
    receiveAttack({ x, y }) {
      const shipIndex = this._shipAtPoint({ x, y })
      if (shipIndex >= 0) {
        const shipVM = this.$refs.ships[shipIndex]
        const { start, end } = this.ships[shipIndex]
        const location = start.x === end.x ? y - start.y : x - start.x
        return !!shipVM.hit(location) && !!this.hits.push({x, y})
      } else {
        return (
          !this.missedAttacks.some(e => e.x === x && e.y === y) &&
          !!this.missedAttacks.push({ x, y })
        )
      }
    },
    allShipsSunk() {
      return this.$refs.ships.every(ship => ship.isSunk())
    }
  }
}
</script>

<style lang="css" scoped>
.game-grid {
  display: grid;
  grid-auto-flow: row dense;
  grid-template-columns: repeat(10, 40px);
  grid-template-rows: repeat(10, 40px);
  border: 7px solid black;
  width: 400px;
}

.tile {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(150,50,50,0.4);
}
.sea-tile {

  background-color: blue;
  cursor: pointer;
}
.mist-tile {
  background-color: grey;
  cursor: pointer;
}
</style>
