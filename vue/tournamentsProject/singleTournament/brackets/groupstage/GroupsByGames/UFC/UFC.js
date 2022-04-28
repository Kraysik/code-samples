import Mapper from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/UFC/Sort/Mapper";
import _ from "lodash";
import UfcMetrics from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/UFC/UfcMetrics";

export default class UFC {
    constructor(matchesOfGroup) {
        this.matches = matchesOfGroup;
        this.participants = (new UfcMetrics(this.matches)).getParticipantsWithMetrics();
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