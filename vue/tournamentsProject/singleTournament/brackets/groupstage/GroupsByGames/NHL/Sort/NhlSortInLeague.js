import NhlSortingMoreTwo from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NHL/Sort/NhlSortingMoreTwo";
import CommonSorting from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NHL/Sort/CommonSorting";

export default class NhlSortInLeague extends CommonSorting{
    constructor(groupedParticipants, groupMatches) {
        super(groupedParticipants, groupMatches);
        this.group = groupedParticipants;
        this.matches = groupMatches;
    }

    sortLeague() {
        return (new NhlSortingMoreTwo(this.group, this.matches)).getSortedParticipants();
    }
}