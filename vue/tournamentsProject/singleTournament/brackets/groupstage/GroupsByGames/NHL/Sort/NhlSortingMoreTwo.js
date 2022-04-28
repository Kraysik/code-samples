import _ from "lodash";
import CommonSorting from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NHL/Sort/CommonSorting";

export default class NhlSortingMoreTwo extends CommonSorting{
    constructor(groupedParticipants, groupMatches) {
        super(groupedParticipants, groupMatches);
        this.group = groupedParticipants;
    }

    getSortedParticipants() {
        this.setSortingMetricsForMoreTwo();

        let sortedGroup = _.orderBy(this.group,
            ['score', 'winsByMainTime', 'winsByMainAndOver', 'winning', 'diffGoals', 'goals', 'id'],
            ['desc', 'desc', 'desc', 'desc', 'desc', 'desc', 'asc']);

        return sortedGroup;
    }

    setSortingMetricsForMoreTwo() {
        this.addGoals();
        this.addDiffAngConcededGoals();
    }
}