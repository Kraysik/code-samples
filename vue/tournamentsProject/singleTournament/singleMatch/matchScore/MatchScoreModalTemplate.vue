<template>
  <div class="score-modal--bg" ref="scoreModal" tabindex="0" @keydown.esc="closeScore" @click="closeScore">
    <div class="score-modal" @click.stop>
      <div class="score-modal--close" @click="closeScore">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.4" d="M1 1L19 19M19 1L1 19" stroke="white"/>
        </svg>
      </div>
      <div class="score-modal--head">Результаты матча</div>
      <div class="score-modal--subtitle" v-if="POV === 'user'">Введите результат игр и нажмите «Подтвердить счёт»</div>
      <div class="score-modal--content">
        <div class="score-modal--teams-container" ref="teams">
          <div class="block-title">Команды</div>
          <div class="score-modal--teams">
            <div class="score-modal--teams-cell red">
              <div class="name">{{
                  getFirstComposition.participant.type === 'teams' ? getFirstComposition.participant.attributes.tag : getFirstComposition.participant.attributes.login
                }}
              </div>
              <div class="logo">
                <img :src="getFirstComposition.participant.attributes.logo">
              </div>
            </div>
            <div class="score-modal--teams-cell blue">
              <div class="name">{{
                  getSecondComposition.participant.type === 'teams' ? getSecondComposition.participant.attributes.tag : getSecondComposition.participant.attributes.login
                }}
              </div>
              <div class="logo">
                <img :src="getSecondComposition.participant.attributes.logo">
              </div>
            </div>
          </div>
        </div>
        <div class="score-modal--inputs-container" ref="inputs">
          <div class="block-title">Игры</div>
          <div class="score-modal--inputs">

            <slot name="score-inputs" :canAcceptScore="acceptScoreBtnClicked"></slot>

          </div>
        </div>
      </div>

      <div v-if="canUChange" :class="[{'score-modal--appendix-admin': POV === 'admin'}, 'score-modal--appendix']" data-title="результаты игроков">
        <div class="score-modal--appendix-wrapper" ref="appendix">
          <!-- Счет для админа -->
          <div class="confirmations" v-if="POV === 'admin'">

            <slot name="score-admin-cells"></slot>

          </div>
        </div>
      </div>

      <div class="screenshots" ref="screenshots">
        <div v-show="isAnyScreenshotsInMatch"
             class="score-modal--appendix score-modal--appendix-admin"
             data-title="скриншоты игры"
        >
          <div ref="screenshots_images"
               class="score-modal--appendix-wrapper screenshots__images_wrapper"
          >
            <match-screenshots
                :first-participant-id="getFirstComposition.participant.id"
                :second-participant-id="getSecondComposition.participant.id"
            />
          </div>
        </div>

        <!-- "Добавьте скриншот, если нужно" -->
        <template v-if="uIsParticipant && !readOnly">
          <attachment-screenshot :score="getMyScore" />
        </template>

      </div>

      <template>
        <div v-if="!readOnly" class="score-modal--foot">
          <div class="score-modal--foot-wrapper">
            <div v-if="canUChange" class="button" :class="{disabled: btnIsDisabled}" @click="setBtnScoreClicked">
              {{ POV !== 'admin' ? 'Подтвердить' : 'Утвердить' }}
            </div>
            <small class="danger" v-if="dangerousActionsOfAdmin">Утверждая счёт, вы идёте против логики
              приложения!!!</small>
            <small v-if="canUChange">* Внимание, после подтверждения вы не сможете изменить результаты.</small>
          </div>
        </div>
      </template>
    </div>

  </div>
</template>
<style lang="scss">
.danger {
  color: red !important;
}
</style>
<script>
import {arrMethods} from "@/helpers/mixins/arrMethods";
import {commonScoreMixin} from "@/components/tournaments/singleTournament/singleMatch/matchScore/commonScoreMixin";
import {matchScoreScreenshotsMixin} from "@/components/tournaments/singleTournament/singleMatch/matchScore/MatchScoreScreenshots/matchScoreScreenshotsMixin";
import AttachmentScreenshot from "@/components/tournaments/singleTournament/singleMatch/matchScore/MatchScoreScreenshots/attachmentScreenshot/attachmentScreenshot";
import MatchScreenshots from "@/components/tournaments/singleTournament/singleMatch/matchScore/MatchScoreScreenshots/MatchScreenshots/MatchScreenshots";

export default {
  name: "MatchScoreModalTemplate",
  components: {MatchScreenshots, AttachmentScreenshot},
  mixins: [arrMethods, commonScoreMixin, matchScoreScreenshotsMixin],
  data() {
    return {
      readOnly: false,
      isAcceptBtn: false,
      acceptScoreBtnClicked: false
    };
  },
  watch: {
    acceptScoreBtnClicked(nV) {
      if (nV) {
        this.$emit('acceptScoreBtnClicked', true);
      }
    },
    isAnyScreenshotsInMatch(nV) {
      if (nV) {
        this.getScreenshotsBlockWidth();
      }
    }
  },
  computed: {
    btnIsDisabled(){
      return !(this.isAcceptBtn || this.dangerousActionsOfAdmin);
    },
    /**
     * Возможны опасные действия со значениями счетов игроков
     */
    dangerousActionsOfAdmin() {
      if (!this.uIsAdmin) {
        return false;
      }
      const match = this.MATCH.data.attributes;

      if (match.previous_finished) {
        return false;
      }

      return match.stage === 'round_robin';
    }

  },
  methods: {
    /**
     * Говорим о том, что кнопка отправки счета нажата, для того чтобы прослушать
     * событие об изменении переменной и выполнении функции отправки, если кнопка была нажата
     * */
    setBtnScoreClicked() {
      if (this.isAcceptBtn === false) {
        return;
      }

      this.acceptScoreBtnClicked = true;
    },

    /**
     * Открываем возможность отправить счет
     * */
    setActiveScoreBtn() {
      this.isAcceptBtn = true;
    },

    /**
     * Закрываем возможность отправить счет
     * */
    setDisabledScoreBtn() {
      this.isAcceptBtn = false;
    },

    /**
     * Получаем ширину блока для скриншотов, что бы корректно его позиционировать относительно счетов
     * */
    getScreenshotsBlockWidth() {
      if (!this.isAnyScreenshotsInMatch) {
        return;
      }

      let inputStyles = window.getComputedStyle(this.$refs.inputs);
      let teamsStyles = window.getComputedStyle(this.$refs.teams);
      let inputMargins = parseFloat(inputStyles.marginLeft) + parseFloat(inputStyles.marginRight);
      let teamsMargins = parseFloat(teamsStyles.marginLeft) + parseFloat(teamsStyles.marginRight);

      this.$refs.screenshots.style.maxWidth = `${this.$refs.inputs.offsetWidth + this.$refs.teams.offsetWidth + inputMargins + teamsMargins}px`;
      this.$refs.screenshots_images.style.maxWidth = `${this.$refs.inputs.offsetWidth}px`;
    }
  },
  mounted() {
    this.$refs.scoreModal.focus();

    window.addEventListener('can-accept-score', this.setActiveScoreBtn);
    window.addEventListener('decline-accept-score', this.setDisabledScoreBtn);

    this.$nextTick(function() {
      this.getScreenshotsBlockWidth();
    });
  },
  destroyed() {
    window.removeEventListener('can-accept-score', this.setActiveScoreBtn);
    window.removeEventListener('decline-accept-score', this.setDisabledScoreBtn);
  }
};
</script>

<style scoped>

</style>
