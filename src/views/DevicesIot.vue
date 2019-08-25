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
              <i class="icon is-medium">
                <fa-l class="fa">
                  <fa-i
                    :icon="stateData.icon"
                    :class="stateData.iconClasses"
                    class="fa-2x"
                  />
                  <transition name="fade">
                    <fa-i
                      v-if="stateData.iconEffect"
                      class="fa-lg"
                      :class="stateData.iconEffectClasses"
                      :icon="stateData.iconEffect"
                      transform="right-4"
                    />
                  </transition>
                </fa-l>
              </i>
            </span>
            <span class="level-item">
              <span class="is-lowercase" v-text="stateData.text" />
            </span>
          </span>
        </p>
        <p>Nimi: {{ hostname }}</p>
        <p>IoT tüüp: {{ iotType }}</p>
        <p v-text="additionalText" />
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
                  maxlength="63"
                  required
                />
              </div>
            </div>
            <div class="field">
              <label class="label has-text-grey-light">IoT seadme ID</label>
              <div class="control">
                <input
                  v-model="iotDeviceId"
                  class="input"
                  type="text"
                  placeholder="sisesta SaarTK süsteemi poolt genereeritud seadme ID"
                  required
                />
              </div>
            </div>
            <fieldset class="field">
              <legend class="label has-text-grey-light">Väljundid</legend>
              <div class="field is-grouped">
                <div v-for="a of actuators" :key="a.id" class="control">
                  <input
                    :id="a.id"
                    v-model="a.value"
                    class="switch is-outlined"
                    type="checkbox"
                  />
                  <label
                    class="label has-text-grey-light"
                    :for="a.id"
                    v-text="a.id"
                  />
                </div>
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
        <li>Ühendu WiFi võrku, mille nimi (SSID) on sarnane: ESP_XXXXXX.</li>
        <li>
          Seejärel oota kuni staatus näitab ühendust ja kuvatakse seadme
          riistvara tunnus.
        </li>
        <li>
          Nüüd on valmidus salvestada kodu WiFi võrgu nimi (SSID) ja kood.
          Salvesta algseaded.
        </li>
        <li>
          Edukast seadistamisest antakse teada, ühenduse pilveke näitab ühenduse
          puudumist.
          <ul>
            <li>
              See tähendab, et IoT seade ei serveeri enam algseadistuse võrku,
              sest see on nüüd ühenduses kodu WiFi võrguga.
            </li>
          </ul>
        </li>
        <li>Ühenda oma seade uuesti kodu WiFi võrkku.</li>
        <li>Seade on nüüd kasutusvalmis.</li>
      </ol>
    </article>
  </section>
</template>

<script>
import ReconnectingWebSocket from 'reconnecting-websocket'

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
  data() {
    return {
      /** @type {String} */
      ssid: null,
      /** @type {String} */
      psk: null,
      /** @type {String} */
      hostname: null,
      /** @type {Array.<{id: String, value: String}>} */
      actuators: [],
      /** @type {String} */
      iotType: null,
      /** @type {String} */
      iotDeviceId: null,
      /** @type {Symbol} */
      initState: initStates.OFFLINE,
      /** @type {Map<Symbol, UIState>} */
      initStateData: null,
      /** @type {String} */
      additionalText: null
    }
  },
  computed: {
    iotConnected() {
      return this.initState != initStates.OFFLINE
    },
    hasConfig() {
      return (
        this.ssid &&
        this.hostname &&
        this.actuators.length > 0 &&
        this.iotType &&
        this.iotDeviceId
      )
    },
    stateData() {
      return this.initStateData.get(this.initState)
    },
    ioIconTitle() {
      return this.iotConnected ? 'IoT seadmega ühendatud' : 'Pole IoT ühendust'
    }
  },
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
      reconnectionDelayGrowFactor: 1,
      maxReconnectionDelay: 1000,
      minReconnectionDelay: 1000,
      connectionTimeout: 500,
      minUptime: 250
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
      rws.send('get-initState')
    },
    wsOnClose(wsEvent) {
      console.log(wsEvent)
      if (this.initState != initStates.SAVING) {
        this.initState = initStates.OFFLINE
        this.clearConfig()
      }
    },
    wsMessageHandler(wsEvent) {
      console.log(event)
      const [subject, ...data] = wsEvent.data.split('\n')
      switch (subject) {
        case 'get-initState-R':
        case 'set-initValues-R':
          this.wsBrancheOnProcState(data)
          break
        case 'get-currentConfig-R':
          this.extractConfig(data.slice(1))
      }
    },
    wsBrancheOnProcState(incomingData) {
      this.additionalText = null
      const [state, ...data] = incomingData
      switch (state) {
        case '1' /* idle */:
          this.initState = initStates.IDLE
          this.extractConfig(data)
          return
        case '2' /* last value set succeed | */:
          this.initState = initStates.SUCCEED
          break
        case '3' /* last value set  failed */:
          this.initState = initStates.FAILED
          break
        case '4' /* working, tray again */:
          this.initState = initStates.SAVING
          return
        default:
          /* invalid response! */
          this.initState = initStates.FAILED
          this.additionalText = `IoT init: bad state code ${state}`
          return
      }
      if (!this.hasConfig) {
      rws.send('get-currentConfig')
      }
    },
    wsSendIotInitData() {
      let payload = `set-initValues\n${this.ssid}\n${this.psk}\n${
        this.iotDeviceId
      }`
      this.actuators.forEach(a => (payload += `\n${+a.value}`))
      this.initState = initStates.SAVING
      rws.send(payload)
    },
    extractConfig(data) {
      const [hostname, ssid, psk, iotDeviceId, type, ...outputs] = data
      this.hostname = hostname
      this.ssid = ssid
      this.psk = psk
      this.iotDeviceId = iotDeviceId
      this.iotType = iotTypes[type]
      this.actuators = outputs.map((v, i) => ({
        id: i + 1,
        value: !!+v
      }))
    },
    clearConfig() {
      this.hostname = null
      this.ssid = null
      this.psk = null
      this.iotDeviceId = null
      this.iotType = null
      this.actuators.length = 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css_fade_transition.scss';

article:not(:last-of-type) {
  margin-bottom: 1.5rem;
}
ol,
ul {
  margin-left: 1.5rem;
}
</style>
