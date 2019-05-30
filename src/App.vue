<template>
  <div class="main-game">
    <game-board
      ref="player"
      :player="true"
      :width="10" />
    <game-board
      ref="computer"
      :player="false"
      :width="10" />
  </div>
</template>

<script>
import GameBoard from './Gameboard.vue'
export default {
  components: {
    GameBoard
  },

  mounted() {
    this.setupBoard(this.$refs.player)
    this.setupBoard(this.$refs.computer)
  },
  methods: {
    setupBoard(board) {
      board.randomShip(5)
      board.randomShip(4)
      board.randomShip(3)
      board.randomShip(3)
      board.randomShip(2)
      board.randomShip(2)
      board.randomShip(1)
      board.randomShip(1)
      board.randomShip(1)
      board.randomShip(1)
      board.randomShip(1)
    
    }

  },
}
</script>

<style lang="scss">
.main-game {
  margin: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  justify-content: center;
  justify-items: center;
}
</style>
