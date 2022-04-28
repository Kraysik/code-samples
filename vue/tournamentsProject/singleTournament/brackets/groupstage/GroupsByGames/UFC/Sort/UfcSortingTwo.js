import CommonSorting from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/UFC/Sort/CommonSorting";
import store from "@/Vuex/store";
import _ from "lodash";
import SortService from "@/helpers/ServiceClasses/SortService";
import UfcSortInLeague from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/UFC/Sort/UfcSortInLeague";

export default class UfcSortingTwo extends CommonSorting{
    constructor(groupedParticipants, groupMatches) {
        super(groupedParticipants, groupMatches);

        this.group = groupedParticipants;
        this.matches = groupMatches;
    }

    getSortedParticipants() {
        if (store.getters.TOURNAMENT.attributes.settings.round_robin.countOfGroups === 1) {
            return (new UfcSortInLeague(this.group, this.matches)).sortLeague();
        }

        return this.sortParticipants();
    }

    sortParticipants() {
        this.setSortingMetricsForTwo();

        let sortedGroup = _.orderBy(this.group,
            ['score', 'ko', 'personalPoints', 'id'],
            ['desc', 'desc', 'desc', 'asc']);

        return sortedGroup;
    }

    setSortingMetricsForTwo() {
        this.addPointsInPersonal();
    }

    addPointsInPersonal() {
        let f_id = this.group[0].id,
            s_id = this.group[1].id;

        let matches = SortService.getPersonalMatches(f_id, s_id, this.matches);

        this.group[0].personalPoints = 0;
        this.group[1].personalPoints = 0;

        matches.map(match => {

            let fPoint = this.getPointsForParticipantInMatch(match, f_id, s_id, f_id);
            let sPoint = this.getPointsForParticipantInMatch(match, f_id, s_id, s_id);

            this.group[0].personalPoints += fPoint;
            this.group[1].personalPoints += sPoint;
        })

    }
}
