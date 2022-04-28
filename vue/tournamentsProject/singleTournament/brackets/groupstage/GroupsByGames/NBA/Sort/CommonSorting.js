import SortService from "@/helpers/ServiceClasses/SortService";

export default class CommonSorting {
    constructor(groupedParticipants, groupMatches) {
        this.matches = groupMatches;
        this.group = groupedParticipants;
    }

    addGoals() {
        return this.group.map(participant => {
            participant.goals = SortService.getGoalsForParticipant(participant, this.matches);
        });
    }

    addDiffAngConcededGoals() {
        return this.group.map(participant => {
            participant.diffGoals = SortService.getDiffAndConcededGoalsForParticipant(participant, this.matches).diffGoals;
            participant.goalsConceded = SortService.getDiffAndConcededGoalsForParticipant(participant, this.matches).goalsConceded;
        });
    }

    getPointsForParticipantInMatch(match, f_id, s_id, target_id) {
        f_id = Number(f_id);
        s_id = Number(s_id);
        target_id = Number(target_id);


        if (!(f_id === target_id || s_id === target_id)) {
            throw new Error('getPointsForParticipantInMatch -> target_id is wrong');
        }

        let firstScore = 0,
            secondScore = 0;

        for (let i = 0; i < match.rounds.attributes.first_score.length; i ++) {

            switch (true) {
                case match.rounds.attributes.first_score[i] > match.rounds.attributes.second_score[i]:
                    firstScore += 2;
                    secondScore += 1;
                    break;
                case match.rounds.attributes.first_score[i] < match.rounds.attributes.second_score[i]:
                    secondScore += 2;
                    firstScore += 1;
                    break;
                default:
                    break;
            }

        }



        return target_id === f_id ? firstScore : secondScore;
    }
}
