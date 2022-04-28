<template>
  <div class="single-group__wrapper">
    <div class="group-name">Группа {{ this.name }}</div>
    <div class="single-group single-group__NBA">
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
                 @mouseleave="hideCol"
                 v-html="cell.name">
            </div>
            <!---->
          </div>
          <div class="wrap-content">
            <!--Одна строка с цифрами-->
            <nba-group-schedule-row v-for="(participant,index) in this.getGroupParticipants" :key="index"
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
import PlayerRow from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/player-row";
import NBA from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NBA/NBA";
import NbaGroupScheduleRow
  from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NBA/ViewComponents/nba-group-schedule-row";
import {groupViewPropsMixin} from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/groupViewPropsMixin";


export default {
  name: "NbaGroupView",
  components: {NbaGroupScheduleRow, PlayerRow},
  mixins: [groupViewPropsMixin],
  data() {
    return {
      activeRow: '',
      activeCol: '',
      statsColumns: [
        {name: '<div class="abbr-wrap">и</div>', hover: 'Игры'},
        {name: '<div class="abbr-wrap">в</div>', hover: 'Выигрыши'},
        {name: '<div class="abbr-wrap">п</div>', hover: 'Поражения'},
        {name: '<div class="abbr-wrap">зм</div>', hover: 'Забитые мячи'},
        {name: '<div class="abbr-wrap">пм</div>', hover: 'Пропущенные мячи'},
        {name: '<div class="abbr-wrap">%<span>побед</span></div>', hover: 'Процент побед'},
      ],
      /*сколько челов выходят с группы*/
      advancesFromGroup: '2',
    }
  },
  computed: {
    ...mapGetters([
      'PARTICIPANTS',
      'TOURNAMENT'
    ]),
    getGroupParticipants() {
      let participants = (new NBA(this.group)).getSortedParticipants();
      participants = this.addParticipantsAttrs(participants);
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
