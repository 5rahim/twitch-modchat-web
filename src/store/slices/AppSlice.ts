import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState, Credentials }                      from '../states/Types'
import { InitialAppStates }                           from '../states/InitialStates'
import { RootState }                                  from '../index'
import { ApiClient }                                  from 'twitch'
import { ChatClient }                                 from 'twitch-chat-client'
import { credentialStorage, updateCredentials } from '../storage/LocalStorage'

export const AppSlice = createSlice({
   name: 'app',
   initialState: InitialAppStates as AppState,
   reducers: {
      needsLogin: state => {
         state.needLogin = true
      },
      login: (state, action: PayloadAction<Credentials>) => {
         state.needLogin = false
         updateCredentials(action.payload)
      },
      logout: (state) => {
         state.needLogin = true
         updateCredentials({})
      },
      selectUser: (state, action: PayloadAction<string | null>) => {
         state.selectedUser = action.payload
      },
      closeSettingsWindow: state => {
         state.showSettingsWindow = false
      },
      toggleSettingsWindow: state => {
         state.showSettingsWindow = !state.showSettingsWindow
      },
      setBookmarks: (state, action) => {
         state.bookmarks = action.payload
      }
   },
})

export const AppSelectors = {
   needLogin: createSelector<RootState, any, any>(state => state.app?.needLogin, v => v),
   selectedUser: createSelector<RootState, any, any>(state => state.app?.selectedUser, v => v),
   chatClient: createSelector<RootState, any, any>(state => state.app?.chatClient, v => v),
   twitchClient: createSelector<RootState, any, any>(state => state.app?.twitchClient, v => v),
   showSettingsWindow: createSelector<RootState, any, any>(state => state.app?.showSettingsWindow, v => v),
   bookmarks: createSelector<RootState, any, any>(state => state.app?.bookmarks, v => v)
}

export const AppActions = AppSlice.actions
