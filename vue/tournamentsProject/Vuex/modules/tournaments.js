import {API} from '../axios-config';
import _ from 'lodash';
import {getDataForRelation, includeFilteringByTag, includeFilteringByType} from "@/helpers/include-filtering";
import GetGroupWinners from "@/helpers/getGroupWinners/getGroupWinners";
import {getPlayOffSEWinners} from "@/helpers/getPlayOffWinners/getPlayOffSEWinners";
import {sortGroupsByGrouping} from "@/helpers/sort/sortGroupsByGrouping";
import {getPlayOffDEWinners} from "@/helpers/getPlayOffWinners/getPlayOffDEWinners";

/*
* PO - playoff
* RR - round robin
*/

export default {
    state: {
        isPoReq: true,
        isRrReq: true,
        matches: [],
        participants: [],
        matchesGroups: {},
        playoff: {},
    },
    mutations: {
        SET_GROUPS: (state, groups) => {
            state.matchesGroups = groups;
        },
        SET_MATCHES: (state, matches) => {
            state.matches = matches;
        },
        SET_CURRENT_COMPOSITION: (state, composition) => {
            state.match_compositions.push(composition);
        },
    },
    actions: {
        GET_MATCHES_RR({commit, getters}, data) {
            commit('IS_Rr_REQ', true);

            return API({
                url: `tournaments/${data.id}/matches?filter[stage]=${data.stage}&fields[matches]=first_score,second_score,grouping,participantable_first_id,participantable_second_id,participantable_first_type,stage,status,rounds&include=rounds`,
                method: "GET"
            }).then(({data}) => {
                let groups = {};
                let rounds = includeFilteringByType(data.included, 'rounds');

                /*
                * Приписюниваем раундсы к матчам
                * и раскидываем матчи по гроупингам
                * */
                data.data.map(match => {
                    match.rounds = rounds.find(round => Number(round.id) === Number(match.relationships.rounds.data.id));

                    if (groups[match.attributes.grouping] === undefined) {
                        groups[match.attributes.grouping] = [];
                    }
                    groups[match.attributes.grouping].push(match);
                });

                commit('SET_RR_MATCHES', data.data);
                let sortedGroups = sortGroupsByGrouping(groups);

                commit('SET_GROUPS', sortedGroups);
                commit('IS_Rr_REQ', false);


                /*
                * Собираем победителей. Если групп будет больше, чем 1, то победители будут все ровно из первой группы
                * */
                if (getters.TOURNAMENT.attributes.playoff_type === null) {
                    if (getters.TOURNAMENT.attributes.finished_at !== null) {
                        let firstGroupMatches = Object.entries(sortedGroups)[0][1];

                        commit('SET_WINNERS', (new GetGroupWinners(firstGroupMatches)).getWinners());
                    } else {
                        return {};
                    }
                }
            });
        },
        GET_MATCHES_PO({commit, getters, state}, data) {
            commit('IS_PO_REQ', true);
            const filteringInGroup = (arr) => {
                let participants = [];
                let matches = {};
                arr.map(item => {

                    if (matches[item.attributes.depth] === undefined) {
                        matches[item.attributes.depth] = [];
                    }

                    matches[item.attributes.depth].push(item);
                    participants.push(item.attributes.participantable_first_id);
                    participants.push(item.attributes.participantable_second_id);
                    participants = _.uniq(participants);
                });
                return {
                    participants,
                    matches
                };
            };
            return API({
                url: `/tournaments/${data.id}/matches?filter[stage]=${data.stage}&include=rounds`,
                method: "GET"
            }).then(({data}) => {

                try {
                    data.data.forEach((item) => {
                        item.rounds = getDataForRelation(data.included, item.relationships.rounds.data);
                    });
                } catch (e) {
                    console.log('GET_MATCHES_PO', e);
                }

                let sortingData = {};
                data.data.map(item => {
                    if (sortingData[item.attributes.grouping] === undefined) {
                        sortingData[item.attributes.grouping] = [];
                    }
                    sortingData[item.attributes.grouping].push(item);
                });

                for (let key in sortingData) {
                    sortingData[key] = filteringInGroup(sortingData[key]);
                }

                commit('SET_PO_DATA', sortingData);
            }).then(() => {
                commit('IS_PO_REQ', false);
            }).then(() => {
                if (getters.TOURNAMENT.attributes.finished_at !== null) {
                        if (state.tournament.attributes.playoff_type === 'single_elimination') {
                            commit('SET_WINNERS', getPlayOffSEWinners(state.playoff.upper_grid.matches))
                        }
                        if (state.tournament.attributes.playoff_type === 'double_elimination') {
                            commit('SET_WINNERS', getPlayOffDEWinners(state.playoff.final_grid.matches[Object.keys(state.playoff.final_grid.matches)[0]][0], state.playoff.lower_grid.matches[Object.keys(state.playoff.lower_grid.matches)[0]][0]))
                        }
                    } else {
                        return {};
                    }
            }).catch((error) => console.log(error))
        },

        async GET_MATCH_FROM_URL({commit, dispatch}, dataToReq) {
            if (!dataToReq.silently) {
                commit('SET_MATCH_IN_REQUEST', true);
            }

            const res = await API({
                method: 'GET',
                url: `/matches/${dataToReq.id}?include=tournament,rounds,rounds.scores,rounds.scores.attachments&fields[tournaments]=name,victory_on_points,sort_after_group,group_type,playoff_type&fields[matches]=chat_id,created_at,current_timestamp,depth,ended_at,first_score,grouping,nextMatch,participantable_first_id,participantable_first_type,participantable_second_id,participantable_second_type,second_score,stage,started_at,status,tournament_id,translation_url,updated_at,victory_on_points,previous_finished,tournament,rounds,rounds.scores`
            });
            const data = res.data;

            const attachments = includeFilteringByType(data.included, 'attachments');

            const matchScores = includeFilteringByType(data.included, 'scores').length ? includeFilteringByType(data.included, 'scores') : null;
            if (matchScores !== null) {
                matchScores.map(score => score.attachments = []);
                matchScores.map(score => {
                    score.relationships.attachments.data.map(attachment => {
                        score.attachments = score.attachments.concat(attachments.filter(includedAttach => includedAttach.id === attachment.id));
                    })
                });
            }

            let matchData = {
                data: data.data,
                rounds: includeFilteringByType(data.included, 'rounds').length ? includeFilteringByType(data.included, 'rounds')[0] : null,
                tournament_info: includeFilteringByType(data.included, 'tournaments')[0],
                scores: matchScores
            };

            commit('SET_MATCH', matchData);

            let firstParticipant = {
                participant_id: data.data.attributes.participantable_first_id,
                tournament_id: data.included[0].id
            };
            let secondParticipant = {
                participant_id: data.data.attributes.participantable_second_id,
                tournament_id: data.included[0].id
            };

            await dispatch('GET_CURRENT_MATCH_COMPOSITION', firstParticipant);
            await dispatch('GET_CURRENT_MATCH_COMPOSITION', secondParticipant);
            commit('SET_MATCH_IN_REQUEST', false);
        },
        GET_CURRENT_MATCH_COMPOSITION({commit}, data) {
            return API({
                method: 'GET',
                url: `/compositions-for-tournaments?include=participantable,participantable.logo,users,users.logo&filter[participantable_id]=${data.participant_id}&filter[tournament_id]=${data.tournament_id}`
            }).then(({data}) => {
                let composition = data.data[0];
                let logos = includeFilteringByTag(data.included, 'logo');
                composition.participant = includeFilteringByType(data.included, composition.attributes.participantable_type)[0];
                composition.participant.logo = logos.filter(logo => logo.id === composition.participant.relationships.logo.data.id)[0].attributes.url;
                if (composition.attributes.participantable_type === 'teams') {
                    composition.users = includeFilteringByType(data.included, 'users')
                        .map(item => {
                            console.log(composition.relationships.users.meta.roles);
                            item.logo = logos.filter(logo => logo.id === item.relationships.logo.data.id)[0].attributes.url;
                            item.role = composition.relationships.users.meta.roles.find(function (role) {
                                console.log(item, role, 'ROLE-ITEM')
                                return Number(role.id) === Number(item.id) ? role : null
                            }).role;
                            return item;
                        })
                    composition.players = composition.users.filter(item => item.role !== 'substitute')
                    composition.players.unshift(...composition.players.splice(_.findIndex(composition.players, item => item.role === 'capitan'), 1))
                    composition.subs = composition.users.filter(item => item.role === 'substitute')
                }

                commit('SET_CURRENT_COMPOSITION', composition);
            })
        },
        UPDATE_SCORES(ctx, data) {
            let url, dataToUpdate;
            if (data.isScores) {
                url = `/scores/${data.id}`;
                dataToUpdate = {
                    'type': 'scores',
                    'id': data.id,
                    'attributes': {
                        'scores': data.scores,
                        'enemy_scores': data.enemy_scores,
                        'etc': {'typeWin': data.typeWin}
                    }
                };
            } else {
                url = `/rounds/${data.id}`;
                dataToUpdate = {
                    'type': 'rounds',
                    'id': data.id,
                    'attributes': {
                        'first_score': data.first_score,
                        'second_score': data.second_score,
                        'etc': {'typeWin': data.typeWin}
                    }
                };
            }

            return API({
                method: 'PATCH',
                url,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userAccessToken')}`
                },
                data: {
                    'data': dataToUpdate
                }
            });
        },

    },
    getters: {
        GET_GROUPS(state) {
            return state.matchesGroups;
        },
        GET_PLAYOFF(state) {
            return state.playoff;
        },
        MATCH(state) {
            return state.match;
        },
        IS_MATCH(state) {
            return state.isMatchInRequest;
        },
    }
};
