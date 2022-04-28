<template>
  <div class="container container_playoff se-container" v-if="!this.GET_PO_REQ">
    <div class="playoff-header">
      <play-off-header v-for="(round, index) in upperRoundsIndexes" :key="index" :round="round"/>
    </div>
    <template v-if="rounds.length">
      <bracket :rounds="rounds" :third-place="thirdPlace">
        <template #player="{ player }">
          {{ player.name }}
        </template>
      </bracket>
    </template>
  </div>
</template>

<script>
import Bracket from "../Bracket";
import PlayOffHeader from "../play-off-header";
import {playoffGridMixin} from "@/components/tournaments/singleTournament/brackets/play-off/playoffMixins/playoffGridMixin";

export default {
  name: "SingleElimination",
  mixins: [playoffGridMixin],
  components: {
    PlayOffHeader,
    Bracket
  },
  data() {
    return {
      rounds: [],
      upperRoundsIndexes: [],
      thirdPlace: [],
    }
  },
  methods: {
    otherThingsWithColumns(resultColumns) {
      resultColumns[0].map(match => {
        match.isThirdPlace = this.isThirdPlaceMatch(resultColumns[1], match.match_id)
        console.log('is 3 place', this.isThirdPlaceMatch(resultColumns[1], match.match_id))
      })

      const thirdPlaceMatchIndex = resultColumns[0].indexOf(resultColumns[0].find(el => el.isThirdPlace))
      if (thirdPlaceMatchIndex !== -1) {
        resultColumns[0].splice(thirdPlaceMatchIndex, 1)
      }
    },
    setThirdPlace() {
      let thirdPlace = this.getThirdPlaceMatch()
      if (thirdPlace) {
        let formatted = this.formingMatchStructure(thirdPlace)
        let games = [];

        games.push(formatted)
        this.thirdPlace = [{
          games
        }]
      }
    },
  },
  mounted() {
    this.rounds = this.setRounds('upper_grid');
    this.$watch('GET_PO_REQ', function() {
      this.rounds = this.setRounds('upper_grid');
    })
  }
}

</script>

<style lang="scss">
@import '../../../../../../scss/vars/mixins';
@import '../../../../../../scss/vars/colors';

.container_playoff {
  padding-right: 40px;
  overflow-x: scroll;
  height: 70vh;

  &::-webkit-scrollbar-track {
    border-radius: 4px;
  }

  &::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(#fff, .5);
    transition: background .3s ease;

    &:hover {
      background: $tournament-color;
    }
  }
}

</style>
