import _ from 'lodash';
import SortService from "@/helpers/ServiceClasses/SortService";

/**
 * Собираем метрики по партисипантам:
 * - кол-во выиграных матчей
 * - кол-во проиграных матчей
 * - кол-во побед в овер тайм или по булитам
 * - кол-во поражений в овер тайм или по булитам
 * - общее кол-во пораджений
 * - кол-во забитых / пропущеных голов
 * - кол-во очков
 * */
export default class NhlMetrics {
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
                winsByMainTime: 0,
                winsByOverTime: 0,
                winsByBulls: 0,
                looses: 0,
                losesByOverTimeOrBulls: 0,
                goals: 0,
                goalsConceded: 0,
                score: 0,
                winsByMainAndOver: 0
            }, {
                id: match.attributes.participantable_second_id,
                totalMatches: 0,
                winning: 0,
                winsByMainTime: 0,
                winsByOverTime: 0,
                winsByBulls: 0,
                looses: 0,
                losesByOverTimeOrBulls: 0,
                goals: 0,
                goalsConceded: 0,
                score: 0,
                winsByMainAndOver: 0
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
                case 'main_time':
                    let main_scores = SortService.getParticipantsScoreInRound(match.rounds.attributes.first_score[i], match.rounds.attributes.second_score[i], 2, 0);

                    p_1.winsByMainTime += main_scores.f_winning;
                    p_2.winsByMainTime += main_scores.s_winning;

                    p_1.score += main_scores.f_points;
                    p_2.score += main_scores.s_points;

                    p_1.looses += main_scores.f_looses;
                    p_2.looses += main_scores.s_looses;

                    break;
                case 'bullet_time':
                    let bullet_scores = SortService.getParticipantsScoreInRound(match.rounds.attributes.first_score[i], match.rounds.attributes.second_score[i], 2, 1);

                    p_1.winsByBulls += bullet_scores.f_winning
                    p_2.winsByBulls += bullet_scores.s_winning

                    p_1.score += bullet_scores.f_points;
                    p_2.score += bullet_scores.s_points;

                    p_1.losesByOverTimeOrBulls += bullet_scores.f_looses;
                    p_2.losesByOverTimeOrBulls += bullet_scores.s_looses;

                    break;
                case 'over_time':
                    let over_scores = SortService.getParticipantsScoreInRound(match.rounds.attributes.first_score[i], match.rounds.attributes.second_score[i], 2, 1);

                    p_1.winsByOverTime += over_scores.f_winning
                    p_2.winsByOverTime += over_scores.s_winning

                    p_1.score += over_scores.f_points;
                    p_2.score += over_scores.s_points;

                    p_1.losesByOverTimeOrBulls += over_scores.f_looses;
                    p_2.losesByOverTimeOrBulls += over_scores.s_looses;

                    break;
                default:
                    break;
            }
        }

        // total looses
        p_1.looses = p_1.looses + p_1.losesByOverTimeOrBulls;
        p_2.looses = p_2.looses + p_2.losesByOverTimeOrBulls;

        //total wins
        p_1.winning = p_1.winsByMainTime + p_1.winsByOverTime + p_1.winsByBulls;
        p_2.winning = p_2.winsByMainTime + p_2.winsByOverTime + p_2.winsByBulls;

        p_1.winsByMainAndOver = p_1.winsByMainTime + p_1.winsByOverTime;
        p_2.winsByMainAndOver = p_2.winsByMainTime + p_2.winsByOverTime;

        // total matches
        p_1.totalMatches = SortService.getMatchesForParticipant(p_1.id, this.matches).length;
        p_2.totalMatches = SortService.getMatchesForParticipant(p_2.id, this.matches).length;
    }

}

