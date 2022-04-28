<template>
  <div class="table-row">
    <div class="pos">{{ index + 1 }}</div>
    <router-link :to="{name: getRoutePath, params: {id: participant.id}}" target="_blank" class="info" active-class=""
                 exact-active-class="">
      <div class="ava">
        <img :src="participant.attributes.logo" alt="#">
      </div>
      <div class="name">
        {{ getName }}
      </div>
    </router-link>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "player-row",
  props: {
    participant: Object,
    index: Number,
  },
  computed: {
    ...mapGetters([
      'TOURNAMENT'
    ]),
    getName() {
      return this.TOURNAMENT.attributes.participant_type === 'TEAM' ? this.participant.attributes.name : this.participant.attributes.login
    },
    getRoutePath() {
      return this.TOURNAMENT.attributes.participant_type === 'TEAM' ? 'team.name' : 'another-profile'

    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>