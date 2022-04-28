<template>
  <div class="container" v-if="!this.IS_MATCH">
    <div class="match-outer_wrapper">
      <div class="mContent__wrapper">
        <div class="mContent__body">
          <div class="team-col" :class="isFirstWinner">
            <div :data-score="getFirstScore" class="team-col__head-wrapper">

              <router-link
                  :to="{ name: getFirstComposition.participant.type === 'teams' ? 'team.name' : 'another-profile', params: { id: getFirstComposition.participant.id }}"
                  target="_blank"
              >
                <div class="team-col__head">
                  <div class="logo">
                    <img :src="getFirstComposition.participant.attributes.logo" alt="">
                  </div>
                  <div class="text">
                    <div class="name">{{ nameInHeadTeam(getFirstComposition) }}</div>
                    <template v-if="uIsParticipant || uIsAdmin">
                      <div class="info" v-if="getFirstComposition.participant.attributes.psn_id"
                      >
                        <div v-html="'PSN ID: &nbsp;'"></div>
                        <span :title="getFirstComposition.participant.attributes.psn_id">
                          {{ shortenStrings(getFirstComposition.participant.attributes.psn_id) }}
                        </span>
                      </div>
                    </template>
                  </div>
                </div>
              </router-link>
              <media :query="{maxWidth:992}">
                <div class="svg-wrapper" v-if="getFirstComposition.participant.type === 'teams'">
                  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6 0C4.71134 0 3.66667 1.19948 3.66667 2.67908C3.66667 4.15871 4.71134 5.35813 6 5.35813C7.28866 5.35813 8.33333 4.15871 8.33333 2.67908C8.33333 1.19948 7.28866 0 6 0ZM12 0C10.3431 0 9 1.34938 9 3.01398C9 4.67854 10.3431 6.02791 12 6.02791C13.6569 6.02791 15 4.67854 15 3.01398C15 1.34938 13.6569 0 12 0ZM18 0C16.7113 0 15.6667 1.19948 15.6667 2.67908C15.6667 4.15871 16.7113 5.35813 18 5.35813C19.2887 5.35813 20.3333 4.15871 20.3333 2.67908C20.3333 1.19948 19.2887 0 18 0ZM4.36458 6.00698C1.36458 6.82311 0 7.09657 0 13.0814L1.63542 13.8977C2.18087 11.4493 2.18561 10.9047 2.45833 10.9047C2.73106 10.9047 2.72538 11.7215 3.27083 14.4419C3.51311 14.4821 3.76846 14.5181 4.03125 14.5465C4.13327 11.7537 4.54144 10.0604 5.42708 8.91628C6.45814 7.58448 7.97951 7.22484 9.79167 6.72911C9.19847 6.43557 8.48416 6.23788 7.63542 6.00698C6.54451 6.82311 5.45549 6.82311 4.36458 6.00698ZM16.3646 6.00698C15.5068 6.24035 14.7842 6.42784 14.1875 6.71861C16.0098 7.21771 17.5413 7.58684 18.5729 8.96861C19.4268 10.1126 19.8392 11.8005 19.9583 14.5465C20.2247 14.5182 20.4838 14.4826 20.7292 14.4419C21.2746 11.7215 21.2689 10.9047 21.5417 10.9047C21.8144 10.9047 21.8191 11.4493 22.3646 13.8977L24 13.3535C24 7.09665 22.6354 6.82311 19.6354 6.00698C18.5445 6.82311 17.4555 6.82311 16.3646 6.00698ZM10 7.36741C6.33333 8.37208 4.66667 8.70693 4.66667 16.0744L6.66667 17.079C7.33333 14.0651 7.33333 13.3953 7.66667 13.3953C8 13.3953 8 14.4 8.66667 17.7488C10.6667 18.0837 13.3333 18.0837 15.3333 17.7488C16 14.4 16 13.3953 16.3333 13.3953C16.6667 13.3953 16.6667 14.0651 17.3333 17.079L19.3333 16.4093C19.3333 8.70693 17.6667 8.37208 14 7.36741C12.6667 8.37208 11.3333 8.37208 10 7.36741Z"
                        fill="#242424"/>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="#242424" stroke-linejoin="round"/>
                  </svg>
                </div>
              </media>
            </div>
            <div v-if="getFirstComposition.users">
              <div class="active-players" v-for="player in getFirstComposition.players" :key="player.index">
                <router-link
                    :to="{ name: 'another-profile', params: { id: player.id }}"
                    target="_blank"
                >
                  <div class="player-block" :class="player.role">
                    <div class="logo">
                      <img alt="#" :src="player.attributes.logo">
                    </div>
                    <div class="name">{{ player.attributes.login ? player.attributes.login : 'User' }}</div>
                  </div>
                </router-link>
              </div>
              <div v-if="getFirstComposition.subs.length">
                <div class="desc">Запасные игроки</div>
                <div class="reserves" v-for="player in getFirstComposition.subs" :key="player.index">
                  <router-link
                      :to="{ name: 'another-profile', params: { id: player.id }}"
                      target="_blank"
                  >
                    <div class="player-block">
                      <div class="logo">
                        <img alt="#" :src="player.attributes.logo">
                      </div>
                      <div class="name">{{ player.attributes.login ? player.attributes.login : 'User' }}</div>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <div class="status">
            <div class="status-head">
              <div class="s1">{{ getMatchStatus }}</div>
              <div class="s2" v-if="MATCH.data.attributes.status === 'no_started'">
                Матч начнется через:
                <template v-if="isTimer">
                  <count-down-timer
                      :seconds="getStartedDistance()"
                      @ended="hideTimer()"
                  />
                </template>
                <div v-else>буквально пару секунд</div>
              </div>
              <div class="s2">{{ getWinnerNumber }}</div>
            </div>
            <div v-if="uIsParticipant && this.MATCH.data.attributes.status === 'started'" class="subtitle">Немного
              подождите, пока ваш соперник не ввел результат.
            </div>
            <!--call-judge call-judge__waiting-->
            <div v-if="showCallAdminButton" class="call-judge" :class="{'call-judge__waiting': requestInProgress}"
                 @click.prevent="call_admin">
              <div class="button-content">
                <div class="call">
                  <template v-if="!isJudgeCalled">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                          d="M4.03126 8.87024C3.78718 8.62617 3.78718 8.23044 4.03126 7.98636L4.91514 7.10248L8.89262 11.08L8.00873 11.9638C7.76466 12.2079 7.36893 12.2079 7.12485 11.9638L4.03126 8.87024Z"
                          fill="#EB3333"/>
                      <path d="M3.75 15.187V13.937H9.375V15.187H3.75Z" fill="#EB3333"/>
                      <path d="M2.5 17.062L2.5 15.812H10.625V17.062L2.5 17.062Z" fill="#EB3333"/>
                      <path
                          d="M8.45068 3.56694L9.33456 2.68306C9.57864 2.43898 9.97437 2.43898 10.2184 2.68306L13.312 5.77665C13.5561 6.02073 13.5561 6.41646 13.312 6.66053L12.4282 7.54442L8.45068 3.56694Z"
                          fill="#EB3333"/>
                      <path d="M5.79886 7.10264L8.45051 4.45099L11.5441 7.54458L8.89245 10.1962L5.79886 7.10264Z"
                            fill="#EB3333"/>
                      <path
                          d="M9.77633 10.1962L11.5441 8.42847L17.7313 14.6157C17.9754 14.8597 17.9754 15.2555 17.7313 15.4995L16.8474 16.3834C16.6033 16.6275 16.2076 16.6275 15.9635 16.3834L9.77633 10.1962Z"
                          fill="#EB3333"/>
                    </svg>
                    пригласить судью
                  </template>
                  <template v-else>
                    cудья приглашен
                  </template>
                </div>
                <div class="wait">
                  <img src="~@/img/ico_spinner.png" alt="">
                  Ожидаем
                </div>
              </div>
            </div>
            <div class="fill-score" @click="showScore">{{ scoreBtnText }}</div>
          </div>
          <div class="team-col reverse" :class="isSecondWinner">
            <div :data-score="getSecondScore" class="team-col__head-wrapper">
              <router-link
                  :to="{ name: getSecondComposition.participant.type === 'teams' ? 'team.name' : 'another-profile', params: { id: getSecondComposition.participant.id }}"
                  target="_blank"
              >
                <div class="team-col__head">
                  <div class="logo">
                    <img :src="getSecondComposition.participant.attributes.logo" alt="">
                  </div>
                  <div class="text">
                    <div class="name">{{ nameInHeadTeam(getSecondComposition) }}</div>
                    <template v-if="uIsParticipant || uIsAdmin">
                      <div class="info" v-if="getSecondComposition.participant.attributes.psn_id">
                        <div v-html="'PSN ID: &nbsp;'"></div>
                        <span :title="getSecondComposition.participant.attributes.psn_id">
                          {{ shortenStrings(getSecondComposition.participant.attributes.psn_id) }}
                        </span>
                      </div>
                    </template>
                  </div>
                </div>
              </router-link>
              <media :query="{maxWidth:992}">
                <div class="svg-wrapper" v-if="getFirstComposition.participant.type === 'teams'">
                  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6 0C4.71134 0 3.66667 1.19948 3.66667 2.67908C3.66667 4.15871 4.71134 5.35813 6 5.35813C7.28866 5.35813 8.33333 4.15871 8.33333 2.67908C8.33333 1.19948 7.28866 0 6 0ZM12 0C10.3431 0 9 1.34938 9 3.01398C9 4.67854 10.3431 6.02791 12 6.02791C13.6569 6.02791 15 4.67854 15 3.01398C15 1.34938 13.6569 0 12 0ZM18 0C16.7113 0 15.6667 1.19948 15.6667 2.67908C15.6667 4.15871 16.7113 5.35813 18 5.35813C19.2887 5.35813 20.3333 4.15871 20.3333 2.67908C20.3333 1.19948 19.2887 0 18 0ZM4.36458 6.00698C1.36458 6.82311 0 7.09657 0 13.0814L1.63542 13.8977C2.18087 11.4493 2.18561 10.9047 2.45833 10.9047C2.73106 10.9047 2.72538 11.7215 3.27083 14.4419C3.51311 14.4821 3.76846 14.5181 4.03125 14.5465C4.13327 11.7537 4.54144 10.0604 5.42708 8.91628C6.45814 7.58448 7.97951 7.22484 9.79167 6.72911C9.19847 6.43557 8.48416 6.23788 7.63542 6.00698C6.54451 6.82311 5.45549 6.82311 4.36458 6.00698ZM16.3646 6.00698C15.5068 6.24035 14.7842 6.42784 14.1875 6.71861C16.0098 7.21771 17.5413 7.58684 18.5729 8.96861C19.4268 10.1126 19.8392 11.8005 19.9583 14.5465C20.2247 14.5182 20.4838 14.4826 20.7292 14.4419C21.2746 11.7215 21.2689 10.9047 21.5417 10.9047C21.8144 10.9047 21.8191 11.4493 22.3646 13.8977L24 13.3535C24 7.09665 22.6354 6.82311 19.6354 6.00698C18.5445 6.82311 17.4555 6.82311 16.3646 6.00698ZM10 7.36741C6.33333 8.37208 4.66667 8.70693 4.66667 16.0744L6.66667 17.079C7.33333 14.0651 7.33333 13.3953 7.66667 13.3953C8 13.3953 8 14.4 8.66667 17.7488C10.6667 18.0837 13.3333 18.0837 15.3333 17.7488C16 14.4 16 13.3953 16.3333 13.3953C16.6667 13.3953 16.6667 14.0651 17.3333 17.079L19.3333 16.4093C19.3333 8.70693 17.6667 8.37208 14 7.36741C12.6667 8.37208 11.3333 8.37208 10 7.36741Z"
                        fill="#242424"/>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="#242424" stroke-linejoin="round"/>
                  </svg>
                </div>
              </media>
            </div>
            <div v-if="getSecondComposition.users">
              <div class="active-players" v-for="player in getSecondComposition.players" :key="player.index">
                <router-link
                    :to="{ name: 'another-profile', params: { id: player.id }}"
                    target="_blank"
                >
                  <div class="player-block reverse" :class="player.role">
                    <div class="logo">
                      <img alt="#" :src="player.attributes.logo">
                    </div>
                    <div class="name">{{ player.attributes.login ? player.attributes.login : 'User' }}</div>
                  </div>
                </router-link>
              </div>
              <div v-if="getSecondComposition.subs.length">
                <div class="desc">Запасные игроки</div>
                <div class="reserves" v-for="player in getSecondComposition.subs" :key="player.index">
                  <router-link
                      :to="{ name: 'another-profile', params: { id: player.id }}"
                      target="_blank"
                  >
                    <div class="player-block reverse" :class="player.role">
                      <div class="logo">
                        <img alt="#" :src="player.attributes.logo">
                      </div>
                      <div class="name">{{ player.attributes.login ? player.attributes.login : 'User' }}</div>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template v-if="tournamentDiscipline === 'NHL'">
      <nhl-score-modal v-if="isScore" @close-score="showScore"/>
    </template>
    <template v-else-if="tournamentDiscipline === 'UFC'">
      <ufc-score-modal v-if="isScore" @close-score="showScore"/>
    </template>
    <template v-else>
      <default-score-modal v-if="isScore" @close-score="showScore"/>
    </template>

    <simple-text-modal
        v-if="isTextModal"
        :configForSimpleTextModal="configForSimpleTextModal"
        @closeSimpleModal="isTextModal = false"
    />
  </div>
</template>

<script>
import Media from 'vue-media';
import {mapGetters, mapActions, mapMutations} from 'vuex';
import SimpleTextModal from "@/components/modals/simple-text-modal";
import {arrMethods} from "@/helpers/mixins/arrMethods";
import moment from "moment";
import _ from "lodash";
import {ActiveEcho as PublicEcho} from "@/main";
import setVictoryOnPoints from "@/helpers/setVictoryOnPoints";
import copyGetter from "@/helpers/VuexHelpers/copyGetter";
import CountDownTimer from "@/components/CountDownTimer/CountDownTimer";
import NhlScoreModal
  from "@/components/tournaments/singleTournament/singleMatch/matchScore/NHLScoreModal/NhlScoreModal";
import UfcScoreModal
  from "@/components/tournaments/singleTournament/singleMatch/matchScore/UFCScoreModal/UfcScoreModal";
import DefaultScoreModal
  from "@/components/tournaments/singleTournament/singleMatch/matchScore/DefaultScoreModal/DefaultScoreModal";

export default {
  name: "SingleMatchInfo",
  components: {DefaultScoreModal, UfcScoreModal, NhlScoreModal, CountDownTimer, SimpleTextModal, Media},
  mixins: [arrMethods],
  data() {
    return {
      requestInProgress: false,
      isAdmin: false,
      isTextModal: false,
      isScore: false,
      showCallAdminButton: false,
      configForSimpleTextModal: {
        text: 'Ваш счет успешно отправлен',
        status: 'default',
        timeoutSeconds: 2,
      },
      isTimer: null,
      isJudgeCalled: false,
      tournamentDiscipline: ''
    };
  },
  computed: {
    ...mapGetters([
      'COMPOSITIONS',
      'MATCH',
      'IS_MATCH',
      'USER',
      'GET_CHAT'
    ]),
    canChat() {

      switch (true) {
        case this.USER.attributes.role === 'admin':
        case this.uIsParticipant:

          return true;
      }

      return false;
    },
    uIsAdmin() {
      return this.USER.attributes.role === 'admin';
    },
    uIsParticipant() {
      if (this.MATCH.data.attributes.participantable_first_type === 'users') {
        switch (Number(this.USER.id)) {
          case Number(this.MATCH.data.attributes.participantable_first_id):
          case Number(this.MATCH.data.attributes.participantable_second_id):
            return true;
        }

        return false;
      }

      if (this.MATCH.data.attributes.participantable_first_type === 'teams') {

        for (let participant of this.getFirstComposition.players) {
          if (Number(this.USER.id) === Number(participant.id)) {
            return true;
          }
        }

        for (let participant of this.getSecondComposition.players) {
          if (Number(this.USER.id) === Number(participant.id)) {
            return true;
          }
        }

        return false;
      }

      return false;
    },

    getMatchStatus() {
      let status = this.MATCH.data.attributes.status;
      return status === 'no_started' ? 'Ожидается' : status === 'finished' ? 'Завершён' : 'В процессе';
    },
    getFirstComposition() {
      let composition = this.COMPOSITIONS.find(item => Number(item.participant.id) === Number(this.MATCH.data.attributes.participantable_first_id));
      composition.score = this.MATCH.rounds ? this.MATCH.rounds.attributes.first_score : null;
      return composition;
    },
    getSecondComposition() {
      let composition = this.COMPOSITIONS.find(item => Number(item.participant.id) === Number(this.MATCH.data.attributes.participantable_second_id));
      composition.score = this.MATCH.rounds ? this.MATCH.rounds.attributes.second_score : null;
      return composition;
    },
    isFirstWinner() {
      if (this.MATCH.data.attributes.status === 'finished') {
        if (Number(this.MATCH.data.attributes.first_score) > Number(this.MATCH.data.attributes.second_score)) {
          return 'winner';
        }
        return 'loser';
      }
      return '';
    },
    isSecondWinner() {
      if (this.MATCH.data.attributes.status === 'finished') {
        if (Number(this.MATCH.data.attributes.first_score) < Number(this.MATCH.data.attributes.second_score)) {
          return 'winner';
        }
        return 'loser';
      }
      return '';
    },
    getWinnerNumber() {
      if (this.MATCH.data.attributes.status === 'finished') {
        switch (true) {
          case this.isFirstWinner === 'winner' :
            return 'Победа 1';
          case this.isSecondWinner === 'winner' :
            return 'Победа 2';
          default:
            return 'Ничья';
        }
      }
      return '';
    },
    getStartedAtBySeconds() {
      return (moment(this.MATCH.data.attributes.started_at).unix());
    },
    getStartedDistance() {
      return ((moment(this.MATCH.data.attributes.started_at).unix()) - this.MATCH.data.attributes.current_timestamp);
    },
    scoreBtnText() {
      switch (true) {
        case this.MATCH.data.attributes.status !== 'started':
          return 'Посмотреть счет';
        case this.USER.attributes.role === 'admin':
          return 'Внести счет';
        case this.uIsParticipant:
          return 'Внести счет';
        default:
          return 'Посмотреть счет';
      }
    },

    getFirstScore() {
      const match = copyGetter(this.MATCH);
      match.data.rounds = match.rounds;
      return setVictoryOnPoints(match.data, 'first');
    },

    getSecondScore() {
      const match = copyGetter(this.MATCH);
      match.data.rounds = match.rounds;
      return setVictoryOnPoints(match.data, 'second');
    },


  },
  methods: {
    ...mapActions([
      'UPDATE_SCORES',
      'CHAT_UPDATE_NEED_ADMIN',
      'GET_MATCH_FROM_URL'
    ]),
    ...mapMutations([
      'SET_SCORE_ENTITY',
      'CLEAR_SCREENSHOTS'
    ]),
    shortenStrings(string) {
      if (window.matchMedia("(min-width: 993px)").matches) {
        return string.length <= 17 ? string : `${string.slice(0, 17)}...`;
      }
      return string;
    },

    showScore() {
      this.isScore = !this.isScore;
    },

    async call_admin() {
      this.requestInProgress = true;
      await this.CHAT_UPDATE_NEED_ADMIN(this.GET_CHAT);
      setTimeout(() => this.isJudgeCalled = true, 600);
      setTimeout(() => this.requestInProgress = false, 1100);
    },

    nameInHeadTeam(composition) {
      return composition.participant.type === 'teams' ? composition.participant.attributes.name : composition.participant.attributes.login;
    },

    /**
     * Обновление данных матча, не чаще 1 раза в 30 секунд
     * */
    updateMatch: _.debounce(function () {
      this.GET_MATCH_FROM_URL({id: this.$router.currentRoute.params.id});
    }, 30000, {'leading': true, 'trailing': false}),

    /**
     * Подписываемся на обновления матча
     * */
    subscribeToMatchUpdates() {
      PublicEcho
          .channel(`matches.${this.MATCH.data.id}`)
          .listen('.MatchChange', (event) => {
            localStorage.removeItem('currentScores');
          });
    },

    hideTimer() {
      this.isTimer = false;
    }

  },
  mounted() {
    this.subscribeToMatchUpdates();

    if (this.uIsParticipant) {
      if (this.MATCH.data.attributes.status === 'started') {
        this.showCallAdminButton = true;
      }
    }
    this.tournamentDiscipline = this.MATCH.tournament_info.attributes.sort_after_group;

    if (this.canUChange) {
      this.SET_SCORE_ENTITY(this.getMyScore);
    }
  },
  beforeDestroy() {
    PublicEcho.leave(`matches.${this.MATCH.data.id}`);
    this.CLEAR_SCREENSHOTS();
  }
};
</script>

<style scoped lang="scss">
.fade-enter-active {
  animation: fade .5s;
}

.fade-leave-active {
  animation: fade .25s reverse;
}

.slide-enter-active {
  animation: slide .5s;
}

.slide-leave-active {
  animation: slide .25s reverse;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  50% {
    opacity: .5;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slide {
  0% {
    transform: translateX(-50%) translateY(0);
  }

  100% {
    transform: translateX(-50%) translateY(-100%);
  }
}

.status {
  position: relative;

  .call_button {
    cursor: pointer;
    margin-top: 1.5rem;
    font-size: 12px;
    text-transform: uppercase;
    font-family: 'SF UI Text', sans-serif;
    line-height: 120%;
    color: rgba(white, .6);
    width: 180px;
    position: absolute;
    top: 4rem;
    user-select: none;
    transition: color .2s;

    &:hover {
      color: rgba(white, .7);
    }

    &:focus, &:active {
      color: rgba(white, .8);
    }
  }
}
</style>
