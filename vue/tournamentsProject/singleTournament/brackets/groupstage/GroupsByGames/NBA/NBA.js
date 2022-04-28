import NbaMetrics from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NBA/NbaMetrics";
import Mapper from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NBA/Sort/Mapper";
import _ from "lodash";

export default class NBA {
    constructor(matchesOfGroup) {
        this.matches = matchesOfGroup;
        this.participants = (new NbaMetrics(this.matches)).getParticipantsWithMetrics();
    }

    getSortedParticipants() {
        this.participants.sort((a,b) => b.winsPercent - a.winsPercent);
        let participantsGroupedByPoints = this.groupingParticipantsByScore();

        return this.sortGroupingParticipants(participantsGroupedByPoints);
    }

    sortGroupingParticipants(groupedParticipants) {
        let result = [];

        groupedParticipants.map(group => {
            result = result.concat((new Mapper(group, this.matches)).sort());
        })

        return result;
    }

    /**
     * Групируем участников по процентам побед
     * */
    groupingParticipantsByScore() {
        let participantsGroupedByPoints = _.groupBy(this.participants, (item) => (item.winsPercent * 10))
        let groups = [];

        for (let key in participantsGroupedByPoints) {
            groups.push(participantsGroupedByPoints[key]);
        }

        groups.reverse();
        return groups

    }
}