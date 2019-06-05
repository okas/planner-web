<template>
  <section id="iot">
    <header class="component-header">
      <slot name="header-title" :_class="'has-text-info'" />
      <p class="has-text-info">IoT asjade algseadistamine</p>
    </header>
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
    <article>
      <header>
        <h4 class="subtitle is-4">Seadme ühenduse staatus</h4>
      </header>
      <i class="icon is-medium" :title="ioIconTitle">
        <fa-l class="fa">
          <fa-i
            class
            icon="microchip"
            :class="{ 'has-text-success': iotConnected }"
          />
          <transition name="fade">
            <fa-i
              v-if="!iotConnected"
              class="fa-2x has-text-danger"
              icon="ban"
              transform="left-4"
            />
          </transition>
        </fa-l>
      </i>
      <span v-if="iotConnected">Ühendatud seadmega: {{ hostname }}</span>
      &nbsp;&nbsp;
      <span v-if="iotConnected">IoT tüüp: {{ iotType }}</span>
    </article>
    <article>
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
              <button type="submit" class="button is-primary">Seadista</button>
            </div>
          </div>
        </fieldset>
      </form>
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

export default {
  data() {
    return {
      ssid: null,
      psk: null,
      hostname: null,
      /** @type {Array.<{id: String, value: String}>} */
      actuators: [],
      iotType: null,
      iotDeviceId: null,
      iotConnected: false
    }
  },
  computed: {
    ioIconTitle() {
      return this.iotConnected ? 'IoT seadmega ühendatud' : 'Pole IoT ühendust'
    }
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
      this.iotConnected = true
      rws.send('get-currentState')
    },
    wsOnClose(wsEvent) {
      console.log(wsEvent)
      this.iotConnected = false
      this.hostname = null
    },
    wsMessageHandler(wsEvent) {
      console.log(event)
      const [subject, ...data] = wsEvent.data.split('\n')
      switch (subject) {
        case 'get-currentState-R': {
          const [hostname, ssid, psk, iotDeviceId, type, ...outputs] = data
          this.hostname = hostname
          this.ssid = ssid
          this.psk = psk
          this.iotDeviceId = iotDeviceId
          this.iotType = iotTypes[type]
          this.actuators = outputs.map((v, i) => ({ id: i + 1, value: !!+v }))
          break
        }
        case 'set-initValues-R':
          alert(data[0] ? 'oli edukas' : 'ebaõnnestus')
          break
      }
    },
    wsSendIotInitData() {
      let payload = `set-initValues\n${this.ssid}\n${this.psk}\n${
        this.iotDeviceId
      }`
      this.actuators.forEach(a => (payload += `\n${+a.value}`))
      rws.send(payload)
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
