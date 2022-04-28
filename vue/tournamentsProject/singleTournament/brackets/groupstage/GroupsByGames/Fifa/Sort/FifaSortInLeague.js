import FifaSortingMoreTwo from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/Fifa/Sort/FifaSortingMoreTwo";
import CommonSorting from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/Fifa/Sort/CommonSorting";

export default class FifaSortInLeague extends CommonSorting{
    constructor(groupedParticipants, groupMatches) {
        super(groupedParticipants, groupMatches);
        this.group = groupedParticipants;
        this.matches = groupMatches;
    }

    sortLeague() {
        return (new FifaSortingMoreTwo(this.group, this.matches)).getSortedParticipants();
    }
}