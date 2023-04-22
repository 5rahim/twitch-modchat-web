import {
   AnyAction, combineReducers, configureStore,
   Dispatch, getDefaultMiddleware, Middleware, PayloadAction,
}                                                 from '@reduxjs/toolkit'
import { createDispatchHook, createSelectorHook } from 'react-redux'
import { AppSlice }                               from './slices/AppSlice'
import { CredentialSlice }                        from './slices/CredentialSlice'
import { SettingsSlice }                          from './slices/SettingsSlice'
import { ApiClient }                              from 'twitch'
import { ChatClient }                             from 'twitch-chat-client'

// const customizedMiddleware = getDefaultMiddleware({
//    serializableCheck: false,
// })


const customMiddleware: Middleware = ({ getState, dispatch }) => {
   
   let connection = null
   
   return (next: Dispatch<AnyAction>) => (action: PayloadAction<{ twitchClient: ApiClient, chatClient: ChatClient }>) => {
      if (action.type === 'app/establishConnection') {
         connection = action.payload
      }
      
      return next(action)
   }
}

const rootReducer = combineReducers({
   app: AppSlice.reducer,
   credentials: CredentialSlice.reducer,
   settings: SettingsSlice.reducer,
})

// Global Store
const store = configureStore({
   reducer: rootReducer,
   middleware: [
      //customMiddleware,
      ...getDefaultMiddleware({ serializableCheck: false, devTools: true }),
   ] as const,
   // middleware: (getDefaultMiddleware) => getDefaultMiddleware({
   //    serializableCheck: false,
   //    devTools: true
   // }),
})

export type RootState = ReturnType<typeof rootReducer>

export default store

export type AppDispatch = typeof store.dispatch
export const useDispatch = createDispatchHook<AppDispatch>()
export const useSelector = createSelectorHook<RootState>()
