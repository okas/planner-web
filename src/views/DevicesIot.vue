<template>
  <section id="iot">
    <header class="component-header">
      <slot name="header-title" :_class="'has-text-info'" />
      <p class="has-text-info">IoT asjade algseadistamine</p>
    </header>
    <div class="columns">
      <article class="column is-one-third">
        <header>
          <h4 class="subtitle is-4">Seadme ühenduse staatus</h4>
        </header>
        <p class="level is-marginless">
          <span class="level-left">
            <span class="level-item">
              <iot-icon v-bind="stateData" />
            </span>
            <span class="level-item">
              <span class="is-lowercase" v-text="stateData.text" />
            </span>
          </span>
        </p>
        <p>Seadme tunnus: {{ iotDeviceId }}</p>
        <p>IoT tüüp: {{ iotType }}</p>
        <p>Edenemine:</p>
        <pre
          class="additional-text"
          :disabled="!iotConnected"
          v-text="additionalText"
        />
      </article>
      <article class="column">
        <header>
          <h4 class="subtitle is-4">IoT seadme algseadistused</h4>
        </header>
        <form autocomplete="on" @submit.prevent="wsSendIotInitData">
          <fieldset :disabled="!iotConnected">
            <div class="field">
              <label class="label has-text-grey-light">SSID</label>
              <div class="control">
                <input
                  v-model="ssid"
                  class="input"
                  type="text"
                  placeholder="sisesta võrgu nimi"
                  minlength="1"
                  maxlength="32"
                  required
                />
              </div>
            </div>
            <div class="field">
              <label class="label has-text-grey-light">Võti</label>
              <div class="control">
                <input
                  v-model="psk"
                  class="input"
                  type="password"
                  placeholder="sisesta võti"
                  minlength="8"
                  maxlength="64"
                  required
                />
              </div>
            </div>
            <fieldset class="field">
              <legend class="label has-text-grey-light">Väljundid</legend>
              <div class="field is-grouped">
                  <tree-select
                  v-for="o of outputs"
                  :key="o.id"
                    v-model="o.value"
                    :options="$options.deviceTypes"
                    :placeholder="`${o.id}: vali...`"
                  >
                    <div
                      slot="value-label"
                      slot-scope="{ node }"
                      :class="{
                        'has-text-info has-text-weight-semibold': o.id
                      }"
                      v-text="`${o.id}: ${node.label}`"
                    />
                  </tree-select>
                </div>
            </fieldset>
            <div class="field">
              <div class="control">
                <button type="submit" class="button is-primary">
                  Seadista
                </button>
              </div>
            </div>
          </fieldset>
        </form>
      </article>
    </div>
    <article>
      <header>
        <h4 class="subtitle is-4">Töövoo kirjeldus</h4>
      </header>
      <ol>
        <li>
          Pane seade
          <i class="is-italic">Algseadistuse</i> režiimi, umbes 5 sek
          nupuvajutus seadmel.
        </li>
        <li>Ühendu WiFi võrku, mille nimi (SSID) on sarnane: ESP_XXXXXX.</li>
        <li>
          Seejärel oota kuni staatus näitab ühendust ja kuvatakse seadme
          praegune info.
        </li>
        <li>
          Nüüd on valmidus salvestada kodu WiFi võrgu nimi (SSID) ja kood.
          Salvesta algseaded.
        </li>
        <li>
          Oota, kuni seade saadab tagasiside salvestuse edukuse kohta, võib
          kuluda kuni 30 sekundit.
        </li>
        <ul>
          <li>Kui staatus on edukas, siis on seade kasutusvalmis.</li>
          <li>
            IoT seade sulgeb
            <i class="is-italic">Algseadistuse</i> režiimi automaatselt.
          </li>
        </ul>
        <li>Ühenda tagasi kodu WiFi võrkku.</li>
      </ol>
    </article>
  </section>
</template>

<script>
import ReconnectingWebSocket from 'reconnecting-websocket'
import TreeSelect from '@riophae/vue-treeselect'
import IotIcon from '../components/DevicesIotIcon'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

/** @type {ReconnectingWebSocket} */
let rws

const iotTypes = {
  'generic-2out': 'Üldine kahe täituriga seade'
}
Object.freeze(iotTypes)

const initStates = {
  OFFLINE: Symbol('0: OFFLINE'),
  IDLE: Symbol('1: IDLE') /* connected */,
  SUCCEED: Symbol('2: SUCCEED'),
  FAILED: Symbol('3: FAILED'),
  SAVING: Symbol('4: SAVING')
}
Object.freeze(initStates)

const deviceTypes = [
  { id: 'lamp', label: 'Lamp' },
  { id: 'blind', label: 'Ruloo' }
]
Object.freeze(deviceTypes)

class UIState {
  /** @type {String} */
  icon
  /** @type {String} */
  iconClasses
  /** @type {String} */
  iconEffect
  /** @type {String} */
  iconEffectClasses
  /** @type {String} */
  text
  /**
   * @param {String} icon
   * @param {String} iconClasses
   * @param {String} iconEffect
   * @param {String} iconEffectClasses
   * @param {String} text
   */
  constructor(icon, iconClasses, iconEffect, iconEffectClasses, text) {
    this.icon = icon
    this.iconClasses = iconClasses
    this.iconEffect = iconEffect
    this.iconEffectClasses = iconEffectClasses
    this.text = text
  }
}

export default {
  components: { TreeSelect, IotIcon },
  data() {
    return {
      /** @type {String} */
      iotDeviceId: '',
      /** @type {String} */
      iotType: '',
      /** @type {String} */
      ssid: '',
      /** @type {String} */
      psk: '',
      /** @type {Array.<{id: Number, value: String}>} */
      outputs: [],
      /** @type {Symbol} */
      initState: initStates.OFFLINE,
      /** @type {Map<Symbol, UIState>} */
      initStateData: null,
      /** @type {String} */
      additionalText: '',
      iotLastInitState: { step: '', desc: '' }
    }
  },
  computed: {
    iotConnected() {
      return this.initState != initStates.OFFLINE
    },
    hasConfig() {
      return (
        this.ssid && this.outputs.length > 0 && this.iotType && this.iotDeviceId
      )
    },
    stateData() {
      return this.initStateData.get(this.initState)
    },
    ioIconTitle() {
      return this.iotConnected ? 'IoT seadmega ühendatud' : 'Pole IoT ühendust'
    }
  },
  deviceTypes: deviceTypes,
  created() {
    const icon = 'microchip',
      connected = 'Ühendatud | ',
      warning = 'has-text-warning',
      info = 'has-text-info',
      success = 'has-text-success',
      danger = 'has-text-danger'
    this.initStateData = new Map([
      [initStates.OFFLINE, new UIState(icon, '', 'ban', danger, 'Ühenduseta')],
      [initStates.IDLE, new UIState(icon, info, '', '', `${connected}ootel`)],
      [
        initStates.SUCCEED,
        new UIState(
          icon,
          success,
          'check-circle',
          info,
          `${connected}seaded salvestatud`
        )
      ],
      [
        initStates.FAILED,
        new UIState(
          icon,
          warning,
          'times-circle',
          danger,
          `${connected}vead salvestusel`
        )
      ],
      [
        initStates.SAVING,
        new UIState(
          icon,
          warning,
          'cog',
          'has-text-info fa-spin',
          'Salvestamine pooleli'
        )
      ]
    ])
  },
  mounted() {
    rws = new ReconnectingWebSocket('ws://192.168.4.1:81', [], {
      // ToDO use port 80 and show hint to open SPA
      reconnectionDelayGrowFactor: 1.25,
      maxReconnectionDelay: 2500,
      minReconnectionDelay: 2000,
      connectionTimeout: 2000,
      minUptime: 1000
    })
    rws.onopen = this.wsOnOpen
    rws.onclose = rws.onerror = this.wsOnClose
    rws.onmessage = this.wsMessageHandler
  },
  beforeDestroy() {
    rws.close()
  },
  methods: {
    wsOnOpen(wsEvent) {
      console.log(wsEvent)
      this.initState = initStates.IDLE
      rws.send('["get-initState"]')
    },
    wsOnClose(wsEvent) {
      console.log(wsEvent)
      if (this.initState != initStates.SAVING) {
        this.initState = initStates.OFFLINE
        this.clearConfig()
      }
    },
    wsMessageHandler(wsEvent) {
      console.log(wsEvent)
      const [subject, objData] = JSON.parse(wsEvent.data)
      switch (subject) {
        case 'get-initState-R':
        case 'set-initValues-R':
          this.wsBrancheOnProcState(objData)
          break
        case 'get-currentConfig-R':
          this.extractConfig(objData)
      }
    },
    wsBrancheOnProcState(incomingObj) {
      const { state, stateDetails, ...rest } = incomingObj
      this.handleStateDetails(stateDetails)
      switch (state) {
        case 1:
          this.initState = initStates.IDLE
          this.extractConfig(rest)
          return
        case 2:
          this.initState = initStates.SUCCEED
          break
        case 3:
          this.initState = initStates.FAILED
          break
        case 4:
          this.initState = initStates.SAVING
          break
        default:
          /* invalid response! */
          this.initState = initStates.FAILED
          this.additionalText = `IoT init: bad IoT State code ${state}`
          return
      }
      if (!this.hasConfig) {
        rws.send('["get-currentConfig"]')
      }
    },
    wsSendIotInitData() {
      this.initState = initStates.SAVING
      const payload = JSON.stringify([
        'set-initValues',
        {
          ssid: this.ssid,
          psk: this.psk,
          outputs: this.outputs.map(o => o.value)
        }
      ])
      rws.send(payload)
    },
    extractConfig(data) {
      const { iotDeviceId, iotType, ssid, psk, outputs } = data
      this.iotDeviceId = iotDeviceId
      this.iotType = iotTypes[iotType]
      this.ssid = ssid
      this.psk = psk
      /* Default value: null is for TreeSelect Component better behavior. */
      this.outputs = outputs.map((v, i) => ({ id: ++i, value: v || null }))
    },
    clearConfig() {
      this.iotDeviceId = null
      this.ssid = null
      this.psk = null
      this.iotType = null
      this.outputs.length = 0
    },
    /** @param {[{}]} details details */
    handleStateDetails(details) {
      if (!details || details.length == 0) {
        return
      }
      const notEmpty = !!this.additionalText.length
      const iLast = details.length - 1
      details.forEach((data, i) => {
        if (i != 0 || notEmpty) {
          this.additionalText += '\n'
        }
        const [step, desc] = Object.entries(data)[0]
        this.additionalText += `${step}: ${desc}`
        if (i == iLast) {
          Object.assign(this.iotLastInitState, { step, desc })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
article:not(:last-of-type) {
  margin-bottom: 1.5rem;
}
ol,
ul {
  margin-left: 1.5rem;
}
.additional-text {
  padding: 0.5rem 0.75rem;
}
</style>
