import Vue from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './addIcons'

export default function initIcons(
  fontAwsomeIconsComponentName = 'font-awesome-icon'
) {
  Vue.component(fontAwsomeIconsComponentName, FontAwesomeIcon) // component name is used in templates
}
