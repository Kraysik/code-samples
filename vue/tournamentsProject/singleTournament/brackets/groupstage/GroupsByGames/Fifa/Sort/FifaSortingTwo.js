import CommonSorting from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/Fifa/Sort/CommonSorting";
import FifaSortInLeague from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/Fifa/Sort/FifaSortInLeague";
import _ from 'lodash';
import store from "@/Vuex/store";
import SortService from "@/helpers/ServiceClasses/SortService";


export default class FifaSortingTwo extends CommonSorting {
    constructor(groupedParticipants, groupMatches) {
        super(groupedParticipants, groupMatches);
        this.group = groupedParticipants;
        this.matches = groupMatches;
    }

    getSortedParticipants() {
        if (store.getters.TOURNAMENT.attributes.settings.round_robin.countOfGroups === 1) {
            return (new FifaSortInLeague(this.group, this.matches)).sortLeague();
        }

        return this.sortParticipants();
    }

    sortParticipants() {
        this.setSortingMetricsForTwo();

        let sortedGroup = _.orderBy(this.group,
            ['personalPoints', 'personalDiff', 'diffGoals', 'goals', 'id'],
            ['desc', 'desc', 'desc', 'desc', 'asc']);

        return sortedGroup;
    }

    setSortingMetricsForTwo() {
        this.addPointsInPersonal();
        this.addDiffGoalsInPersonal();
        this.addGoals();
        this.addDiffGoals();
    }

    addPointsInPersonal() {
        let f_id = this.group[0].id,
            s_id = this.group[1].id;

        let matches = SortService.getPersonalMatches(f_id, s_id, this.matches);

        this.group[0].personalPoints = 0;
        this.group[1].personalPoints = 0;

        matches.map(match => {
            let firstScore = match.attributes.first_score;
            let secondScore = match.attributes.second_score;

            let f_p = match.attributes.participantable_first_id;
            let s_p = match.attributes.participantable_second_id;

            let fPoint = this.getPointsForParticipantInMatch(f_p, s_p, firstScore, secondScore, f_id);
            let sPoint = this.getPointsForParticipantInMatch(f_p, s_p, firstScore, secondScore, s_id);

            this.group[0].personalPoints += fPoint;
            this.group[1].personalPoints += sPoint;
        })

        // return group;
    }

    addDiffGoalsInPersonal() {
        let f_id = null,
            s_id = null;

        let fDiff = 0,
            sDiff = 0;

        let matches = SortService.getPersonalMatches(this.group[0].id, this.group[1].id, this.matches);

        matches.map(match => {
            f_id = match.attributes.participantable_first_id;
            s_id = match.attributes.participantable_second_id;

            let fScore = match.rounds.attributes.first_score,
                sScore = match.rounds.attributes.second_score;

            for (let i = 0; i < fScore.length; i++) {
                fDiff += (fScore[i] - sScore[i]);
                sDiff += (sScore[i] - fScore[i]);
            }
        });

        this.group[0].personalDiff = this.group[0].id === f_id ? fDiff : sDiff;
        this.group[1].personalDiff = this.group[1].id === s_id ? sDiff : fDiff;
    }
}

