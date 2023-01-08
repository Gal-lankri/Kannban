
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

async function query(filterBy = { title: '' }) {
    return httpService.get(BOARD_URL, filterBy)
    // if (!boards) {
    //     boards = gBoards
    //     storageService.save(STORAGE_KEY, boards)
    // }

    // if (filterBy.title) {
    //     const regex = new RegExp(filterBy.title, 'i')
    //     boards = boards.filter(board => regex.test(board.title))
    // }
    // if (filterBy.price) {
    //     boards = boards.filter(board => board.price <= filterBy.price)
    // // }
    // return boards
}

async function save(board) {
    board = JSON.parse(JSON.stringify(board))
    // console.log('BOARD COPIED SUCCESSFULLY')
    try {
        // console.log('SAVE service frontend')
        var savedBoard
        if (board._id) {
            // console.log(board._id)
            savedBoard = await httpService.put(`${BOARD_URL}${board._id}`, board)
            socketService.emit('board updated', savedBoard)
        } else {
            // Later, owner is set by the backend
            board.createdBy = userService.getLoggedinUser()
            savedBoard = await httpService.post(BOARD_URL, board)
        }
        return savedBoard
    }
    catch (err) {
        // const prevBoard = await getById(board._id)
        console.log(prevBoard);
        console.log(err);
        throw prevBoard
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
    // console.log(boardId, 'boardId');
    const board = await getById(boardId)
    // PUT /api/board/b123/task/t678

    // TODO: find the task, and update
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





