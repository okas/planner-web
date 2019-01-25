import Vue from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './registry-solid'
import './registry-regular'

export default function initIcons(
  fontAwsomeIconsComponentName = 'font-awesome-icon'
) {
  Vue.component(fontAwsomeIconsComponentName, FontAwesomeIcon) // component name is used in templates
}
