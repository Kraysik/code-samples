import CommonSorting from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NHL/Sort/CommonSorting";
import NhlSortInLeague from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NHL/Sort/NhlSortInLeague";
import _ from 'lodash';
import store from "@/Vuex/store";
import SortService from "@/helpers/ServiceClasses/SortService";


export default class NhlSortingTwo extends CommonSorting {
    constructor(groupedParticipants, groupMatches) {
        super(groupedParticipants, groupMatches);
        this.group = groupedParticipants;
        this.matches = groupMatches;
    }

    getSortedParticipants() {
        if (store.getters.TOURNAMENT.attributes.settings.round_robin.countOfGroups === 1) {
            return (new NhlSortInLeague(this.group, this.matches)).sortLeague();
        }

        return this.sortParticipants();
    }

    sortParticipants() {
        this.setSortingMetricsForTwo();

        let sortedGroup = _.orderBy(this.group,
            ['score', 'winsByMainTime', 'winsByMainAndOver', 'winning', 'personalPoints', 'diffGoals', 'goals', 'id'],
            ['desc', 'desc', 'desc', 'desc', 'desc', 'desc', 'desc', 'asc']);

        return sortedGroup;
    }

    setSortingMetricsForTwo() {
        this.addPointsInPersonal();
        this.addDiffGoalsInPersonal();
        this.addGoals();
        this.addDiffAngConcededGoals();
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

    addDiffGoalsInPersonal() {
        let f_id = this.group[0].id,
            s_id = this.group[1].id;

        let fDiff = 0,
            sDiff = 0;

        let matches = SortService.getPersonalMatches(f_id, s_id, this.matches);

        matches.map(match => {
            let fScore = match.rounds.attributes.first_score,
                sScore = match.rounds.attributes.second_score;

            for (let i = 0; i < fScore.length; i++) {
                fDiff += (fScore[i] - sScore[i]);
                sDiff += (sScore[i] - fScore[i]);
            }
        });

        this.group[0].personalDiff = fDiff;
        this.group[1].personalDiff = sDiff;
    }
}

