import { queryNotices } from '@/services/api'
import { queryCurrentMenu } from '@/services/common'

export default {
    namespace: 'global',

    state: {
        fetching: 0,
        authorities: [],
        collapsed: false,
        notices: [],
    },

    effects: {
        *fetchAuthorities(_, { call, put }) {
            const res = yield call(queryCurrentMenu)
            if (res && res.errcode === 0) {
                yield put({
                    type: 'saveAuthorities',
                    payload: res.data,
                })
            }
        },
        *fetchNotices(_, { call, put, select }) {
            const data = yield call(queryNotices)
            yield put({
                type: 'saveNotices',
                payload: data,
            })
            const unreadCount = yield select(
                state => state.global.notices.filter(item => !item.read).length
            )
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: data.length,
                    unreadCount,
                },
            })
        },
        *clearNotices({ payload }, { put, select }) {
            yield put({
                type: 'saveClearedNotices',
                payload,
            })
            const count = yield select(state => state.global.notices.length)
            const unreadCount = yield select(
                state => state.global.notices.filter(item => !item.read).length
            )
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: count,
                    unreadCount,
                },
            })
        },
        *changeNoticeReadState({ payload }, { put, select }) {
            const notices = yield select(state =>
                state.global.notices.map(item => {
                    const notice = { ...item }
                    if (notice.id === payload) {
                        notice.read = true
                    }
                    return notice
                })
            )
            yield put({
                type: 'saveNotices',
                payload: notices,
            })
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: notices.length,
                    unreadCount: notices.filter(item => !item.read).length,
                },
            })
        },
    },

    reducers: {
        changeLayoutCollapsed(state, { payload }) {
            return {
                ...state,
                collapsed: payload,
            }
        },
        saveNotices(state, { payload }) {
            return {
                ...state,
                notices: payload,
            }
        },
        saveClearedNotices(state, { payload }) {
            return {
                ...state,
                notices: state.notices.filter(item => item.type !== payload),
            }
        },

        saveAuthorities(state, { payload }) {
            return {
                ...state,
                authorities: payload,
            }
        },

        fetchingStart(state) {
            return {
                ...state,
                fetching: state.fetching + 1,
            }
        },
        fetchingEnd(state) {
            let count = state.fetching - 1
            if (count < 0) {
                count = 0
            }

            return {
                ...state,
                fetching: count,
            }
        },
    },

    subscriptions: {
        setup({ history }) {
            // Subscribe history(url) change, trigger `load` action if pathname is `/`
            return history.listen(({ pathname, search }) => {
                if (typeof window.ga !== 'undefined') {
                    window.ga('send', 'pageview', pathname + search)
                }
            })
        },
    },
}
