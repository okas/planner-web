import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'

export default function setupIcons(
  fontAwsomeIconsComponentName = 'font-awesome-icon'
) {
  library.add(faLightbulb)
  Vue.component(fontAwsomeIconsComponentName, FontAwesomeIcon) // component name is used in templates
}
