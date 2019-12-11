<template>
  <section id="blinds">
    <header class="component-header">
      <slot name="header-title" :_class="'has-text-success'" />
      <p class="has-text-success">Roloode süsteemi armatuurlaud</p>
      <div class="commands field is-grouped is-marginless">
        <div class="control">
          <button-reload title="Värskenda serverist" @click="ioGetAllBlinds" />
        </div>
        <div class="control">
          <button-add title="Lisa ruloo" @click="create" />
        </div>
      </div>
    </header>
    <div class="rooms-grid">
      <section v-for="[room, blinds] of roomBlindsMap" :key="room" class="room">
        <h3 class="title is-4" v-text="room" />
        <div class="blinds-grid">
          <item
            v-for="blind in blinds"
            :key="blind.id"
            :blind="blind"
            @blindStateChanged="blindStateChangedHandler"
            @openEditor="modify"
          />
        </div>
      </section>
    </div>
    <transition :css="$options.tCss" @enter="tEnter" @leave="tLeave">
      <editor
        v-if="modalShow"
        :mode="editorMode"
        :device-for-edit="blindToWork"
        :existing-rooms="existingRooms"
        editor-id="blindEditor"
        :editor-title="editorTitle"
        @quit="quitEventHandler"
        @remove="removeEventHandler"
        @verifyDependents="ioGetBlindDependents"
        @save="saveEventHandler"
      >
        <dependents
          v-if="blindDependents.length > 0"
          slot="show-dependents"
          :dependents="blindDependents"
          header-text="See ruloo on seotud automaatidega"
          message-text="Ruloo kustutamisel eemaldatakse see järgmistest automaatidest:"
        />
      </editor>
    </transition>
  </section>
</template>

<script>
import * as constants from '../constants/uiEditorConstants'
import ButtonReload from '../components/ButtonReload'
import ButtonAdd from '../components/ButtonAdd'
import Item from '../components/DevicesBlindItem'
import Editor, { transitionMixin } from '../components/DevicesGeneralEditor'
import Dependents from '../components/DevicesDependentPresets'

export default {
  name: 'Blinds',
  components: { ButtonReload, ButtonAdd, Item, Editor, Dependents },
  mixins: [transitionMixin],
  data() {
    return {
      blindsData: [],
      blindToWork: null,
      editorMode: '',
      editorTitle: '',
      modalShow: false,
      blindDependents: []
    }
  },
  computed: {
    roomBlindsMap() {
      return this.blindsData.reduce((map, { room, ...blind }) => {
        let blinds = map.get(room)
        if (!blinds) {
          map.set(room, (blinds = []))
        }
        blinds.push(blind)
        return map
      }, new Map())
    },
    existingRooms() {
      return [...this.roomBlindsMap.keys()]
    }
  },
  watch: {
    editorMode(val) {
      // ToDo i18n
      if (val === constants.MODE_CREATE) {
        this.editorTitle = 'Loo ruloo'
        this.modalShow = true
      } else if (val === constants.MODE_MODIFY) {
        this.editorTitle = 'Muuda rulood'
        this.modalShow = true
      } else {
        this.modalShow = false
      }
    }
  },
  created() {
    // Can be combined with addtional component display while loading. "After Nav Fetch"
    this.ioGetAllBlinds()
  },
  socketRooms: ['blind', 'blind-state'],
  sockets: {
    reconnect() {
      this.ioGetAllBlinds()
    },
    blind__api_add(data) {
      this.blindsData.push(data)
    },
    blind__api_update(data) {
      Object.assign(
        this.blindsData.find(l => l.id === data.id),
        data
      )
    },
    blind__api_remove({ id }) {
      this.$delete(
        this.blindsData,
        this.blindsData.findIndex(x => x.id == id)
      )
    },
    blind__api_set_state({ id, state }) {
      this.setBlindState(id, state)
    },
    blind__api_present({ id, state }) {
      this.setBlindState(id, state)
    },
    blind__api_lost({ id }) {
      this.setBlindState(id, null)
    },
    devices__api_lost() {
      this.blindsData.forEach(l => (l.state = null))
    },
    devices__api_ready() {
      this.blindsData.forEach(this.ioGetBlindState)
    }
  },
  methods: {
    setBlindState(id, state) {
      const blind = this.blindsData.find(l => l.id == id)
      if (blind) {
        blind.state = state
      }
    },
    create() {
      this.blindToWork = {
        id: 0,
        name: '',
        room: '',
        /**
         * Tri-state property. Value null means no connection to device.
         * Values true or false indicate the state of the online device.
         */
        state: null,
        valuestep: 0.01
      }
      this.editorMode = constants.MODE_CREATE
    },
    modify(blindId) {
      this.blindToWork = this.blindsData.find(b => b.id === blindId)
      this.editorMode = constants.MODE_MODIFY
    },
    quitEventHandler() {
      this.editorMode = null
    },
    removeEventHandler(blindId) {
      this.editorMode = null
      const event = 'blind__remove'
      this.$socket.emit(event, blindId, ({ status, errors }) => {
        if (errors && errors.length > 0) {
          console.error(`${event}: API responded with error: [ ${errors} ]`)
          return
        }
        if (status !== 'ok') {
          console.warn(
            `API event '${event}' responded with status [ ${status} ].`
          )
          return
        }
        // ToDo add some 'toast' notifications or useer to show if all was not 100% OK!
        this.$delete(
          this.blindsData,
          this.blindsData.findIndex(x => x.id == blindId)
        )
      })
    },
    saveEventHandler(blind) {
      switch (this.editorMode) {
        case constants.MODE_CREATE:
          this.saveCreated(blind)
          break
        case constants.MODE_MODIFY:
          this.saveModified(blind)
          break
      }
      this.editorMode = null
    },
    saveCreated(blind) {
      const event = 'blind__add'
      // ToDo handle case when API do not respond!
      this.$socket.emit(event, blind, ({ id, errors }) => {
        if (errors && errors.length > 0) {
          console.error(`${event}: API responded with errors: [ ${errors} ]`)
          // ToDo say it with toast/snackbar/notification!
          return
        }
        blind.id = id
        this.ioGetBlindState(blind)
        this.blindsData.push(blind)
      })
      // ToDo say it with toast/snackbar/notification if event times out!
    },
    saveModified(blind) {
      const event = 'blind__update'
      this.$socket.emit(event, blind, ({ status, errors }) => {
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
        this.ioGetBlindState(blind)
        Object.assign(
          this.blindsData.find(l => l.id === blind.id),
          blind
        )
      })
      // ToDo say it with toast/snackbar/notification if event times out!
    },
    blindStateChangedHandler(id, state) {
      const event = 'blind__set_state'
      const payload = { id, state }
      this.$socket.emit(event, payload, ({ status, response, errors }) => {
        if (errors && errors.length > 0) {
          console.error(`${event}: API responded with errors: "${errors}"`)
          return
        }
        if (status !== 'ok') {
          console.warn(
            `API event '${event}' responded with status "${status}".`
          )
          return
        }
        if (response !== state) {
          console.warn(
            `API event '${event}' response indicates that new value was not set on server
            Expected new value "${state}"; API responded: "${response}".`
          )
        }
        this.setBlindState(id, response)
      })
    },
    ioGetAllBlinds() {
      this.$socket.emit('blind__get_all', data => {
        this.blindsData = data.map(blind => {
          blind.state = null
          this.ioGetBlindState(blind)
          return blind
        })
      })
    },
    ioGetBlindState(blind) {
      this.$socket.emit('blind__get_state', blind.id, data => {
        blind.state = data
      })
    },
    ioGetBlindDependents(blindId) {
      this.$socket.emit('blind__get_dependent_presets', blindId, data => {
        this.blindDependents = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/devices-blinds.scss';

.rooms-grid {
  display: grid;
  gap: 3rem;
  grid-auto-flow: dense;
  justify-content: start;
  grid-template-columns: repeat(auto-fit, minmax($blind-width, 1fr));
  .blinds-grid {
    display: grid;
    gap: 1.5rem;
    grid-auto-flow: dense;
    justify-content: start;
    grid-template-columns: repeat(auto-fit, minmax($blind-width, 1fr));
  }
}
</style>
