import NbaSortingTwo
    from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NBA/Sort/NbaSortingTwo";
import NbaSortingMoreTwo
    from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NBA/Sort/NbaSortingMoreTwo";
import NbaAddMetricsForSingleParticipant
    from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NBA/Sort/NbaAddMetricsForSingleParticipant";


export default class Mapper {
    constructor(groupedParticipants, groupMatches) {
        this.group = groupedParticipants;
        this.matches = groupMatches;
    }

    sort() {
        switch(this.group.length) {
            case 1:
                return (new NbaAddMetricsForSingleParticipant(this.group, this.matches)).getParticipantWithMetrics();
            case 2:
                return (new NbaSortingTwo(this.group, this.matches)).getSortedParticipants();
            default:
                return (new NbaSortingMoreTwo(this.group, this.matches)).getSortedParticipants();
        }
    }
}