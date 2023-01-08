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
    // return storageService.query('user')
    return httpService.get(`user`)
}

function onUserUpdate(user) {
    // showSuccessMsg(`This user ${user.fullname} just got updated from socket, new score: ${user.score}`)
    store.dispatch({ type: 'setWatchedUser', user })
}

async function getById(userId) {
    // const user = await storageService.get('user', userId)
    const user = await httpService.get(`user/${userId}`)

    // socketService.emit(SOCKET_EMIT_USER_WATCH, userId)
    // socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
    // socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate)

    return user
}
function remove(userId) {
    // return storageService.remove('user', userId)
    return httpService.delete(`user/${userId}`)
}

async function update(user) {
    // console.log(user);
    // await storageService.put('user', user)
    user = await httpService.put(`user/${user._id}`, user)
    // Handle case in which admin updates other user's details
    if (getLoggedinUser()._id === user._id) saveLocalUser(user)
    return user
}

async function login(userCred) {
    // console.log(userCred);
    // const users = await storageService.query('user')
    // const user = users.find(user => user.email === userCred.email)
    // console.log(user, '.......................');
    const user = await httpService.post('auth/login', userCred)
    // console.log(user);
    if (user) {
        socketService.login(user._id)
        return saveLocalUser(user)
    }
}
async function signup(userCred) {
    // userCred.score = 10000
    // console.log(userCred);
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    // const user = await storageService.post('user', userCred)
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
    if (!sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)) {
        const user = {
            _id: 'demoboy', fullname: 'Dima Demo', email: 'dima-demo@mystartup.org', isAdmin: false, imgUrl: 'src/assets/img/user1.jpg'
        }
        sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    }

    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
    // return { _id: 'fsdfds', fullname: 'Puki Norma', email: 'puki', password: '123', isAdmin: false, imgUrl: 'src/assets/img/user1.jpg' }
}


// ; (async () => {
//     await userService.signup({ fullname: 'Amir Gombo', email: 'amir', password: '123', isAdmin: true })
//     await userService.signup({ fullname: 'Gal Lankri', email: 'gal', password: '123', isAdmin: true })
//     await userService.signup({ fullname: 'Yadid Hadad', email: 'yadid', password: '123', isAdmin: true })
// })()



