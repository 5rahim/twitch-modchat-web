import * as React from "react"
import {
   getBTTVGlobalEmotes,
   getBTTVUserEmotes,
   getFFZGlobalEmotes,
   getFFZUserEmotes,
} from "./helpers"
import { EmoteMap, ThirdPartyEmoteState } from "./types"
import { useEffect } from 'react'

export const ThirdPartyEmotesContext = React.createContext<ThirdPartyEmoteState>(
   {
      bttvUserEmotes: {},
      bttvGlobalEmotes: {},
      ffzUserEmotes: {},
      ffzGlobalEmotes: {},
   },
)

interface Props {
   channelId: string;
   children: React.ReactNode;
}

export const ThirdPartyEmotesProvider: React.FunctionComponent<Props> = (
   props: Props,
) => {
   const [ffzUserEmotes, setFfzUserEmotes] = React.useState<EmoteMap>({})
   const [ffzGlobalEmotes, setFfzGlobalEmotes] = React.useState<EmoteMap>({})
   const [bttvUserEmotes, setBttvUserEmotes] = React.useState<EmoteMap>({})
   const [bttvGlobalEmotes, setBttvGlobalEmotes] = React.useState<EmoteMap>({})
   
   React.useEffect(() => {
     getFFZGlobalEmotes().then(setFfzGlobalEmotes);
     getBTTVGlobalEmotes().then(setBttvGlobalEmotes);
   }, []);

   React.useEffect(() => {
     if(props.channelId) {
        getFFZUserEmotes(props.channelId).then(setFfzUserEmotes);
        getBTTVUserEmotes(props.channelId).then(setBttvUserEmotes);
     }
   }, [props.channelId]);
   
   // useEffect(() => {
   //    async function fetch() {
   //
   //       if(props.channelId) {
   //          const ffz1 = await getFFZGlobalEmotes().then()
   //          const ffz2 = await getFFZUserEmotes(props.channelId).then()
   //          const bttv1 = await getBTTVGlobalEmotes().then()
   //          const bttv2 = await getBTTVUserEmotes(props.channelId).then()
   //
   //          setFfzGlobalEmotes(ffz1)
   //          setFfzUserEmotes(ffz2)
   //          setBttvGlobalEmotes(bttv1)
   //          setBttvUserEmotes(bttv2)
   //       }
   //
   //    }
   //
   //    fetch()
   // }, [])
   
   return (
      <ThirdPartyEmotesContext.Provider
         value={{
            bttvGlobalEmotes,
            bttvUserEmotes,
            ffzUserEmotes,
            ffzGlobalEmotes,
         }}
      >
         {props.children}
      </ThirdPartyEmotesContext.Provider>
   )
}
