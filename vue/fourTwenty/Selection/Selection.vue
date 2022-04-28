<template>
  <div class="selection">
    <div class="tickets">

      <div
          class="tickets-slider-wrap"
          ref="ticketsWrap"
          :style="{transform: `translateX(${currentTranslate}px)`, transitionDuration: `${transitionDuration}s`,'--total': this.tickets.length}"
      >
        <Ticket
            v-for="(ticket, index) in tickets" :key="index"
            :ref="'ticket_' + index"
            :ticket="ticket"
            :index="index"
            :tickets-length="tickets.length"
            @complete="openExtraBet()"
            @showMultiplierPopup="openMultiplierPopup"
            @go-next-ticket="goNext(0.3, true)"
            @delete-ticket="goPrev(0)"
        />
      </div>

    </div>

    <div class="slide-btn prev"
         v-if="!isSliderBegin"
         @click="goPrev()"
         v-show="true"
    >
      <svg width="11" height="22" viewBox="0 0 11 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M0.677665 10.0653C0.218448 10.5814 0.218448 11.4182 0.677665 11.9343L8.99253 21.2794C9.45175 21.7955 10.1963 21.7955 10.6555 21.2794C11.1147 20.7633 11.1147 19.9265 10.6555 19.4104L2.34064 10.0653C1.88142 9.54922 1.13688 9.54922 0.677665 10.0653Z"
            fill="#2B5DA8"/>
        <path
            d="M0.677665 11.9343C1.13688 12.4505 1.88142 12.4505 2.34064 11.9343L10.6555 2.58927C11.1147 2.07316 11.1147 1.23637 10.6555 0.720255C10.1963 0.204142 9.45175 0.204142 8.99253 0.720255L0.677665 10.0653C0.218448 10.5814 0.218448 11.4182 0.677665 11.9343Z"
            fill="#2B5DA8"/>
      </svg>
    </div>
    <div class="slide-btn next"
         v-if="!isSliderFinish"
         @click="goNext()"
         v-show="true"
    >
      <svg width="11" height="22" viewBox="0 0 11 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M0.677665 10.0653C0.218448 10.5814 0.218448 11.4182 0.677665 11.9343L8.99253 21.2794C9.45175 21.7955 10.1963 21.7955 10.6555 21.2794C11.1147 20.7633 11.1147 19.9265 10.6555 19.4104L2.34064 10.0653C1.88142 9.54922 1.13688 9.54922 0.677665 10.0653Z"
            fill="#2B5DA8"/>
        <path
            d="M0.677665 11.9343C1.13688 12.4505 1.88142 12.4505 2.34064 11.9343L10.6555 2.58927C11.1147 2.07316 11.1147 1.23637 10.6555 0.720255C10.1963 0.204142 9.45175 0.204142 8.99253 0.720255L0.677665 10.0653C0.218448 10.5814 0.218448 11.4182 0.677665 11.9343Z"
            fill="#2B5DA8"/>
      </svg>
    </div>

    <transition name="fade">
      <ExtraBet v-if="extraBetConfig.isOpen" @close="closeExtraBet()"/>
    </transition>
    <transition name="fade">
      <ExtraBetMultiplier
          v-if="multiplierPopup.isOpen"
          @close="closeMultiplierPopup"/>
    </transition>
  </div>
</template>

<script>
import Ticket from '@/components/Ticket/Ticket';
import { mapActions, mapMutations, mapState } from 'vuex';
import { cloneObject } from '@/helpers/deepObjectCloning';
import { ticketStructure } from '@/store/modules/tickets';
import ExtraBet from '@/components/ExtraBet/ExtraBet';
import ExtraBetMultiplier from '@/components/ExtraBet/ExtraBetMultiplier';

export default {
  name: 'Selection',
  components: {
    ExtraBetMultiplier,
    ExtraBet,
    Ticket
  },
  data () {
    return {
      activeSlideIndex: 0,
      translateDirection: '-',
      currentTranslate: 0,
      transitionDuration: 0.2,
      extraBetConfig: {
        isOpen: false
      },
      multiplierPopup: {
        isOpen: false
      }
    };
  },
  computed: {
    ...mapState({
      tickets: state => state.tickets.tickets
    }),
    isSliderBegin () {
      return !this.activeSlideIndex;
    },
    isSliderFinish () {
      return this.activeSlideIndex === this.tickets.length - 1;
    },
    ticketWidth () {
      return this.$refs.ticket_0[0].$el.getBoundingClientRect().width;
    }
  },
  watch: {
    '$store.state.ui.extraBetPopupOpen' (nv) {
      this.extraBetConfig.isOpen = nv;
    },
    '$store.state.ui.multiplierPopupOpen' (nv) {
      this.multiplierPopup.isOpen = nv;
    }
  },
  methods: {
    ...mapMutations([
      'setTickets',
      'toggleMultiplierPopup',
      'toggleExtraBetPopup'
    ]),
    ...mapActions([
      'resetAndCloseMultiplier'
    ]),
    getStyle (e, styleName) {
      let styleValue = '';
      if (document.defaultView && document.defaultView.getComputedStyle) {
        styleValue = document.defaultView.getComputedStyle(e, '').getPropertyValue(styleName);
      } else if (e.currentStyle) {
        styleName = styleName.replace(/-(\w)/g, function (strMatch, p1) {
          return p1.toUpperCase();
        });
        styleValue = e.currentStyle[styleName];
      }
      return parseFloat(styleValue);
    },
    closeExtraBet () {
      this.toggleExtraBetPopup(false);
    },
    openExtraBet () {
      this.closeMultiplierPopup();
      this.toggleExtraBetPopup(true);
    },
    openMultiplierPopup () {
      this.toggleExtraBetPopup(false);
      this.toggleMultiplierPopup(true);
    },
    closeMultiplierPopup () {
      this.toggleMultiplierPopup(false);
    },
    goNext (duration = 0.3, toLast = false) {
      if (this.isSliderFinish) return;
      const mr = this.getStyle(this.$refs.ticket_0[0].$el, 'margin-right');

      if (toLast) {
        const step = (this.tickets.length - 1) - this.activeSlideIndex;
        if (window.matchMedia('(max-width: 525px)').matches) {
          setTimeout(() => {
            this.$refs[`ticket_${this.activeSlideIndex}`][0].$el.scrollIntoView({
              inline: 'center',
              behavior: 'smooth'
            });
          }, 0);
        } else {
          this.activeSlideIndex = this.tickets.length - 1;
          this.translateDirection = '-';
          this.transitionDuration = duration;
          console.log(this.ticketWidth);
          this.currentTranslate = this.currentTranslate - ((this.ticketWidth + mr * 2) * step);
          return;
        }
      }
      this.activeSlideIndex++;
      if (window.matchMedia('(max-width: 525px)').matches) {
        setTimeout(() => {
          this.$refs[`ticket_${this.activeSlideIndex}`][0].$el.scrollIntoView({
            inline: 'center',
            behavior: 'smooth'
          });
        }, 0);
      } else {
        this.translateDirection = '-';
        this.transitionDuration = duration;
        this.currentTranslate = this.currentTranslate - (this.ticketWidth + mr * 2);
      }
    },
    goPrev (duration = 0.3) {
      if (this.isSliderBegin) return;

      const mr = this.getStyle(this.$refs.ticket_0[0].$el, 'margin-right');

      this.activeSlideIndex--;
      if (window.matchMedia('(max-width: 525px)').matches) {
        setTimeout(() => {
          this.$refs[`ticket_${this.activeSlideIndex}`][0].$el.scrollIntoView({
            inline: 'center',
            behavior: 'smooth'
          });
        }, 0);
      } else {
        this.translateDirection = '+';
        this.transitionDuration = duration;
        this.currentTranslate = this.currentTranslate + (this.ticketWidth + mr * 2);
      }
    }
  },
  created () {
    this.setTickets([cloneObject(ticketStructure)]);
  },
  mounted () {
    this.resetAndCloseMultiplier();
  }
};
</script>

<style lang="scss">
@use 'selection';
</style>
