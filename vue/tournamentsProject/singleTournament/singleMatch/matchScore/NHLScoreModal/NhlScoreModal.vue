<template>
  <match-score-modal-template @close-score="closeScore" @acceptScoreBtnClicked="initializationScoreAccept($event)">
    <template v-slot:score-inputs>
      <!--Класс 'active' для активной колонки-->
      <div class="score-modal--inputs-cell"
           v-for="(cell,index) in firstScore.length" :key="index"
           :class="{'active': (firstScore[index].marker !== 'main_time') && (firstScore[index].marker !== '') && (firstScore[index].marker !== null)}"
      >
        <div class="index">{{ index + 1 }}</div>
        <!-- first participant -->
        <input
            :ref="'first_input_'+index"
            v-model="firstScore[index].value"
            :placeholder="firstScore[index].placeholder"
            :disabled="firstScore[index].disabled"
            type="number"
            minlength="1"
            maxlength="3"
            @keydown="scoreValueValidator"
            @input="checkRounds"
            :readonly="readOnly"
        >
        <!-- second participant -->
        <input
            :ref="'second_input_'+index"
            v-model="secondScore[index].value"
            :placeholder="secondScore[index].placeholder"
            :disabled="secondScore[index].disabled"
            type="number"
            minlength="1"
            maxlength="3"
            @keydown="scoreValueValidator"
            @input="checkRounds"
            :readonly="readOnly"
        >
        <div class="extra-buttons" :style="{'pointer-events': readOnly ? 'none' : 'all'}">
          <!--Класс 'active' для спана для активной кнопки-->
          <span @click="updateRoundMarker('over_time', index)"
                :class="{'active': firstScore[index].marker === 'over_time'}"
          >ОТ</span>
          <span @click="updateRoundMarker('bullet_time', index)"
                :class="{'active': firstScore[index].marker === 'bullet_time'}"
          >Б</span>
        </div>
      </div>
    </template>

    <template v-slot:score-admin-cells>
      <div class="cell conflict" v-for="(round, index) of conflict_score.first.scores.length" :key="index">

        <div class="score red">
          <span>{{ conflict_score.first.scores[index].value }}</span>
          <span>{{ conflict_score.first.enemy_scores[index].value }}</span>

          <span class="score_marker">{{ conflict_score.first.scores[index].marker === 'over_time' ? 'ОТ' : conflict_score.first.scores[index].marker === 'bullet_time' ? 'Б' : null}}</span>
        </div>
        <div class="score blue">
          <span>{{ conflict_score.second.enemy_scores[index].value }}</span>
          <span>{{ conflict_score.second.scores[index].value }}</span>

          <span class="score_marker">{{ conflict_score.second.scores[index].marker === 'over_time' ? 'ОТ' : conflict_score.second.scores[index].marker === 'bullet_time' ? 'Б' : null}}</span>
        </div>

      </div>
    </template>
  </match-score-modal-template>
</template>

<script>
import {arrMethods} from "@/helpers/mixins/arrMethods";
import {matchScoreMixin} from "@/components/tournaments/singleTournament/singleMatch/matchScore/matchScoreMixin";
import MatchScoreModalTemplate from "@/components/tournaments/singleTournament/singleMatch/matchScore/MatchScoreModalTemplate";
import {commonScoreMixin} from "@/components/tournaments/singleTournament/singleMatch/matchScore/commonScoreMixin";

export default {
  name: "NhlScoreModal",
  components: {MatchScoreModalTemplate},
  mixins: [arrMethods, matchScoreMixin, commonScoreMixin],
  data() {
    return {
      defaultScoreMarker: 'main_time',
    }
  },
  methods: {
    /**
     * Добавляем или убираем у скора тип победы:
     * @param marker - строка по которой будем определять тип победы
     * @param roundIndex - индекс текущего раунда
     *
     * markers:
     * - main_time (победа в основное время)
     * - over_time (победа в овер тайме)
     * - bullet_time (победа по буллитам)
     * */
    updateRoundMarker(marker, roundIndex) {
      this.firstScore[roundIndex].marker = this.firstScore[roundIndex].marker === marker ? 'main_time' : marker;
      this.secondScore[roundIndex].marker = this.secondScore[roundIndex].marker === marker ? 'main_time' : marker;

      if (this.USER.attributes.role !== 'admin') {
        this.setScoresToLocalStorage(this.firstScore, this.secondScore)
      }
    }
  }
}
</script>

<style scoped>

</style>
