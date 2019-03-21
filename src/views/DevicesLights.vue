<template>
  <section id="ligths">
    <header class="component-header">
      <slot name="header-title" :_class="'has-text-warning'" />
      <div class="commands field is-grouped is-marginless">
        <button-reload title="Värskenda serverist" @click="ioGetAllLamps" />
        <button-add title="Lisa automaattoiming" @click="create" />
      </div>
    </header>
    <div class="rooms-grid">
      <section v-for="room in groupedLamps" :key="room.id" class="room">
        <h3 class="subtitle is-5 has-text-weight-light" v-text="room.id" />
        <div class="lamps-grid">
          <lamp v-for="lamp in room.items" :key="lamp.id" :lamp.sync="lamp" />
        </div>
      </section>
    </div>
    <editor
      v-if="modalShow"
      v-slot:header-title="{ _class }"
      :class="isActiveClass"
      :lamp-for-edit="lampToWork"
      :existingrooms="existingrooms"
      @hook:mounted="editorMounted"
      @hook:destroyed="editorDestroyed"
      @quit="quitEventHandler"
      @save="saveEventHandler"
    >
      <h4 class="title is-2 has-text-warning" :class="_class">
        <span v-text="editorTitle" />
      </h4>
    </editor>
  </section>
</template>

<script>
// Todo disable edited lamp while editor is open!
import ButtonReload from '../components/ButtonReload'
import ButtonAdd from '../components/ButtonAdd'
import Lamp from '../components/DevicesLightsLamp'
import Editor from '../components/DevicesLightsEditor'
import { setTimeout } from 'timers'

export default {
  name: 'Lights',
  components: { ButtonReload, ButtonAdd, Lamp, Editor },
  data() {
    return {
      groupedLamps: [],
      lampToWork: {},
      editorMode: '',
      editorTitle: '',
      modalShow: false,
      isActiveClass: ''
    }
  },
  MODE_CREATE: 'create',
  MODE_MODIFY: 'modify',
  computed: {
    existingrooms() {
      return this.groupedLamps.map(g => g.id)
    }
  },
  watch: {
    editorMode(val) {
      // ToDo i18n
      switch (val) {
        case this.$options.MODE_CREATE:
          this.editorTitle = 'Loo lamp'
          this.modalShow = true
          break
        case this.$options.MODE_MODIFY:
          this.editorTitle = 'Muuda lampi'
          this.modalShow = true
          break
        default:
          this.closeEditor()
      }
    }
  },
  created() {
    // Can be combined with addtional component display while loading. "After Nav Fetch"
    this.ioGetAllLamps()
  },
  methods: {
    editorMounted() {
      this.$nextTick(() => (this.isActiveClass = 'is-active'))
    },
    closeEditor() {
      this.isActiveClass = ''
      this.editorTitle = ''
      setTimeout(() => (this.modalShow = false), 1000)
    },
    editorDestroyed() {
      this.lampToWork = null
    },
    create() {
      this.lampToWork = {
        id: 0,
        name: '',
        room: '', // ToDo room selection in future, or query to get existing rooms (browser).
        valuestep: 1 // Todo non-dimmable lamps have 1, dimmable valu between 0-0.5 (0.5 means 2 steps, smaller vale means more granual lamp controllability)
      }
      this.editorMode = this.$options.MODE_CREATE
    },
    quitEventHandler() {
      this.editorMode = null
    },
    saveEventHandler(lamp) {
      switch (this.editorMode) {
        case this.$options.MODE_CREATE:
          this.saveCreated(lamp)
          break
        case this.$options.MODE_MODIFY:
          this.saveModified(lamp)
          break
      }
      this.editorMode = null
    },
    saveCreated(lamp) {
      if (
        !lamp.room &&
        !lamp.name
        // Todo `&&...` add checks here
      ) {
        // ToDo say it with toast/snackbar/notification!
        return
      }
      // ToDo handle case when API do not respond!
      this.$socket.emit('lamp-add', lamp, ({ id, errors }) => {
        if (errors) {
          console.error(`lamp-add: API responded with errors: [${errors}]`)
          // ToDo say it with toast/snackbar/notification!
          return
        }
        lamp.id = id
        const group = this.groupedLamps.find(x => x.id == lamp.room)
        if (group) {
          group.items.push(lamp)
        } else {
          this.groupedLamps.push({ id: lamp.room, items: [lamp] })
        }
      })
      // ToDo say it with toast/snackbar/notification if event times out!
    },
    ioGetAllLamps() {
      this.$socket.emit(
        'get-all-room_lamps',
        data => (this.groupedLamps = data)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/devices_lights.scss';

.rooms-grid {
  display: grid;
  gap: 2.5rem;
  grid-auto-flow: dense;
  grid-template-columns: repeat(auto-fit, minmax($lamp-width, auto));
  .lamps-grid {
    display: grid;
    gap: 1.5rem;
    grid-auto-flow: dense;
    justify-content: start;
    grid-template-columns: repeat(auto-fit, minmax($lamp-width, auto));
  }
}
</style>
