<template>
  <div class="step-timing has-text-centered">
    <div class="weekdays field is-horizontal">
      <div class="field-label">
        <label for="timeSelector" class="label has-text-grey">Ajastus</label>
      </div>
      <div class="time field-body">
        <div class="field">
          <timeselector
            id="timeSelector"
            class="control"
            placeholder="vali aeg"
            :display-format="displayFormat"
            :return-format="returnFormat"
            :pad-time="true"
            :interval="selectedTimeInterval"
            @formatedTime="formatedTime"
            @cleared="clearSelectedTime"
          >
            <span slot="clear-ico" class="icon">
              <fa-i icon="times" />
            </span>
          </timeselector>
        </div>
        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label has-text-grey">Aktiivne</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control" :title="activeTitle">
                <input
                  id="editorSetAct"
                  v-model.lazy="preset.active"
                  class="switch is-outlined"
                  type="checkbox"
                  :disabled="!selectedTime"
                />
                <label for="editorSetAct" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="weekdays field is-horizontal">
      <div class="field-label">
        <label class="label has-text-grey">Päevad</label>
      </div>
      <div class="field-body">
        <div class="field is-grouped is-grouped-multiline">
          <div v-for="wd of weekInfo" :key="wd.id" class="control">
            <input
              :id="`wd|${wd.id}`"
              v-model="selectedDaysOfWeek[wd.id]"
              class="is-checkradio has-no-border"
              type="checkbox"
              :name="`wd|${wd.id}`"
              :indeterminate.prop="isIndetermined"
            />
            <label :for="`wd|${wd.id}`" v-text="wd.name" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i18SelectMixin } from '../plugins/vue-i18n-select/'
import Timeselector from 'vue-timeselector'

export default {
  components: { Timeselector },
  mixins: [i18SelectMixin],
  props: { preset: { type: Object, required: true } },
  data() {
    return {
      selectedDaysOfWeek: Array(7),
      selectedTime: null,
      displayFormat: 'HH:mm',
      returnFormat: 'HH:mm', //Bug, non-padded numbers do not work
      selectedTimeInterval: { h: 1, m: 5 }
    }
  },
  computed: {
    weekInfo() {
      const dayMilSecs = 86400000
      const weekStartRelatedtoEpochSecs = dayMilSecs - 5 * dayMilSecs
      let result = Array(7)
      for (let i = 0; i < 7; i++) {
        result[i] = {
          id: i,
          name: new Date(
            weekStartRelatedtoEpochSecs + i * dayMilSecs
          ).toLocaleDateString(this.$language, { weekday: 'short' })
        }
      }
      return result
    },
    isIndetermined() {
      return !this.selectedDaysOfWeek.includes(true)
    },
    activeTitle() {
      return !this.preset.active ? '! Määra aeg, et automaat aktiveerida' : ''
    }
  },
  watch: {
    selectedTime: 'handleSelectedTime',
    selectedDaysOfWeek: 'handleSelectedDaysOfWeek',
    'preset.schedule'(val) {
      this.preset.active = val ? true : false
    }
  },
  methods: {
    getOrCreateCronFields() {
      if (this.preset.schedule) {
        return this.preset.schedule
          .split(' ')
          .reverse()
          .slice(0, 5)
          .reverse()
      } else {
        return new Array(5).fill('*')
      }
    },
    handleSelectedTime(val) {
      if (!val) {
        this.preset.schedule = null
        return
      }
      const fields = this.getOrCreateCronFields()
      const [h, m] = val.split(':')
      fields[0] = m.replace(/^0/, '')
      fields[1] = h.replace(/^0/, '')
      this.preset.schedule = fields.join(' ')
    },
    handleSelectedDaysOfWeek(val) {
      if (!val || !this.selectedTime) {
        this.preset.schedule = null
        return
      }
      const fields = this.getOrCreateCronFields()
      const weekDays = val.reduce((acc, v, i) => (acc += v ? `,${i}` : ''), '')
      fields[4] = weekDays.substring(1) || '*'
      this.preset.schedule = fields.join(' ')
    },
    formatedTime(val) {
      this.selectedTime = val
    },
    clearSelectedTime() {
      this.selectedTime = null
    }
  }
}
</script>

<style lang="scss">
// .vtimeselector__input,
// .vtimeselector__input--is-open {
// }
</style>

<style lang="scss" scoped>
.vtimeselector {
  width: 7.5rem;
}
.switch[type='checkbox'] + label {
  padding-top: 0;
}
</style>
