<template>
  <div v-show="alive" class="alert" :class="alertClass">
    {{ msg?.txt }}
  </div>
</template>


<script>
import { eventBus, SHOW_MSG } from "../services/event-bus.service.js"

export default {
  name: 'user-msg',
  created() {
    eventBus.on(SHOW_MSG, (msg) => {
      this.msg = msg
      var delay = msg.delay || 4000
      this.alive = true
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        this.alive = false
      }, delay)
    })
  },
  data() {
    return {
      alive: false,
      msg: null,
    }
  },
  computed: {
    alertClass() {
      if (!this.msg) return
      return `alert-${this.msg.type}`
    },
  },
}
</script>