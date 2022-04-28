import SortService from "@/helpers/ServiceClasses/SortService";

export default class CommonSorting {
    constructor(groupedParticipants, groupMatches) {
        this.matches = groupMatches;
        this.group = groupedParticipants;
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
                case 'win':
                    let main_wins = SortService.getParticipantsScoreInRound(match.rounds.attributes.first_score[i], match.rounds.attributes.second_score[i], 1, 0);

                    firstScore += main_wins.f_points;
                    secondScore += main_wins.s_points;

                    break;
                case 'ko':
                    let early_wins = SortService.getParticipantsScoreInRound(match.rounds.attributes.first_score[i], match.rounds.attributes.second_score[i], 2, 0);

                    firstScore += early_wins.f_points;
                    secondScore += early_wins.s_points;

                    break;
                default:
                    break;
            }
        }


        return target_id === f_id ? firstScore : secondScore;
    }
}
