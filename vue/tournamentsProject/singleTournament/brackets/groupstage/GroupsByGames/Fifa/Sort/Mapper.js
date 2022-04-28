import FifaSortingTwo from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/Fifa/Sort/FifaSortingTwo";
import FifaSortingMoreTwo from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/Fifa/Sort/FifaSortingMoreTwo";


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
                return (new FifaSortingTwo(this.group, this.matches)).getSortedParticipants();
            default:
                return (new FifaSortingMoreTwo(this.group, this.matches)).getSortedParticipants();
        }
    }
}