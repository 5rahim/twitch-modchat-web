import {
   ThirdPartyEmote,
   ThirdPartyEmoteProvider,
} from "../../models/ThirdPartyEmote"
import {
   BetterttvGlobalBody,
   BetterttvUserBody,
   EmoteMap,
   FrankerfacezGlobalBody,
   FrankerfacezSet,
   FrankerfacezUserBody,
} from "./types"
import axios from 'axios'


export const parseFFZSet = (set: FrankerfacezSet) => {
   const emoteMap: EmoteMap = {}
   for (let i = 0; i < set?.emoticons?.length ?? 0; ++i) {
      const emote = set?.emoticons[i]
      if (!emote) continue
      
      emoteMap[emote.name] = new ThirdPartyEmote(
         emote.id.toString(),
         ThirdPartyEmoteProvider.FrankerFaceZ,
         emote.name,
         ThirdPartyEmote.getFrankerfacezImageURL(emote.id),
      )
   }
   
   return emoteMap
}

export const getFFZGlobalEmotes = (): Promise<EmoteMap> =>
   axios
      .get<FrankerfacezGlobalBody>(
         "https://api.frankerfacez.com/v1/set/global",
      )
      .then((res) =>
         (res.data?.default_sets ?? [])
            .map((setId) =>
               parseFFZSet(res?.data?.sets[setId.toString()] || {}),
            )
            .reduce((acc, cur) => ({ ...acc, ...cur }), {} as EmoteMap),
      )
      .catch((error) => {
         console.error("Failed to get FFZ global emotes", error)
         return {}
      })

export const getFFZUserEmotes = (
   channelId: string,
): Promise<EmoteMap> =>
   axios
      .get<FrankerfacezUserBody>(
         `https://api.frankerfacez.com/v1/room/id/${encodeURIComponent(
            channelId,
         )}`,
      )
      .then((res) =>
         parseFFZSet(
            res?.data?.sets[res.data.room.set ?? "".toString()] || {
               emoticons: [],
            },
         ),
      )
      .catch((error) => {
         console.error("Failed to get FFZ user emotes", error)
         return {}
      })

export const getBTTVGlobalEmotes = (): Promise<EmoteMap> =>
   axios
      .get<BetterttvGlobalBody>(
         "https://api.betterttv.net/3/cached/emotes/global",
      )
      .then((res) =>
         res.data.reduce((acc, cur) => {
            acc[cur.code] = new ThirdPartyEmote(
               cur.id,
               ThirdPartyEmoteProvider.BetterTTV,
               cur.code,
               ThirdPartyEmote.getBetterttvImageURL(cur.id),
            )
            return acc
         }, {} as EmoteMap),
      )
      .catch((error) => {
         console.error("Failed to get BTTV global emotes", error)
         return {}
      })

export const getBTTVUserEmotes = (
   channelId: string,
): Promise<EmoteMap> =>
   axios
      .get<BetterttvUserBody>(
         `https://api.betterttv.net/3/cached/users/twitch/${encodeURIComponent(
            channelId,
         )}`,
      )
      .then((res) =>
         [
            ...(res?.data?.sharedEmotes ?? []),
            ...(res.data.channelEmotes ?? []),
         ].reduce((acc, cur) => {
            acc[cur.code] = new ThirdPartyEmote(
               cur.id,
               ThirdPartyEmoteProvider.BetterTTV,
               cur.code,
               ThirdPartyEmote.getBetterttvImageURL(cur.id),
            )
            return acc
         }, {} as EmoteMap),
      )
      .catch((error) => {
         console.error("Failed to get BTTV user emotes", error)
         return {}
      })
