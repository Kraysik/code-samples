import UfcSortingTwo from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/UFC/Sort/UfcSortingTwo";
import UfcSortingMoreTwo from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/UFC/Sort/UfcSortingMoreTwo";

export default class Mapper {
    constructor(groupedParticipants, groupMatches) {
        this.group = groupedParticipants;
        this.matches = groupMatches;
    }

    sort() {
        switch(this.group.length) {
            case 1:
                return this.group;
            case 2:
                return (new UfcSortingTwo(this.group, this.matches)).getSortedParticipants();
            default:
                return (new UfcSortingMoreTwo(this.group, this.matches)).getSortedParticipants();
        }
    }
}