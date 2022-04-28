<template>
  <div class="matchPage" v-if="!IS_MATCH">
    <div class="match__header">
      <div class="container">
        <div class="mHeader-content">
          <div class="mHeader-dropdown">
            <span @click="dropdownActive = !dropdownActive">{{ MATCH.tournament_info.attributes.name }}</span>
            <svg @click="dropdownActive = !dropdownActive"
                 :class="dropdownActive? 'active' : ''"
                 width="16" height="16" viewBox="0 0 16 16" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="white" stroke-linejoin="round"/>
            </svg>
          </div>

          <div :class="dropdownActive? 'active' : ''" class="dropdown-content">
            <div class="dropdown-content__header">{{ MATCH.tournament_info.attributes.name }}</div>
            <div class="dropdown-content__info-block">
              <div class="dropdown-content__info-string">
                <div class="s1">Начало</div>
                <div class="s2">{{ getStartedTime }}</div>
              </div>
              <div class="dropdown-content__info-string">
                <div class="s1">Этап</div>
                <div class="s2">{{ getMatchStage }}</div>
              </div>
            </div>

            <div class="dropdown-content__footer">
              <router-link :to="{name: 'tournaments.matches', params: {id: this.MATCH.data.attributes.tournament_id}}"
                           class="outlined">Вернуться к турниру
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="BG-filter__dark">
        <img src="~@/img/stock_bg.png" alt="#">
      </div>
    </div>
    <div class="match__content">
      <transition name="default">
        <router-view/>
      </transition>

      <div ref="chat-container" class="chat-container">
        <chat></chat>
      </div>

    </div>
  </div>
</template>

<script>

import {mapActions, mapGetters} from 'vuex';
import moment from "moment";
import Chat from "@/components/tournaments/singleTournament/singleMatch/сhat/chat";

export default {
  name: "SingleMatch",
  components: {Chat},
  data() {
    return {
      dropdownActive: true,
      shareActive: false,
    }
  },
  computed: {
    ...mapGetters([
      'IS_MATCH',
      'COMPOSITIONS',
      'MATCH',
      'USER'
    ]),
    users() {
      let users = [];
      for (let usersCompositions of this.COMPOSITIONS) {
        for (let user of usersCompositions.players) {
          users.push(user);
        }
      }
      return users;
    },
    getMatchStage() {
      let stage = this.MATCH.data.attributes.stage;
      return stage === 'round_robin' ? 'Групповой' : 'Плэй-офф'
    },
    getMatchStatus() {
      let status = this.MATCH.data.attributes.status;
      return status === 'no_started' ? 'Ожидается' : status === 'finished' ? 'Завершён' : 'В процессе'
    },
    getStartedTime() {
      let date;
      if (this.MATCH.data.attributes.started_at !== null) {
        date = this.$options.filters.regTime((moment(this.MATCH.data.attributes.started_at).valueOf()) / 1000);
      } else {
        date = 'Дата ещё не определена'
      }
      return date
    },
    isChat() {
      return this.MATCH.data.attributes.status !== 'no_started'
    },
  },
  methods: {
    ...mapActions([
        'GET_MATCH_FROM_URL',
    ]),
    updateChatZIndex(zIndex) {
      this.$refs["chat-container"].style.zIndex = zIndex;
    },
    addListenersForChat() {
      this.$root.$on('chat-image-open', () => this.updateChatZIndex(9999));
      this.$root.$on('chat-image-close', () => this.updateChatZIndex(22));
    },
    removeListenersForChat() {
      this.$root.$off('chat-image-open');
      this.$root.$off('chat-image-close');
    }
  },
  created() {
    this.GET_MATCH_FROM_URL({id: this.$router.currentRoute.params.id});
  },

  mounted() {
    if (window.innerWidth < 769) {
      this.dropdownActive = false
    }

    this.addListenersForChat();
  },

  beforeDestroy() {
    this.removeListenersForChat();
  },
}
</script>

<style scoped lang="scss">
.matchPage {
  padding-top: 64px;
  padding-bottom: 64px;
  @media (max-width: 525px) {
    padding-bottom: 0;
  }
}
</style>
