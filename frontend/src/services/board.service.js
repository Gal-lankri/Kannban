
import { socketService, SOCKET_EVENT_ACTIVITY_ADDED } from './socket.service.js'
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import { store } from '../store/store'


export const boardService = {
    query,
    getById,
    save,
    remove,
    getEmptyBoard,
    saveTask,
    addBoardActivity,
    addBoardMsg,
}

window.cs = boardService
const BOARD_URL = 'board/'

async function query(filterBy = { title: '' }, loggedinUser) {
    return httpService.get(BOARD_URL, loggedinUser)
}

async function save(board) {
    board = JSON.parse(JSON.stringify(board))
    try {
        var newBoard
        if (board._id) {
            newBoard = await httpService.put(`${BOARD_URL}${board._id}`, board)
            socketService.emit('board updated', newBoard)
        } else {
            board.createdBy = userService.getLoggedinUser()
            newBoard = await httpService.post(BOARD_URL, board)
        }
        return newBoard
    }
    catch (err) {
        throw err
    }
}
async function getById(boardId) {
    // return storageService.get(STORAGE_KEY, boardId)
    return await httpService.get(`${BOARD_URL}${boardId}`)
}

async function remove(boardId) {
    // await storageService.remove(STORAGE_KEY, boardId)
    return httpService.delete(`${BOARD_URL}${boardId}`)
}

async function addBoardMsg(boardId, txt) {
    const savedMsg = await httpService.post(`${BOARD_URL}${boardId}/msg`, { txt })
    return savedMsg
}


function getEmptyBoard(
    title = '',
    isStarred = false,
    createdBy = {},
    style = { backgroundImage: "src/assets/img/bgc-img-1.jpg" },
    groups = [],
    members = [],
    activities = []) {
    return {
        // _id: utilService.makeId(),
        title,
        isStarred,
        createdBy,
        style,
        labels: [{ id: utilService.makeId(), title: '', color: '#d6ecd2' },
        { id: utilService.makeId(), title: '', color: '#faf3c0' },
        { id: utilService.makeId(), title: '', color: '#fce6c6' },
        { id: utilService.makeId(), title: '', color: '#f5d3ce' },
        { id: utilService.makeId(), title: '', color: '#eddbf4' },
        { id: utilService.makeId(), title: '', color: '#bcd9ea' }],
        groups,
        members,
        activities,
    }
}


async function saveTask(boardId, groupId, task, activity) {
    const board = await getById(boardId)
    if (!board.activities) board.activities = []
    board.activities.unshift(activity)
    const group = board.groups.find(g => g.id === groupId)
    const taskIdx = group.tasks.find(t => t.id === task.id)
    group.tasks.splice(taskIdx, 1, task)
    await save(board)
    return { board, task }
}

async function addBoardActivity(boardId, txt) {
    // Later, this is all done by the backend
    const board = await getById(boardId)
    if (!board.activities) board.activities = []

    const act = {
        id: utilService.makeId(),
        createdAt: Date.now(),
        // byMember: userService.getLoggedinUser(),
        txt
    }

    board.activities.push(act)
    await storageService.put(STORAGE_KEY, board)

    return act
}





