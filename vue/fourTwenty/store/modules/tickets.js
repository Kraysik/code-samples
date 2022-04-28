import Vue from 'vue';
import { parseTicketFields } from '@/helpers/helpers';
import { buyMultipleTickets, buyTicket } from '@/api/games';

/**
 * Объект-структура билета. Подобие интерфейса.
 * */
export const ticketStructure = {
  id: 0,
  number: 0,
  isComplete: false,
  price: 0,
  multiplier: 1,
  field_l: [],
  field_r: []
};

export default {
  state: {
    activeTicketIndex: 0,
    tickets: [
      {
        id: 0,
        number: 0,
        isComplete: false,
        price: 0,
        multiplier: 1,
        field_l: [],
        field_r: []
      }
    ],
    multiplier: {
      raw: ''
    },
    purchaseType: '',
    singleTicketPrice: 0
  },
  mutations: {
    setMultiplierToState (state, payload) {
      state.multiplier.raw = String(payload.multiplier);
    },
    /**
     * Метод обновления полей билета.
     * @param state
     * @param {object} payload - объект, с обновленными значениями.
     *
     * @param {number} payload.idx - индекс билета
     * @param {array} payload.props - массив полей для изменения
     * @param {object} payload.values - объект новых значений полей билета.
     *
     * @param payload.values.prop - пара ключ - значение, где ключом является payload.props[i].
     * */
    updateTicket (state, payload) {
      payload.props.map(prop => {
        Vue.set(state.tickets[payload.idx], prop, payload.values[prop]);
      });
    },

    setSingleTicketPrice (state, payload) {
      state.tickets.forEach(function (ticket) {
        ticket.price = payload;
      });
      ticketStructure.price = payload;
      state.singleTicketPrice = payload;
    },

    setTickets (state, payload) {
      state.tickets = payload;
    },

    setTicket (state, ticket) {
      state.tickets.push(ticket);
    },

    removeTicket (state, index) {
      state.tickets.splice(index, 1);
    },

    resetMultiplierState (state) {
      state.multiplier.raw = '';
    },

    setPurchaseType (state, type) {
      state.purchaseType = type;
    }
  },
  actions: {
    BUY_TICKETS_MANUAL ({
      commit,
      getters,
      state
    }, purchaseType) {
      const rawTickets = getters.getCompleteTickets;
      const cost = getters.getTotalSum;
      const tickets = [];

      for (let i = 0; i < rawTickets.length; i++) {
        tickets.push(parseTicketFields(rawTickets[i]));
      }

      return buyTicket({
        'purchase_type': purchaseType,
        cost,
        tickets
      });
    },

    BUY_TICKETS_BULK ({
      commit,
      getters,
      state
    }, purchaseType) {
      const tickets = getters.getCompleteTickets;
      const cost = getters.getTotalSum;
      const count = getters.getCompleteTickets.length;

      const part_1_count = parseTicketFields(tickets[0]).part_1.length;
      const part_2_count = parseTicketFields(tickets[0]).part_2.length;

      return buyMultipleTickets({
        'purchase_type': purchaseType,
        part_1_count,
        part_2_count,
        cost,
        count
      });
    },

    resetAndCloseMultiplier ({ commit }) {
      commit('resetMultiplierState');
      commit('toggleMultiplierPopup', false, { root: true });
    }
  },
  getters: {
    /**
     * Возвращает только собранные билеты.
     * Собранным считается билет, в котором каждое из полей содержит 4 и более выбранных числа.
     * */
    getCompleteTickets (state) {
      return state.tickets.filter(ticket => ticket.isComplete);
    },

    /**
     * Возвращает сумму для покупки билетов.
     * */
    getTotalSum (state, getters) {
      if (getters.getCompleteTickets.length) {
        const prices = [];
        getters.getCompleteTickets.map(ticket => prices.push(ticket.price * ticket.multiplier));
        const reducer = (prevVal, curVal) => prevVal + curVal;

        return prices.reduce(reducer);
      }

      return 0;
    }
  }
};
