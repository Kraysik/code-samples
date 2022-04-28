<template>
  <div class="multiTicket">
    <div>
      <RangeSlider
        :initial-count="tickets.count"
        :initial-titles="[translations.ticket_suffixes_1,translations.ticket_suffixes_2,translations.ticket_suffixes_3]"
        :initial-marks="tickets.marks"
        :has-preset="true"
        @change="createTickets($event)"
      />
      <RangeSlider
        :subtitle="`${translations.field_name} 1:`"
        :initial-count="field_l.count"
        :initial-titles="[translations.ticket_number_suffixes_1,translations.ticket_number_suffixes_2,translations.ticket_number_suffixes_3]"
        :initial-marks="field_l.marks"
        :initial-min="minFieldLength"
        :initial-max="maxFieldLength"
        @change="updateField($event, 'field_l')"
      />
      <RangeSlider
        :subtitle="`${translations.field_name} 2:`"
        :initial-count="field_r.count"
        :initial-titles="[translations.ticket_number_suffixes_1,translations.ticket_number_suffixes_2,translations.ticket_number_suffixes_3]"
        :initial-marks="field_r.marks"
        :initial-min="minFieldLength"
        :initial-max="maxFieldLength"
        @change="updateField($event, 'field_r')"
      />
    </div>

    <transition name="fade">
      <ExtraBetMultiplier
        v-if="$store.state.ui.multiplierPopupOpen"
        @close="closeMultiplierPopup"/>
    </transition>
  </div>
</template>

<script>
import RangeSlider from '@/components/RangeSlider/RangeSlider';
import getRandomIntInRange from '@/helpers/getRandomIntInRange';
import uniqueArray from '@/helpers/uniqueArray';
import { cloneObject } from '@/helpers/deepObjectCloning';
import { ticketStructure } from '@/store/modules/tickets';
import factorial from '@/helpers/factorial';
import { mapActions, mapMutations, mapState } from 'vuex';
import ExtraBetMultiplier from '@/components/ExtraBet/ExtraBetMultiplier';

export default {
  name: 'MultiTicket',
  components: {
    ExtraBetMultiplier,
    RangeSlider
  },
  data () {
    return {
      minFieldLength: 4,
      maxFieldLength: 8,
      tickets: {
        count: 1,
        marks: [
          1,
          25,
          50,
          75,
          100
        ]
      },
      field_l: {
        count: 4,
        marks: [
          4,
          5,
          6,
          7,
          8
        ]
      },
      field_r: {
        count: 4,
        marks: [
          4,
          5,
          6,
          7,
          8
        ]
      },
      timer: 0,
      multiplier: undefined
    };
  },
  computed: {
    ...mapState({
      translations: state => state.rulesAndTranslations.translations
    })
  },
  watch: {
    '$store.state.tickets.multiplier.raw' (nV, oV) {
      if (nV > 1) {
        if (nV !== oV && this.$store.state.tickets.multiplier.raw) {
          this.toggleExtraBetPopup(false);
          this.toggleMultiplierPopup(true);
        }
      }
    }
  },
  methods: {
    ...mapMutations([
      'setTickets',
      'setMultiplierToState',
      'toggleMultiplierPopup',
      'toggleExtraBetPopup'
    ]),
    ...mapActions([
      'resetAndCloseMultiplier'
    ]),
    closeMultiplierPopup () {
      this.toggleMultiplierPopup(false);
    },
    createTickets (count) {
      this.tickets.count = count;
      const tickets = [];

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        for (let i = 0; i < this.tickets.count; i++) {
          const ticket = this.createSingleTicket();

          tickets.push(ticket);
        }

        this.setTickets(tickets);
      }, 100);
    },
    createSingleTicket () {
      const ticket = cloneObject(ticketStructure);

      const fieldL = this.setNumbers(this.field_l.count).map(el => ({
        number: el,
        selected: true,
        disabled: false
      }));
      const fieldR = this.setNumbers(this.field_r.count).map(el => ({
        number: el,
        selected: true,
        disabled: false
      }));
      ticket.field_l.push(...fieldL);
      ticket.field_r.push(...fieldR);

      ticket.multiplier = this.getMultiplier(this.field_l.count) * this.getMultiplier(this.field_r.count);

      if (this.multiplier !== ticket.multiplier) {
        const multiplier = this.multiplier = ticket.multiplier;
        this.setMultiplierToState({ multiplier });
      }

      ticket.isComplete = true;

      return ticket;
    },
    updateField (count, field) {
      this.$data[field].count = count;

      this.createTickets(this.tickets.count);
    },
    setNumbers (count) {
      const ints = [];

      for (let i = 0; i < 30; i++) {
        ints.push(getRandomIntInRange(1, 20));
      }

      const uniquedInts = ints.filter(uniqueArray);
      return uniquedInts.slice(0, count);
    },
    /**
     * Возвращаем множитель для опредлелённого поля.
     * C из n по k сочетаний.
     * */
    getMultiplier (count) {
      const n = factorial(count);
      const k = factorial(this.minFieldLength);
      let m = count - this.minFieldLength;
      // Если (n-k) равно нулю, то приводим его к 1(единице), т.к. 0! = 1! = 1.
      m = m === 0 ? 1 : m;

      const remaining = factorial(m);

      return n / (k * remaining);
    }
  },
  mounted () {
    if (this.$route.query.tickets_amount) {
      this.tickets.count = Number(this.$route.query.tickets_amount);
    }
    this.createTickets(this.tickets.count);
    this.resetAndCloseMultiplier();
  }
};
</script>

<style lang="scss">
@use 'multiTicket';
</style>
