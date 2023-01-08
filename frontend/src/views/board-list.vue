<template>
  <section class="boards-page-container">
    <img v-if="!boards" src="../assets/svg/loader.svg" alt="" class="loader">
    <section v-else class="container home boards-page">
      <app-nav />
      <div class="board-main">
        <div class="starred-boards">
          <div class="star-header-container">
            <span class="trellicons star">
            </span>
            <h3>Starred boards</h3>
          </div>
          <ul v-if="boards" class="starred-board-list flex row wrap gap">

            <li v-for="board in boards.filter(b => b.isStarred)" :key="board._id">
              <board-preview class="starred" :board="board" @click="goToBoard(board._id)"
                @toggleStar="toggleStar(false, board)" />
            </li>
          </ul>
        </div>
        <div class="full-boards-list">
          <div class="boards-header-container">
            <span class="trellicons icon-template-board">
            </span>
            <h3>Your boards</h3>
          </div>
          <ul v-if="boards" class="board-list flex row wrap gap">
            <li v-for="board in boards" :key="board._id">
              <!-- <pre>{{ board }}</pre> -->
              <!-- <div class="board-title">{{ board.title }}</div> -->
              <board-preview :board="board" @click="goToBoard(board._id)" @toggleStar="toggleStar(true, board)">
              </board-preview>
              <!-- <button @click="removeBoard(board._id)">x</button>
                <button @click="updateBoard(board)">Update</button> -->
              <!-- <button @click="addBoardMsg(board._id)">Add board msg</button>
                <button @click="printBoardToConsole(board)">Print msgs to console</button> -->
            </li>
            <li @click="isAddBoard = true">
              <span>Create new board</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- <form @submit.prevent="addBoard()">
          <h2>Add board</h2>
          <input type="text" v-model="boardToAdd.title" />
          <button>Save</button>
        </form> -->
      <add-board-modal v-if="isAddBoard" @addBoard="addBoard" v-click-outside="() => isAddBoard = false"
        @closeEdit="(isAddBoard = false)" />
    </section>
  </section>
</template>

<script>

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board.service.local'

// import { getActionRemoveBoard, getActionUpdateBoard, getActionAddBoardMsg } from '../store/board.store'

import boardPreview from '../cmps/board-preview.vue'
import addBoardModal from '../cmps/add-board-modal.vue'
import appNav from '../cmps/app-nav.vue'
import confirmModal from '../cmps/confirm-modal.vue'
export default {
  data() {
    return {
      boardToAdd: boardService.getEmptyBoard(),
      isAddBoard: false,
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    boards() {
      return this.$store.getters.boards
    }
  },
  async created() {

  },
  methods: {
    updateUser() {
      console.log('ADD NOTIFICATOIN');
    },
    async addBoard({ bcg, title, members }) {
      if (bcg.startsWith('#')) {
        this.boardToAdd.style = { bgColor: bcg }
      } else {
        this.boardToAdd.style = { backgroundImage: bcg }
      }
      this.boardToAdd.title = title
      this.boardToAdd.members = members
      this.isAddBoard = false
      try {
        await this.$store.dispatch({ type: 'addBoard', board: this.boardToAdd })
        showSuccessMsg('Board added')
        this.boardToAdd = boardService.getEmptyBoard()
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot add board')
      }
    },
    async removeBoard(boardId) {
      try {
        await this.$store.dispatch({ type: 'removeBoard', boardId })
        showSuccessMsg('Board removed')

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove board')
      }
    },
    async updateBoard(board) {
      try {
        // board = { ...board }
        await this.$store.dispatch({ type: 'updateBoard', board })
        // showSuccessMsg('Board updated')

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot update board')
      }
    },
    async addBoardMsg(boardId) {
      try {
        await this.$store.dispatch(getActionAddBoardMsg(boardId))
        showSuccessMsg('Board msg added')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot add board msg')
      }
    },
    printBoardToConsole(board) {
      console.log('Board msgs:', board.msgs)
    },
    goToBoard(id) {
      this.$router.push(`/board/${id}`)
    },
    toggleStar(isStarred, board) {
      const newBoard = JSON.parse(JSON.stringify(board))
      newBoard.isStarred = isStarred
      this.updateBoard(newBoard)
    }
  },
  components: {
    boardPreview,
    appNav,
    addBoardModal,
    confirmModal
  }


}
</script>
