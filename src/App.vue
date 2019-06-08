<template>
  <div class="main-game">
    <h2>Player Board</h2>
    <h2>Computer Board</h2>
    <game-board
      ref="player"
      :player="true"
      :width="10"
      @turn-finished="turnFinished('player')"
      @winner = "hasWon($event)"
      :key = "playerKey"
      />

    <game-board
      ref="computer"
      :player="false"
      :width="10"
      @turn-finished="turnFinished('computer')"
      @winner = "hasWon($event)"
      :key = "computerKey"
      />
  </div>
</template>

<script>
import GameBoard from './Gameboard.vue'
export default {
  data() {
    return {
      playerKey: 0,
      computerKey: 1000
    }
  },
  components: {
    GameBoard
  },

  mounted() {
    this.setup()
  },
  methods: {
    setupBoard(board) {
      board.randomShip(5)
      board.randomShip(4)
      board.randomShip(3)
      board.randomShip(3)
      board.randomShip(3)
      board.randomShip(2)
      board.randomShip(2)


    },
    turnFinished(finished) {
      const next = finished === 'player' ? 'computer' : 'player'
      this.$refs[finished].turn = false
      this.$refs[next].turn = true
    },
    hasWon(winner) {
      alert(`${winner} has won!`)
      this.playerKey++
      this.computerKey++
      this.setup()
    },
    setup() {
      this.$nextTick( () => {
      this.setupBoard(this.$refs.player)
      this.setupBoard(this.$refs.computer)
      this.$refs.computer.turn = true
    }
    )
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
