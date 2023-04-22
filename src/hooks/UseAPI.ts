import { ChatClient }            from 'twitch-chat-client'
import { ApiClient }             from 'twitch'
import { useSelector }           from '../store'
import { CredentialSelectors }   from '../store/slices/CredentialSlice'
import { AppSelectors }                      from '../store/slices/AppSlice'
import { useCallback, useContext, useEffect, useState } from 'react'
import { TwitchApiContext, TwitchApiProps }  from '../contexts/TwitchApiContext'

export interface UseTwitchApiProps {
   chatClient: ChatClient | null
   twitchClient: ApiClient | null
   establishConnection: (props: TwitchApiProps) => void
   channel: string | null
   channelID: any
}

export function useTwitchApi(): UseTwitchApiProps {
   
   const { state, dispatch } = useContext(TwitchApiContext)
   
   const credentials = useSelector(CredentialSelectors.credentials)
   const [channelID, setChannelID] = useState<any>(null)
   
   const establishConnection = useCallback(({ twitchClient, chatClient }: TwitchApiProps) => {
      dispatch({ type: 'ESTABLISH_CONNECTION', payload: { twitchClient, chatClient } })
   }, [])
   
   useEffect(() => {
      async function fetch() {
         if(credentials.channel && state.twitchClient) {
            const channelUser = await (state.twitchClient as any)?.helix?.users?.getUserByName(credentials.channel)
            setChannelID(channelUser.id)
            // console.log('FETCHED CHANNEL USER ID', channelUser.id)
         }
      }
      fetch()
   }, [credentials.channel, state.twitchClient])
   
   return {
      twitchClient: state.twitchClient,
      chatClient: state.chatClient,
      establishConnection,
      channel: credentials.channel,
      channelID
   }
   
}
