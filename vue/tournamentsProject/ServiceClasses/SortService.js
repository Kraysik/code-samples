import _ from "lodash";

/**
 * Сервисный класс с методами для сортировки участников групповых этапов
 * */
export default class SortService {
    /**
     * Возвращает завершенные матчи
     *
     * @param matches - матчи, из которых надо выделить завершенные
     * */
    static getFinishedMatches(matches) {
        return matches.filter(match => match.attributes.status === 'finished');
    }

    /**
     * Получаем кол-во очков, выигрышей, проигрышей для партисипантов из раунда
     *
     * @param f_score - очки первого участника
     * @param s_score - очки второго участника
     * @param w_points - кол-во очков за победу
     * @param l_points - кол-во очков за проигрыш
     * */
    static getParticipantsScoreInRound(f_score, s_score, w_points, l_points) {
        let points= {
            f_points: 0,
            s_points: 0,
            f_winning: 0,
            f_looses: 0,
            s_winning: 0,
            s_looses: 0
        };

        if (Number(f_score) > Number(s_score)) {
            points.f_points = w_points;
            points.s_points = l_points;
            points.f_winning++
            points.s_looses++
        }
        if (Number(f_score) < Number(s_score)) {
            points.f_points = l_points;
            points.s_points = w_points;
            points.s_winning++
            points.f_looses++
        }

        return points;
    }

    /**
     * Собираем матчи между двумя конкретными участниками
     *
     * @param f_id - первый участник
     * @param s_id - второй участник
     * @param matches - список матчей группы
     * */
    static getPersonalMatches(f_id, s_id, matches) {
        f_id = Number(f_id);
        s_id = Number(s_id);

        return matches.filter(match => {
            let first_id = Number(match.attributes.participantable_first_id);
            let second_id = Number(match.attributes.participantable_second_id);

            return (first_id === f_id && second_id === s_id) || (first_id === s_id && second_id === f_id);
        });
    }

    /**
     * Собираем матчи для конкретного участника
     *
     * @param participant_id - id участника
     * @param matches - матчи группы
     * */
    static getMatchesForParticipant(participant_id, matches) {
        participant_id = Number(participant_id);
        let finishedMatches = this.getFinishedMatches(matches);

        return finishedMatches.filter(match => {
            return (Number(match.attributes.participantable_first_id) === participant_id) || (Number(match.attributes.participantable_second_id) === participant_id)
        });
    }

    /**
     * Собираем забитые участником голы
     *
     * @param participant - участник, для которого нужно собрать голы
     * @param matches - матчи группы
     * */
    static getGoalsForParticipant(participant, matches) {
        let goals = 0;

        let participantMatches = this.getMatchesForParticipant(participant.id, matches);

        participantMatches.map(match => {
            let score = Number(match.attributes.participantable_first_id) === Number(participant.id) ? 'first_score' : 'second_score';

            match.rounds.attributes[score].map(value => goals += Number(value));
        });

        return goals;
    }

    /**
     * Собираем разницу голов участника и кол-во пропуцщеных гоглов участника
     * */
    static getDiffAndConcededGoalsForParticipant(participant, matches) {
        let goalsConceded = 0,
            goals = 0;

        let participantMatches = SortService.getMatchesForParticipant(participant.id, matches);

        participantMatches.map(match => {
            let enemyScore = Number(match.attributes.participantable_first_id) === Number(participant.id) ? 'second_score' : 'first_score';
            let myScore = Number(match.attributes.participantable_first_id) === Number(participant.id) ? 'first_score' :  'second_score';

            match.rounds.attributes[enemyScore].map(value => goalsConceded += Number(value));
            match.rounds.attributes[myScore].map(value => goals += Number(value));
        });

        return {
            goalsConceded,
            diffGoals: goals - goalsConceded
        };
    }

    /**
     * Находим матчи, между участниками данной группе(группа = участники, сгруппированные по очкам или другому признаку)
     * @param ids - индексы участников группы матчей
     * @param matches - матчи, из которых нам надо собрать матчи между участниками
     *
     * @return totalMatches - массив матчей, между переданными участниками
     * */
    static getMatchesBetweenGroupParticipants(ids, matches) {
        let totalMatches = [];

        for (let i = 0; i < ids.length; i++) {
            for (let j = 0; j < ids.length; j++) {
                totalMatches = totalMatches.concat(SortService.getPersonalMatches(ids[i], ids[j], matches))
            }
        }

        totalMatches = _.uniqBy(totalMatches, 'id');

        return totalMatches;
    }

}
