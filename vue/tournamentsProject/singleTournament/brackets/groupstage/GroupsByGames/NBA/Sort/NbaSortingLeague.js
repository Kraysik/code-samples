import CommonSorting
    from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NBA/Sort/CommonSorting";
import NbaSortingMoreTwo
    from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NBA/Sort/NbaSortingMoreTwo";


export default class NbaSortingLeague extends CommonSorting {
    constructor(groupedParticipants, groupMatches) {
        super(groupedParticipants, groupMatches);
        this.group = groupedParticipants;
        this.matches = groupMatches;
    }

    sortLeague() {
        return (new NbaSortingMoreTwo(this.group, this.matches)).getSortedParticipants();
    }
}