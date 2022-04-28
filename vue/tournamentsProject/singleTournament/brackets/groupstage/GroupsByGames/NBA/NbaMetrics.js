import _ from 'lodash';
import SortService from "@/helpers/ServiceClasses/SortService";

/**
 * Собираем метрики по партисипантам:
 * - кол-во выиграных матчей
 * - кол-во проиграных матчей
 * - кол-во ничьих
 * - кол-во очков
 *
 * */
export default class NbaMetrics {
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
                roundsCount: 0,
                winning: 0,
                loses: 0,
                goals: 0,
                goalsConceded: 0,
                winsPercent: 0,
                score: 0
            }, {
                id: match.attributes.participantable_second_id,
                totalMatches: 0,
                roundsCount: 0,
                winning: 0,
                loses: 0,
                goals: 0,
                goalsConceded: 0,
                winsPercent: 0,
                score: 0
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

        for (let i = 0; i < match.rounds.attributes.first_score.length; i++) {
            p_1.roundsCount++;
            p_2.roundsCount++;

            switch (true) {
                case Number(match.rounds.attributes.first_score[i]) > Number(match.rounds.attributes.second_score[i]):
                    p_1.winning++;
                    p_1.score += 2;
                    p_2.loses++;
                    break;
                case Number(match.rounds.attributes.first_score[i]) < Number(match.rounds.attributes.second_score[i]):
                    p_2.winning++;
                    p_2.score += 2;
                    p_1.loses++;
                    break;
                default:
                    break;
            }
        }

        p_1.totalMatches = SortService.getMatchesForParticipant(p_1.id, this.matches).length;
        p_2.totalMatches = SortService.getMatchesForParticipant(p_2.id, this.matches).length;

        //TODO добавить каунтер сыграных раундов, что бы корректно считать процент побед
        p_1.winsPercent = Number(((100 / p_1.roundsCount) * p_1.winning).toFixed(1));
        p_2.winsPercent = Number(((100 / p_2.roundsCount) * p_2.winning).toFixed(1));

    }

}

