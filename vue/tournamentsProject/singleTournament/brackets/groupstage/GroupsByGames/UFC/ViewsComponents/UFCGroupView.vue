<template>
  <div class="single-group__wrapper">
    <div class="group-name">Группа {{ this.name }}</div>
    <div class="single-group">
      <div class="names-wrap">
        <div class="wrap-header">{{ TOURNAMENT.attributes.participant_type === 'USER' ? 'Игрок' : 'Команда' }}</div>
        <div class="wrap-content">
          <!--Список игроков и их позиция-->
          <player-row v-for="(participant, index) in this.getGroupParticipants" :data-row="`hover-row-${index}`"
                      :key="index"
                      :class="[{'active-row': activeRow === `hover-row-${index}`}, {advances: index + 1 <= advancesFromGroup}]"
                      @mouseenter.native="showRow"
                      @mouseleave.native="hideRow"
                      :participant="participant"
                      :index="index"/>
          <!---->
        </div>
      </div>
      <div class="stats-wrap">
        <div class="stats-wrap__inner">
          <div class="wrap-header stats-header">
            <!--Шапка блока с цифрами-->
            <div class="stats-cell" v-for="(cell,index) in this.statsColumns"
                 :key="index"
                 :data-col="`hover-col-${index}`"
                 :data-title="cell.hover"
                 :class="{'active-cell': activeCol === `hover-col-${index}`}"
                 @mouseenter="showCol"
                 @mouseleave="hideCol">
              {{ cell.name }}
            </div>
            <!---->
          </div>
          <div class="wrap-content">
            <!--Одна строка с цифрами-->
            <ufc-group-schedule-row
                v-for="(participant,index) in this.getGroupParticipants" :key="index"
                :data-row="`hover-row-${index}`"
                :payload-data="{index,participant, activeCol, activeRow}"
                :class="{'active-row': activeRow === `hover-row-${index}`}"
                @mouseenter.native="showRow"
                @mouseleave.native="hideRow(); hideCol()"
                @catchActiveCol="readActiveCol"
            />
            <!---->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import PlayerRow
  from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/player-row";
import UFC from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/UFC/UFC";
import UfcGroupScheduleRow
  from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/UFC/ViewsComponents/ufc-group-schedule-row";
import {groupViewPropsMixin} from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/groupViewPropsMixin";


export default {
  name: "UFCGroupView",
  components: {UfcGroupScheduleRow, PlayerRow},
  mixins: [groupViewPropsMixin],
  data() {
    return {
      activeRow: '',
      activeCol: '',
      statsColumns: [
        {name: 'б', hover: 'Бои'},
        {name: 'в', hover: 'Победы'},
        {name: 'дв', hover: 'Досрочные победы'},
        {name: 'п', hover: 'Поражения'},
        {name: 'о', hover: 'Очки'},
      ],
      /*сколько челов выходят с группы*/
      advancesFromGroup: '1',
    }
  },
  computed: {
    ...mapGetters([
      'PARTICIPANTS',
      'TOURNAMENT'
    ]),
    getGroupParticipants() {
      let participants = (new UFC(this.group)).getSortedParticipants();
      participants = this.addParticipantsAttrs(participants);
      console.log(participants)
      return participants;
    }
  },
  methods: {
    showRow(event) {
      if (event.target.dataset.row) this.activeRow = `${event.target.dataset.row}`
    },
    hideRow() {
      this.activeRow = ''
    },
    showCol(event) {
      if (event.target.dataset.col) this.activeCol = `${event.target.dataset.col}`
    },
    hideCol() {
      this.activeCol = ''
    },
    readActiveCol(payload) {
      this.activeCol = payload
    },
    addParticipantsAttrs(participants) {
      for (let i = 0; i < participants.length; i++) {
        let participant = participants[i];
        for (let j = 0; j < this.PARTICIPANTS.length; j++) {
          let stateParticipant = this.PARTICIPANTS[j];
          if (participant.id === Number(stateParticipant.id)) {
            participant.attributes = stateParticipant.attributes;

            break;
          }
        }
      }

      return participants;
    },
  },
  mounted() {
    this.advancesFromGroup = Number(this.TOURNAMENT.attributes.settings.round_robin.countOfWinnerInGroup ?? 0)
  }
}
</script>


<style scoped>

</style>
