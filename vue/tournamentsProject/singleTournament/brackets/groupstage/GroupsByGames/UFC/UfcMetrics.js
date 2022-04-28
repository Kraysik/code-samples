import SortService from "@/helpers/ServiceClasses/SortService";
import _ from "lodash";

export default class UfcMetrics {
    constructor(matches) {
        this.matches = matches;
        this.participants = [];

        this.setParticipants();
    }

    /**
     * Забираем массив с участниками, с уже высчитаными метриками
     * */
    getParticipantsWithMetrics() {
        this.setMetrics();
        return this.participants;
    }

    setMetrics() {
        let finishedMatches = SortService.getFinishedMatches(this.matches);
        finishedMatches.map(match => {
            this.getMetricsFromMatch(match)
        })
    }

    /**
     * Собраем партисипантов исходя из матчей турнира
     * */
    setParticipants() {

        this.matches.map(match => {
            this.participants.push({
                id: match.attributes.participantable_first_id,
                totalMatches: 0,
                winning: 0,
                looses: 0,
                ko: 0,
                score: 0,
            }, {
                id: match.attributes.participantable_second_id,
                totalMatches: 0,
                winning: 0,
                looses: 0,
                ko: 0,
                score: 0,
            });
        })

        this.participants = _.uniqBy(this.participants, 'id');
        this.participants = this.participants.filter(p => p.id !== null);
    }

    /**
     * Мутируем объекты партисипантов, которые сконфигурировали в методе setParticipants
     * Добавляем туда реальные метрики исходя из сыграных матчей
     * */
    getMetricsFromMatch(match) {
        let p_1 = this.participants.find(p => p.id === match.attributes.participantable_first_id);
        let p_2 = this.participants.find(p => p.id === match.attributes.participantable_second_id);

        for (let i = 0; i < match.rounds.attributes.etc.typeWin.length; i ++) {
            let win_type = match.rounds.attributes.etc.typeWin[i];

            switch (win_type) {
                case 'win':
                    let main_wins = SortService.getParticipantsScoreInRound(match.rounds.attributes.first_score[i], match.rounds.attributes.second_score[i], 1, 0);

                    p_1.winning += main_wins.f_winning;
                    p_2.winning += main_wins.s_winning;

                    p_1.score += main_wins.f_points;
                    p_2.score += main_wins.s_points;

                    p_1.looses += main_wins.f_looses;
                    p_2.looses += main_wins.s_looses;

                    break;
                case 'ko':
                    let early_wins = SortService.getParticipantsScoreInRound(match.rounds.attributes.first_score[i], match.rounds.attributes.second_score[i], 2, 0);

                    p_1.ko += early_wins.f_winning
                    p_2.ko += early_wins.s_winning

                    p_1.score += early_wins.f_points;
                    p_2.score += early_wins.s_points;

                    p_1.looses += early_wins.f_looses;
                    p_2.looses += early_wins.s_looses;

                    break;
                default:
                    break;
            }
        }

        // total matches
        p_1.totalMatches = SortService.getMatchesForParticipant(p_1.id, this.matches).length;
        p_2.totalMatches = SortService.getMatchesForParticipant(p_2.id, this.matches).length;
    }
}
