import CommonSorting from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NBA/Sort/CommonSorting";
import _ from "lodash";
import SortService from "@/helpers/ServiceClasses/SortService";

export default class NbaSortingMoreTwo extends CommonSorting {
    constructor(groupedParticipants, groupMatches) {
        super(groupedParticipants, groupMatches);
        this.group = groupedParticipants;
        this.matches = groupMatches;
    }

    getSortedParticipants() {
        this.setSortingMetricsForMoreTwo();

        let sortedGroup = _.orderBy(this.group,
            ['winsPercent', 'diffBetween', 'diffGoals', 'goals', 'id'],
            ['desc', 'desc', 'desc', 'desc', 'asc']);

        return sortedGroup;
    }

    setSortingMetricsForMoreTwo() {
        this.addGoals();
        this.addDiffGoalsBetweenParticipants();
        this.addDiffGoals();
    }

    addDiffGoalsBetweenParticipants() {
        let participants_ids = this.group.map(participant => participant.id);
        let matches = SortService.getMatchesBetweenGroupParticipants(participants_ids, this.matches);

        return this.group.map(participant => {
            participant.diffBetween = SortService.getDiffAndConcededGoalsForParticipant(participant, matches).diffGoals;
        });
    }

    addDiffGoals() {
        this.group.map(participant => {
            participant.diffGoals = SortService.getDiffAndConcededGoalsForParticipant(participant, this.matches).diffGoals;
        })
    }

}
