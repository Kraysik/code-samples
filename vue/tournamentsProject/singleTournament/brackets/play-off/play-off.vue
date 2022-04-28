<template>
  <single-elimination v-if="TOURNAMENT.attributes.playoff_type === 'single_elimination'" />
  <double-elimination v-else></double-elimination>
</template>

<script>
import {mapGetters} from "vuex";
import SingleElimination from "@/components/tournaments/singleTournament/brackets/play-off/SingleElimination/SingleElimination";
import DoubleElimination from "@/components/tournaments/singleTournament/brackets/play-off/DoubleElimination/DoubleElimination";

export default {
  name: "play-off",
  components: {DoubleElimination, SingleElimination},
  computed: {
    ...mapGetters([
        'TOURNAMENT'
    ])
  },
}

</script>

<style lang="scss">

</style>
