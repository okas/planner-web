<template>
  <section id="iot">
    <header class="component-header">
      <slot name="header-title" :_class="'has-text-info'" />
      <p class="has-text-info">IoT asjade algseadistamine</p>
    </header>
    <p class="notification is-warning has-text-weight-semibold is-size-5">
      Palun ära lae lehte uuesti, kui oled ühenud IoT seadmega!
    </p>
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
    </article>
    <article>
      <header>
        <h4 class="subtitle is-4">IoT seadme algseadistused</h4>
      </header>
      <form autocomplete="on" @submit.prevent="wsSendWifiData">
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
            <label class="label has-text-grey-light">Seadme ID</label>
            <div class="control">
              <input
                v-model="clientId"
                class="input"
                type="text"
                placeholder="sisesta SaarTK süsteemi poolt genereeritud seadme ID"
                required
              />
            </div>
          </div>
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
/** @type {WebSocket} */
let webSocket

export default {
  data() {
    return {
      ssid: '',
      psk: '',
      clientId: null,
      iotConnected: false,
      hostname: null
    }
  },
  computed: {
    ioIconTitle() {
      return this.iotConnected ? 'IoT seadmega ühendatud' : 'Pole IoT ühendust'
    }
  },
  mounted() {
    webSocket = new WebSocket('ws://192.168.4.1:81')
    webSocket.onopen = this.wsOnOpen
    webSocket.onclose = webSocket.onerror = this.wsOnClose
    webSocket.onmessage = this.wsMessageHandler
  },
  beforeDestroy() {
    webSocket.close()
  },
  methods: {
    wsOnOpen(wsEvent) {
      console.log(wsEvent)
      this.iotConnected = true
      webSocket.send('get-currentState')
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
          const [hostname, ssid, clientId] = data
          this.hostname = hostname
          this.ssid = ssid
          this.clientId = clientId
          break
        }
        case 'set-initValues-R':
          alert(data[0] ? 'oli edukas' : 'ebaõnnestus')
          break
      }
    },
    wsSendWifiData() {
      webSocket.send(
        `set-initValues\n${this.ssid}\n${this.psk}\n${this.clientId}`
      )
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
