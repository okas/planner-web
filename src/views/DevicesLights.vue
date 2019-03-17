<template>
  <section id="ligths">
    <header class="component-header">
      <slot name="header-title" :_class="'has-text-warning'" />
      <div class="commands field is-grouped is-marginless">
        <button-reload title="Värskenda serverist" @click="ioGetAllLamps" />
        <button-add
          data-target="quickviewLamp"
          data-show="quickview"
          title="Lisa automaattoiming"
          @click="create"
        />
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
      v-slot:header-title="{ _class }"
      :lamp-for-edit="lampToWork"
      :existingrooms="existingrooms"
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
import BulmaQuickview from 'bulma-extensions/bulma-quickview/src/js'
import ButtonReload from '../components/ButtonReload'
import ButtonAdd from '../components/ButtonAdd'
import Lamp from '../components/DevicesLightsLamp'
import Editor from '../components/DevicesLightsEditor'

export default {
  name: 'Lights',
  components: { ButtonReload, ButtonAdd, Lamp, Editor },
  data() {
    return {
      groupedLamps: [],
      lampToWork: this.getEmptyLamp(),
      editorMode: ''
    }
  },
  MODE_CREATE: 'create',
  MODE_MODIFY: 'modify',
  computed: {
    editorTitle() {
      // ToDo i18n
      switch (this.editorMode) {
        case this.$options.MODE_CREATE:
          return 'Loo lamp'
        case this.$options.MODE_MODIFY:
          return 'Muuda lampi'
        default:
          return ''
      }
    },
    existingrooms() {
      return this.groupedLamps.map(g => g.id)
    }
  },
  created() {
    // Can be combined with addtional component display while loading. "After Nav Fetch"
    this.ioGetAllLamps()
  },
  mounted() {
    BulmaQuickview.attach()
  },
  methods: {
    getEmptyLamp() {
      return {
        id: 0,
        name: '',
        room: '', // ToDo room selection in future, or query to get existing rooms (browser).
        valuestep: 1 // Todo non-dimmable lamps have 1, dimmable valu between 0-0.5 (0.5 means 2 steps, smaller vale means more granual lamp controllability)
      }
    },
    create() {
      this.editorMode = this.$options.MODE_CREATE
      this.lampToWork = this.getEmptyLamp()
    },
    quitEventHandler() {
      this.lampToWork = this.getEmptyLamp()
      this.editorMode = null
    },
    saveEventHandler(lamp) {
      if (this.editorMode === this.$options.MODE_CREATE) {
        this.saveCreated(lamp)
      } else if (this.editorMode === this.$options.MODE_MODIFY) {
        this.saveModified(lamp)
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
        this.lampToWork = this.getEmptyLamp()
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
