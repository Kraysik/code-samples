import CommonSorting from "@/components/tournaments/singleTournament/brackets/groupstage/GroupsByGames/NBA/Sort/CommonSorting";

/**
 * Добавляем метрики для таблицы, если больше нет пользователей с таким же счетом:
 *
 * - забитые шайбы
 * - пропущеные шайбы
 *
 * */
export default class NbaAddMetricsForSingleParticipant extends CommonSorting{
    constructor(groupedParticipant, groupMatches) {
        super(groupedParticipant, groupMatches);
        this.group = groupedParticipant;
        this.matches = groupMatches
    }

    getParticipantWithMetrics() {
        this.addGoals();
        this.addDiffAngConcededGoals();

        return this.group;
    }
}