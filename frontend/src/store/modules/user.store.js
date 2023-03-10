import { userService } from '../../services/user.service'
import { utilService } from '../../services/util.service'

// var localLoggedinUser = null
// if (sessionStorage.user) localLoggedinUser = JSON.parse(sessionStorage.user || null)

export const userStore = {
    state: {
        loggedinUser: null,
        users: [],
        watchedUser: null
    },
    getters: {
        users({ users }) { return users },
        loggedinUser({ loggedinUser }) {
            return loggedinUser
        },
        watchedUser({ watchedUser }) { return watchedUser }
    },
    mutations: {
        updateSeenNotifications(state) {
            state.loggedinUser.notifications.some(notification => {
                if (!notification.isSeen) {
                    notification.isSeen = true
                    return false
                }
                return true
            })
        },
        removeNotification(state, { notId }) {
            if (notId === 'all') state.loggedinUser.notifications = []
            else {
                const notIdx = state.loggedinUser.notifications.findIndex(not => not.id === notId)
                state.loggedinUser.notifications.splice(notIdx, 1)
            }
        },
        setLoggedinUser(state, { user }) {
            state.loggedinUser = (user) ? { ...user } : null
        },
        setWatchedUser(state, { user }) {
            state.watchedUser = user
        },
        setUsers(state, { users }) {
            state.users = users
        },
        removeUser(state, { userId }) {
            state.users = state.users.filter(user => user._id !== userId)
        },
        setUserScore(state, { score }) {
            state.loggedinUser.score = score
        },
        addNotification(state, { notification }) {
            notification.id = utilService.makeId()
            if (!state.loggedinUser?.notifications) state.loggedinUser.notifications = []
            if (state.loggedinUser.notifications.length >= 20) state.loggedinUser.notifications.pop()
            state.loggedinUser.notifications.unshift(notification)
        }
    },
    actions: {
        async login({ commit }, { userCred }) {
            try {
                const user = await userService.login(userCred)
                if (!user) return
                commit({ type: 'setLoggedinUser', user })
                return user
            } catch (err) {
                console.log('userStore: Error in login', err)
                throw err
            }
        },
        async updateSeenNotifications(context) {
            context.commit({ type: 'updateSeenNotifications' })
            try {
                await userService.update(context.state.loggedinUser)
            }
            catch (err) {
                console.log('error in update user notifications', err);
            }
        },
        async removeNotification(context, { notId }) {
            context.commit({ type: 'removeNotification', notId })
            try {
                await userService.update(context.state.loggedinUser)
            }
            catch (err) {
                console.log('error in update user notifications', err);
            }
        },
        async addNotification(context, { notification }) {
            context.commit({ type: 'addNotification', notification })
            try {
                await userService.update(context.state.loggedinUser)
            }
            catch (err) {
                console.log('error in update user notifications', err);
            }
        },
        async loginWithGoogle({ commit }, { email }) {
            const userCred = { email, password: '' }
            try {
                const user = await userService.login(userCred)
                commit({ type: 'setLoggedinUser', userCred })
                return user
            }
            catch (err) {
                console.log('userStore: Error in login', err)
                throw err
            }
        },
        async signup({ commit }, { userCred }) {
            try {
                console.log('userCred',userCred )
                const user = await userService.signup(userCred)
                commit({ type: 'setLoggedinUser', user })
                return user
            } catch (err) {
                console.log('userStore: Error in signup', err)
                throw err
            }

        },
        async logout({ commit }) {
            try {
                await userService.logout()
                commit({ type: 'setLoggedinUser', user: null })
            } catch (err) {
                console.log('userStore: Error in logout', err)
                throw err
            }
        },
        async loadUsers({ commit }) {
            try {
                const users = await userService.getUsers()
                commit({ type: 'setUsers', users })
            } catch (err) {
                console.log('userStore: Error in loadUsers', err)
                throw err
            }
        },
        async loadAndWatchUser({ commit }, { userId }) {
            try {
                const user = await userService.getById(userId)
                commit({ type: 'setWatchedUser', user })

            } catch (err) {
                console.log('userStore: Error in loadAndWatchUser', err)
                throw err
            }
        },
        async removeUser({ commit }, { userId }) {
            try {
                await userService.remove(userId)
                commit({ type: 'removeUser', userId })
            } catch (err) {
                console.log('userStore: Error in removeUser', err)
                throw err
            }
        },
        async updateUser({ commit }, { user }) {
            try {
                user = await userService.update(user)
                commit({ type: 'setUser', user })
            } catch (err) {
                console.log('userStore: Error in updateUser', err)
                throw err
            }
        },
        setWatchedUser({ commit }, payload) {
            commit(payload)
        },

    }
}