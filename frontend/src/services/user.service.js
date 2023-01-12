import { storageService } from './async.storage.service'
import { httpService } from './http.service'
import { store } from '../store/store'
import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from './socket.service'
import { showSuccessMsg } from './event-bus.service'

// import usersDB from '../../data/users.json' assert {type: 'json'};
// const gUsers = JSON.parse(JSON.stringify(usersDB));

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    getUsers,
    getById,
    remove,
    update,
    // changeScore
}

window.userService = userService


function getUsers() {
    return httpService.get(`user`)
}

function onUserUpdate(user) {
    store.dispatch({ type: 'setWatchedUser', user })
}

async function getById(userId) {
    const user = await httpService.get(`user/${userId}`)
    return user
}
function remove(userId) {
    // return storageService.remove('user', userId)
    return httpService.delete(`user/${userId}`)
}

async function update(user) {
    user = await httpService.put(`user/${user._id}`, user)
    // Handle case in which admin updates other user's details
    if (getLoggedinUser()._id === user._id) saveLocalUser(user)
    return user
}

async function login(userCred) {
    const user = await httpService.post('auth/login', userCred)
    if (user) {
        socketService.login(user._id)
        return saveLocalUser(user)
    }
}
async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    // const user = await storageService.post('user', userCred)
    console.log(userCred);
    const user = await httpService.post('auth/signup', userCred)
    socketService.login(user._id)
    return saveLocalUser(user)
}
async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    socketService.logout()
    return await httpService.post('auth/logout')
}

function saveLocalUser(user) {
    let miniUser = { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl }
    if (user.notifications) miniUser.notifications = user.notifications
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(miniUser))
    return miniUser
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}




