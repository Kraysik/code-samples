<template>
  <match-score-modal-template @close-score="closeScore" @acceptScoreBtnClicked="initializationScoreAccept($event)">
    <template v-slot:score-inputs>
      <div class="score-modal--inputs-cell no-appendix" v-for="(cell,index) in firstScore.length" :key="index">
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
      </div>
    </template>

    <template v-slot:score-admin-cells>
      <div class="cell conflict" v-for="(round, index) of conflict_score.first.scores.length" :key="index">

        <div class="score red">
          <span>{{ conflict_score.first.scores[index].value }}</span>
          <span>{{ conflict_score.first.enemy_scores[index].value }}</span>
        </div>
        <div class="score blue">
          <span>{{ conflict_score.second.enemy_scores[index].value }}</span>
          <span>{{ conflict_score.second.scores[index].value }}</span>
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
  name: "DefaultScoreModal",
  components: {MatchScoreModalTemplate},
  mixins: [arrMethods, matchScoreMixin, commonScoreMixin],
}
</script>
