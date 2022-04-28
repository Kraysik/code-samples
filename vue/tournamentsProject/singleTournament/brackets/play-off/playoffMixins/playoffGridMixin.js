import {mapGetters} from "vuex";
import setVictoryOnPoints from "@/helpers/setVictoryOnPoints";
import {log} from "three";

export const playoffGridMixin = {
    data() {
        return {
            highlightedPlayer: null
        }
    },
    computed: {
        ...mapGetters([
            'TOURNAMENT',
            'GET_PLAYOFF',
            'GET_PO_REQ',
            'PARTICIPANTS'
        ]),

        getGroupParticipants() {
            let participants = []

            for (const key in this.GET_PLAYOFF) {
                this.GET_PLAYOFF[key].participants.map(item => {
                    this.PARTICIPANTS.map(participant => {
                        if (Number(participant.id) === Number(item)) {
                            participants.push(participant)
                        }
                    })
                })
            }
            return participants;
        },
    },
    methods: {
        createColumn(grid) {
            let colPairs = {};

            for (let key in this.GET_PLAYOFF[grid].matches) {
                let matches = this.GET_PLAYOFF[grid].matches[key];
                matches.map(item => {
                    if (colPairs[key] === undefined) {
                        colPairs[key] = []
                    }

                    let pair = this.formingMatchStructure(item)

                    colPairs[key].push(pair)
                })
            }

            return colPairs
        },

        formingMatchStructure(match) {
            let firstParticipant;
            let secondParticipant;

            const emptyParticipant = {
                id: '',
                type: 'teams',
                empty: true,
                attributes: {
                    name: 'TBA',
                },
                winner: null
            }

            if (match.attributes.participantable_first_id === null) {
                firstParticipant = emptyParticipant
            } else {
                firstParticipant = this.getParticipantInfo(match.attributes.participantable_first_id);
            }
            if (match.attributes.participantable_second_id === null) {
                secondParticipant = emptyParticipant
            } else {
                secondParticipant = this.getParticipantInfo(match.attributes.participantable_second_id);
            }

            return {
                match_id: match.id,
                next_match_id: match.attributes.nextMatch,
                status: match.attributes.status,
                depth: match.attributes.depth,
                player1: {
                    id: firstParticipant.id,
                    name: firstParticipant.type === 'teams' ? firstParticipant.attributes.name : firstParticipant.attributes.login,
                    winner: this.isWinner(match) === Number(firstParticipant.id),
                    logo: firstParticipant.attributes.logo,
                    empty: firstParticipant.empty ? firstParticipant.empty : false,
                    score: match.rounds.attributes['first_score'],
                    victoryOnPoints: setVictoryOnPoints(match, 'first')
                },
                player2: {
                    id: secondParticipant.id,
                    name: secondParticipant.type === 'teams' ? secondParticipant.attributes.name : secondParticipant.attributes.login,
                    winner: this.isWinner(match) === Number(secondParticipant.id),
                    logo: secondParticipant.attributes.logo,
                    empty: secondParticipant.empty ? secondParticipant.empty : false,
                    score: match.rounds.attributes['second_score'],
                    victoryOnPoints: setVictoryOnPoints(match, 'second')
                },
                rounds: match.rounds,
            };
        },

        sortedColumn(grid) {
            let columns = this.createColumn(grid);

            const sortingMatchInColumn = (currentCol, parentCol) => {
                let result = [];
                if (parentCol === null) {
                    return currentCol;
                }

                parentCol.map(parent => {
                    currentCol.filter(item => {
                        return Number(item.next_match_id) === Number(parent.match_id)
                    })
                        .sort((a, b) => Number(b.match_id) - Number(a.match_id))
                        .map(item => result.push(item));
                })

                return result;


            }

            let parentCol = null;
            let resultColumns = {}
            for (let key in columns) {
                parentCol = sortingMatchInColumn(columns[key], parentCol);
                resultColumns[key] = parentCol
            }

            this.otherThingsWithColumns(resultColumns)

            return resultColumns;
        },

        otherThingsWithColumns(resultColumns) {

        },

        isThirdPlaceMatch(column, matchId) {
            return String(column[0].next_match_id) !== String(matchId)
        },

        getThirdPlaceMatch() {
            let matches = this.GET_PLAYOFF.upper_grid.matches
            let matchesDepth_0 = matches[0];
            let matchesDepth_1 = matches[1];

            return matchesDepth_0.filter(match => {
                for (let i = 0; i < matchesDepth_1.length; i++) {
                    if (String(matchesDepth_1[i].attributes.nextMatch) !== String(match.id)) {
                        return true
                    }
                }
                return false
            })[0]
        },

        setThirdPlace() {

        },

        createRounds(pairs) {
            let rounds = [];

            for (let key in pairs) {
                let games = pairs[key];
                rounds.push({games})
            }

            return rounds.reverse()
        },

        setRounds(grid) {
            if (this.GET_PO_REQ) {
                return false;
            }

            let pairs = this.sortedColumn(grid)

            this.setThirdPlace()

            let rounds = this.createRounds(pairs);

            if (grid === 'lower_grid') {
                rounds = this.deleteAllLastMatchesIfTechnical(rounds);
            }

            this.setStagesIndexes(grid, rounds);

            return rounds;
        },

        getParticipantInfo(id) {
            return this.PARTICIPANTS.find(item => Number(item.id) === Number(id))
        },

        isWinner(match) {
            switch (true) {
                case Number(match.attributes.first_score) > Number(match.attributes.second_score):
                    return match.attributes.participantable_first_id;
                case Number(match.attributes.first_score) < Number(match.attributes.second_score):
                    return match.attributes.participantable_second_id;
                default:
                    return 0
            }

        },

        highlightPlayers(event) {
            this.highlightedPlayer = event.detail.playerId;
            let players = [...document.querySelectorAll(`[data-player-id="${this.highlightedPlayer}"]`)];
            players.map(player => player.classList.add('highlight'));
        },

        unHighlightPlayers() {
            let players = [...document.querySelectorAll(`[data-player-id="${this.highlightedPlayer}"]`)];
            players.map(player => player.classList.remove('highlight'));
            this.highlightedPlayer = null;
        },

        createHighlightEvents() {
            window.addEventListener('onSelectedPlayer', this.highlightPlayers);
            window.addEventListener('onDeselectedPlayer', this.unHighlightPlayers);
        },

        removeHighlightEvents() {
            window.removeEventListener('onSelectedPlayer', this.highlightPlayers);
            window.removeEventListener('onDeselectedPlayer', this.unHighlightPlayers);
        },

        /**
         * Собираем индексы этапов плей офф для каждой отдельной сетки.
         * Это нужно, чтобы корректно отобразить стадию в шапке плей-офф
         *
         * @param stages - массив этапов плей-офф.
         *
         * На выходе получаем массив индексов от большего к меньшему
         * */
        getStagesIndexes(stages) {
            let indexes = [];

            for (let i = 0; i < stages.length; i++) {
                indexes.push(i);
            }

            return indexes.reverse();
        },

        /**
         * Записываем в data массив с индексами для конкретной сетки.
         *
         * @param grid - тип сетки, например: 'upper_grid'
         * @param stages - этапы плей-офф
         * */
        setStagesIndexes(grid, stages) {
            switch (grid) {
                case 'upper_grid':
                    this.upperRoundsIndexes = this.getStagesIndexes(stages);
                    break;
                case 'lower_grid':
                    this.lowerRoundsIndexes = this.getStagesIndexes(stages);
                    break;
                default:
                    break;
            }
        },

        /**
         * Удаляем все последние матчи, если они все технические.
         *
         * Это нужно, что бы визуально сетка выглядела приятно и без лишних раундов в заголовках.
         *
         * @param rounds - массив с играми и матчами типа:
         * rounds = [{games: [ ** Массив с матчами раунда(столбца сетки) ** ]} ... {games: [...]}]
         * */
        deleteAllLastMatchesIfTechnical(rounds) {
            let isAllTechnical = false;
            let notTechnicalMatches = rounds[0].games.filter(match => match.status !== 'technical');

            notTechnicalMatches.length ? isAllTechnical = false : isAllTechnical = true;

            if (isAllTechnical) {
                rounds.splice(0, 1);
            }

            return rounds;
        }
    },
    mounted() {
        this.createHighlightEvents();
    },
    destroyed() {
        this.removeHighlightEvents();
    }
}
