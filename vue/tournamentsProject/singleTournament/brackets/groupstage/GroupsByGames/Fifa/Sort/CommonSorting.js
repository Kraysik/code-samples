export default class CommonSorting {
    constructor(groupedParticipants, groupMatches) {
        this.matches = groupMatches;
        this.group = groupedParticipants;
    }

    getPersonalMatches(f_id, s_id) {
        f_id = Number(f_id);
        s_id = Number(s_id);

        return this.matches.filter(match => {
            let first_id = Number(match.attributes.participantable_first_id);
            let second_id = Number(match.attributes.participantable_second_id);

            return (first_id === f_id && second_id === s_id) || (first_id === s_id && second_id === f_id);
        });
    }

    getMatchesForParticipant(participant_id) {
        participant_id = Number(participant_id);
        return this.matches.filter(match => {
            return (Number(match.attributes.participantable_first_id) === participant_id) || (Number(match.attributes.participantable_second_id) === participant_id)
        });
    }

    addGoals() {
        return this.group.map(participant => {
            participant.goals = this.getGoalsForParticipant(participant);
        });
    }

    addDiffGoals() {
        return this.group.map(participant => {
            participant.diffGoals = this.getDiffGoalsForParticipant(participant).diffGoals
        });
    }

    getGoalsForParticipant(participant) {
        let goals = 0;

        let matches = this.getMatchesForParticipant(participant.id);

        matches.map(match => {
            let score = Number(match.attributes.participantable_first_id) === Number(participant.id) ? 'first_score' : 'second_score';

            match.rounds.attributes[score].map(value => goals += Number(value));
        });

        return goals;
    }

    getDiffGoalsForParticipant(participant) {
        let goalsConceded = 0;

        let matches = this.getMatchesForParticipant(participant.id);

        matches.map(match => {
            let enemyScore = Number(match.attributes.participantable_first_id) === Number(participant.id) ? 'second_score' : 'first_score';

            match.rounds.attributes[enemyScore].map(value => goalsConceded += Number(value));
        });

        return {
            goalsConceded,
            diffGoals: Number(participant.goals) - Number(goalsConceded)
        };
    }

    getPointsForParticipantInMatch(f_id, s_id, first_score, second_score, target_id) {
        f_id = Number(f_id);
        s_id = Number(s_id);
        first_score = Number(first_score);
        second_score = Number(second_score);
        target_id = Number(target_id);


        if (!(f_id === target_id || s_id === target_id)) {
            throw new Error('getPointsForParticipantInMatch -> target_id is wrong');
        }

        let firstScore = 0,
            secondScore = 0;

        switch (true) {
            case first_score > second_score:
                firstScore += 3;
                break;
            case first_score < second_score:
                secondScore += 3;
                break;
            default:
                firstScore++;
                secondScore++;
                break;
        }

        return target_id === f_id ? firstScore : secondScore;
    }
}