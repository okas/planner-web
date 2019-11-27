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
        <p>
          Seadme tunnus:
          <samp
            :class="{ 'status--value': iotDeviceId }"
            v-text="iotDeviceId"
          />
        </p>
        <p>
          IoT tüüp:
          <samp :class="{ 'status--value': iotType }" v-text="iotType" />
        </p>
        <p>
          Serveris olemas:
          <samp
            class="status--value"
            v-text="isInServer ? 'jah' : 'ilmselt ei'"
          />
        </p>
        <p>Edenemine:</p>
        <pre
          class="additional-text"
          :disabled="!iotConnected"
          v-text="additionalText"
        />
      </article>
      <div class="column">
        <article>
          <header>
            <h4 class="subtitle is-4">IoT seadme algseadistused</h4>
          </header>
          <form autocomplete="on" @submit.prevent="wsSendIotInitData">
            <fieldset :disabled="!iotConnected">
              <div class="field">
                <label :class="['label', ssidState.class]">SSID</label>
                <div class="control">
                  <input
                    v-model="ssid"
                    :class="['input', ssidState.class1]"
                    type="text"
                    placeholder="sisesta võrgu nimi"
                    minlength="1"
                    maxlength="32"
                    required
                  />
                </div>
                <help v-bind="ssidState" />
              </div>
              <div class="field">
                <label :class="['label', pskState.class]">Võti</label>
                <div class="control">
                  <input
                    v-model="psk"
                    :class="['input', pskState.class1]"
                    type="password"
                    placeholder="sisesta võti"
                    minlength="8"
                    maxlength="64"
                    required
                  />
                </div>
                <help v-bind="pskState" />
              </div>
              <div class="field">
                <label :class="['label', outputsState.class]"
                  >Väljundid (serverist)</label
                >
                <div class="filed-body">
                  <div class="field is-horizontal">
                    <div
                      v-for="output of outputs"
                      :key="output._id"
                      class="output"
                    >
                      <label
                        :class="[
                          'output--label label help',
                          output.id ? outputsState.class : 'has-text-warning'
                        ]"
                        v-text="`id: ${output.id}`"
                      />
                      <tree-select
                        v-model="output.usage"
                        class="output--control"
                        :options="$options.deviceTypes"
                        :placeholder="`${output._id}: vali...`"
                      >
                        <div
                          slot="value-label"
                          slot-scope="{ node }"
                          :class="[
                            { 'has-text-weight-semibold': output._id },
                            output._id ? outputsState.class2 : ''
                          ]"
                          v-text="`${output._id}: ${node.label}`"
                        />
                      </tree-select>
                    </div>
                  </div>
                </div>
                <help v-bind="outputsState" />
              </div>
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
        <article>
          <header>
            <h5 class="subtitle is-5">Vead serverisse salestamisel</h5>
          </header>
          <ul>
            <li
              v-for="(error, i) of serverErrors"
              :key="i"
              style="border: 1px solid black"
            >
              <samp v-text="error" />
            </li>
          </ul>
          <header>
            <h5 class="subtitle is-5">Serveris olevad seadistused</h5>
          </header>
          <p>Paistab selle selle IoT seadme info on serveris olemas</p>
          <h6 class="subtitle is-6">Kas kirjutame serveri seadistuse üle?</h6>
          <pre v-text="serverExistingConfigJSONString" />
        </article>
      </div>
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
        <li>
          Ühendu WiFi võrku, mille nimi (SSID) on sarnane:
          <i class="is-italic">ESP_XXXXXX</i>.
        </li>
        <ul>
          <li>
            Kui paned ajutiselt "ühenda automaatselt", siis on seadistusprotsess
            mugavam.
          </li>
        </ul>
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
        <li>Ühenda oma masin tagasi kodu WiFi võrkku.</li>
        <ul>
          <li>
            Vajadusel pane koduvõrgule tagasi "ühenda automaatselt", kui seda
            <i class="is-italic">ESP_XXXXXX</i> ühendudes muutsid.
          </li>
        </ul>
      </ol>
    </article>
  </section>
</template>

<script>
import Help from '../components/DevicesIotFormHelp'
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
  SAVING: Symbol('4: SAVING'),
  UNKNOWN: Symbol('x: UNKNOWN')
}
Object.freeze(initStates)

const deviceTypes = [
  { id: 'lamp', label: 'Lamp' },
  { id: 'blind', label: 'Ruloo' }
]
Object.freeze(deviceTypes)

const txtClass = {
  // TODO Move out of Vue component object
  warning: 'has-text-warning',
  info: 'has-text-info',
  success: 'has-text-success',
  danger: 'has-text-danger',
  greyLight: 'has-text-grey-light'
}
Object.freeze(txtClass)

const auxClass = {
  // TODO Move out of Vue component object
  warning: 'is-warning',
  info: 'is-info',
  success: 'is-success',
  danger: 'is-danger'
}
Object.freeze(auxClass)

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
  components: { TreeSelect, IotIcon, Help },
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
      /** @type {Array.<{id: Number; usage: string; _id: number}>} */
      outputs: [],
      /** @type {Symbol} */
      initState: initStates.OFFLINE,
      /** @type {Map<Symbol, UIState>} */
      initStateData: null,
      /** @type {String} */
      additionalText: '',
      iotLastInitState: { state: '', step: '', desc: '' },
      ssidState: { class: '', txt: '', class1: '' },
      pskState: { class: '', txt: '', class1: '' },
      outputsState: { class: '', txt: '', class1: '', class2: '' },
      /** @type {string[]} */
      serverErrors: [],
      serverExistingConfig: {}
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
    isInServer() {
      return this.outputs.length > 0 && this.outputs.every(({ id }) => id)
    },
    stateData() {
      return this.initStateData.get(this.initState)
    },
    ioIconTitle() {
      return this.iotConnected ? 'IoT seadmega ühendatud' : 'Pole IoT ühendust'
    },
    serverExistingConfigJSONString() {
      return Object.entries(this.serverExistingConfig).length > 0
        ? JSON.stringify(this.serverExistingConfig, null, 2)
        : ''
    }
  },
  watch: {
    iotConnected: function(val) {
      if (!val) {
        this.uiGenericReset()
      }
    },
    iotLastInitState: {
      immediate: true,
      deep: true,
      handler: 'handleUIChangesOnIoTState'
    }
  },
  deviceTypes: deviceTypes,
  created() {
    const icon = 'microchip',
      connected = 'Ühendatud | '
    this.initStateData = new Map([
      [
        initStates.OFFLINE,
        new UIState(icon, '', 'ban', txtClass.danger, 'Ühenduseta')
      ],
      [
        initStates.IDLE,
        new UIState(icon, txtClass.info, '', '', `${connected}ootel`)
      ],
      [
        initStates.SUCCEED,
        new UIState(
          icon,
          txtClass.success,
          'check-circle',
          txtClass.info,
          `${connected}seaded salvestatud`
        )
      ],
      [
        initStates.FAILED,
        new UIState(
          icon,
          txtClass.warning,
          'times-circle',
          txtClass.danger,
          `${connected}vead salvestusel`
        )
      ],
      [
        initStates.SAVING,
        new UIState(
          icon,
          txtClass.warning,
          'cog',
          `${txtClass.info} fa-spin`,
          'Salvestamine pooleli'
        )
      ]
    ])
    // this.serverExistingConfig = JSON.parse(
    //   '{"id":"bcddc29d6497","iottype":"generic-2out","outputs":[{"id":6604002963763495000,"usage":"lamp"},{"id":6604002963767689000,"usage":"blind"}]}'
    // )
    // this.serverErrors = JSON.parse(
    //   "[\"attempted object didn't have valid {[output.id]} value: '0'\",\"data mismatch, {[output.id]}: incoming has {0}; database has '6604002963763495000'\",\"attempted object didn't have valid {[output.id]} value: '0'\",\"data mismatch, {[output.id]}: incoming has {0}; database has '6604002963767689000'\"]"
    // )
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
      const [subject, { state, stateDetails, ...objData }] = JSON.parse(
        wsEvent.data
      )
      this.handleIoTState(state)
      this.handleStateDetails(stateDetails)
      switch (subject) {
        case 'set-initValuesUpdate-R':
        // TOTO: here: this.serverExistingConfig. Clear existing, when response is OK
        case 'get-initState-R':
        case 'set-initValues-R':
          this.wsBrancheOnProcState(state, objData)
          break
        case 'get-currentConfig-R':
          this.extractConfig(objData)
      }
    },
    wsBrancheOnProcState(stateCode, objData) {
      switch (this.initState) {
        case initStates.FAILED:
          this.handleInitErrors(objData)
          break
        case initStates.IDLE:
          this.extractConfig(objData)
          return
        case initStates.UNKNOWN:
          this.initState = initStates.FAILED
          this.additionalText = `IoT init: bad IoT State code ${stateCode}`
          break
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
          outputs: this.outputs.map(({ _id, ...restOutput }) => restOutput)
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
      this.outputs = outputs.map(({ id, usage }, i) => ({
        id,
        usage: usage || null,
        _id: ++i
      }))
    },
    clearConfig() {
      this.iotDeviceId = null
      this.ssid = null
      this.psk = null
      this.iotType = null
      this.outputs.length = 0
    },
    handleIoTState(stateCode) {
      switch (stateCode) {
        case 1:
          this.initState = initStates.IDLE
          return
        case 2:
          this.initState = initStates.SUCCEED
          return
        case 3:
          this.initState = initStates.FAILED
          return
        case 4:
          this.initState = initStates.SAVING
          return
        default:
          /* invalid response! */
          this.initState = initStates.UNKNOWN
          return
      }
    },
    /**
     * @param {[{}]} details details
     */
    handleStateDetails(stateDetails) {
      if (!stateDetails || stateDetails.length == 0) {
        return
      }
      const notEmpty = !!this.additionalText.length
      const iLast = stateDetails.length - 1
      stateDetails.forEach((data, i) => {
        if (i != 0 || notEmpty) {
          this.additionalText += '\n'
        }
        const [step, desc] = Object.entries(data)[0]
        this.additionalText += `${step}: ${desc}`
        if (i == iLast) {
          Object.assign(this.iotLastInitState, {
            state: this.initState,
            step,
            desc
          })
        }
      })
    },
    // handleInitErrors({ errors, existing, ...unknown }) {
    handleInitErrors({ apiresult: { errors, existing } = {}, ...other }) {
      if (errors) {
        this.serverErrors = errors
      }
      if (existing) {
        this.serverExistingConfig = existing
      }
    },
    handleUIChangesOnIoTState({ state, step, desc }) {
      this.uiGenericReset()
      switch (step) {
        case 'wifi':
          if (desc == 'WL_CONNECTED' || desc == 'WL_IDLE_STATUS') {
            this.uiWiFiConnected()
          } else if (desc == 'WL_DISCONNECTED' && state == initStates.FAILED) {
            this.uiWiFiDisconnectedAndFailed()
          } else if (desc == 'WL_NO_SSID_AVAIL') {
            this.uiWiFiNoSSID()
          } else if (desc == 'WL_CONNECT_FAILED') {
            this.uiWiFiConnectFailed()
          }
          if (desc != 'WL_CONNECTED') {
            this.uiWiFiNotConnected()
          }
          return
        case 'mqtt':
          if (
            desc == 'LWMQTT_CONNECTION_ACCEPTED' ||
            desc == 'LWMQTT_SUCCESS'
          ) {
            this.uiMqttConnectedOrSuccess()
          } else if (desc == '__PUBLISH_FAILED') {
            this.uiMqttConnectedOrSuccess()
          }
          return
        case 'iotnode':
          if (desc == 'INIT_WAITING_IDS_FROM_API') {
            this.uiMqttConnectedOrSuccess()
          } else if (desc == 'INIT_FAILED_IDS_FROM_API') {
            this.uiErrorsInApiResponse()
          } else if (desc == 'INIT_SUCCESS') {
            this.uiInitSucceed()
          }
          return
        default:
          return
      }
    },
    uiWiFiConnected() {
      this.ssidState.class = this.pskState.class = txtClass.success
      this.ssidState.class1 = this.pskState.class1 = auxClass.success
      this.outputsState.class = txtClass.info
    },
    uiWiFiDisconnectedAndFailed() {
      this.ssidState.class = this.pskState.class = txtClass.warning
      this.ssidState.class1 = this.pskState.class1 = auxClass.warning
      this.ssidState.txt = 'võimalik vale võrk'
      this.pskState.txt = 'võimalik vale võti'
    },
    uiWiFiNoSSID() {
      this.ssidState.class = txtClass.danger
      this.ssidState.class1 = auxClass.danger
      this.ssidState.txt = 'sellist võrku pole näha'
    },
    uiWiFiConnectFailed() {
      this.ssidState.class = txtClass.success
      this.ssidState.clas1s = auxClass.success
      this.pskState.class = txtClass.danger
      this.pskState.class1 = auxClass.danger
      this.pskState.txt = 'vale võti'
    },
    uiWiFiNotConnected() {
      this.outputsState.class = this.outputsState.class2 = txtClass.warning
      this.uiGenericOutsNotSaved()
    },
    uiMqttConnectedOrSuccess() {
      this.ssidState.class = this.pskState.class = txtClass.success
      this.ssidState.class1 = this.pskState.class1 = auxClass.success
      this.outputsState.class = this.outputsState.class2 = txtClass.warning
      this.uiGenericOutsNotSaved()
    },
    uiErrorsInApiResponse() {
      this.ssidState.class = this.pskState.class = txtClass.success
      this.ssidState.class1 = this.pskState.class1 = auxClass.success
      this.outputsState.class = this.outputsState.class2 = txtClass.danger
      this.outputsState.class1 = auxClass.danger
      this.outputsState.txt = 'serverisse ei õnnestu salvestada'
    },
    uiInitSucceed() {
      this.ssidState.class = this.pskState.class = this.outputsState.class = this.outputsState.class2 =
        txtClass.success
      this.ssidState.class1 = this.pskState.class1 = this.outputsState.class1 =
        auxClass.success
      this.outputsState.txt = ''
    },
    uiGenericReset() {
      this.ssidState.txt = this.pskState.txt = this.outputsState.txt = ''
      this.ssidState.class = this.pskState.class = this.outputsState.class =
        txtClass.greyLight
      this.ssidState.class1 = this.pskState.class1 = this.outputsState.class1 =
        ''
      this.outputsState.class2 = txtClass.info
    },
    uiGenericOutsNotSaved() {
      this.outputsState.txt = 'pole veel salvestatud'
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
.status--value {
  border: 1px solid black;
}
</style>
