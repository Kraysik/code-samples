import CommonSorting from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NBA/Sort/CommonSorting";
import store from "@/Vuex/store";
import NbaSortInLeague from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NBA/Sort/NbaSortingLeague";
import _ from "lodash";
import SortService from "@/helpers/ServiceClasses/SortService";

export default class NbaSortingTwo extends CommonSorting {
    constructor(groupedParticipants, groupMatches) {
        super(groupedParticipants, groupMatches)

        this.group = groupedParticipants;
        this.matches = groupMatches;
    }

    getSortedParticipants() {
        if (store.getters.TOURNAMENT.attributes.settings.round_robin.countOfGroups === 1) {
            return (new NbaSortInLeague(this.group, this.matches)).sortLeague();
        }

        return this.sortParticipants();
    }

    sortParticipants() {
        this.setSortingMetricsForTwo();

        let sortedGroup = _.orderBy(this.group,
            ['winsPercent', 'personalPoints', 'id'],
            ['desc', 'desc', 'asc']);

        return sortedGroup;
    }

    setSortingMetricsForTwo() {
        this.addPointsInPersonal();
        this.addGoals();
        this.addDiffAngConcededGoals();
    }

    addPointsInPersonal() {
        let matches = SortService.getPersonalMatches(this.group[0].id, this.group[1].id, this.matches);

        this.group[0].personalPoints = 0;
        this.group[1].personalPoints = 0;

        matches.map(match => {
            let f_id = match.attributes.participantable_first_id;
            let s_id = match.attributes.participantable_second_id;

            let fPoint = this.getPointsForParticipantInMatch(match, f_id, s_id, this.group[0].id);
            let sPoint = this.getPointsForParticipantInMatch(match, f_id, s_id, this.group[1].id);

            this.group[0].personalPoints += fPoint;
            this.group[1].personalPoints += sPoint;
        })

    }
}
