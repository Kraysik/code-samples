import {mapGetters} from "vuex";

export const commonScoreMixin = {
    computed: {
        ...mapGetters([
            'COMPOSITIONS',
            'MATCH',
            'USER',
            'uIsAdmin'
        ]),
        headText() {
            switch (true) {
                case this.MATCH.data.attributes.status !== 'started':
                    return 'Счет'
                case this.USER.attributes.role === 'admin':
                    return 'Заполнить счёт'
                case this.uIsParticipant:
                    return 'Заполнить счёт'
                default:
                    return 'Счет'
            }
        },
        uIsParticipant() {
            if (this.MATCH.data.attributes.participantable_first_type === 'users') {
                switch (Number(this.USER.id)) {
                    case Number(this.MATCH.data.attributes.participantable_first_id):
                        return true;
                    case Number(this.MATCH.data.attributes.participantable_second_id):
                        return true;
                }

                return false
            }

            if (this.MATCH.data.attributes.participantable_first_type === 'teams') {

                for (let participant of this.getFirstComposition.players) {
                    if (Number(this.USER.id) === Number(participant.id)) {
                        return true
                    }
                }

                for (let participant of this.getSecondComposition.players) {
                    if (Number(this.USER.id) === Number(participant.id)) {
                        return true;
                    }
                }

                return false
            }

            return false;
        },
        uIsCapitan() {
            if (this.uIsParticipant) {
                for (let participant of this.getFirstComposition.players) {
                    if (Number(this.USER.id) === Number(participant.id) && participant.role === 'capitan') {
                        return true;
                    }
                }

                for (let participant of this.getSecondComposition.players) {
                    if (Number(this.USER.id) === Number(participant.id) && participant.role === 'capitan') {
                        return true;
                    }
                }

                return false;
            }

            return false;
        },
        canUChange() {
            // Если матч не завершён и юзер админ, то он может заполнить счета участников
            if (this.uIsAdmin) {
                if (window.innerWidth > 768) {
                    return true
                }
            }

            // Проверяем на заполненность раундом матча. Если что-то есть, считаем, что матч отыгран и изменять его нельзя
            if (this.MATCH.rounds.attributes.first_score.length) {
                return false
            }

            // Если матч не закончен по раундам, по времени и пользователь не админ, то проверяем на статус.
            // Если по статусу матч в процессе, то разрешаем участникам его заполнять
            if (this.MATCH.data.attributes.status !== 'started') {
                return false
            }

            switch (this.MATCH.data.attributes.participantable_first_type) {
                case 'users':
                    return this.uIsParticipant;
                case 'teams':
                    return this.uIsCapitan;
            }

            return false
        },
        getFirstComposition() {
            let composition = this.COMPOSITIONS.find(item => Number(item.participant.id) === Number(this.MATCH.data.attributes.participantable_first_id));
            composition.score = this.MATCH.rounds ? this.MATCH.rounds.attributes.first_score : null;
            return composition
        },
        getSecondComposition() {
            let composition = this.COMPOSITIONS.find(item => Number(item.participant.id) === Number(this.MATCH.data.attributes.participantable_second_id));
            composition.score = this.MATCH.rounds ? this.MATCH.rounds.attributes.second_score : null;
            return composition
        },
        isFirstWinner() {
            if (this.MATCH.data.attributes.status === 'finished') {
                if (Number(this.MATCH.data.attributes.first_score) > Number(this.MATCH.data.attributes.second_score)) {
                    return 'winner';
                }
                return 'loser'
            }
            return ''
        },
        isSecondWinner() {
            if (this.MATCH.data.attributes.status === 'finished') {
                if (Number(this.MATCH.data.attributes.first_score) < Number(this.MATCH.data.attributes.second_score)) {
                    return 'winner';
                }
                return 'loser'
            }
            return ''
        },
        getWinnerNumber() {
            if (this.MATCH.data.attributes.status === 'finished') {
                return this.isFirstWinner === 'winner' ? 'Победа 1' : 'Победа 2'
            }
            return ''
        },
        getMyNumberInMatchIfNotAdmin() {
            if (this.USER.attributes.role === 'admin') {
                return false
            }

            const number = this.getMyNumberInMatch;

            if (number.id) return number;

            return false
        },

        getMyNumberInMatch() {
            if (this.canUChange) {
                if (this.MATCH.data.attributes.participantable_first_type === 'users') {
                    if (Number(this.USER.id) === Number(this.MATCH.data.attributes.participantable_first_id)) return {
                        number: 0,
                        id: Number(this.USER.id)
                    }
                    if (Number(this.USER.id) === Number(this.MATCH.data.attributes.participantable_second_id)) return {
                        number: 1,
                        id: Number(this.USER.id)
                    }
                }

                if (this.MATCH.data.attributes.participantable_first_type === 'teams') {
                    let number = {};

                    for (let participant of this.getFirstComposition.players) {
                        if (Number(this.USER.id) === Number(participant.id)) {
                            if (participant.role === 'capitan') {
                                number = {number: 0, id: Number(this.getFirstComposition.attributes.participantable_id)}
                                break;
                            }
                        }
                    }
                    for (let participant of this.getSecondComposition.players) {
                        if (Number(this.USER.id) === Number(participant.id)) {
                            if (participant.role === 'capitan') {
                                number = {
                                    number: 1,
                                    id: Number(this.getSecondComposition.attributes.participantable_id)
                                }
                                break;
                            }
                        }
                    }
                    return number;
                }
            }

            return {
                id: null,
                number: null
            };
        },

        getMyScore() {
            return this.MATCH.scores.find(el => Number(el.attributes.participantable_id) === this.getMyNumberInMatch.id)
        },
        POV() {
            return this.USER.attributes.role
        },
    },
    methods: {
        nameInHeadTeam(composition) {
            return composition.participant.type === 'teams' ? composition.participant.attributes.name : composition.participant.attributes.login
        },

        closeScore() {
            this.$emit('close-score')
        },
    }
}
