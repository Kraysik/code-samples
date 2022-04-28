<template>
  <div class="container">
    <div class="groups" v-if="!GET_RR_REQ">
      <template v-if="tournamentDiscipline === 'NHL'">
        <nhl-group-view :index="i" :group="group" :name="name" v-for="(group, name, i) in this.GET_GROUPS" :key="name"/>
      </template>
      <template v-else-if="tournamentDiscipline=== 'NBA'">
        <nba-group-view :index="i" :group="group" :name="name" v-for="(group, name, i) in this.GET_GROUPS" :key="name"/>
      </template>
      <template v-else-if="tournamentDiscipline=== 'UFC'">
        <u-f-c-group-view :index="i" :group="group" :name="name" v-for="(group, name, i) in this.GET_GROUPS" :key="name"/>
      </template>
      <template v-else>
        <fifa-group-view :index="i" :group="group" :name="name" v-for="(group, name, i) in this.GET_GROUPS" :key="name"/>
      </template>
    </div>
    <groups-skeleton v-else/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import GroupsSkeleton from "@/views/sceleton/groups-skeleton";
import FifaGroupView
  from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/Fifa/ViewsComponents/FifaGroupView";
import NhlGroupView
  from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NHL/ViewsComponents/NhlGroupView";
import NbaGroupView
  from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NBA/ViewComponents/NbaGroupView";
import UFCGroupView
  from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/UFC/ViewsComponents/UFCGroupView";

export default {
  name: "group-stage",
  components: {UFCGroupView, GroupsSkeleton, FifaGroupView, NhlGroupView, NbaGroupView},
  data() {
    return {
      tournamentDiscipline: ''
    }
  },
  computed: {
    ...mapGetters([
      'GET_GROUPS',
      'GET_RR_REQ',
      'TOURNAMENT'
    ]),
  },
  mounted() {
    this.tournamentDiscipline = this.TOURNAMENT.attributes.sort_after_group
  }
}
</script>

<style scoped>

</style>
