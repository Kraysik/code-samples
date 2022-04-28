<template>
  <match-score-modal-template @close-score="closeScore" @acceptScoreBtnClicked="initializationScoreAccept($event)">
    <template v-slot:score-inputs>
      <div class="score-modal--inputs-cell" v-for="(cell,index) in firstScore.length" :key="index"
           :class="{'active': (firstScore[index].marker !== 'win') && (firstScore[index].marker !== '') && (firstScore[index].marker !== null)}"
      >
        <div class="index">{{ index + 1 }}</div>

        <div class="ufc-inputs">
          <!-- first participant -->
          <!--Класс 'active' активной перчатки-->
          <div :ref="'first_input_'+index"
               class="ufc-cell"
               :class="{
                        'disabled': firstScore[index].disabled,
                        'active': firstScore[index].value === 1,
                        'readonly': readOnly
                     }"
               @click="setUfcRoundScore(0, index)"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M18.3 3H16.97C16.585 3 16.27 3.25312 16.27 3.5625V5.39063C16.27 5.61562 16.025 5.8125 15.745 5.8125C15.465 5.8125 15.22 5.61562 15.22 5.39062V3.5625C15.22 3.25312 14.905 3 14.52 3H13.19C12.805 3 12.49 3.25312 12.49 3.5625V5.39062C12.49 5.61562 12.245 5.8125 11.965 5.8125C11.685 5.8125 11.44 5.61562 11.44 5.39062V3.5625C11.44 3.25312 11.125 3 10.74 3H9.41C9.025 3 8.71 3.25312 8.71 3.5625V5.39062C8.71 5.61562 8.465 5.8125 8.185 5.8125C7.905 5.8125 7.66 5.61562 7.66 5.39062V3.5625C7.66 3.25312 7.345 3 6.96 3H5.7C5.315 3 5 3.25312 5 3.5625V5.8125C5 8.68125 5.77 12.2531 6.155 13.9125C6.295 14.4469 6.855 14.8125 7.52 14.8125H16.445C17.11 14.8125 17.705 14.4187 17.81 13.9125C18.23 12.2531 19 8.68125 19 5.8125V3.5625C19 3.25312 18.685 3 18.3 3ZM15.85 11.7188C15.85 12.0281 15.535 12.2812 15.15 12.2812H8.85C8.465 12.2812 8.15 12.0281 8.15 11.7188V8.90625C8.15 8.59688 8.465 8.34375 8.85 8.34375H15.15C15.535 8.34375 15.85 8.59688 15.85 8.90625V11.7188Z"
                  fill="#EAEAEA"/>
              <path
                  d="M16.2004 15.9375H7.80039C7.03039 15.9375 6.40039 16.4437 6.40039 17.0625V19.875C6.40039 20.4938 7.03039 21 7.80039 21H16.2004C16.9704 21 17.6004 20.4938 17.6004 19.875V17.0625C17.6004 16.4437 16.9704 15.9375 16.2004 15.9375ZM14.8004 18.75C14.8004 18.9188 14.6604 19.0312 14.4504 19.0312H9.55039C9.34039 19.0312 9.20039 18.9188 9.20039 18.75V18.1875C9.20039 18.0187 9.34039 17.9062 9.55039 17.9062H14.4504C14.6604 17.9062 14.8004 18.0187 14.8004 18.1875V18.75Z"
                  fill="#EAEAEA"/>
            </svg>
          </div>
          <!-- second participant -->
          <!--Класс 'active' активной перчатки-->
          <div :ref="'second_input_'+index"
               class="ufc-cell"
               :class="{
                        'disabled': secondScore[index].disabled,
                        'active': secondScore[index].value === 1,
                        'readonly': readOnly
                     }"
               @click="setUfcRoundScore(1, index)"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M18.3 3H16.97C16.585 3 16.27 3.25312 16.27 3.5625V5.39063C16.27 5.61562 16.025 5.8125 15.745 5.8125C15.465 5.8125 15.22 5.61562 15.22 5.39062V3.5625C15.22 3.25312 14.905 3 14.52 3H13.19C12.805 3 12.49 3.25312 12.49 3.5625V5.39062C12.49 5.61562 12.245 5.8125 11.965 5.8125C11.685 5.8125 11.44 5.61562 11.44 5.39062V3.5625C11.44 3.25312 11.125 3 10.74 3H9.41C9.025 3 8.71 3.25312 8.71 3.5625V5.39062C8.71 5.61562 8.465 5.8125 8.185 5.8125C7.905 5.8125 7.66 5.61562 7.66 5.39062V3.5625C7.66 3.25312 7.345 3 6.96 3H5.7C5.315 3 5 3.25312 5 3.5625V5.8125C5 8.68125 5.77 12.2531 6.155 13.9125C6.295 14.4469 6.855 14.8125 7.52 14.8125H16.445C17.11 14.8125 17.705 14.4187 17.81 13.9125C18.23 12.2531 19 8.68125 19 5.8125V3.5625C19 3.25312 18.685 3 18.3 3ZM15.85 11.7188C15.85 12.0281 15.535 12.2812 15.15 12.2812H8.85C8.465 12.2812 8.15 12.0281 8.15 11.7188V8.90625C8.15 8.59688 8.465 8.34375 8.85 8.34375H15.15C15.535 8.34375 15.85 8.59688 15.85 8.90625V11.7188Z"
                  fill="#EAEAEA"/>
              <path
                  d="M16.2004 15.9375H7.80039C7.03039 15.9375 6.40039 16.4437 6.40039 17.0625V19.875C6.40039 20.4938 7.03039 21 7.80039 21H16.2004C16.9704 21 17.6004 20.4938 17.6004 19.875V17.0625C17.6004 16.4437 16.9704 15.9375 16.2004 15.9375ZM14.8004 18.75C14.8004 18.9188 14.6604 19.0312 14.4504 19.0312H9.55039C9.34039 19.0312 9.20039 18.9188 9.20039 18.75V18.1875C9.20039 18.0187 9.34039 17.9062 9.55039 17.9062H14.4504C14.6604 17.9062 14.8004 18.0187 14.8004 18.1875V18.75Z"
                  fill="#EAEAEA"/>
            </svg>
          </div>
        </div>

        <div class="extra-buttons extra-buttons__ufc" :style="{'pointer-events': readOnly ? 'none' : 'all'}">
          <!--Класс 'active' для спана для активной кнопки-->
          <span @click="updateRoundMarker('ko', index)"
                :class="{'active': firstScore[index].marker === 'ko'}"
          >K.O.</span>
        </div>
      </div>
    </template>

    <template v-slot:score-admin-cells>
      <div class="cell conflict" v-for="(round, index) of conflict_score.first.scores.length" :key="index">

        <div class="score red">
          <span>{{ conflict_score.first.enemy_scores[index].value }}</span>
          <span>{{ conflict_score.first.scores[index].value }}</span>

          <span class="score_marker">{{ conflict_score.first.scores[index].marker === 'ko' ? 'КО' : null}}</span>
        </div>
        <div class="score blue">
          <span>{{ conflict_score.second.scores[index].value }}</span>
          <span>{{ conflict_score.second.enemy_scores[index].value }}</span>

          <span class="score_marker">{{ conflict_score.second.scores[index].marker === 'ko' ? 'КО' : null}}</span>
        </div>

      </div>
    </template>
  </match-score-modal-template>
</template>

<script>
import MatchScoreModalTemplate from "@/components/tournaments/singleTournament/singleMatch/matchScore/MatchScoreModalTemplate";
import {arrMethods} from "@/helpers/mixins/arrMethods";
import {matchScoreMixin} from "@/components/tournaments/singleTournament/singleMatch/matchScore/matchScoreMixin";
import {commonScoreMixin} from "@/components/tournaments/singleTournament/singleMatch/matchScore/commonScoreMixin";

export default {
  name: "ufc-score-modal",
  components: {MatchScoreModalTemplate},
  mixins: [arrMethods, matchScoreMixin, commonScoreMixin],
  data() {
    return {
      defaultScoreMarker: 'win',
    }
  },
  methods: {
    /**
     * Заполнение счета уастников
     *
     * @param participantNumber - номер счета для участника:
     * 0 - firstScore
     * 1 - secondScore
     *
     * @param roundIndex - индекс раунда
     * */
    setUfcRoundScore(participantNumber, roundIndex) {
      switch (participantNumber) {
        case 0:
          // Если мы тыкаем на ячеичку ещё раз, то
          if (this.firstScore[roundIndex].value === 1) {
            this.firstScore[roundIndex].value = ''
            this.secondScore[roundIndex].value = '';
            break;
          }

          this.firstScore[roundIndex].value = 1;
          this.secondScore[roundIndex].value = 0;

          break;
        case 1:
          // Если мы тыкаем на ячеичку ещё раз, то
          if (this.secondScore[roundIndex].value === 1) {
            this.secondScore[roundIndex].value = ''
            this.firstScore[roundIndex].value = '';
            break;
          }

          this.secondScore[roundIndex].value = 1;
          this.firstScore[roundIndex].value = 0;

          break;
        default:
          break;
      }

      this.setScoresToLocalStorage(this.firstScore, this.secondScore)
      this.checkRounds();
    },

    /**
     * Добавляем или убираем у скора тип победы:
     * @param marker - строка по которой будем определять тип победы
     * @param roundIndex - индекс текущего раунда
     *
     * markers:
     * - win (простая победа)
     * - ko (досрочная победа)
     * */
    updateRoundMarker(marker, roundIndex) {
      this.firstScore[roundIndex].marker = this.firstScore[roundIndex].marker === marker ? 'win' : marker;
      this.secondScore[roundIndex].marker = this.secondScore[roundIndex].marker === marker ? 'win' : marker;

      if (this.USER.attributes.role !== 'admin') {
        this.setScoresToLocalStorage(this.firstScore, this.secondScore)
      }
    },
  }
}
</script>

<style scoped>

</style>
