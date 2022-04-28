<template>
  <div class="table-row stats-row">
    <!--бои-->
    <div :data-col="`hover-col-0`"
         :class="{'active-col': payloadData.activeCol === `hover-col-0`}"
         @mouseenter="showCol"
         @mouseleave="hideCol"
         class="stats-cell">{{ payloadData.participant.totalMatches }}
    </div>
    <!--победы-->
    <div :data-col="`hover-col-1`"
         :class="{'active-col': payloadData.activeCol === `hover-col-1`}"
         @mouseenter="showCol"
         @mouseleave="hideCol"
         class="stats-cell">{{ payloadData.participant.winning }}
    </div>
    <!--досрочные победы-->
    <div :data-col="`hover-col-2`"
         :class="{'active-col': payloadData.activeCol === `hover-col-2`}"
         @mouseenter="showCol"
         @mouseleave="hideCol"
         class="stats-cell">{{ payloadData.participant.ko }}
    </div>
    <!--поражения-->
    <div :data-col="`hover-col-3`"
         :class="{'active-col': payloadData.activeCol === `hover-col-3`}"
         @mouseenter="showCol"
         @mouseleave="hideCol"
         class="stats-cell">{{ payloadData.participant.looses }}
    </div>
    <!--очки-->
    <div :data-col="`hover-col-4`"
         :class="{'active-col': payloadData.activeCol === `hover-col-4`}"
         @mouseenter="showCol"
         @mouseleave="hideCol"
         class="stats-cell">{{ payloadData.participant.score }}
    </div>
  </div>
</template>

<script>

export default {
  name: "ufc-group-schedule-row",
  props: {
    participant: {},
    payloadData: {
      type: Object
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      rout_name: '',
    }
  },
  computed: {
  },
  methods: {
    getRoutName() {
      this.rout_name = this.payloadData.participant.type === 'teams' ? 'team.name' : 'another-profile'
    },
    showCol(event) {
      this.$emit('catchActiveCol', event.target.dataset.col)
    },
    hideCol() {
      this.activeCol = ''
    },
  },
  mounted() {
    this.getRoutName();
  }
}
</script>

<style scoped>

</style>