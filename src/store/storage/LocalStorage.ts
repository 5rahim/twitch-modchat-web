// import ElectronStore       from 'electron-store'
import * as R from 'ramda'
import { InitialSettings } from '../states/InitialStates'
import { Credentials, Settings } from '../states/Types'

// const Store = require('electron-store')

// export const credentialStorage: ElectronStore = new Store({ name: 'credentials' })
// export const settingsStorage: ElectronStore = new Store({ name: 'settings' })

export const credentialStorage = localStorage.getItem('credentials')
export const settingsStorage = localStorage.getItem('settings')

// If storages don't exist, create them
export function initGlobalStorage() {
   
   const rawSettings = localStorage.getItem('settings')
   const rawCredentials = localStorage.getItem('credentials')
   
   if (!rawCredentials) {
      localStorage.setItem('credentials', JSON.stringify({}))
   }
   // console.log('[LocalStorage]:', rawSettings)
   if (!rawSettings || rawSettings.length < 10) {
      localStorage.setItem('settings', JSON.stringify(InitialSettings))
   }
}

// Get storage values
export function getLocalStorageValues(): { credentials: Credentials | {}, settings: Settings } | null {
   initGlobalStorage()
   
   const rawSettings = localStorage.getItem('settings')
   const rawCredentials = localStorage.getItem('credentials')
   
   if(rawSettings && rawCredentials) {
      const settings = JSON.parse(rawSettings)
      const credentials = JSON.parse(rawCredentials)
   
      return {
         credentials: credentials as Credentials | {},
         settings: settings as any
      }
      
   }
   
   return null
   
}

export function updateCredentials(value: Credentials | {}) {
   return localStorage.setItem('credentials', JSON.stringify(value))
}


export function getUpdatedSettings(setting: string, value: any): Settings {
   // settingsStorage.set(`${setting}`, value)
   
   const rawSettings = localStorage.getItem('settings')
   
   if (rawSettings) {
      let settings = JSON.parse(rawSettings)
   
      settings = R.assocPath(setting.split('.'), value, settings)
   
      console.log('[Updating Setting]', setting, settings)
      localStorage.setItem('settings', JSON.stringify(settings))
      
      const newRawSettings = localStorage.getItem('settings')
      
      return (newRawSettings ? JSON.parse(newRawSettings) : null) as any
   }
   
   return null as any
}

//
export function getSetting(setting: string): any {
   // return settingsStorage.get(setting)
   
   const rawSettings = localStorage.getItem('settings')
   
   if (rawSettings) {
      const settings = JSON.parse(rawSettings)
      // return settings[setting]
      return R.path(setting.split('.'), settings)
   }
   
   return null
   
}
