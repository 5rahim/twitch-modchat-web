import React, { memo, useReducer } from 'react'
import { ApiClient }               from 'twitch'
import { ChatClient }              from 'twitch-chat-client'
import produce                     from 'immer'

export interface TwitchApiProps {
   twitchClient: ApiClient | null
   chatClient: ChatClient | null
}

const TwitchApiContext = React.createContext({
   state: { twitchClient: null, chatClient: null },
   dispatch: ({ type, ...rest }: { type: string, [key: string]: any }): void => {},
})

const AppReducer = (state: TwitchApiProps, action: any) => {
   switch (action.type) {
      case 'ESTABLISH_CONNECTION':
         state.twitchClient = action.payload.twitchClient
         state.chatClient = action.payload.chatClient
         return
   }
}

const TwitchApiProvider = memo((props: any) => {
   const [state, dispatch] = useReducer(produce(AppReducer), { twitchClient: null, chatClient: null })
   
   return (
      <TwitchApiContext.Provider value={{ state, dispatch } as { state: any, dispatch: any }}>
         {props.children}
      </TwitchApiContext.Provider>
   )
})

export { TwitchApiContext, TwitchApiProvider }
