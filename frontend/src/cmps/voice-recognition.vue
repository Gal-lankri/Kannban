

<template>
    <section class="voice-recognition">
      <button @click="toggleMic">
      <span class="fa-solid mic-icon"></span>
      </button>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        transcript: '',
        isRecording: false
      }
    },
    created() {
      const recognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.sr = new recognition
      this.sr.continuous = true
      this.sr.interimResults = true
      // console.log(sr);
      this.sr.onstart = () => {
        console.log('VR STARTED');
        this.isRecording = true
      }
  
      this.sr.onend = () => {
        console.log('VR STOPED');
        this.isRecording = false
        this.$emit('searchByVoice' , this.transcript)
      }
  
      this.sr.onresult = (ev) => {
        this.transcript = Array.from(ev.results)
          .map(result => result[0])
          .map(result => result.transcript).join('')
  
        // console.log(transcript);
      }
    },
  
    methods: {
      toggleMic() {
        if (this.isRecording) this.sr.stop()
        else this.sr.start()
      }
    },
  }
  </script>
  