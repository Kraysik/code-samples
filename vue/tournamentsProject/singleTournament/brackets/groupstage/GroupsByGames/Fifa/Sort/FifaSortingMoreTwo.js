import _ from "lodash";
import CommonSorting from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/Fifa/Sort/CommonSorting";
import SortService from "@/helpers/ServiceClasses/SortService";

export default class FifaSortingMoreTwo extends CommonSorting{
    constructor(groupedParticipants, groupMatches) {
        super(groupedParticipants, groupMatches);
        this.group = groupedParticipants;
    }

    getSortedParticipants() {
        this.setSortingMetricsForMoreTwo();


        let sortedGroup = _.orderBy(this.group,
            ['score', 'winningBetween', 'diffBetween', 'goalsBetween', 'id'],
            ['desc', 'desc', 'desc', 'desc', 'asc']);
        return sortedGroup;
    }

    /**
     * Собираем разницу голов между участниками этой группы (this.group)
     * */
    addDiffGoalsBetweenParticipants() {
        const participants_ids = this.group.map(participant => participant.id);
        const matches = SortService.getMatchesBetweenGroupParticipants(participants_ids, this.matches);

        return this.group.map(participant => {
            participant.diffBetween = SortService.getDiffAndConcededGoalsForParticipant(participant, matches).diffGoals;
            participant.goalsBetween = SortService.getDiffAndConcededGoalsForParticipant(participant, matches).goals;

        });
    }

    /**
     * Собираем кол-во побед каждого участника среди этой группы участников
     * */
    getWinningsForParticipantBetweenGroup() {
        const participants_ids = this.group.map(participant => participant.id);
        const matches = SortService.getMatchesBetweenGroupParticipants(participants_ids, this.matches);

        matches.map(match => {
            this.getWinningsFromMatch(match);
        })
    }

    /**
     * Выясняем кто из участников данной группы победил в матче и инкрементируем ему победу между участниками
     * */
    getWinningsFromMatch(match) {
        let p_1 = this.group.find(p => p.id === match.attributes.participantable_first_id);
        let p_2 = this.group.find(p => p.id === match.attributes.participantable_second_id);

        switch (true) {
            case match.attributes.first_score > match.attributes.second_score:
                p_1.winningBetween++;
                break;
            case match.attributes.first_score < match.attributes.second_score:
                p_2.winningBetween++;
                break;
            default:
                break;
        }
    }

    setSortingMetricsForMoreTwo() {
        this.addGoals();
        this.addDiffGoalsBetweenParticipants();
        this.getWinningsForParticipantBetweenGroup();
        this.addDiffGoals();
    }
}
