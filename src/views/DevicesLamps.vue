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
      <section v-for="[room, lamps] of roomLampsMap" :key="room" class="room">
        <h3 class="subtitle is-5 has-text-weight-light" v-text="room" />
        <div class="lamps-grid">
          <item
            v-for="lamp of lamps"
            :key="lamp.id"
            :lamp="lamp"
            @modify="modify($event, room.id)"
          ></item>
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
import Item from '../components/DevicesLampItem'
import Editor, { transitionMixin } from '../components/DevicesGeneralEditor'
import Dependents from '../components/DevicesDependentPresets'

export default {
  name: 'Lamps',
  components: { ButtonReload, ButtonAdd, Item, Editor, Dependents },
  mixins: [transitionMixin],
  data() {
    return {
      lampsData: [],
      lampToWork: null,
      editorMode: '',
      editorTitle: '',
      modalShow: false,
      lampDependents: []
    }
  },
  computed: {
    roomLampsMap() {
      return this.lampsData.reduce((map, { room, ...lamp }) => {
        let lamps = map.get(room)
        if (!lamps) {
          map.set(room, (lamps = []))
        }
        lamps.push(lamp)
        return map
      }, new Map())
    },
    existingRooms() {
      return [...this.roomLampsMap.keys()]
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
    modify(lampId) {
      this.lampToWork = this.lampsData.find(l => l.id === lampId)
      this.editorMode = constants.MODE_MODIFY
    },
    quitEventHandler() {
      this.editorMode = null
    },
    removeEventHandler(lampId) {
      this.editorMode = null
      const event = 'lamp__remove'
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
        this.$delete(
          this.lampsData,
          this.lampsData.findIndex(x => x.id == lampId)
        )
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
      const event = 'lamp__add'
      this.$socket.emit(event, lamp, ({ id, errors }) => {
        if (errors && errors.length > 0) {
          console.error(`${event}: API responded with errors: [ ${errors} ]`)
          // ToDo say it with toast/snackbar/notification!
          return
        }
        lamp.id = id
        this.lampsData.push(lamp)
      })
      // ToDo say it with toast/snackbar/notification if event times out!
    },
    saveModified(lamp) {
      const event = 'lamp__update'
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
        Object.assign(this.lampsData.find(l => l.id === lamp.id), lamp)
      })
      // ToDo say it with toast/snackbar/notification if event times out!
    },
    ioGetAllLamps() {
      this.$socket.emit('lamp__get-all', data => (this.lampsData = data))
    },
    ioGetLampDependents(lampId) {
      this.$socket.emit('lamp__get-dependent-presets', lampId, data => {
        this.lampDependents = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/devices_lamps.scss';

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
