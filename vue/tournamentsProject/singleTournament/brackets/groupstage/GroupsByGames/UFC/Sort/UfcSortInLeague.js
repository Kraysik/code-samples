import CommonSorting from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/UFC/Sort/CommonSorting";
import UfcSortingMoreTwo from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/UFC/Sort/UfcSortingMoreTwo";

export default class UfcSortInLeague extends CommonSorting {
    constructor(groupedParticipants, groupMatches) {
        super(groupedParticipants, groupMatches);

        this.group = groupedParticipants;
        this.matches = groupMatches;
    }

    sortLeague() {
        return (new UfcSortingMoreTwo(this.group, this.matches)).getSortedParticipants();
    }
}