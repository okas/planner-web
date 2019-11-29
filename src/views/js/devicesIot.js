export const iotTypes = {
  'generic-2out': 'Üldine kahe täituriga seade'
}
Object.freeze(iotTypes)

export const initStates = {
  OFFLINE: Symbol('0: OFFLINE'),
  IDLE: Symbol('1: IDLE') /* connected */,
  SUCCEED: Symbol('2: SUCCEED'),
  FAILED: Symbol('3: FAILED'),
  SAVING: Symbol('4: SAVING'),
  UNKNOWN: Symbol('x: UNKNOWN')
}
Object.freeze(initStates)

export const deviceTypes = [
  { id: 'lamp', label: 'Lamp' },
  { id: 'blind', label: 'Ruloo' }
]
Object.freeze(deviceTypes)

export const txtClass = {
  // TODO Move out of Vue component object
  warning: 'has-text-warning',
  info: 'has-text-info',
  success: 'has-text-success',
  danger: 'has-text-danger',
  greyLight: 'has-text-grey-light'
}
Object.freeze(txtClass)

export const auxClass = {
  // TODO Move out of Vue component object
  warning: 'is-warning',
  info: 'is-info',
  success: 'is-success',
  danger: 'is-danger'
}
Object.freeze(auxClass)

export class UIState {
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
