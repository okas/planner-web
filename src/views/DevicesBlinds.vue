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
      <section v-for="room of groupedBlinds" :key="room.id" class="room">
        <h3 class="title is-4" v-text="room.id" />
        <div class="remotes-grid">
          <remote
            v-for="blind in room.items"
            :key="blind.id"
            :blind="blind"
            @modify="modify({ room: room.id, blind })"
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
import Remote from '../components/DevicesBlindsRemote'
import Editor, { transitionMixin } from '../components/DevicesGeneralEditor'
import Dependents from '../components/DevicesDependentPresets'

export default {
  name: 'Blinds',
  components: { ButtonReload, ButtonAdd, Remote, Editor, Dependents },
  mixins: [transitionMixin],
  data() {
    return {
      groupedBlinds: [],
      blindToWork: null,
      editorMode: '',
      editorTitle: '',
      modalShow: false,
      blindDependents: []
    }
  },
  computed: {
    existingRooms() {
      return this.groupedBlinds.map(g => g.id)
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
  methods: {
    create() {
      this.blindToWork = {
        id: 0,
        name: '',
        room: '',
        valuestep: 0.01
      }
      this.editorMode = constants.MODE_CREATE
    },
    modify({ room, blind }) {
      this.blindToWork = { room, ...blind }
      this.editorMode = constants.MODE_MODIFY
    },
    quitEventHandler() {
      this.editorMode = null
    },
    removeEventHandler() {
      const oldBlind = this.blindToWork
      this.editorMode = null
      const event = 'blind-remove'
      this.$socket.emit(event, oldBlind.id, ({ status, errors }) => {
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
        const oldGroup = this.groupedBlinds.find(x => x.id == oldBlind.room)
        this.deleteFromOldRoom(oldGroup.items, oldBlind)
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
      const event = 'blind-add'
      // ToDo handle case when API do not respond!
      this.$socket.emit(event, blind, ({ id, errors }) => {
        if (errors && errors.length > 0) {
          console.error(`${event}: API responded with errors: [ ${errors} ]`)
          // ToDo say it with toast/snackbar/notification!
          return
        }
        blind.id = id
        const { room, ...nBlind } = blind
        this.upsertBlindToGroup(room, nBlind)
      })
      // ToDo say it with toast/snackbar/notification if event times out!
    },
    saveModified(blind) {
      const event = 'blind-update'
      const oldBlind = this.blindToWork
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
        const { room: mRoom, ...mBlind } = blind
        const oldGroup = this.groupedBlinds.find(x => x.id == oldBlind.room)
        if (oldBlind.room === mRoom) {
          Object.assign(oldGroup.items.find(l => l.id == oldBlind.id), mBlind)
        } else {
          this.deleteFromOldRoom(oldGroup.items, oldBlind)
          this.upsertBlindToGroup(mRoom, mBlind)
        }
      })
      // ToDo say it with toast/snackbar/notification if event times out!
    },
    deleteFromOldRoom(roomBlinds, blind) {
      if (roomBlinds.length == 1) {
        this.groupedBlinds.splice(this.groupedBlinds.indexOf(roomBlinds), 1)
      } else {
        roomBlinds.splice(roomBlinds.findIndex(x => x.id == blind.id), 1)
      }
    },
    upsertBlindToGroup(room, blind) {
      const group = this.groupedBlinds.find(x => x.id == room)
      if (group) {
        group.items.push(blind)
      } else {
        this.groupedBlinds.push({ id: room, items: [blind] })
      }
    },
    ioGetAllBlinds() {
      this.$socket.emit(
        'get-all-room_blinds',
        data => (this.groupedBlinds = data)
      )
    },
    ioGetBlindDependents(blindId) {
      this.$socket.emit('blind-dependents', blindId, data => {
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
  grid-template-columns: repeat(auto-fit, minmax($remote-width, 1fr));
  .remotes-grid {
    display: grid;
    gap: 1.5rem;
    grid-auto-flow: dense;
    justify-content: start;
    grid-template-columns: repeat(auto-fit, minmax($remote-width, 1fr));
  }
}
</style>
