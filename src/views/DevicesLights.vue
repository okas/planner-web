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
            @modify="modify($event, room.id)"
          ></lamp>
        </div>
      </section>
    </div>
    <transition :css="$options.tCss" @enter="tEnter" @leave="tLeave">
      <editor
        v-if="modalShow"
        :mode="editorMode"
        :device-for-edit="lampToWork"
        :existing-rooms="existingRooms"
        editor-id="lampEditor"
        :editor-title="editorTitle"
        @quit="quitEventHandler"
        @remove="removeEventHandler"
        @verifyDependents="ioGetLampDependents"
        @save="saveEventHandler"
      >
        <dependents
          v-if="lampDependents.length > 0"
          slot="show-dependents"
          :dependents="lampDependents"
          header-text="See lamp on seotud automaatidega"
          message-text="Lambi kustutamisel eemaldatakse see järgmistest automaatidest:"
        />
      </editor>
    </transition>
  </section>
</template>

<script>
import * as constants from '../constants/uiEditorConstants.js'
import ButtonReload from '../components/ButtonReload'
import ButtonAdd from '../components/ButtonAdd'
import Lamp from '../components/DevicesLightsLamp'
import Editor, { transitionMixin } from '../components/DevicesGeneralEditor'
import Dependents from '../components/DevicesDependentPresets'

export default {
  name: 'Lights',
  components: { ButtonReload, ButtonAdd, Lamp, Editor, Dependents },
  mixins: [transitionMixin],
  data() {
    return {
      groupedLamps: [],
      lampToWork: null,
      editorMode: '',
      editorTitle: '',
      modalShow: false,
      lampDependents: []
    }
  },
  computed: {
    existingRooms() {
      return this.groupedLamps.map(g => g.id)
    }
  },
  watch: {
    editorMode(val) {
      // ToDo i18n
      switch (val) {
        case constants.MODE_CREATE:
          this.editorTitle = 'Loo lamp'
          this.modalShow = true
          return
        case constants.MODE_MODIFY:
          this.editorTitle = 'Muuda lampi'
          this.modalShow = true
          return
        default:
          this.editorTitle = ''
          this.lampToWork = null
          this.modalShow = false
          return
      }
    },
    lampToWork() {
      this.lampDependents = []
    }
  },
  created() {
    // Can be combined with addtional component display while loading. "After Nav Fetch"
    this.ioGetAllLamps()
  },
  methods: {
    create() {
      this.lampToWork = {
        id: 0,
        name: '',
        room: '',
        valuestep: 1 // Todo non-dimmable lamps have 1, dimmable valu between 0-0.5
      }
      this.editorMode = constants.MODE_CREATE
    },
    modify(lamp, room) {
      this.lampToWork = { ...lamp, room }
      this.editorMode = constants.MODE_MODIFY
    },
    quitEventHandler() {
      this.editorMode = null
    },
    removeEventHandler(lampId) {
      const oldLampRoom = this.lampToWork.room
      this.editorMode = null
      const event = 'lamp-remove'
      this.$socket.emit(event, lampId, ({ status, errors }) => {
        if (errors && errors.length > 0) {
          console.error(`${event}: API responded with error: [ ${errors} ]`)
          return
        }
        if (status !== 'ok') {
          console.warn(
            `API event '${event}' responded with status [ ${status} ].`
          )
          if (status !== 'no-exist') {
            return
          }
        }
        // ToDo add some 'toast' notifications or useer to show if all was not 100% OK!
        const oldGroup = this.groupedLamps.find(x => x.id == oldLampRoom)
        this.deleteFromOldRoom(oldGroup.items, lampId)
      })
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
      const event = 'lamp-add'
      this.$socket.emit(event, lamp, ({ id, errors }) => {
        if (errors && errors.length > 0) {
          console.error(`${event}: API responded with errors: [ ${errors} ]`)
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
      const event = 'lamp-update'
      const { id: oldLampId, room: oldLampRoom } = this.lampToWork
      this.$socket.emit(event, lamp, ({ status, errors }) => {
        if (errors && errors.length > 0) {
          console.error(`${event}: API responded with errors: [ ${errors} ]`)
          // ToDo say it with toast/snackbar/notification if event times out!
          return
        }
        if (status !== 'ok') {
          console.warn(
            `API event '${event}' responded with status [ ${status} ].`
          )
          // ToDo say it with toast/snackbar/notification if event times out!
          return
        }
        const { room: mRoom, ...mLamp } = lamp
        const oldGroup = this.groupedLamps.find(x => x.id == oldLampRoom)
        if (oldLampRoom === mRoom) {
          Object.assign(oldGroup.items.find(l => l.id == oldLampId), mLamp)
        } else {
          this.deleteFromOldRoom(oldGroup.items, mLamp.id)
          this.upsertLampToGroup(mRoom, mLamp)
        }
      })
      // ToDo say it with toast/snackbar/notification if event times out!
    },
    deleteFromOldRoom(roomLamps, lampId) {
      if (roomLamps.length == 1) {
        this.groupedLamps.splice(this.groupedLamps.indexOf(roomLamps), 1)
      } else {
        roomLamps.splice(roomLamps.findIndex(x => x.id == lampId), 1)
      }
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
    },
    ioGetLampDependents(lampId) {
      this.$socket.emit('lamp-dependents', lampId, data => {
        this.lampDependents = data
      })
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
