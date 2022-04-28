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

        for (let i = 0; i < match.rounds.attributes.etc.typeWin.length; i ++) {
            let win_type = match.rounds.attributes.etc.typeWin[i];

            switch (win_type) {
                case 'main_time':
                    let main_scores = SortService.getParticipantsScoreInRound(match.rounds.attributes.first_score[i], match.rounds.attributes.second_score[i], 2, 0);

                    firstScore += main_scores.f_points;
                    secondScore += main_scores.s_points;

                    break;
                case 'bullet_time':
                    let bullet_scores = SortService.getParticipantsScoreInRound(match.rounds.attributes.first_score[i], match.rounds.attributes.second_score[i], 2, 1);

                    firstScore += bullet_scores.f_points;
                    secondScore += bullet_scores.s_points;

                    break;
                case 'over_time':
                    let over_scores = SortService.getParticipantsScoreInRound(match.rounds.attributes.first_score[i], match.rounds.attributes.second_score[i], 2, 1);

                    firstScore += over_scores.f_points;
                    secondScore += over_scores.s_points;

                    break;
                default:
                    break;
            }
        }


        return target_id === f_id ? firstScore : secondScore;
    }
}
