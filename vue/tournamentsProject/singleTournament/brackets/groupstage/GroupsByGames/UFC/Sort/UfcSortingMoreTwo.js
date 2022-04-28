import CommonSorting from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/UFC/Sort/CommonSorting";
import _ from "lodash";

export default class UfcSortingMoreTwo extends CommonSorting{
    constructor(groupedParticipants, groupMatches) {
        super(groupedParticipants, groupMatches);

        this.group = groupedParticipants;
        this.matches = groupMatches;
    }

    getSortedParticipants() {
        // this.setSortingMetricsForMoreTwo();

        let sortedGroup = _.orderBy(this.group,
            ['score', 'ko', 'winning', 'id'],
            ['desc', 'desc', 'desc', 'asc']);

        return sortedGroup;
    }
}