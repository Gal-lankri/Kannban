<template>
  <section class="board-list">
    <section class="boards-page">
      <app-nav />
      <section class="board-main">
        <section class="starred-boards">
          <div class="star-header-container">
            <span class="trellicons star"> </span>
            <h3>Starred boards</h3>
          </div>
          <ul class="starred-board-list flex row wrap gap">
            <li v-for="board in boards.filter((b) => b.isStarred)" :key="board._id">
              <board-preview class="starred" :board="board" @click="goToBoard(board._id)"
                @toggleStar="toggleStar(false, board)" />
            </li>
          </ul>
        </section>
        <section class="full-boards-list">
          <div class="boards-header-container">
            <span class="trellicons icon-template-board"> </span>
            <h3>Your boards</h3>
          </div>
          <ul class="boards-container flex row wrap gap">
            <li v-for="board in boards" :key="board._id">
              <board-preview :board="board" @click="goToBoard(board._id)" @toggleStar="toggleStar(true, board)">
              </board-preview>
            </li>
            <li @click="isAddBoard = true" class="btn-create">
              <span>Create new board</span>
            </li>
          </ul>
        </section>
      </section>
      <add-board-modal v-if="isAddBoard" @addBoard="addBoard" v-click-outside="() => (isAddBoard = false)"
        @closeEdit="isAddBoard = false" />
    </section>
  </section>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"
import { boardService } from "../services/board.service.local"

import boardPreview from "../cmps/board-preview.vue"
import addBoardModal from "../cmps/add-board-modal.vue"
import appNav from "../cmps/app-nav.vue"
import confirmModal from "../cmps/confirm-modal.vue"

export default {
  components: {
    boardPreview,
    appNav,
    addBoardModal,
    confirmModal,
  },

  data() {
    return {
      boardToAdd: boardService.getEmptyBoard(),
      isAddBoard: false,
    }
  },

  async created() {
    // try {
    //   await this.$store.dispatch({ type: "loadBoards" })
    // } catch (err) {
    //   console.log(err)
    // }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    boards() {
      return this.$store.getters.boards
    },
  },

  methods: {
    updateUser() {
      console.log("ADD NOTIFICATOIN")
    },
    async addBoard({ bcg, title, members }) {
      if (bcg.startsWith("#")) {
        this.boardToAdd.style = { bgColor: bcg }
      } else {
        this.boardToAdd.style = { backgroundImage: bcg }
      }
      this.boardToAdd.title = title
      this.boardToAdd.members = members
      this.isAddBoard = false
      try {
        await this.$store.dispatch({
          type: "addBoard",
          board: this.boardToAdd,
        })
        showSuccessMsg('Board was added successfully.')
        this.boardToAdd = boardService.getEmptyBoard()
      } catch (err) {
        console.log(err)
        showErrorMsg('Error occurred while adding a board.')
      }
    },
    async removeBoard(boardId) {
      try {
        await this.$store.dispatch({ type: "removeBoard", boardId })
        showSuccessMsg('Board was removed successfully.')
      } catch (err) {
        console.log(err)
        showErrorMsg('Error occurred while removing board.')
      }
    },
    async updateBoard(board) {
      try {
        // board = { ...board }
        await this.$store.dispatch({ type: "updateBoard", board })
        // showSuccessMsg('Board updated')
      } catch (err) {
        console.log(err)
        showErrorMsg('Error occurred while updating board.')
      }
    },
    async addBoardMsg(boardId) {
      try {
        await this.$store.dispatch(getActionAddBoardMsg(boardId))
        showSuccessMsg('Message was added successfully.')
      } catch (err) {
        console.log(err)
        showErrorMsg('Error occurred while adding board message.')
      }
    },
    printBoardToConsole(board) {
      console.log("Board msgs:", board.msgs)
    },
    goToBoard(id) {
      this.$router.push(`/board/${id}`)
    },
    toggleStar(isStarred, board) {
      const newBoard = JSON.parse(JSON.stringify(board))
      newBoard.isStarred = isStarred
      this.updateBoard(newBoard)
    },
  },
}
</script>
