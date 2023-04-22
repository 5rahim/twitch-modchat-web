import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Credentials }                                from '../states/Types'
import { RootState }                                  from '../index'

export const CredentialSlice = createSlice({
   name: 'credentials',
   initialState: {} as Credentials,
   reducers: {
      save: (state, action: PayloadAction<Credentials>) => {
         return action.payload
      }
   }
})

export const CredentialSelectors = {
   credentials: createSelector<RootState, any, any>(state => state.credentials, v => v),
   channel: createSelector<RootState, any, any>(state => state.credentials?.channel, v => v),
   token: createSelector<RootState, any, any>(state => state.credentials?.token, v => v),
   username: createSelector<RootState, any, any>(state => state.credentials?.username, v => v),
}

export const CredentialActions = CredentialSlice.actions
