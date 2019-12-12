import { auxClass, initStates, txtClass, UIState } from './DevicesIotDTO'

export default {
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
  methods: {
    handleUIChangesOnIoTState({ state, step, desc }) {
      this.uiGenericReset()
      switch (step) {
        case 'wifi': {
          switch (desc) {
            case 'WL_CONNECTED':
            case 'WL_IDLE_STATUS':
              this.uiWiFiConnected()
              break
            case 'WL_DISCONNECTED':
              if (state != initStates.FAILED) break
            case 'WL_CONNECTION_TIMEOUT':
              this.uiWiFiDisconnectedAndFailed()
              break
            case 'WL_NO_SSID_AVAIL':
              this.uiWiFiNoSSID()
              break
            case 'WL_CONNECT_FAILED':
              this.uiWiFiConnectFailed()
          }
          if (desc != 'WL_CONNECTED') {
            this.uiFormOutputsWarning()
          }
          return
        }
        case 'mqtt': {
          this.uiFormWiFiSuccess()
          switch (desc) {
            case 'LWMQTT_CONNECTION_ACCEPTED':
            case 'LWMQTT_SUCCESS':
            case '__PUBLISH_FAILED':
              this.uiFormOutputsWarning()
              return
          }
        }
        case 'iotnode': {
          this.uiFormWiFiSuccess()
          switch (desc) {
            case 'INIT_WAITING_IDS_FROM_API':
            case 'INITUPDATE_WAITING_CONFIRM_FROM_API':
              this.uiFormOutputsWarning()
              return
            case 'INIT_FAILED_IDS_FROM_API':
            case 'INITUPDATE_FAILED_FROM_API':
              this.uiErrorsInApiResponse()
              return
            case 'INIT_SUCCESS':
            case 'INITUPDATE_SUCCESS':
              this.uiInitSucceed()
              return
          }
        }
        default:
          return
      }
    },
    uiWiFiConnected() {
      this.uiFormWiFiSuccess()
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
    uiErrorsInApiResponse() {
      this.outputsState.class = this.outputsState.class2 = txtClass.danger
      this.outputsState.class1 = auxClass.danger
      this.outputsState.txt = 'serverisse ei õnnestu salvestada'
    },
    uiInitSucceed() {
      this.outputsState.class = this.outputsState.class2 = txtClass.success
      this.outputsState.class1 = auxClass.success
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
    uiFormOutputsWarning() {
      this.outputsState.class = this.outputsState.class2 = txtClass.warning
      this.outputsState.txt = 'pole veel salvestatud'
    },
    uiFormWiFiSuccess() {
      this.ssidState.class = this.pskState.class = txtClass.success
      this.ssidState.class1 = this.pskState.class1 = auxClass.success
    }
  }
}
