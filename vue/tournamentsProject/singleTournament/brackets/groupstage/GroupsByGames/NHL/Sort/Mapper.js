import NhlSortingTwo from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NHL/Sort/NhlSortingTwo";
import NhlSortingMoreTwo from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NHL/Sort/NhlSortingMoreTwo";
import NhlAddMetricsForSingleParticipant
    from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NHL/Sort/NhlAddMetricsForSingleParticipant";


export default class Mapper {
    constructor(groupedParticipants, groupMatches) {
        this.group = groupedParticipants;
        this.matches = groupMatches;
    }

    sort() {
        switch(this.group.length) {
            case 1:
                return (new NhlAddMetricsForSingleParticipant(this.group, this.matches)).getParticipantWithMetrics();
            case 2:
                return (new NhlSortingTwo(this.group, this.matches)).getSortedParticipants();
            default:
                return (new NhlSortingMoreTwo(this.group, this.matches)).getSortedParticipants();
        }
    }
}