<template>
  <div class="step-timing has-text-centered" :title="preset.schedule">
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
  props: {
    preset: { type: Object, required: true },
    isActive: { type: Boolean }
  },
  data() {
    return {
      selectedDaysOfWeek: Array(7).fill(false),
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
      let result = Array(7)
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
      let weekDaysField
      if (val.length === 7 && (val.every(d => !d) || val.every(d => d))) {
        weekDaysField = '*'
      } else {
        weekDaysField = this.calculateCronDaysOfWeek(val)
      }
      this.cronModel.dayWeek = weekDaysField
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
      if (!this.cronModel || this.cronModel.dayWeek === '*') {
        return
      }
      this.cronModel.dayWeek.split(',').forEach(listItem => {
        if (listItem.startsWith('-') || listItem.endsWith('-')) {
          throw `Day of week: range: wrong value found in range expression: [ ${
            this.cronModel.dayWeek
          } ]`
        } else if (listItem === '-') {
          throw 'Day of week: day filed: wrong value as filed list item "-".'
        }
        let [start, end] = listItem.split('-')
        start = Number(start)
        end = Number(end)
        if (Number.isNaN(end)) {
          this.selectedDaysOfWeek[start] = true
        } else if (start >= end) {
          throw `Day of week: range: need that [ start < end ]; found [ start:${start}, end:${end}  ]`
        } else {
          this.selectedDaysOfWeek.fill(true, start, end + 1)
        }
      })
    },
    ensureCronModel() {
      if (!this.preset.schedule) {
        this.initCronModel('* * * * *')
      }
    },
    setInitialTimePlaceholder() {
      this.placeholderTimeSelect = this.initialTime ? '' : this.placeHolderText
    },
    calculateCronDaysOfWeek(selection) {
      let lastInRange = null
      let prevIdx = null
      let result = selection.reduce((acc, selected, i) => {
        if (selected) {
          if (prevIdx !== null && i === prevIdx + 1) {
            if (lastInRange === null) {
              acc += '-'
            }
            lastInRange = i
          } else {
            if (lastInRange !== null) {
              acc += lastInRange
              lastInRange = null
            }
            acc += `,${i}`
          }
          prevIdx = i
        }
        return acc
      }, '')
      if (result.endsWith('-')) {
        result += lastInRange
      }
      if (result.startsWith(',')) {
        result = result.substring(1)
      }
      return result
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
