<template>
  <section id="ligths">
    <header class="component-header">
      <slot name="header-title" :_class="'has-text-warning'" />
      <div class="commands field is-grouped is-marginless">
        <div class="control">
          <button-reload title="Värskenda serverist" @click="ioGetAllLamps" />
        </div>
        <div class="control">
          <button-add title="Lisa lamp" @click="create" />
        </div>
      </div>
    </header>
    <div class="rooms-grid">
      <section v-for="room in groupedLamps" :key="room.id" class="room">
        <h3 class="subtitle is-5 has-text-weight-light" v-text="room.id" />
        <div class="lamps-grid">
          <lamp
            v-for="lamp in room.items"
            :key="lamp.id"
            :lamp="lamp"
            @modify="modify({ room: room.id, lamp })"
          ></lamp>
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
import * as constants from '../constants/uiEditorConstants.js'
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
      lampToWork: null,
      editorMode: '',
      editorTitle: '',
      modalShow: false,
      isActiveClass: ''
    }
  },
  computed: {
    existingrooms() {
      return this.groupedLamps.map(g => g.id)
    }
  },
  watch: {
    editorMode(val) {
      // ToDo i18n
      switch (val) {
        case constants.MODE_CREATE:
          this.openEditorWithTitle('Loo lamp')
          break
        case constants.MODE_MODIFY:
          this.openEditorWithTitle('Muuda lampi')
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
    openEditorWithTitle(title) {
      this.editorTitle = title
      this.modalShow = true
    },
    closeEditor() {
      this.isActiveClass = ''
      this.editorTitle = ''
      setTimeout(() => {
        this.modalShow = false
        this.lampToWork = null
      }, 1000)
    },
    async editorMounted() {
      await this.$nextTick()
      this.isActiveClass = 'is-active'
    },
    create() {
      this.lampToWork = {
        id: 0,
        name: '',
        room: '',
        valuestep: 1 // Todo non-dimmable lamps have 1, dimmable valu between 0-0.5 (0.5 means 2 steps, smaller vale means more granual lamp controllability)
      }
      // ToDo avoid editor race, allow one at the time!
      this.editorMode = constants.MODE_CREATE
    },
    modify({ room, lamp }) {
      // ToDo avoid editor race, allow one at the time!
      this.lampToWork = { room, ...lamp }
      this.editorMode = constants.MODE_MODIFY
    },
    quitEventHandler() {
      this.editorMode = null
    },
    saveEventHandler(lamp) {
      switch (this.editorMode) {
        case constants.MODE_CREATE:
          this.saveCreated(lamp)
          break
        case constants.MODE_MODIFY:
          this.saveModified(lamp)
          break
      }
      this.editorMode = null
    },
    saveCreated(lamp) {
      // ToDo handle case when API do not respond!
      this.$socket.emit('lamp-add', lamp, ({ id, errors }) => {
        if (errors && errors.length > 0) {
          console.error(`lamp-add: API responded with errors: [ ${errors} ]`)
          // ToDo say it with toast/snackbar/notification!
          return
        }
        lamp.id = id
        const { room, ...nLamp } = lamp
        this.upsertLampToGroup(room, nLamp)
      })
      // ToDo say it with toast/snackbar/notification if event times out!
    },
    saveModified(lamp) {
      const oldLamp = this.lampToWork
      this.$socket.emit('lamp-update', lamp, ({ status, errors }) => {
        if (errors && errors.length > 0) {
          console.error(`lamp-update: API responded with errors: [ ${errors} ]`)
          // ToDo say it with toast/snackbar/notification if event times out!
          return
        }
        if (status !== 'ok') {
          console.warn(
            `API event 'lamp-update' responded with status [ ${status} ].`
          )
          // ToDo say it with toast/snackbar/notification if event times out!
          return
        }
        const { room: mRoom, ...mLamp } = lamp
        const oldGroup = this.groupedLamps.find(x => x.id == oldLamp.room)
        if (oldLamp.room === mRoom) {
          Object.assign(oldGroup.items.find(l => l.id == oldLamp.id), mLamp)
        } else {
          if (oldGroup.items.length == 1) {
            this.groupedLamps.splice(this.groupedLamps.indexOf(oldGroup), 1)
          } else {
            oldGroup.items.splice(
              oldGroup.items.findIndex(x => x.id == oldLamp.id),
              1
            )
          }
          this.upsertLampToGroup(mRoom, mLamp)
        }
      })
      // ToDo say it with toast/snackbar/notification if event times out!
    },
    upsertLampToGroup(room, lamp) {
      const group = this.groupedLamps.find(x => x.id == room)
      if (group) {
        group.items.push(lamp)
      } else {
        this.groupedLamps.push({ id: room, items: [lamp] })
      }
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
