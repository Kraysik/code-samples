<template>
  <div class="container container_playoff" v-if="!this.GET_PO_REQ">

    <div class="de-grids__wrapper">
      <div class="main-grid__wrapper">
        <div class="upper-grid">
          <div class="playoff-header">
            <play-off-header v-for="round in upperRoundsIndexes" :key="round" :round="round"/>
          </div>
          <template v-if="upperRounds.length">

            <bracket :rounds="upperRounds">
              <template #player="{ player }">
                {{ player.name }}
              </template>
            </bracket>

          </template>
        </div>

        <div style="margin-top: 70px;" class="playoff-header">
          <play-off-header v-for="round in lowerRoundsIndexes" :key="round" :round="round"/>
        </div>
        <template v-if="lowerRounds.length">

          <div class="lower-grid">
            <bracket :flat-tree="lowerRounds">
              <template #player="{ player }">
                {{ player.name }}
              </template>
            </bracket>
          </div>

        </template>
      </div>

      <div class="final-grid">
        <div class="playoff-header">
          <play-off-header :grand-final="true" :grand-final-rounds-count="this.finalRounds.length"/>
        </div>
        <template v-if="finalRounds.length">

          <bracket :rounds="finalRounds">
            <template #player="{ player }">
              {{ player.name }}
            </template>
          </bracket>

        </template>
      </div>
    </div>

  </div>
</template>

<script>
import {playoffGridMixin} from "@/components/tournaments/singleTournament/brackets/play-off/playoffMixins/playoffGridMixin";
import PlayOffHeader from "@/components/tournaments/singleTournament/brackets/play-off/play-off-header";
import Bracket from "@/components/tournaments/singleTournament/brackets/play-off/Bracket";

export default {
  name: "DoubleElimination",
  components: {Bracket, PlayOffHeader},
  mixins: [playoffGridMixin],
  data() {
    return {
      upperRounds: [],
      lowerRounds: [],
      finalRounds: [],
      upperRoundsIndexes: [],
      lowerRoundsIndexes: [],
    }
  },
  methods: {
    /**
     * Разворачиваем массив со стадиями и матчами нижней сетки в массив объектов для её построения.
     * */
    flatLowerRounds(rounds) {
      if (this.GET_PO_REQ) {
        return false;
      }

      let res = [];
      rounds.map(round => {
        res = res.concat(round.games);
      })

      return res;
    }
  },
  mounted() {

    this.upperRounds = this.setRounds('upper_grid');
    this.lowerRounds = this.flatLowerRounds(this.setRounds('lower_grid'));
    this.finalRounds = this.setRounds('final_grid');

    this.$watch('GET_PO_REQ', function() {
      this.upperRounds = this.setRounds('upper_grid');
      this.lowerRounds = this.flatLowerRounds(this.setRounds('lower_grid'));
      this.finalRounds = this.setRounds('final_grid');
    })

  }
}
</script>
