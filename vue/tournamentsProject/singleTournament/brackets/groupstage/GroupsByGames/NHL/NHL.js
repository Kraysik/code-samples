import NhlMetrics from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NHL/NhlMetrics";
import _ from "lodash";
import Mapper from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NHL/Sort/Mapper";

export default class NHL {
    constructor(matchesOfGroup) {
        this.matches = matchesOfGroup;
        this.participants = (new NhlMetrics(this.matches)).getParticipantsWithMetrics();
    }

    getSortedParticipants() {
        this.participants.sort((a,b) => b.score - a.score);
        let participantsGroupedByPoints = this.groupingParticipantsByScore(this.participants);

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
     * Групируем участников по набраным очкам
     * */
    groupingParticipantsByScore(participants) {
        let participantsGroupedByPoints = _.groupBy(participants, (item) => item.score)
        let groups = [];

        for (let key in participantsGroupedByPoints) {
            groups.push(participantsGroupedByPoints[key]);
        }

        groups.reverse();
        return groups

    }
}