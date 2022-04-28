<template>
  <div class="screenshots-container">
    <div v-if="firstParticipantScreenshots.length" class="screenshot_block">
      <screenshots-block :screenshots="firstParticipantScreenshots"
                         type="first"
                         :can-u-change="canUChangeFirstScreenshots"
      />
    </div>

    <div v-if="secondParticipantScreenshots.length" class="screenshot_block">
      <screenshots-block :screenshots="secondParticipantScreenshots"
                         type="second"
                         :can-u-change="canUChangeSecondScreenshots"
      />
    </div>
  </div>
</template>

<script>
import ScreenshotsBlock from "@/components/tournaments/singleTournament/singleMatch/matchScore/MatchScoreScreenshots/MatchScreenshots/ScreenshotsBlock/ScreenshotsBlock";
import {mapMutations, mapState} from "vuex";

export default {
  name: "MatchScreenshots",
  components: {ScreenshotsBlock},
  props: {
    firstParticipantId: {
      type: String,
      default: ''
    },
    secondParticipantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      canUChangeFirstScreenshots: false,
      canUChangeSecondScreenshots: false
    }
  },
  computed: {
    ...mapState({
      match: state => state.tournaments.match,
      user: state => state.user.user,
      currentParticipantScreenshots: state => state.matchScoreScreenshots.currentParticipantScreenshots
    }),

    /**
     * Массив скриншотов для верхнего участника
     * */
    firstParticipantScreenshots() {
      const score = this.match.scores.find(score => Number(score.attributes.participantable_id) === Number(this.firstParticipantId));

      if (this.canUChangeFirstScreenshots) {
        this.FILL_PARTICIPANT_SCREENSHOTS(score.attachments);
        return this.currentParticipantScreenshots;
      }

      return score.attachments;
    },

    /**
     * Массив скриншотов второго участника
     * */
    secondParticipantScreenshots() {
      const score = this.match.scores.find(score => Number(score.attributes.participantable_id) === Number(this.secondParticipantId));

      if (this.canUChangeSecondScreenshots) {
        this.FILL_PARTICIPANT_SCREENSHOTS(score.attachments);
        return this.currentParticipantScreenshots;
      }

      return score.attachments;
    },
  },
  methods: {
    ...mapMutations([
        'FILL_PARTICIPANT_SCREENSHOTS'
    ]),

    /**
     * Определяем, может ли юзер менять какие-то скриншоты или нет
     * */
    isUserCanChangeScreenshots() {
      this.match.scores.map(score => {
        this.canUChangeFirstScreenshots = Number(this.user.id) === Number(this.firstParticipantId);
        this.canUChangeSecondScreenshots = Number(this.user.id) === Number(this.secondParticipantId);
      })
    }
  },
  created() {
    this.isUserCanChangeScreenshots();
  }
}
</script>

<style scoped lang="scss"></style>
