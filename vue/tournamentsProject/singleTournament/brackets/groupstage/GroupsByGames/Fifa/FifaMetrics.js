import _ from 'lodash';

/**
 * Собираем метрики по партисипантам:
 * - кол-во выиграных матчей
 * - кол-во проиграных матчей
 * - кол-во ничьих
 * - кол-во очков
 *
 * */
export default class FifaMetrics {
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
        let finishedMatches = this.getFinishedMatches();
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
                winning: 0,
                winningBetween: 0,
                loses: 0,
                ties: 0,
                score: 0,
                totalMatches: 0
            }, {
                id: match.attributes.participantable_second_id,
                winning: 0,
                winningBetween: 0,
                loses: 0,
                ties: 0,
                score: 0,
                totalMatches: 0
            });
        })

        this.participants = _.uniqBy(this.participants, 'id');
        this.participants = this.participants.filter(p => p.id !== null);
    }

    /**
     * Мутируем объекты партисипантов, которые сконфигурировали в методе setParticipants
     * Добавляем туда реальные метрики исходя из сыгранных матчей
     * */
    getMetricsFromMatch(match) {
        let p_1 = this.participants.find(p => p.id === match.attributes.participantable_first_id);
        let p_2 = this.participants.find(p => p.id === match.attributes.participantable_second_id);

        switch (true) {
            case match.attributes.first_score > match.attributes.second_score:
                p_1.winning++;
                p_1.score += 3;
                p_2.loses++;
                break;
            case match.attributes.first_score < match.attributes.second_score:
                p_2.winning++;
                p_2.score += 3;
                p_1.loses++;
                break;
            default:
                p_1.ties++;
                p_1.score += 1;
                p_2.ties++;
                p_2.score += 1;
        }

        p_1.totalMatches = p_1.winning + p_1.loses + p_1.ties;
        p_2.totalMatches = p_2.winning + p_2.loses + p_2.ties;
    }

    /**
     * Возвращает завершенные матчи
     * */
    getFinishedMatches() {
        return this.matches.filter(match => match.attributes.status === 'finished');
    }

}

