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
            :placeholder="placeholderTimeSelect"
            :value="initialTime"
            :display-format="displayFormat"
            :return-format="returnFormat"
            :pad-time="true"
            :interval="selectedTimeInterval"
            @formatedTime="handleFormatedTime"
            @cleared="handleClearSelectedTime"
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
                  v-model="preset.active"
                  class="switch is-outlined"
                  type="checkbox"
                  :disabled="!cronModel"
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
          <div
            v-for="wd of weekInfo"
            :key="wd.id"
            class="control"
            :title="activeTitle"
          >
            <input
              :id="`wd|${wd.id}`"
              v-model="selectedDaysOfWeek[wd.id]"
              class="is-checkradio has-no-border"
              type="checkbox"
              :name="`wd|${wd.id}`"
              :indeterminate.prop="isIndetermined"
              :disabled="!cronModel"
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
      initialTime: null,
      displayFormat: 'HH:mm',
      returnFormat: 'HH:mm', //Bug, non-padded numbers do not work
      selectedTimeInterval: { h: 1, m: 5 },
      placeHolderText: 'Määra aeg',
      placeholderTimeSelect: '',
      cronModel: null
    }
  },
  computed: {
    weekInfo() {
      // ToDo: consider flattening (to object or to array with primitives)
      const dayMilSecs = 86400000
      const weekStartRelatedtoEpochSecs = dayMilSecs - 5 * dayMilSecs
      let result = Array(this.selectedDaysOfWeek.length)
      for (let i = 0; i < result.length; i++) {
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
      return this.cronModel ? '' : this.placeHolderText
    }
  },
  watch: {
    selectedDaysOfWeek(val) {
      const days = val.reduce((acc, v, i) => (acc += v ? `,${i}` : ''), '')
      this.cronModel.dayWeek = days.substring(1) || '*'
    },
    cronModel: {
      deep: true,
      handler(val) {
        // cronModel properties order is important;
        // or create expression from fileds in a controlled way
        this.preset.schedule = val ? Object.values(val).join(' ') : null
      }
    },
    'preset.schedule'(val) {
      if (!val) {
        this.preset.active = false
      } else if (this.initialTime) {
        this.preset.active = true
      }
    }
  },
  created() {
    if (this.preset.schedule) {
      this.initCronModel(this.preset.schedule)
      this.setInitialTime()
    }
    this.initWeekDays()
    this.setInitialTimePlaceholder()
  },
  methods: {
    initCronModel(cronExpr) {
      const [minute, hour, dayMonth, month, dayWeek] = cronExpr.split(' ')
      // cronModel order is important
      this.cronModel = { minute, hour, dayMonth, month, dayWeek }
    },
    setInitialTime() {
      if (!this.cronModel.minute || !this.cronModel.hour) {
        return
      }
      let time = new Date()
      time.setMinutes(this.cronModel.minute)
      time.setHours(this.cronModel.hour)
      this.initialTime = time
    },
    initWeekDays() {
      if (!this.cronModel) {
        return
      }
      this.cronModel.dayWeek
        .split(',')
        .forEach(d => (this.selectedDaysOfWeek[d] = true))
    },
    ensureCronModel() {
      if (!this.preset.schedule) {
        this.initCronModel('* * * * *')
      }
    },
    setInitialTimePlaceholder() {
      this.placeholderTimeSelect = this.initialTime ? '' : this.placeHolderText
    },
    handleFormatedTime(val) {
      const [h, m] = val.split(':')
      this.ensureCronModel()
      this.cronModel.minute = m.replace(/^0/, '')
      this.cronModel.hour = h.replace(/^0/, '')
    },
    handleClearSelectedTime() {
      this.cronModel = null
      this.placeholderTimeSelect = this.placeHolderText
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
