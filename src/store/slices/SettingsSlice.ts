import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Settings }                                   from '../states/Types'
import { RootState }                                       from '../index'
import { getSetting, getUpdatedSettings, settingsStorage } from '../storage/LocalStorage'
import { InitialSettings } from '../states/InitialStates'

const insert = (arr: any, index: number, newItem: any) => [
   // part of the array before the specified index
   ...arr.slice(0, index),
   // inserted item
   newItem,
   // part of the array after the specified index
   ...arr.slice(index),
]

export const SettingsSlice = createSlice({
   name: 'settings',
   initialState: {} as Settings,
   reducers: {
      init: (state, action: PayloadAction<Settings>) => {
         return action.payload
      },
      update: {
         reducer: (state, action) => {
            const { setting, value } = action.payload
            return getUpdatedSettings(setting, value)
         },
         prepare: (setting: string, value: any): any => ({ payload: { setting, value } }),
      },
      addItem: {
         reducer: (state, action) => {
            const { setting, value } = action.payload
            const valueToAdd = typeof value === 'string' ? value : { ...value }
            return getUpdatedSettings(setting, [...getSetting(setting), valueToAdd])
         },
         prepare: (setting: string, value: boolean): any => ({ payload: { setting, value } }),
      },
      updateItem: {
         reducer: (state, action) => {
            const { key, setting, index, value } = action.payload
            const newSettings = { ...getSetting(setting)[index], [key]: value }
            const otherSettings = [...getSetting(setting).filter((v: any, i: number) => i !== index)]
            return getUpdatedSettings(setting, insert(otherSettings, index, newSettings))
         },
         prepare: (setting: string, key: string, index: number, value: any): any =>
            ({ payload: { key, setting, index, value } }),
      },
      updateArrayItem: {
         reducer: (state, action) => {
            const { setting, index, value } = action.payload
            const otherSettings = [...getSetting(setting).filter((v: any, i: number) => i !== index)]
            return getUpdatedSettings(setting, insert(otherSettings, index, value))
         },
         prepare: (setting: string, index: number, value: any): any =>
            ({ payload: { setting, index, value } }),
      },
      removeItem: {
         reducer: (state, action) => {
            const { setting, index } = action.payload
            return getUpdatedSettings(setting, [...getSetting(setting).filter((v: any, i: number) => i !== index)])
         },
         prepare: (setting: string, index: number): any =>
            ({ payload: { setting, index } }),
      },
      toggle: {
         reducer: (state, action) => {
            const { setting, value } = action.payload
            return getUpdatedSettings(setting, value)
         },
         prepare: (setting: string, value: boolean): any => ({ payload: { setting, value: !value } }),
      },
   },
})

export const SettingsSelectors = {
   settings: createSelector((state: RootState) => state.settings, v => v),
   showPopupProfile: createSelector((state: RootState) => state.settings?.appearance?.showPopupProfile, v => v),
   timeouts: createSelector((state: RootState) => state.settings?.moderation?.timeouts, v => v),
   separateWithLines: createSelector((state: RootState) => state.settings?.appearance?.messages?.separateWithLines, v => v),
   boldUsername: createSelector((state: RootState) => state.settings?.appearance?.messages?.boldUsername, v => v),
   alternateBackground: createSelector((state: RootState) => state.settings?.appearance?.messages?.alternateBackground, v => v),
   redeemedHighlight: createSelector((state: RootState) => state.settings?.appearance?.messages?.redeemedHighlight, v => v),
   showTimestamp: createSelector((state: RootState) => state.settings?.appearance?.messages?.showTimestamp, v => v),
   commands: createSelector((state: RootState) => state.settings?.commands, v => v),
   games: createSelector((state: RootState) => state.settings?.moderation?.games, v => v),
   stickAtMessage: createSelector((state: RootState) => state.settings?.appearance?.messages?.stickAtMessage, v => v),
   stickAutomodMessage: createSelector((state: RootState) => state.settings?.moderation?.stickAutomodMessage, v => v),
   bodyguardMinimumProbability: createSelector((state: RootState) => state.settings?.moderation?.bodyguard.minimumProbability, v => v),
   bodyguardIdentityAttack: createSelector((state: RootState) => state.settings?.moderation?.bodyguard.identityAttack, v => v),
   bodyguardInsult: createSelector((state: RootState) => state.settings?.moderation?.bodyguard.insult, v => v),
   bodyguardObscene: createSelector((state: RootState) => state.settings?.moderation?.bodyguard.obscene, v => v),
   bodyguardSevereToxicity: createSelector((state: RootState) => state.settings?.moderation?.bodyguard.severeToxicity, v => v),
   bodyguardExplicit: createSelector((state: RootState) => state.settings?.moderation?.bodyguard.explicit, v => v),
   bodyguardThreat: createSelector((state: RootState) => state.settings?.moderation?.bodyguard.threat, v => v),
   bodyguardToxicity: createSelector((state: RootState) => state.settings?.moderation?.bodyguard.toxicity, v => v),
   assistantIsOn: createSelector((state: RootState) => state.settings?.moderation?.assistant?.isOn, v => v),
   assistantPatterns: createSelector((state: RootState) => state.settings?.moderation?.assistant?.patterns, v => v),
   nukes: createSelector((state: RootState) => state.settings?.moderation?.nukes, v => v),
   quickMode: createSelector((state: RootState) => state.settings?.moderation?.quickMode, v => v),
   highlightedMessages: createSelector((state: RootState) => state.settings?.highlighting?.messages, v => v),
   highlightedUsers: createSelector((state: RootState) => state.settings?.highlighting?.users, v => v),
}

export const SettingsKeys = {
   separateWithLines: 'appearance.messages.separateWithLines',
   boldUsername: 'appearance.messages.boldUsername',
   alternateBackground: 'appearance.messages.alternateBackground',
   redeemedHighlight: 'appearance.messages.redeemedHighlight',
   showTimestamp: 'appearance.messages.showTimestamp',
   stickAtMessage: 'appearance.messages.stickAtMessage',
   showPopupProfile: 'appearance.showPopupProfile',
   showSalutationPopup: 'mentions.salutationPopup',
   commands: 'commands',
   timeouts: 'moderation.timeouts',
   games: 'moderation.games',
   stickAutomodMessage: 'moderation.stickAutomodMessage',
   bodyguardMinimumProbability: 'moderation.bodyguard.minimumProbability',
   bodyguardIdentityAttack: 'moderation.bodyguard.identityAttack',
   bodyguardInsult: 'moderation.bodyguard.insult',
   bodyguardObscene: 'moderation.bodyguard.obscene',
   bodyguardSevereToxicity: 'moderation.bodyguard.severeToxicity',
   bodyguardExplicit: 'moderation.bodyguard.explicit',
   bodyguardThreat: 'moderation.bodyguard.threat',
   bodyguardToxicity: 'moderation.bodyguard.toxicity',
   assistantIsOn: 'moderation.assistant.isOn',
   assistantPatterns: 'moderation.assistant.patterns',
   nukes: 'moderation.nukes',
   quickMode: 'moderation.quickMode',
   highlightedMessages: 'highlighting.messages',
   highlightedUsers: 'highlighting.users',
}


export const SettingsActions = SettingsSlice.actions
