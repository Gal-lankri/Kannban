
import { storageService } from './async.storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

import boardsDB from '../../data/boards.json' assert {type: 'json'};
const gBoards = JSON.parse(JSON.stringify(boardsDB));
// console.log(gBoards);

const STORAGE_KEY = 'board'

export const boardService = {
    query,
    getById,
    save,
    remove,
    getEmptyBoard,
    saveTask,
    addBoardActivity
}
window.cs = boardService


async function query(filterBy = { title: '' }) {
    var boards = await storageService.query(STORAGE_KEY)
    if (!boards) {
        boards = gBoards
        storageService.save(STORAGE_KEY, boards)
    }

    // if (filterBy.title) {
    //     const regex = new RegExp(filterBy.title, 'i')
    //     boards = boards.filter(board => regex.test(board.title))
    // }
    // if (filterBy.price) {
    //     boards = boards.filter(board => board.price <= filterBy.price)
    // }
    return boards
}

function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
}

async function remove(boardId) {
    await storageService.remove(STORAGE_KEY, boardId)
}
async function saveGroup(boardId, group, activity) {
    try {
        const board = await getById(boardId)
        board.groups.push(group)
        const newBoard = await save(board)
    }
    catch (err) {
        console.log(err)
    }
    // TODO: find the task, and update
    board.activities.unshift(activity)
    save(board)
    // return board
    // return task
}

async function save(board) {
    var savedBoard
    if (board._id) {
        savedBoard = await storageService.put(STORAGE_KEY, board)
    } else {
        // Later, owner is set by the backend
        board.createdBy = userService.getLoggedinUser()
        savedBoard = await storageService.post(STORAGE_KEY, board)
    }
    return savedBoard
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
