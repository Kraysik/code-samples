import {mapActions, mapGetters, mapMutations} from "vuex";

export const matchScoreMixin = {
    data() {
        return {
            firstScore: [],
            secondScore: [],
            firstScorePoints: 0,
            secondScorePoints: 0,
            isAcceptBtn: false,
            isTextModal: false,
            readOnly: false,
            conflict_score: {
                first: {
                    scores: [],
                    enemy_scores: []
                },
                second: {
                    scores: [],
                    enemy_scores: []
                },
            },
            isScore: true,
            isSyncingLeftScroll: false,
            isSyncingRightScroll: false,
            defaultScoreMarker: ''
        }
    },
    computed: {
        ...mapGetters(['uIsAdmin'])
    },
    methods: {
        ...mapMutations([
            'SET_MAX_COUNT_OF_SCREENSHOTS',
            'SET_SCORE_ENTITY'
        ]),
        ...mapActions([
            'UPDATE_SCORES',
            'GET_MATCH_FROM_URL',
        ]),

        /**
         * Используем для составления и заполнения счетов в случаях:
         * - человек является участником, и матч не завершен
         * - человек является администратором
         * */
        setInitialScores() {
            if (this.getMyNumberInMatchIfNotAdmin) {
                // Заполняем значения счетов исходя из того, что юзер является партисипантом
                let myScore = this.MATCH.scores.find(el => Number(el.attributes.participantable_id) === Number(this.getMyNumberInMatchIfNotAdmin.id))

                if (this.setScoresAsRounds()) {
                    return false
                }

                if (this.setScoresAsMyScore(myScore)) {
                    return false
                }

                if (this.setScoresAsLocalStorage()) {
                    return false
                }

                this.firstScore = this.createScoreArr(Number(this.MATCH.rounds.attributes.number))
                this.secondScore = this.createScoreArr(Number(this.MATCH.rounds.attributes.number))
            }

            if (this.setScoresAsAdmin()) {
                return false
            }
        },

        /**
         * Заполняем счет, исходя из приходящих раундсов
         * */
        setScoresAsRounds() {
            if (this.MATCH.rounds.attributes.first_score.length) {

                const dataToCreateScores = {
                    myNumberInMatch: this.getMyNumberInMatchIfNotAdmin.number,
                    count: Number(this.MATCH.rounds.attributes.number),
                    scores: {
                        first: this.MATCH.rounds.attributes.first_score,
                        second: this.MATCH.rounds.attributes.second_score
                    },
                    winTypes: this.MATCH.rounds.attributes.etc.typeWin
                }
                this.createScores(dataToCreateScores)

                this.readOnly = true;
                return true;

            }
            return false
        },

        /**
         * Заполняем счет, как его отправил участник, если другой участник ещё не отправил
         * @param myScore Объект скора участника, который приходит с сервера
         * */
        setScoresAsMyScore(myScore) {

            if (myScore.attributes.scores.length) {

                const dataToCreateScores = {
                    myNumberInMatch: this.getMyNumberInMatchIfNotAdmin.number,
                    count: Number(this.MATCH.rounds.attributes.number),
                    scores: {
                        first: myScore.attributes.scores,
                        second: myScore.attributes.enemy_scores
                    },
                    winTypes: myScore.attributes.etc.typeWin
                }
                this.createScores(dataToCreateScores)

                this.readOnly = true;
                return true;

            }
            return false
        },

        /**
         * Заполняем счет из локального хранилища. Если игрок просто заполнял счета, но не отправлял на сервер
         * */
        setScoresAsLocalStorage() {
            if (localStorage.getItem('currentScores')) {
                let scores = JSON.parse(localStorage.getItem('currentScores'));

                this.firstScore = scores.firstScore;
                this.secondScore = scores.secondScore;
                this.checkRounds()

                return true
            }
            return false
        },

        /**
         * Заполняем счет, исходя из приходящих раундсов, если ты не участник и администратор
         * */
        setScoresAsAdmin() {
            const roundsCount = Number(this.MATCH.rounds.attributes.number);

            if (this.getMyNumberInMatchIfNotAdmin === false && this.USER.attributes.role === 'admin') {
                let firstScore = this.MATCH.scores.find(el => Number(el.attributes.participantable_id) === Number(this.getFirstComposition.attributes.participantable_id))
                let secondScore = this.MATCH.scores.find(el => Number(el.attributes.participantable_id) === Number(this.getSecondComposition.attributes.participantable_id))

                this.conflict_score.first.scores = this.createScoreArr(roundsCount, firstScore.attributes.scores, firstScore.attributes.etc.typeWin)
                this.conflict_score.first.enemy_scores = this.createScoreArr(roundsCount, firstScore.attributes.enemy_scores, secondScore.attributes.etc.typeWin)

                this.conflict_score.second.scores = this.createScoreArr(roundsCount, secondScore.attributes.scores, secondScore.attributes.etc.typeWin)
                this.conflict_score.second.enemy_scores = this.createScoreArr(roundsCount, secondScore.attributes.enemy_scores, firstScore.attributes.etc.typeWin)

                if (this.setScoresAsRounds()) {
                    this.readOnly = false;
                    this.checkRounds()

                    this.disabledItemsInScore(this.firstScore, false)
                    this.disabledItemsInScore(this.secondScore, false)
                    localStorage.removeItem('currentScores');
                    return true
                }

                this.firstScore = this.createScoreArr(roundsCount)
                this.secondScore = this.createScoreArr(roundsCount)

                return true
            }
            return false
        },

        /**
         * Составляем массивы со счетами. Из scores || rounds
         * @param dataToScores.count - кол-во раундов
         * @param dataToScores.myNumberInMatch - номер игрока в матче, первый или нет
         * @param dataToScores.scores - объект со счетами игроков
         * */
        createScores(dataToScores) {
            let numberInMatch = dataToScores.myNumberInMatch === undefined ? 0 : dataToScores.myNumberInMatch;

            this.firstScore = numberInMatch === 0
                ? this.createScoreArr(dataToScores.count, dataToScores.scores.first, dataToScores.winTypes)
                : this.createScoreArr(dataToScores.count, dataToScores.scores.second, dataToScores.winTypes);

            this.secondScore = numberInMatch === 0
                ? this.createScoreArr(dataToScores.count, dataToScores.scores.second, dataToScores.winTypes)
                : this.createScoreArr(dataToScores.count, dataToScores.scores.first, dataToScores.winTypes);
        },

        /**
         * Не даем ввести в инпут более 3х значений
         * */
        scoreValueValidator(e) {
            return e.target.value.length === 3 ? e.target.value = e.target.value.slice(0, -1) : e.target.value
        },

        /**
         * Проверка раундов. Находим вероятного победителя. Дизаблим или нет нужные элементы счета.
         * */
        checkRounds() {
            let checkedLength = this.firstScore.length % 2 !== 0 ? Math.ceil(this.firstScore.length / 2) : this.firstScore.length / 2;

            if (!this.validateRoundsScores(checkedLength)) {
                this.emitDeclineScoreEvent();
                this.isAcceptBtn = false;
                this.disabledItemsInScore(this.firstScore, false);
                this.disabledItemsInScore(this.secondScore, false);

                return;
            }

            let firstScore = 0,
                secondScore = 0,
                firstParticipantCountWins = 0,
                secondParticipantCountWins = 0,
                firstScoreLength = [...this.firstScore.filter(el => el.value !== '' && el.value !== '-')].length,
                secondScoreLength = [...this.secondScore.filter(el => el.value !== '' && el.value !== '-')].length;

            /*
            * Если подсчет будет идти по очкам, то просто прибавляем значения очков партисипантам
            * */
            if (this.MATCH.data.attributes.victory_on_points) {
                if (firstScoreLength === secondScoreLength) {
                    for (let i = 0; i < this.firstScore.length; i++) {

                        firstScore = Number(firstScore) + Number(this.firstScore[i].value)
                        secondScore = Number(secondScore) + Number(this.secondScore[i].value)

                    }
                }
            } else {
                /*
                * Если подсчет будет идти по раундам
                * Проверяем раунды, подсчитываем кол-во очков и кол-во побед игрока
                * */
                if (firstScoreLength === secondScoreLength) {
                    for (let i = 0; i < this.firstScore.length; i++) {
                        switch (true) {
                            case Number(this.firstScore[i].value) > Number(this.secondScore[i].value):
                                firstScore++
                                firstParticipantCountWins++
                                break
                            case Number(this.secondScore[i].value) > Number(this.firstScore[i].value):
                                secondScore++
                                secondParticipantCountWins++
                                break
                            default:
                                break
                        }
                    }

                    this.setScoresToLocalStorage(this.firstScore, this.secondScore)
                }
            }


            if (this.MATCH.data.attributes.victory_on_points) {
                this.checkRoundsByPoints(firstScore, secondScore, firstScoreLength, secondScoreLength)
                return
            }

            if (firstScoreLength === secondScoreLength) {
                // определяем есть ли побелитель, если да, то нужно разблокировать кнопку
                if (firstScoreLength >= checkedLength) {

                    let dataToCheckWins = {
                        firstParticipantCountWins,
                        secondParticipantCountWins,
                        checkedLength,
                        firstScore,
                        secondScore,
                        firstScoreLength,

                    }

                    if (this.MATCH.data.attributes.stage === 'round_robin') {
                        if (firstScoreLength === this.MATCH.rounds.attributes.number) {

                            this.checkResultsByRounds(firstScore, secondScore, firstScoreLength)
                            return
                        }
                    }

                    this.checkWinnerInMatch(dataToCheckWins)
                }
            }

        },

        /**
         * Если подсчет будет идти по очкам, проверяем все ли раунды заполнены. Если да,
         * то делаем проверку результата.
         */
        checkRoundsByPoints(firstScore, secondScore, firstScoreLength, secondScoreLength) {
            if (this.MATCH.data.attributes.victory_on_points) {

                this.isAcceptBtn = false;
                this.emitDeclineScoreEvent();

                if (firstScoreLength === secondScoreLength) {
                    if (firstScoreLength >= this.MATCH.rounds.attributes.number) {
                        this.checkResultsByPoints(firstScore, secondScore)
                        return
                    }
                }

                return
            }
        },

        /**
         * Удаляем крайний раунд из матча, если он не нужен.
         * В основном используется в плей-офф матчах, при подсчете по очкам
         * */
        removeLastRoundInMatch() {
            if (this.firstScore.length > this.MATCH.rounds.attributes.number) {
                if (!!this.firstScore[this.MATCH.rounds.attributes.number].value === false && !!this.secondScore[this.MATCH.rounds.attributes.number].value === false) {
                    this.removeLastRoundFromScores()
                }
            }
        },

        /**
         * Проверяем есть ли в матче победитель, что бы
         * */
        checkWinnerInMatch(dataToCheckWins) {
            if (dataToCheckWins.firstParticipantCountWins >= dataToCheckWins.checkedLength) {
                this.checkResultsByRounds(dataToCheckWins.firstScore, dataToCheckWins.secondScore, dataToCheckWins.firstScoreLength)
                return true
            }
            if (dataToCheckWins.secondParticipantCountWins >= dataToCheckWins.checkedLength) {
                this.checkResultsByRounds(dataToCheckWins.firstScore, dataToCheckWins.secondScore, dataToCheckWins.firstScoreLength)
                return true
            }
            /*
            * Если кол-во побед не совпадает с длинной проверки, то открываем дополнительные поля
            */
            this.makeInputsAvailable()

            return false
        },

        /**
         * Проверяем результаты матча, если подсчет по рандам.
         * Задизабливаем нужные элементы счета или наоборот.
         * */
        checkResultsByRounds(firstScore, secondScore) {
            /*
            * Определение победителя если подсчет идёт по раундам.
            */

            let firstRes = 0;
            let secondRes = 0;
            switch (true) {
                case firstScore > secondScore:
                    firstRes++

                    this.changeScorePlaceholder(this.firstScore, '', '-');
                    this.changeScorePlaceholder(this.secondScore, '', '-');
                    // Задизабливаем пустые инпуты.
                    this.disabledItemsInScore(this.firstScore)
                    this.disabledItemsInScore(this.secondScore)

                    this.isAcceptBtn = true;
                    this.emitAcceptScoreEvent();

                    break;

                case secondScore > firstScore:
                    secondRes++

                    this.changeScorePlaceholder(this.firstScore, '', '-');
                    this.changeScorePlaceholder(this.secondScore, '', '-');
                    // Задизабливаем пустые инпуты.
                    this.disabledItemsInScore(this.firstScore)
                    this.disabledItemsInScore(this.secondScore)

                    this.isAcceptBtn = true;
                    this.emitAcceptScoreEvent();

                    break;

                default:
                    firstRes = 0;
                    secondRes = 0;
                    this.isAcceptBtn = false;
                    this.emitDeclineScoreEvent();

                    break;
            }

        },

        /**
         * Определение победителя если подсчет идёт по очкам.
         */
        checkResultsByPoints(firstScore, secondScore) {
            let firstRes = 0;
            let secondRes = 0;
            switch (true) {
                case firstScore > secondScore:
                    firstRes++
                    this.isAcceptBtn = true;
                    this.emitAcceptScoreEvent();
                    this.removeLastRoundInMatch();
                    break

                case secondScore > firstScore:
                    secondRes++
                    this.isAcceptBtn = true;
                    this.emitAcceptScoreEvent();
                    this.removeLastRoundInMatch();
                    break

                default:

                    firstRes = 0;
                    secondRes = 0;
                    this.isAcceptBtn = false;
                    this.emitDeclineScoreEvent();

                    // если плей-оф, и у партисипантов одинаковый счет, то нужно добавить поле для финального раунда.
                    if (this.MATCH.data.attributes.stage === this.MATCH.tournament_info.attributes.playoff_type) {
                        if (this.firstScore.length === this.MATCH.rounds.attributes.number) {
                            this.firstScore.push({
                                value: '',
                                disabled: false,
                                placeholder: '',
                                marker: ''
                            });
                            this.secondScore.push({
                                value: '',
                                disabled: false,
                                placeholder: '',
                                marker: ''
                            });

                            return;
                        }
                    }

                    // если групповой этап и все квадраты заполнены, то раздизабливаем
                    if (this.MATCH.data.attributes.stage === this.MATCH.tournament_info.attributes.group_type) {
                        this.isAcceptBtn = true;
                        this.emitAcceptScoreEvent();

                        return;
                    }

                    break;
                }
        },

        /**
         * Записываем текущие значения раундов в локальное хранилище,
         * что бы игроки после перезагрузки страницы не вводили их по новой
         * */
        setScoresToLocalStorage(firstScore, secondScore) {
            const currentScores = {
                firstScore,
                secondScore
            }
            localStorage.setItem('currentScores', JSON.stringify(currentScores))
        },

        disabledItemsInScore(score, disabled = true) {
            for (let i = 0; i < score.length; i++) {
                score[i].disabled = score[i].value === '' ? disabled : false
            }
        },

        makeInputsAvailable() {
            this.disabledItemsInScore(this.firstScore, false)
            this.disabledItemsInScore(this.secondScore, false)

            this.isAcceptBtn = false;
            this.emitDeclineScoreEvent();

            this.changeScorePlaceholder(this.firstScore, '-', '');
            this.changeScorePlaceholder(this.secondScore, '-', '');
        },

        /**
         * Удаляем последний раунд из массивов счетов.
         * На 06.04.2021 используется при подсчете по очкам.
         * */
        removeLastRoundFromScores() {
            this.firstScore.pop()
            this.secondScore.pop()
        },

        /**
         * Вызываем метод отправки счета, если
         * */
        initializationScoreAccept(flag) {
            if (flag) {
                this.acceptScore();
            }
        },

        /**
         * Функция отправки счёта на сервер.
         * */
        acceptScore() {
            let firstScore = this.firstScore.map(el => el.value);
            let secondScore = this.secondScore.map(el => el.value);
            this.winTypes = this.firstScore.map(el => {
                if (el.marker === '') {
                    if (!el.disabled) {
                        el.marker = this.defaultScoreMarker;
                    }
                }
                return el.marker;
            })

            if (this.uIsAdmin) {
                this.acceptScoreAsAdmin(firstScore, secondScore)

                return false;
            }

            this.acceptScoreAsUser(firstScore, secondScore)
        },

        /**
         * Отправляем счет на сервер, если мы участник
         * @param firstScore - счет первого участника
         * @param secondScore - счет второго участника
         * */
        async acceptScoreAsUser(firstScore, secondScore) {

            let data = {
                isScores: true,
                id: this.getMyScore.id,
                scores: this.getMyNumberInMatchIfNotAdmin.number === 0 ? firstScore : secondScore,
                enemy_scores: this.getMyNumberInMatchIfNotAdmin.number === 0 ? secondScore : firstScore,
                typeWin: this.winTypes
            }

            if (this.isAcceptBtn) {
                this.UPDATE_SCORES(data).then(() => {
                    this.isTextModal = true;
                    this.isAcceptBtn = false;
                    this.emitDeclineScoreEvent();
                    this.readOnly = true;
                    localStorage.removeItem('currentScores');
                }).then(() => {
                    this.closeScore();
                    this.GET_MATCH_FROM_URL({id: this.MATCH.data.id});
                }).catch((err) => {
                    this.isTextModal = true;
                    this.modalText = 'Ошибка. Проверьте правильность данных или попробуйте познее...'
                    console.log('Ошибка подтверждения счета', err)
                })
            }
        },

        /**
         * Отпраляем счет на сервер, если мы администратор
         * @param firstScore - счет первого участника
         * @param secondScore - счет второго участника
         * */
        acceptScoreAsAdmin(firstScore, secondScore) {
            let data = {
                isScores: false,
                id: this.MATCH.rounds.id,
                first_score: firstScore,
                second_score: secondScore,
                typeWin: this.winTypes
            }

            if (this.isAcceptBtn) {
                this.UPDATE_SCORES(data).then(() => {
                    this.isTextModal = true;
                    this.isAcceptBtn = false
                    this.emitDeclineScoreEvent();
                    this.readOnly = true;
                }).catch((err) => {
                    this.isTextModal = true;
                    this.modalText = 'Ошибка. Проверьте правильность данных или попробуйте познее...'
                    console.log('Ошибка подтверждения счета', err)
                })
            }
        },

        /**
         * Заполняем счета данными из rounds в случаях, если:
         * - человек не участник
         * - участник, но матч закончен
         * */
        setMatchRounds() {
            // Заполняем значения счетов исходя из того, что юзер не является партисипантом
            const roundsCount = Number(this.MATCH.rounds.attributes.number);
            this.readOnly = true;

            if (this.MATCH.rounds.attributes.first_score.length) {
                this.firstScore = this.createScoreArr(roundsCount, this.MATCH.rounds.attributes.first_score, this.MATCH.rounds.attributes.etc.typeWin);
                this.secondScore = this.createScoreArr(roundsCount, this.MATCH.rounds.attributes.second_score, this.MATCH.rounds.attributes.etc.typeWin);

                return false;
            }

            this.firstScore = this.createScoreArr(roundsCount)
            this.secondScore = this.createScoreArr(roundsCount)
        },

        bindAppendixWrapper() {
            if (this.isSyncingLeftScroll === false) {
                this.isSyncingRightScroll = true;
                if (document.querySelector('.score-modal--appendix-wrapper') && document.querySelector('.score-modal--inputs-container')) this.$refs.appendix.scrollLeft = this.$refs.inputs.scrollLeft;
            }
            this.isSyncingLeftScroll = false;
        },

        bindInputsWrapper() {
            if (this.isSyncingRightScroll === false) {
                this.isSyncingLeftScroll = true;
                if (document.querySelector('.score-modal--appendix-wrapper') && document.querySelector('.score-modal--inputs-container')) this.$refs.inputs.scrollLeft = this.$refs.appendix.scrollLeft;
            }
            this.isSyncingRightScroll = false;
        },

        validateRoundsScores(validateLength) {
            for (let i = 0; i < validateLength; i++) {
                if (this.firstScore[i].value === '' || this.firstScore[i].value === '-') {
                    return false
                }
                if (this.secondScore[i].value === '' || this.secondScore[i].value === '-') {
                    return false
                }
            }

            return true
        },

        /**
         * Отправляем во вселенную событие о том, что счет может быть отправлен
         * */
        emitAcceptScoreEvent() {
            const event = new Event('can-accept-score');
            window.dispatchEvent(event);
        },

        /**
         * Отправляем во вселенную событие о том, что счет не может быть отправлен
         * */
        emitDeclineScoreEvent() {
            const event = new Event('decline-accept-score');
            window.dispatchEvent(event);
        }
    },
    mounted() {

        if (this.canUChange) {
            this.setInitialScores();
        } else {
            this.setMatchRounds();
        }

        if (this.$refs.appendix) this.$refs.appendix.addEventListener('scroll', this.bindInputsWrapper);
        if (this.$refs.inputs) this.$refs.inputs.addEventListener('scroll', this.bindAppendixWrapper);

        if (this.uIsParticipant) {
            this.SET_SCORE_ENTITY(this.getMyScore);
        }
    },
    destroyed() {
        if (this.$refs.appendix) this.$refs.appendix.removeEventListener('scroll', this.bindInputsWrapper)
        if (this.$refs.inputs) this.$refs.inputs.removeEventListener('scroll', this.bindAppendixWrapper)
    }
}
