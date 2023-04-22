import { useThirdPartyEmotes } from './UseThirdPartyEmotes'
import { useEffect, useMemo, useState } from 'react'
import { useTwitchApi } from './UseAPI'
import { HelixChatApi } from 'twitch/lib/API/Helix/Chat/HelixChatApi'
import { HelixChannelEmote, HelixEmote, HelixEmoteFromSet } from 'twitch'

interface FormattedEmotes {
   id: string,
   code: string,
   img: string
}

export function useEmotes() {
   
   const { chatClient, twitchClient, channelID } = useTwitchApi()
   
   const [userEmotes, setUserEmotes] = useState<HelixEmoteFromSet[]>([])
   
   const [formattedEmotes, setFormattedEmotes] = useState<FormattedEmotes[]>([])
   
   const {
      bttvGlobalEmotes,
      bttvUserEmotes,
      ffzGlobalEmotes,
      ffzUserEmotes,
   } = useThirdPartyEmotes()
   
   
   useEffect(() => {
      
      if (twitchClient) {
         chatClient?.onNamedMessage('GLOBALUSERSTATE', async (msg) => {
            
            console.log('GLOBALUSERSTATE received')
            
            const emoteSets = msg.tags.get('emote-sets')?.split(',')
            
            const chat = new HelixChatApi(twitchClient)
            
            if (emoteSets) {
               setUserEmotes(await chat.getEmotesFromSets(emoteSets))
            }
            
         })
      }
      
   }, [twitchClient, chatClient])
   
   const emoteMap = useMemo(
      () => ({
         ...userEmotes,
         ...bttvGlobalEmotes,
         ...ffzGlobalEmotes,
         ...ffzUserEmotes,
         ...bttvUserEmotes,
      }),
      [
         userEmotes,
         bttvGlobalEmotes,
         bttvUserEmotes,
         ffzGlobalEmotes,
         ffzUserEmotes,
      ],
   )
   
   return emoteMap
}


export function useEmoteLists() {
   
   const { chatClient, twitchClient, channelID } = useTwitchApi()
   
   const [userEmotes, setUserEmotes] = useState<HelixEmoteFromSet[]>([])
   
   const {
      bttvGlobalEmotes,
      bttvUserEmotes,
      ffzGlobalEmotes,
      ffzUserEmotes,
   } = useThirdPartyEmotes()
   
   useEffect(() => {
   
      console.log(!!twitchClient, !!chatClient)
      
      if (twitchClient && chatClient) {
         chatClient?.onNamedMessage('GLOBALUSERSTATE', async (msg) => {
            
            console.log('GLOBALUSERSTATE received')
            
            const emoteSets = msg.tags.get('emote-sets')?.split(',')
            
            const chat = new HelixChatApi(twitchClient)
   
            if (emoteSets) {
               setUserEmotes(await chat.getEmotesFromSets(emoteSets))
            }
            
         })
      }
      
   }, [twitchClient, chatClient])
   
   return {
      userEmotes,
      bttvGlobalEmotes,
      ffzGlobalEmotes,
      ffzUserEmotes,
      bttvUserEmotes,
   }
}
