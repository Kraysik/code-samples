<template>
  <div class="containerAttachment">
    <div class="container__leftSide leftSide">
      <span class="leftSide__title">Если нужно – </span>
      <span class="leftSide__title">прикрепите скриншот</span>
    </div>
    <div class="container__rightSide rightSide">
      <attachment-button @click="onClickAttachmentButton" :disabled="isMaxCountOfScreenshots"  />
    </div>
  </div>
</template>

<script>
import AttachmentButton from "@/components/UIElements/AttachmentButton/AttachmentButton";
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import _ from "lodash";

export default {
name: "attachmentScreenshot",
  components: {AttachmentButton},
  props: {
    score: {
      type: Object,
      default: function() {
        return {
          id: 0,
          attachments: [],
          attributes: null
        }
      }
    }
  },
  data() {
    return {
      countOfScreenshots: 0,
      screenshots: []
    }
  },
  computed: {
    ...mapState({
      match: state => state.tournaments.match,
      maxCountOfScreenshots: state => state.matchScoreScreenshots.maxCountOfScreenshots
    }),

    isMaxCountOfScreenshots() {
      return this.score.attachments.length >= this.maxCountOfScreenshots;
    },

    /**
     * Проверяем возможность загрузки скриншота
     * */
    canULoadAnotherOneFile() {
      if (this.countOfScreenshots >= this.maxCountOfScreenshots) {
        this.SET_CONFIG_UNIVERSAL_MODAL({
          text: `Вы выбрали слишком много фотографий! Можно загрузить до : ${this.maxCountOfScreenshots} файлов(а)`,
          status: 'warning'
        });
        this.SET_ACTIVE_UNIVERSAL_MODAL();

        return false;
      }
      return true;
    },
  },
  methods: {
    ...mapActions([
        'SET_CONFIG_UNIVERSAL_MODAL',
        'SET_ACTIVE_UNIVERSAL_MODAL',
        'UPLOAD_MATCH_SCREENSHOT',
    ]),
    ...mapMutations([
        'ADD_SCREENSHOT_TO_STATE',
    ]),

    async onClickAttachmentButton(e) {
      try {
        e.target.files.forEach((file) => {

          if (!this.canULoadAnotherOneFile) {
            return e.target.value = '';
          }

          const reader = new FileReader();

          const loadFunc = async () => {
            const data = {
              id: Math.random(),
              attributes: {
                url: reader.result,
              },
              isLoad: true,
              url: reader.result,
              file: file
            };

            this.ADD_SCREENSHOT_TO_STATE(data);
            await this.UPLOAD_MATCH_SCREENSHOT(data.file);

            e.target.value = '';
        }

          reader.addEventListener("load", loadFunc, {once: true})
          reader.readAsDataURL(file)

          this.countOfScreenshots++;
        });

      } catch (e) {
        return null
      }

    },
    decrementCountOfScreenshots() {
      this.countOfScreenshots--;
    }
  },
  mounted() {
    this.countOfScreenshots = this.score.attachments.length;

    window.addEventListener('match-screenshot-deleted', this.decrementCountOfScreenshots);
  },
  beforeDestroy() {
  window.removeEventListener('match-screenshot-deleted', this.decrementCountOfScreenshots);
  }
}
</script>

<style scoped lang="scss">
@import "src/scss/vars/mixins";
@import "src/scss/vars/colors";

  .containerAttachment {
    margin-top: 26px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    &__leftSide, .leftSide {
      display: flex;
      flex-direction: column;
      color: $grey;
      letter-spacing: 0.002em;
      font-family: $blatant-cyrillic, $blatant-latin;
      font-size: 14px;
      line-height: 14px;

      &__title {
        white-space: pre
      }
    }

    &__rightSide, .rightSide {
      margin-left: 20px;
    }

    @media all and (max-width: 720px) {
      flex-direction: column;

      .leftSide {
        flex-direction: row;
      }

      .rightSide {
        margin-top: 20px;
        margin-left: 0;
      }
    }
  }
</style>
